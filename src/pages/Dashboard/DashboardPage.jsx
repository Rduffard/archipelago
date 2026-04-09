import Dashboard from '../../components/dashboard/Dashboard'
import { useAuth } from '../../hooks/useAuth'

function DashboardPage() {
  const { user, characters } = useAuth()

  return (
    <Dashboard
      user={user}
      characters={characters}
    />
  )
}

export default DashboardPage
