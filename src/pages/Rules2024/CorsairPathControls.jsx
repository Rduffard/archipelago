import {useState} from 'react';
import AbilityPreview from './AbilityPreview';
export default function CorsairPathControls({summary,state,busy,onCommand}){
  const [target,setTarget]=useState(''),[eventId,setEventId]=useState(''),[attackTotal,setAttackTotal]=useState(15),[indices,setIndices]=useState('1'),[turnId,setTurnId]=useState(''),[confirmed,setConfirmed]=useState(false);
  const [originalRoll,setOriginalRoll]=useState(10);
  const options=summary.abilityOptions.filter(o=>o.handler.startsWith('lantern-')||o.handler.startsWith('duelist-'));
  if(!options.length)return null;
  function use(o){const parameters={confirmed};if(['lantern-reroll','duelist-parry','duelist-answer','duelist-footwork','duelist-perfect'].includes(o.handler))parameters.eventId=eventId;if(o.handler==='duelist-parry')Object.assign(parameters,{attackTotal,originalRoll});if(o.handler==='lantern-reroll')parameters.indices=indices.split(',').map(i=>Number(i.trim())-1);
    onCommand('ability.activate',{optionId:o.id,parameters,targetIds:target.trim()?[target.trim()]:[],...(o.handler==='duelist-footwork'?{turnId}:{})});}
  return <section className="character-creation__surface" aria-label="Corsair Path abilities"><h2>{summary.paths.corsair==='hollow-lantern'?'Hollow Lantern':'Saltglass Duelist'}</h2><fieldset disabled={busy}>
    <label>Target stable ID <input value={target} onChange={e=>setTarget(e.target.value)} maxLength={100}/></label>
    <label>Attack or saved damage event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    <label>Attack total against your Guard (Open Challenge) <input type="number" min={-100} max={1000} value={attackTotal} onChange={e=>setAttackTotal(Number(e.target.value))}/></label>
    <label>Incoming attack natural d20 <input type="number" min={1} max={20} value={originalRoll} onChange={e=>setOriginalRoll(Number(e.target.value))}/></label>
    <label>Attack turn ID (Saltglass Footwork) <input value={turnId} onChange={e=>setTurnId(e.target.value)} maxLength={100}/></label>
    {summary.paths.corsair==='hollow-lantern'&&summary.totalLevel>=17&&<><label>Last Tell: saved studied Sneak Attack <select value={eventId} onChange={e=>setEventId(e.target.value)}><option value="">Choose damage roll</option>{(state.strikeHistory??[]).filter(s=>s.kind==='cunning'&&s.studyEffectId&&!s.lastTellUsed).map(s=><option key={s.eventId} value={s.eventId}>{s.eventId}: {s.rolls.join(', ')} against {s.targetId}</option>)}</select></label><label>Last Tell dice positions (1-based, up to three) <input value={indices} onChange={e=>setIndices(e.target.value)}/></label></>}
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the printed range, visibility, trigger and target facts</label>
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><AbilityPreview option={o}/><p>{o.costs.map(c=>`${c.amount} ${c.poolId.split(':').at(-1)} (${state.pools[c.poolId]??0} remaining)`).join('; ')||'No resource cost.'}</p><button disabled={o.available===false||!confirmed||o.costs.some(c=>(state.pools[c.poolId]??0)<c.amount)} onClick={()=>use(o)}>Use {o.name}</button></article>)}
    {!!summary.studiedSneakTargets?.length&&<p>Read the Wake targets: {summary.studiedSneakTargets.join(', ')}. No other creature may be within five feet of you, and you must lack Disadvantage.</p>}
    {summary.detectFalseAdvantage&&<p>Unmask the False: Advantage on checks to detect disguises, shapechanging and illusions. No automatic revelation.</p>}
    {!!summary.unseenAttackAdvantageSuppressedTargets?.length&&<p>Unseen attack Advantage suppressed against you: {summary.unseenAttackAdvantageSuppressedTargets.join(', ')}. Only the last location is marked; later movement is not revealed.</p>}
    {!!state.strikeHistory?.some(s=>s.kind==='cunning')&&<details><summary>Saved Sneak Attack damage</summary>{state.strikeHistory.filter(s=>s.kind==='cunning').map(s=><p key={s.eventId}>{s.eventId}: {s.rolls.join(' + ')} = {s.extraDamage} {s.damageType}{s.lastTellUsed?'; Last Tell used':''}.</p>)}</details>}
    {(state.counters.duelistParries??[]).map(p=><p key={p.eventId}>{p.eventId}: Guard {p.guardBefore} → {p.guardAfter}; incoming total {p.attackTotal}; {p.causedMiss?'Open Challenge caused a miss.':'No miss caused by this feature.'}{p.answered?' Answer in Steel used.':''}</p>)}
  </fieldset></section>;
}
