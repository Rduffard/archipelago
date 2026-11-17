import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import AppNavbar from './AppNavbar'
import { useAuth } from '../../hooks/useAuth'
import './AppLayout.css'
import '../../game/game.css'

function AppLayout() {
  const { logout } = useAuth()

  return (
    <div className="app-layout">
      <AppNavbar onSignOut={logout} />
      <Suspense fallback={<main role="status">Loading page…</main>}>
        <Outlet />
      </Suspense>
    </div>
  )
}

export default AppLayout
