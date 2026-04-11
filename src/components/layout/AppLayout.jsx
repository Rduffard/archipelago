import { Outlet } from 'react-router-dom'
import AppNavbar from './AppNavbar'
import { useAuth } from '../../hooks/useAuth'
import './AppLayout.css'

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
