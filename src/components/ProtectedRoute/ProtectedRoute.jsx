import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './ProtectedRoute.css'

function ProtectedRoute({ redirectTo = '/login' }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <main className="boot-screen">
        <p>Rejoining the Archipelago...</p>
      </main>
    )
  }

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
