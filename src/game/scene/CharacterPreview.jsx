import { useState } from 'react';
import { GameButton, GamePanel } from '../ui/GameUI';
import SceneCanvas from './SceneCanvas';
import { buildAppearance, defaultAppearance, facings } from './appearance';

export default function CharacterPreview({ appearance = defaultAppearance, name }) {
  const [direction, setDirection] = useState(0);
  return <GamePanel title="Character Preview" className="sa-preview">
    <SceneCanvas build={buildAppearance} data={{ appearance, facing: facings[direction] }}
      fallback="3D character preview unavailable." />
    <p>{name || 'Unnamed character'}</p>
    <div className="sa-preview__rotation">
      <GameButton aria-label="Rotate left" onClick={() => setDirection((direction + 7) % 8)}>←</GameButton>
      <output aria-live="polite">{facings[direction]}</output>
      <GameButton aria-label="Rotate right" onClick={() => setDirection((direction + 1) % 8)}>→</GameButton>
    </div>
  </GamePanel>;
}
