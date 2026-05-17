import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, withTimeout, TimeoutError } from '../lib/supabase'
import type { Profile } from '../types/database'

const AUTH_TIMEOUT_MS = 5000

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  refreshProfile: () => Promise<void>
  signIn: (email: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Fetches the user's profile row, bounded by AUTH_TIMEOUT_MS.
   * Returns true on success, false on timeout/error so callers can recover.
   */
  const fetchProfile = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),
        AUTH_TIMEOUT_MS,
        'fetchProfile'
      )
      if (error) {
        console.warn('[auth] fetchProfile error:', error)
        setProfile(null)
        return false
      }
      setProfile((data as Profile | null) ?? null)
      return true
    } catch (err) {
      if (err instanceof TimeoutError) {
        console.error('[auth] timeout: fetchProfile')
      } else {
        console.error('[auth] fetchProfile threw:', err)
      }
      setProfile(null)
      return false
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (session?.user) await fetchProfile(session.user.id)
  }, [session, fetchProfile])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      let initialSession: Session | null = null
      try {
        console.log('[auth] init: getSession…')
        const { data } = await withTimeout(
          supabase.auth.getSession(),
          AUTH_TIMEOUT_MS,
          'getSession'
        )
        if (cancelled) return
        initialSession = data.session
        console.log(
          '[auth] init: session =',
          initialSession ? 'present' : 'none'
        )
        setSession(initialSession)
      } catch (err) {
        if (err instanceof TimeoutError) {
          console.error('[auth] timeout: getSession — proceeding as signed-out')
        } else {
          console.error('[auth] getSession failed:', err)
        }
        // Fire-and-forget signout to clear any half-corrupt local state.
        supabase.auth.signOut().catch(() => {})
        if (!cancelled) setSession(null)
      }

      if (initialSession && !cancelled) {
        const ok = await fetchProfile(initialSession.user.id)
        if (!ok && !cancelled) {
          // Session was valid but profile fetch broke. Bail to fresh sign-in.
          console.warn(
            '[auth] profile unavailable for current session — signing out to recover'
          )
          supabase.auth.signOut().catch(() => {})
          setSession(null)
          setProfile(null)
        }
      }

      if (!cancelled) {
        console.log('[auth] init: done, loading=false')
        setLoading(false)
      }
    }

    init()

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return
      console.log('[auth] onAuthStateChange:', event)
      setSession(session)
      if (session) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      cancelled = true
      data.subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    return { error: error?.message ?? null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        profile,
        loading,
        refreshProfile,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
