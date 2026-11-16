import {firstMissingAbilityCost,envoyRepeatedSaveConditions} from '@crossworld/sanguine-engine/callings';
import {useState} from 'react';
import AbilityPreview from './AbilityPreview';
export default function EnvoyControls({summary,state,busy,onCommand}){
  const [targets,setTargets]=useState(''),[eventId,setEventId]=useState(''),[turnId,setTurnId]=useState(''),[condition,setCondition]=useState('charmed'),[confirmed,setConfirmed]=useState(false);
  const options=summary.abilityOptions.filter(o=>o.handler.startsWith('envoy-'));
  if(!options.length)return null;
  function activate(o){onCommand('ability.activate',{optionId:o.id,targetIds:targets.split(',').map(s=>s.trim()).filter(Boolean),turnId,parameters:{eventId,confirmed,mode:condition}});}
  return <section className="character-creation__surface" aria-label="Black Flag Envoy commands"><h2>Black Flag Envoy</h2><fieldset disabled={busy}>
    <label>Ally or parley target IDs, separated by commas <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={500}/></label>
    <label>Unique command event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    <label>Command turn ID <input value={turnId} onChange={e=>setTurnId(e.target.value)} maxLength={100}/></label>
    <label>Crew Before Crown condition <select value={condition} onChange={e=>setCondition(e.target.value)}>{envoyRepeatedSaveConditions.map(id=><option key={id} value={id}>{id==='charmed'?'Charmed':'Frightened'}</option>)}</select></label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms printed range and visibility. Each commanded ally hears me, is conscious, and has a Reaction to spend. Parley targets understand me.</label>
    <p>All Hands grants movement to up to three different allies. Each spends its own Reaction. Crew Before Crown repeats the original condition save with Advantage; end that condition only on success.</p>
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><AbilityPreview option={o}/><p>{o.costs.map(c=>`${c.amount} ${c.poolId.split(':').at(-1)} (${state.pools[c.poolId]??0} remaining)`).join('; ')}</p><button disabled={o.available===false||!confirmed||!eventId.trim()||Boolean(firstMissingAbilityCost(o.costs,state.pools))} onClick={()=>activate(o)}>Use {o.name}</button></article>)}
    <p>Binding Parley requires a failed Instinct save. Charmed immunity prevents both effects. Repeat the save at each target turn end; harm from you or an ally ends that target's effect. Resolve these world events with the GM.</p>
  </fieldset></section>;
}
