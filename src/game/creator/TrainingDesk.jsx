import { useEffect, useRef } from 'react';
import { GameButton } from '../ui/GameUI';

export default function TrainingDesk({ decisions, current, onSelect, children }) {
  const previousDecision = useRef(current);
  useEffect(() => {
    if (previousDecision.current !== current && current !== 'grants') {
      document.getElementById('sa-training-choice')?.focus();
    }
    previousDecision.current = current;
  }, [current]);

  const remaining = decisions.filter(decision => !decision.complete || decision.invalid || decision.blocker).length;

  return <div className="sa-training-desk">
    <nav aria-label="Training decisions">
      <h3>Decisions</h3>
      <p role="status">{remaining ? remaining + ' remaining' : 'All decisions complete'}</p>
      <ul>
        {decisions.map(decision => {
          const prerequisite = decisions.find(item => item.key === decision.blocker);
          const status = prerequisite ? 'After ' + prerequisite.label
            : decision.invalid ? 'Needs review' : decision.complete ? 'Complete' : 'Ready to choose';
          return <li key={decision.key}>
            <GameButton aria-current={current === decision.key ? 'step' : undefined}
              aria-controls="sa-training-choice" onClick={() => onSelect(decision)}>
              <strong>{decision.label}</strong><small>{status}</small>
            </GameButton>
          </li>;
        })}
      </ul>
    </nav>
    <details open={current === 'grants'}>
      <summary>Training and language grants</summary>
      {children}
    </details>
  </div>;
}
