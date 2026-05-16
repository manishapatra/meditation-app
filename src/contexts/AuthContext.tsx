import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

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

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      if (error) {
        console.warn('[auth] fetchProfile error:', error)
        setProfile(null)
        return
      }
      setProfile((data as Profile | null) ?? null)
    } catch (err) {
      console.error('[auth] fetchProfile threw:', err)
      setProfile(null)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (session?.user) await fetchProfile(session.user.id)
  }, [session, fetchProfile])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        console.log('[auth] init: getSession…')
        const { data } = await supabase.auth.getSession()
        if (cancelled) return
        console.log('[auth] init: session =', data.session ? 'present' : 'none')
        setSession(data.session)
        if (data.session) {
          await fetchProfile(data.session.user.id)
        }
      } catch (err) {
        console.error('[auth] init failed:', err)
      } finally {
        if (!cancelled) {
          console.log('[auth] init: done, loading=false')
          setLoading(false)
        }
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
