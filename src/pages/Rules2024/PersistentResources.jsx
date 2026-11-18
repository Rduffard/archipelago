import { ResourceBar } from '../../game/ui/GameUI';
import { displayName } from '../../game/creator/choiceLabels';
import { useState } from "react";
import { getSpellSlotCreationTerms } from "@crossworld/sanguine-engine/spell-slots";
import { wishInterventionUnlocked } from "@crossworld/sanguine-engine/callings";

export default function PersistentResources({ summary, state, busy, onOperation }) {
  const [die, setDie] = useState(Object.keys(state.hitDice)[0]);
  const [roll, setRoll] = useState(1);
  const [recoverySlots, setRecoverySlots] = useState('');
  const restoration = summary.resources['tidecaller:restoration'];
  const restorationUses = state.pools['tidecaller:restoration'] ?? 0;
  const points = 'tidecaller:sorcery-points';
  const sorceryFull = state.pools[points] >= summary.resources[points]?.max;
  return <>
    <div className="sa-vital-instruments">
      <div className="sa-vital-instruments__health">
        <ResourceBar label="Health" current={state.health.current} maximum={state.health.max} />
        {state.temporaryHealth > 0 && <p>+{state.temporaryHealth} temporary Health</p>}
      </div>
      <dl>
        <div><dt>Hit Dice</dt><dd>{Object.entries(state.hitDice).map(([die, count]) => count + die).join(' · ') || 'None'}</dd></div>
        {Object.entries(summary.resources).filter(([id]) => /(^|:)(stamina|focus)$/.test(id)).map(([id, pool]) =>
          <div key={id}><dt>{displayName(id.split(':').at(-1))}</dt><dd>{state.pools[id] ?? 0} / {pool.max}</dd></div>)}
      </dl>
    </div>
    <fieldset disabled={busy}>
    <legend>Current resources</legend>
    <div className="sa-rest-choices">
      <div className="sa-rest-option">
        <button onClick={() => onOperation({ type: "short-rest" })}>Plan Short Rest</button>
        <small>Preview recovery without spending Hit Dice.</small>
      </div>
      <div className="sa-rest-option">
        <button onClick={() => onOperation({ type: "long-rest" })}>Plan Long Rest</button>
        <small>Preview Health, Hit Dice, slots, and pool recovery.</small>
      </div>
    </div>
    <details className="sa-resource-ledger"><summary>Resource ledger and Hit Dice</summary>
    {wishInterventionUnlocked(summary.callingLevels.doctor) && <p>Divine Intervention Wish cooldown: {state.interventionCooldown?.longRestsRemaining??0} completed Long Rests remaining. Recovery is automatic when that count reaches zero.</p>}
    {summary.resources['shipwright:arcane-recovery'] && <p>
      <label>Arcane Recovery slot levels (comma separated) <input value={recoverySlots} onChange={e => setRecoverySlots(e.target.value)} placeholder="1, 2" /></label>
      <button disabled={!recoverySlots.trim() || !state.pools['shipwright:arcane-recovery']} onClick={() => onOperation({ type: 'short-rest', recoverSlots: recoverySlots.split(',').map(Number) })}>Short Rest with Arcane Recovery</button>
    </p>}
    {restoration && <div className="sa-rest-option">
      <button disabled={!restorationUses || sorceryFull} onClick={() => onOperation({ type: 'short-rest', restoreSorcery: true })}>Short Rest with Sorcerous Restoration</button>
      <small>{!restorationUses ? 'Sorcerous Restoration has been spent.' : sorceryFull ? 'Sorcery Points are full.' : 'Preview the points you will recover before starting the rest.'}</small>
    </div>}
    {Object.entries(summary.resources).map(([id, pool]) => <p key={id}>
      {id.replace(/[-:]/g, " ")}: {state.pools[id]} / {pool.max}{" "}
      <button disabled={!state.pools[id]} onClick={() => onOperation({ type: "spend-pool", poolId: id, amount: 1 })}>Spend 1</button>
    </p>)}
    {summary.spellSlots.map((max, i) => <p key={i}>Level {i + 1} slots: {state.slots[i]} / {max}{" "}
      <button disabled={!state.slots[i]} onClick={() => onOperation({ type: "spend-slot", slotLevel: i + 1 })}>Spend slot</button>
      {summary.resources['tidecaller:sorcery-points'] && <>
        <button disabled={!state.slots[i]} onClick={() => onOperation({ type: 'slot-to-sorcery', slotLevel: i + 1 })}>Convert slot to points</button>
        {getSpellSlotCreationTerms(i + 1) && <button onClick={() => onOperation({ type: 'sorcery-to-slot', slotLevel: i + 1 })}>Create slot with points</button>}
      </>}
    </p>)}
    <p>Hit Dice remaining: {Object.entries(state.hitDice).map(([key, n]) => `${n}${key}`).join(", ")}</p>
    {die && <><label>Hit Die <select value={die} onChange={e => setDie(e.target.value)}>
      {Object.keys(state.hitDice).map(key => <option key={key} value={key}>{key}</option>)}
    </select></label>
    <label>GM-recorded roll <input type="number" min="1" max={Number(die.slice(1))} value={roll} onChange={e => setRoll(Number(e.target.value))} /></label>
    <button disabled={!state.hitDice[die]} onClick={() => onOperation({ type: "short-rest", hitDice: [{ die, roll }] })}>Short Rest and spend Hit Die</button></>}
    </details>
  </fieldset>
  </>;
}
