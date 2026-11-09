import { useState } from 'react';
export default function FeatureActions({ summary, state, busy, onOperation, supplemental=false }) {
  const [note, setNote] = useState('');
  const restores = ['omen-diver:wings', 'tidecaller:innate-sorcery', 'bloodwake:presence',
    'leviathan-anchor:nimbus', 'oath-of-the-free-port:open-harbor', 'iron-covenant:standard', 'lantern-vigil:dawn'];
  return <details><summary>Feature actions and temporary Health</summary>
    <p>Resolve targets, range, duration, saves and damage at the table. Using an action records its resource costs and an effect note.</p>
    <fieldset disabled={busy}>
      {!supplemental&&<label>Target or effect note <input maxLength={500} value={note} onChange={e => setNote(e.target.value)} /></label>}
      {!supplemental&&summary.featureActions?.map(action => <article key={action.featureId}>
        <h4>{action.name}</h4>
        <p>{summary.features.find(f => f.id === action.featureId)?.description}</p>
        <button disabled={action.costs.some(c => (state.pools[c.poolId] ?? 0) < c.amount)}
          onClick={() => onOperation({ type: 'use-feature', featureId: action.featureId, note })}>
          Use {action.name} ({action.costs.map(c => `${c.amount} ${c.poolId.replaceAll('-', ' ')}`).join(', ')})
        </button>
      </article>)}
      <p>Temporary Health: {state.temporaryHealth ?? 0}</p>
      {restores.filter(id => summary.resources[id]).map(id => <button key={id} disabled={state.pools[id] !== 0 || restores.indexOf(id)>=3 && !(state.slots?.[4]>0)}
        onClick={() => onOperation({ type: 'restore-feature', poolId: id, ...(restores.indexOf(id)>=3 ? { slotLevel: 5 } : {}) })}>
        Restore {id.replaceAll('-', ' ')} {restores.indexOf(id)>=3?(id==='leviathan-anchor:nimbus'?'with a level-five slot (no action)':'with a level-five slot (Bonus Action)'):'using its alternate cost'}
      </button>)}
      {summary.resources['reaver:persistent-reserve'] && <button disabled={!state.inCombat||!state.initiative} onClick={() => onOperation({ type: 'initiative-recovery', poolId: 'reaver:rage' })}>Initiative: recover Rage (once per Long Rest)</button>}
      {summary.resources['storm-broker:eye-reserve'] && <button disabled={!state.inCombat||!state.initiative} onClick={() => onOperation({ type: 'initiative-recovery', poolId: 'storm-broker:squall' })}>Initiative: recover one Squall when empty</button>}
      {summary.resources['reef-colossus:colossus-reserve'] && <button disabled={!state.inCombat||!state.initiative} onClick={() => onOperation({ type: 'initiative-recovery', poolId: 'reef-colossus:colossus' })}>Initiative: recover one Colossus use when empty</button>}
      {!supplemental&&(state.effects ?? []).map((effect, i) => <p key={i}>{effect.name}: {effect.note}
        <button onClick={() => onOperation({ type: 'end-effect', featureId: effect.featureId })}>End recorded effect</button>
      </p>)}
    </fieldset>
  </details>;
}
