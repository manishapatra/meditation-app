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
const INITIAL_SESSION_FALLBACK_MS = 5000

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

  useEffect(() => {
    let cancelled = false
    let receivedInitial = false

    // Subscribe first. supabase-js fires an INITIAL_SESSION event once it has
    // determined initial state — including processing any ?code=… in the URL
    // from a magic-link redirect. We use that event as the signal that
    // loading=false is safe.
    const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (cancelled) return
      console.log('[auth] onAuthStateChange:', event, newSession ? '(with session)' : '(no session)')
      setSession(newSession)
      if (newSession) {
        await fetchProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
      if (event === 'INITIAL_SESSION') {
        receivedInitial = true
        console.log('[auth] INITIAL_SESSION received, loading=false')
        setLoading(false)
      }
    })

    // Belt-and-suspenders: if INITIAL_SESSION never fires (a supabase-js bug
    // or a hung internal call), give up after a few seconds and unblock the UI.
    const fallback = setTimeout(() => {
      if (!receivedInitial && !cancelled) {
        console.warn('[auth] INITIAL_SESSION never fired — releasing loading')
        setLoading(false)
      }
    }, INITIAL_SESSION_FALLBACK_MS)

    return () => {
      cancelled = true
      clearTimeout(fallback)
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
