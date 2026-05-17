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
const INITIAL_FALLBACK_MS = 10000

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  authError: string | null
  refreshProfile: () => Promise<void>
  resetSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  const fetchProfile = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await withTimeout(
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
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

  const resetSession = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('[auth] signOut on reset failed:', err)
    }
    // signOut → SIGNED_OUT event → state cleared.
    // We then trigger a fresh anonymous sign-in.
    const { error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.error('[auth] anonymous re-sign-in failed:', error)
      setAuthError(error.message)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let initialHandled = false

    const ensureAnonymousSession = async () => {
      console.log('[auth] no session — signing in anonymously…')
      const { error } = await supabase.auth.signInAnonymously()
      if (error) {
        console.error('[auth] anonymous sign-in failed:', error)
        if (!cancelled) {
          setAuthError(error.message)
          setLoading(false)
        }
      }
      // On success, the SIGNED_IN event handler below will flip loading=false.
    }

    const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (cancelled) return
      console.log(
        '[auth] onAuthStateChange:',
        event,
        newSession ? '(with session)' : '(no session)'
      )
      setSession(newSession)
      if (newSession) {
        await fetchProfile(newSession.user.id)
      } else {
        setProfile(null)
      }

      if (event === 'INITIAL_SESSION') {
        initialHandled = true
        if (newSession) {
          setLoading(false)
        } else {
          ensureAnonymousSession()
        }
      } else if (event === 'SIGNED_IN' && initialHandled) {
        // Anonymous sign-in (or post-init sign-in) completed.
        setLoading(false)
      }
    })

    // Belt-and-suspenders fallback — if neither INITIAL_SESSION nor the
    // subsequent SIGNED_IN event flips loading off within 10s, release the UI
    // anyway so the user is not stuck.
    const fallback = setTimeout(() => {
      if (!cancelled) {
        console.warn('[auth] init fallback fired — releasing loading')
        setLoading(false)
      }
    }, INITIAL_FALLBACK_MS)

    return () => {
      cancelled = true
      clearTimeout(fallback)
      data.subscription.unsubscribe()
    }
  }, [fetchProfile])

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        profile,
        loading,
        authError,
        refreshProfile,
        resetSession,
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
