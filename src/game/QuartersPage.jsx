import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameButton } from './ui/GameUI';
import SceneCanvas from './scene/SceneCanvas';
import { buildQuarters } from './scene/quarters';

export default function QuartersPage() {
  const navigate = useNavigate();
  const select = useCallback(to => navigate(to), [navigate]);
  return <main className="sa-quarters">
    <SceneCanvas build={buildQuarters} onSelect={select} className="sa-quarters__scene"
      fallback="3D scene unavailable. Use the quarters menu below." />
    <header className="sa-quarters__title">
      <p>Sanguine Archipelago</p>
      <h1>Captain’s Quarters</h1>
    </header>
    <nav className="sa-quarters__actions" aria-label="Captain’s Quarters">
      <GameButton to="/characters"><span>Character Mirror</span>Characters</GameButton>
      <GameButton to="/campaigns/new"><span>Chart Table</span>Campaigns</GameButton>
      <GameButton to="/campaigns/open"><span>Campaign Finder</span>Open Campaigns</GameButton>
    </nav>
  </main>;
}
