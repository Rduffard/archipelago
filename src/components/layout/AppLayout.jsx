import { Outlet } from 'react-router-dom'
import AppNavbar from './AppNavbar'
import { useAuth } from '../../hooks/useAuth'

function AppLayout() {
  const { logout } = useAuth()

  return (
    <div className="app-layout">
      <AppNavbar onSignOut={logout} />
      <Outlet />
    </div>
  )
}

export default AppLayout
