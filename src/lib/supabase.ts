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
