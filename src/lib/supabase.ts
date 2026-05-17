import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local (and in Vercel project settings for deployments).'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Races a promise against a timeout. Used to bound auth-init calls so the UI
 * cannot hang indefinitely on a stuck Supabase request.
 */
export class TimeoutError extends Error {
  constructor(label: string, ms: number) {
    super(`${label} timed out after ${ms}ms`)
    this.name = 'TimeoutError'
  }
}

/**
 * Best-effort human-readable description of any thrown value. Handles plain
 * Errors, Supabase PostgrestError-shaped objects ({ message, code, details,
 * hint }), and unknown values.
 */
export function describeError(err: unknown): string {
  if (err instanceof Error) return err.message
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>
    if (typeof e.message === 'string') {
      const code = typeof e.code === 'string' ? ` (code ${e.code})` : ''
      const hint = typeof e.hint === 'string' && e.hint ? `\nHint: ${e.hint}` : ''
      const details =
        typeof e.details === 'string' && e.details ? `\nDetails: ${e.details}` : ''
      return `${e.message}${code}${details}${hint}`
    }
    try {
      return JSON.stringify(err)
    } catch {
      return String(err)
    }
  }
  return String(err)
}

export function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  label: string
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(label, ms)), ms)
  })
  return Promise.race([
    Promise.resolve(promise).then(
      (v) => {
        if (timer) clearTimeout(timer)
        return v
      },
      (e) => {
        if (timer) clearTimeout(timer)
        throw e
      }
    ),
    timeout,
  ]) as Promise<T>
}
