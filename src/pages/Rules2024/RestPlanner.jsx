import {useState} from 'react';
import { restDuration, restInterruptionReasons } from '@crossworld/sanguine-engine/rest';
import { recoverHealthWithHitDice, HitDiceRecoveryError } from '@crossworld/sanguine-engine/hit-dice';
import { calculateCappedPoolRecovery, recoverRestPools } from '@crossworld/sanguine-engine/resources';
import { recoverWishCooldown, sorcerousRestorationAmount } from '@crossworld/sanguine-engine/callings';
import { recoverArcaneSlots, ArcaneRecoveryError } from '@crossworld/sanguine-engine/spell-slots';
import { displayName } from '../../game/creator/choiceLabels';

const interruptionLabels = {
  initiative: 'Rolling Initiative',
  'non-cantrip-spell': 'Casting a non-cantrip spell',
  damage: 'Taking damage',
  'exertion-hour': 'One hour of exertion',
};
export default function RestPlanner({summary,state,draft,busy,onCommand,onDismiss}){
  const activeRest = state.restSession;
  const restMode = summary.lineage?.restModes?.find(mode => mode.id === activeRest?.mode);
  const [start,setStart]=useState(()=>new Date(state.worldTime??Date.now()).toISOString().slice(0,16));
  const [end,setEnd]=useState(()=>new Date(activeRest?Math.ceil((activeRest.startedAt+restDuration(activeRest.kind,activeRest.interruptions?.length,restMode?.hours))/60000)*60000:state.worldTime??Date.now()).toISOString().slice(0,16));
  const [interruption,setInterruption]=useState(start),[reason,setReason]=useState('initiative'),[resume,setResume]=useState(true),[nourished,setNourished]=useState(false);
  if(!draft&&!state.restSession)return null;
  const rest=state.restSession;
  const kind=rest?.kind??draft.type;
  const long = kind === 'long-rest';
  const options = rest?.options ?? draft;
  let health = long ? state.health.max : state.health.current;
  let hitDice = long ? summary.hitDice : state.hitDice;
  let recoveryError;
  let slots = long ? summary.spellSlots : state.slots;
  const proposedPools = { ...state.pools };
  if (!long && options?.recoverSlots) {
    try {
      const recovered = recoverArcaneSlots({
        slots: state.slots, maximums: summary.spellSlots, slotLevels: options.recoverSlots,
        shipwrightLevel: summary.callingLevels.shipwright, uses: state.pools['shipwright:arcane-recovery'],
      });
      slots = recovered.slots;
      proposedPools['shipwright:arcane-recovery'] = recovered.uses;
    } catch (error) {
      if (!(error instanceof ArcaneRecoveryError)) throw error;
      recoveryError = error.message;
    }
  }
  if (!long && options?.hitDice) {
    try {
      const recovered = recoverHealthWithHitDice({
        health: state.health, hitDice: state.hitDice, allocation: summary.hitDice,
        resolve: summary.attributes.resolve, spends: options.hitDice,
      });
      health = recovered.health.current;
      hitDice = recovered.hitDice;
    } catch (error) {
      if (!(error instanceof HitDiceRecoveryError)) throw error;
      recoveryError = error.message;
    }
  }
  if (!long && options?.restoreSorcery) {
    const restoration = 'tidecaller:restoration';
    const points = 'tidecaller:sorcery-points';
    if (summary.resources[restoration] && proposedPools[restoration] > 0) {
      proposedPools[restoration]--;
      proposedPools[points] = calculateCappedPoolRecovery({
        current: proposedPools[points], maximum: summary.resources[points].max,
        amount: sorcerousRestorationAmount(summary.callingLevels.tidecaller),
      }).remaining;
    } else recoveryError = 'Sorcerous Restoration unavailable';
  }
  const pools = recoverRestPools(proposedPools, summary.resources, {
    kind, interventionCooldown: recoverWishCooldown(state.interventionCooldown?.longRestsRemaining, kind),
  });
  const changedPools = Object.entries(pools).filter(([id, value]) => value !== (state.pools[id] ?? 0));
  const duration = restDuration(kind, rest?.interruptions?.length, restMode?.hours) / 3600000;
  return <section className="character-creation__surface" aria-label="Rest planner"><h2>{kind==='long-rest'?'Long Rest':'Short Rest'}</h2>
    <p>Record the GM's world time. This rest takes {duration} {duration === 1 ? 'hour' : 'hours'}.{long && ' Long Rest benefits require 24 hours between completions.'}</p>
    <div className="sa-sheet__recovery">
      <h3>Expected recovery</h3>
      <ul>
        <li>Health {state.health.current} → {health} / {state.health.max}</li>
        <li>Hit Dice after rest {Object.entries(hitDice).map(([die, count]) => count + die).join(', ')}</li>
        {long && state.temporaryHealth > 0 && <li>Temporary Health clears.</li>}
        {summary.spellSlots.length > 0 && <li>Spell slots after rest {slots.map((slot, index) => 'L' + (index + 1) + ' ' + slot).join(', ')}.
          {long && ' Temporary slots clear.'}</li>}
        {changedPools.map(([id, value]) => <li key={id}>{displayName(id.split(':').at(-1))} {state.pools[id] ?? 0} → {value}</li>)}
      </ul>
      {recoveryError && <p role="alert">{recoveryError}</p>}
    </div>
    {state.inCombat&&<p>End the encounter before {rest?'completing':'starting'} the rest.</p>}
    <fieldset disabled={busy}>
      {!rest?<><label>World start time (UTC) <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)}/></label>
        <label><input type="checkbox" checked={nourished} onChange={e=>setNourished(e.target.checked)}/>Appropriate food and water for Exhaustion recovery</label>
        <button disabled={state.inCombat || !start || Boolean(recoveryError)} onClick={()=>{const {type,...options}=draft;onCommand('rest.start',{restId:crypto.randomUUID(),kind:type,startedAt:Date.parse(start+'Z'),options:{...options,nourished}});}}>Start {long ? 'Long Rest' : 'Short Rest'}</button>
        <button onClick={onDismiss}>Cancel proposal</button></>:<>
        <p>Started {new Date(rest.startedAt).toISOString()}. Choices are saved with this rest.</p>
        <p>{rest.interruptions?.length??0} interruptions. Each resumed Long Rest interruption adds one hour.</p>
        <label>World completion time (UTC) <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)}/></label>
        <button disabled={state.inCombat} onClick={()=>onCommand('rest.complete',{restId:rest.id,completedAt:Date.parse(end+'Z')})}>Complete rest</button>
        <button onClick={()=>onCommand('rest.cancel',{restId:rest.id})}>Cancel interrupted rest</button>
        <label>Interruption world time (UTC) <input type="datetime-local" value={interruption} onChange={e=>setInterruption(e.target.value)}/></label>
        <label>Interruption <select value={reason} onChange={e=>setReason(e.target.value)}>{restInterruptionReasons.map(id=><option key={id} value={id}>{interruptionLabels[id]}</option>)}</select></label>
        {kind==='long-rest'&&<label><input type="checkbox" checked={resume} onChange={e=>setResume(e.target.checked)}/>Resume immediately, adding one hour</label>}
        <button onClick={()=>onCommand('rest.interrupt',{restId:rest.id,at:Date.parse(interruption+'Z'),reason,resume,confirmed:true})}>Record GM-confirmed interruption</button>
      </>}
    </fieldset>
  </section>;
}
