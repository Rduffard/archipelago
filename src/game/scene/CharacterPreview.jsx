import { useState } from 'react';
import { GameButton, GamePanel } from '../ui/GameUI';
import SceneCanvas from './SceneCanvas';
import { buildAppearance, defaultAppearance, facings } from './appearance';

export default function CharacterPreview({ appearance = defaultAppearance, name, lineage, calling, portraitUrl, showIdentity = true, deferScene = false }) {
  const [direction, setDirection] = useState(1);
  const [sceneRequested, setSceneRequested] = useState(false);
  const showScene = !portraitUrl && (!deferScene || sceneRequested);

  return <GamePanel className="sa-preview">
    {portraitUrl ? <img className="sa-scene sa-preview__portrait" src={portraitUrl} alt="Character portrait" /> : showScene ? <SceneCanvas transparent build={buildAppearance} data={{ appearance, facing: facings[direction] }}
      fallback="3D character preview unavailable." /> : <div className="sa-scene sa-preview__placeholder">
        <GameButton onClick={() => setSceneRequested(true)}>View 3D portrait</GameButton>
      </div>}
    {showIdentity && <div className="sa-preview__identity">
      <h2>{name || 'Unnamed character'}</h2>
      {(lineage || calling) && <p>{[lineage, calling].filter(Boolean).join(' · ')}</p>}

    </div>}
    {showScene && <div className="sa-preview__rotation">
      <GameButton aria-label="Rotate left" onClick={() => setDirection(value => (value + 7) % 8)}>&larr;</GameButton>
      <output aria-live="polite">{facings[direction]}</output>
      <GameButton aria-label="Rotate right" onClick={() => setDirection(value => (value + 1) % 8)}>&rarr;</GameButton>
    </div>}
  </GamePanel>;
}
