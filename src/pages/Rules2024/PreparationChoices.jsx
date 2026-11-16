import { useState } from 'react';
import { canMemorizeOnShortRest, spellPreparationEligible } from '@crossworld/sanguine-engine/preparations';
export default function PreparationChoices({ summary, rules, state, busy, onOperation }) {
  const [selections, setSelections] = useState(structuredClone(state.preparations));
  const eligible = Object.entries(summary.spellcasting).filter(([id]) => id !== 'tidecaller');
  if (!eligible.length) return null;
  return <details><summary>Change prepared spells</summary>
    <p>Doctor and Shipwright can change their full list at a Long Rest. Navigator and Warden can replace one. A Shipwright of level 5 or higher can replace one at a Short Rest.</p>
    <fieldset disabled={busy}>
      {eligible.map(([id, casting]) => <div key={id}>
        <label>{rules.callings.find(c => c.id === id).name}: choose {casting.preparedCount}
          <select multiple size={8} value={selections[id]} onChange={e => setSelections({ ...selections,
            [id]: Array.from(e.target.selectedOptions, option => option.value),
          })}>
            {rules.spells.filter(spell => spellPreparationEligible(id, spell, casting)).map(s => <option key={s.id} value={s.id}>{s.name} (level {s.level})</option>)}
          </select>
        </label>
        <button disabled={selections[id].length !== casting.preparedCount} onClick={() => onOperation({ type: 'long-rest', preparations: { [id]: selections[id] } })}>Long Rest and prepare spells</button>
        {canMemorizeOnShortRest(id, summary.callingLevels.shipwright) && <button disabled={selections[id].length !== casting.preparedCount} onClick={() => onOperation({ type: 'short-rest', preparations: { [id]: selections[id] } })}>Short Rest and memorize one spell</button>}
      </div>)}
    </fieldset>
  </details>;
}
