import { Navigate, Route, Routes } from 'react-router-dom'
import { TabBar } from './components/TabBar'
import { Growth } from './screens/Growth'
import { Journal } from './screens/Journal'
import { Path } from './screens/Path'
import { Today } from './screens/Today'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-24">
        <Routes>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<Today />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/path" element={<Path />} />
          <Route path="/growth" element={<Growth />} />
        </Routes>
      </main>
      <TabBar />
    </div>
  )
}

export default App
