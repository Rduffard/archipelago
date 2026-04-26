import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute'
import AppLayout from '../components/layout/AppLayout'
import CharacterCreatorPage from '../pages/CharacterCreator/CharacterCreatorPage'
import CharacterSheetPage from '../pages/CharacterSheet/CharacterSheetPage'
import CharactersPage from '../pages/Characters/CharactersPage'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import LoginPage from '../pages/Login/LoginPage'
import MapPage from '../pages/Map/MapPage'
import PlaceholderPage from '../pages/Placeholder/PlaceholderPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/new" element={<CharacterCreatorPage />} />
          <Route path="/characters/:characterId/edit" element={<CharacterCreatorPage />} />
          <Route path="/characters/:characterId" element={<CharacterSheetPage />} />
          <Route path="/campaigns/new" element={<PlaceholderPage />} />
          <Route path="/campaigns/open" element={<PlaceholderPage />} />
          <Route path="/achievements" element={<PlaceholderPage />} />
          <Route path="/settings" element={<PlaceholderPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
