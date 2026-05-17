import { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { TabBar } from './components/TabBar'
import { useAuth } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
import { Growth } from './screens/Growth'
import { Journal } from './screens/Journal'
import { Onboarding } from './screens/Onboarding'
import { Path } from './screens/Path'
import { Today } from './screens/Today'

function Loading() {
  const [showHelp, setShowHelp] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShowHelp(true), 5000)
    return () => clearTimeout(t)
  }, [])

  const reset = () => {
    supabase.auth.signOut().catch(() => {})
    try {
      localStorage.clear()
    } catch {
      /* ignore */
    }
    try {
      sessionStorage.clear()
    } catch {
      /* ignore */
    }
    window.location.reload()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-muted">
      <p>Loading…</p>
      {showHelp && (
        <div className="mt-10">
          <p className="text-sm">Still loading? Something may be stuck.</p>
          <button onClick={reset} className="mt-3 text-sm text-primary underline">
            Reset and reload
          </button>
        </div>
      )}
    </div>
  )
}

function AuthError({ message }: { message: string }) {
  const reload = () => {
    localStorage.clear()
    window.location.reload()
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="font-serif text-2xl text-primary">Could not start a session</h1>
      <p className="mt-3 text-sm text-muted">{message}</p>
      <p className="mt-4 max-w-sm text-xs text-muted">
        Make sure anonymous sign-ins are enabled in your Supabase project
        (Authentication → Sign In / Up).
      </p>
      <button
        onClick={reload}
        className="mt-6 rounded-full bg-primary px-6 py-3 font-serif text-base text-white"
      >
        Try again
      </button>
    </div>
  )
}

function ProtectedLayout({ requirePath = false }: { requirePath?: boolean }) {
  const { user, profile, loading, authError } = useAuth()

  if (loading) return <Loading />
  if (authError) return <AuthError message={authError} />
  if (!user) return <AuthError message="No user session available." />
  if (requirePath && !profile?.dominant_path) {
    return <Navigate to="/onboarding" replace />
  }
  return <Outlet />
}

function AppShell() {
  const { resetSession } = useAuth()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="font-serif text-lg text-primary">Stillness</span>
        <button
          onClick={resetSession}
          className="text-xs uppercase tracking-wider text-muted"
          aria-label="Reset progress and start over"
        >
          Reset
        </button>
      </header>
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<ProtectedLayout />}>
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>
      <Route element={<ProtectedLayout requirePath />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<Today />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/path" element={<Path />} />
          <Route path="/growth" element={<Growth />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
