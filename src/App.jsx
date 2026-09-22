import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { useThemeStore } from './store/themeStore'
import ProtectedRoute from './components/ProtectedRoute'
import Toaster from './components/Toaster'
import Unlock from './pages/Unlock'
import Dashboard from './pages/Dashboard'
import Generator from './pages/Generator'
import NotFound from './pages/NotFound'

function App() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <BrowserRouter>
      <div className="min-h-screen text-slate-900 transition-colors dark:text-slate-100">
        <Routes>
          <Route path="/" element={<Navigate to="/unlock" replace />} />
          <Route path="/unlock" element={<Unlock />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generator"
            element={
              <ProtectedRoute>
                <Generator />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Toaster />
    </BrowserRouter>
  )
}

export default App
