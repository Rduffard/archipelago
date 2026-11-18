import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

import CharactersPage from "../pages/Characters/CharactersPage";
import LoginPage from "../pages/Login/LoginPage";
import PlaceholderPage from "../pages/Placeholder/PlaceholderPage";
import CampaignPage from "../pages/Campaigns/CampaignPage";

const PersistentSheet = lazy(() => import("../pages/Rules2024/PersistentSheet"));
const Rules2024Page = lazy(() => import("../pages/Rules2024/Rules2024Page"));
const CharacterCreation = lazy(() => import("../pages/Rules2024/CharacterCreation"));
const CombatTestPage = lazy(() => import("../pages/CombatTest/CombatTestPage"));
const QuartersPage = lazy(() => import("../game/QuartersPage"));
const MapPage = lazy(() => import("../pages/Map/MapPage"));

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<QuartersPage />} />
          <Route path="/rules-2024" element={<Rules2024Page />} />
          <Route path="/combat-test" element={<CombatTestPage />} />
          <Route
            path="/combat-test/:encounterId"
            element={<CombatTestPage />}
          />
          <Route path="/map" element={<MapPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/new" element={<CharacterCreation />} />
          <Route path="/characters/create" element={<Navigate to="/characters/new" replace />} />
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
