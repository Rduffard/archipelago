import { NavLink, useLocation } from 'react-router-dom';
import { GameButton, GameMenu } from '../../game/ui/GameUI';

export default function AppNavbar({ onSignOut }) {
  const { pathname } = useLocation();
  return <header className="sa-topbar">
    <NavLink className="sa-brand" to="/dashboard">Sanguine Archipelago</NavLink>
    <nav aria-label="Primary" className="sa-primary">
      <NavLink to="/dashboard">Captain’s Quarters</NavLink>
      <NavLink to="/characters">Characters</NavLink>
      <NavLink to="/campaigns/new">Campaigns</NavLink>
      <GameMenu key={pathname} label="Menu">
        <NavLink to="/map">Lore Map</NavLink>
        <NavLink to="/campaigns/open">Open Campaigns</NavLink>
        <NavLink to="/rules-2024">Calling Rules</NavLink>
        <NavLink to="/achievements">Achievements</NavLink>
        <NavLink to="/settings">Settings</NavLink>
        <NavLink to="/combat-test">Combat Practice</NavLink>
        <GameButton onClick={onSignOut}>Sign out</GameButton>
      </GameMenu>
    </nav>
  </header>;
}
