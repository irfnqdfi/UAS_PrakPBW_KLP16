import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Sidebar from './components/layout/Sidebar'
import ProtectedRoute from './components/layout/ProtectedRoute'

import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import DashboardPage   from './pages/DashboardPage'
import CalculatorPage  from './pages/CalculatorPage'
import MeasurementsPage from './pages/MeasurementsPage'
import WorkoutPage     from './pages/WorkoutPage'
import NutritionPage   from './pages/NutritionPage'
import GoalsPage       from './pages/GoalsPage'
import RemindersPage   from './pages/RemindersPage'
import ProfilePage     from './pages/ProfilePage'
import NotFoundPage    from './pages/NotFoundPage'

// Layout wrapper for authenticated pages
const AppLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-60 p-6 min-h-screen">
      <Outlet />
    </main>
  </div>
)

const App = () => {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/"            element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard"   element={<DashboardPage />} />
        <Route path="/calculator"  element={<CalculatorPage />} />
        <Route path="/measurements" element={<MeasurementsPage />} />
        <Route path="/workout"     element={<WorkoutPage />} />
        <Route path="/nutrition"   element={<NutritionPage />} />
        <Route path="/goals"       element={<GoalsPage />} />
        <Route path="/reminders"   element={<RemindersPage />} />
        <Route path="/profile"     element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
