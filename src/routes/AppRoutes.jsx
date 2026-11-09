import PersistentSheet from "../pages/Rules2024/PersistentSheet";
import Rules2024Page from "../pages/Rules2024/Rules2024Page";
import CharacterCreation from "../pages/Rules2024/CharacterCreation";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import CombatTestPage from "../pages/CombatTest/CombatTestPage";
import AppLayout from "../components/layout/AppLayout";

import CharactersPage from "../pages/Characters/CharactersPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import LoginPage from "../pages/Login/LoginPage";
import MapPage from "../pages/Map/MapPage";
import PlaceholderPage from "../pages/Placeholder/PlaceholderPage";
import CampaignPage from "../pages/Campaigns/CampaignPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/rules-2024" element={<Rules2024Page />} />
          <Route path="/combat-test" element={<CombatTestPage />} />
          <Route
            path="/combat-test/:encounterId"
            element={<CombatTestPage />}
          />
          <Route path="/map" element={<MapPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/new" element={<CharacterCreation />} />
          <Route
            path="/characters/:characterId/edit"
            element={<PersistentSheet editing />}
          />
          <Route
            path="/characters/:characterId"
            element={<PersistentSheet />}
          />
          <Route path="/campaigns/new" element={<CampaignPage key="new" mode="new" />} />
          <Route path="/campaigns/open" element={<CampaignPage key="open" mode="open" />} />
          <Route path="/campaigns/:campaignId" element={<CampaignPage key="detail" mode="detail" />} />
          <Route path="/achievements" element={<PlaceholderPage />} />
          <Route path="/settings" element={<PlaceholderPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
