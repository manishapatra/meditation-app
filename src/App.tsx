import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { TabBar } from './components/TabBar'
import { useAuth } from './contexts/AuthContext'
import { Auth } from './screens/Auth'
import { Growth } from './screens/Growth'
import { Journal } from './screens/Journal'
import { Onboarding } from './screens/Onboarding'
import { Path } from './screens/Path'
import { Today } from './screens/Today'

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted">
      Loading…
    </div>
  )
}

function ProtectedLayout({ requirePath = false }: { requirePath?: boolean }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loading />
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />
  if (requirePath && !profile?.dominant_path) {
    return <Navigate to="/onboarding" replace />
  }
  return <Outlet />
}

function AppShell() {
  const { signOut, user } = useAuth()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="font-serif text-lg text-primary">Stillness</span>
        <button
          onClick={signOut}
          className="text-xs uppercase tracking-wider text-muted"
          aria-label={`Sign out ${user?.email ?? ''}`}
        >
          Sign out
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
      <Route path="/auth" element={<Auth />} />
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
