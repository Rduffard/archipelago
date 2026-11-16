import { useState } from "react";
import { getSpellSlotCreationTerms } from "@crossworld/sanguine-engine/spell-slots";
import { wishInterventionUnlocked } from "@crossworld/sanguine-engine/callings";

export default function PersistentResources({ summary, state, busy, onOperation }) {
  const [die, setDie] = useState(Object.keys(state.hitDice)[0]);
  const [roll, setRoll] = useState(1);
  const [recoverySlots, setRecoverySlots] = useState('');
  return <fieldset disabled={busy}>
    <legend>Current resources</legend>
    <p>Health {state.health.current} / {state.health.max}</p>
    <button onClick={() => onOperation({ type: "short-rest" })}>Short Rest (no Hit Dice)</button>
    <button onClick={() => onOperation({ type: "long-rest" })}>Long Rest</button>
    {wishInterventionUnlocked(summary.callingLevels.doctor) && <p>Divine Intervention Wish cooldown: {state.interventionCooldown?.longRestsRemaining??0} completed Long Rests remaining. Recovery is automatic when that count reaches zero.</p>}
    {summary.resources['shipwright:arcane-recovery'] && <p>
      <label>Arcane Recovery slot levels (comma separated) <input value={recoverySlots} onChange={e => setRecoverySlots(e.target.value)} placeholder="1, 2" /></label>
      <button disabled={!recoverySlots.trim() || !state.pools['shipwright:arcane-recovery']} onClick={() => onOperation({ type: 'short-rest', recoverSlots: recoverySlots.split(',').map(Number) })}>Short Rest with Arcane Recovery</button>
    </p>}
    {summary.resources['tidecaller:restoration'] && <button disabled={!state.pools['tidecaller:restoration']} onClick={() => onOperation({ type: 'short-rest', restoreSorcery: true })}>Short Rest with Sorcerous Restoration</button>}
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
    <label>Hit Die <select value={die} onChange={e => setDie(e.target.value)}>
      {Object.keys(state.hitDice).map(key => <option key={key} value={key}>{key}</option>)}
    </select></label>
    <label>GM-recorded roll <input type="number" min="1" max={Number(die.slice(1))} value={roll} onChange={e => setRoll(Number(e.target.value))} /></label>
    <button disabled={!state.hitDice[die]} onClick={() => onOperation({ type: "short-rest", hitDice: [{ die, roll }] })}>Short Rest and spend Hit Die</button>
  </fieldset>;
}
