import {firstMissingAbilityCost} from '@crossworld/sanguine-engine/callings';
import {useState} from 'react';
import {unbrokenCurrentUnlocked} from '@crossworld/sanguine-engine/vitality';
import callingRules from '@crossworld/sanguine-engine/calling-mechanics';
import AbilityPreview from './AbilityPreview';
export default function ConduitControls({summary,state,busy,onCommand}){
  const [target,setTarget]=useState(''),[triggerTarget,setTriggerTarget]=useState(''),[eventId,setEventId]=useState(''),[grantId,setGrantId]=useState(''),[turn,setTurn]=useState(''),[confirmed,setConfirmed]=useState(false);
  const options=summary.abilityOptions.filter(o=>o.handler.startsWith('conduit-'));
  if(!options.length)return null;
  const shelter=callingRules.bloodPriceShelterSelected(summary.pathSelections.tidecaller.pathDiscipline);
  function activate(o){const circuit=o.handler==='conduit-circuit';onCommand('ability.activate',{optionId:o.id,targetIds:circuit||o.handler==='conduit-price'&&shelter?[target.trim()]:[],parameters:{confirmed,...(circuit?{eventId,targetId:triggerTarget.trim(),objectId:grantId}:{})},...(circuit?{turnId:turn}:{})});}
  return <section className="character-creation__surface" aria-label="Sanguine Conduit"><h2>Sanguine Conduit</h2><fieldset disabled={busy}>
    <p>Blood Price: lose {callingRules.bloodPriceHealthCost(summary.trainingBonus)} Health, bypassing Resistance and temporary Health; you must remain at 1 or more. {shelter?'Shelter grants one creature temporary Health within 30 feet.':'Surge adds Necrotic damage to one damage roll of your next spell before your next turn; a nondamaging spell forfeits it.'}</p>
    <label>Temporary Health recipient stable ID (your own ID to target yourself) <input value={target} onChange={e=>setTarget(e.target.value)} maxLength={100}/></label>
    {options.some(option=>option.handler==='conduit-circuit')&&<>
      <label>Vital Circuit: creature that lost Blood Price temporary Health <input value={triggerTarget} onChange={e=>setTriggerTarget(e.target.value)} maxLength={100}/></label>
      <label>Source damage operation ID (native) or GM damage event ID (tabletop) <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
      <label>Blood Price grant for a tabletop target <select value={grantId} onChange={e=>setGrantId(e.target.value)}><option value="">Choose grant if target is external</option>{(state.conduitGrants??[]).map(g=><option key={g.grantId} value={g.grantId}>{g.targetId}: {g.grantId}</option>)}</select></label>
      <label>Vital Circuit trigger turn ID <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>
      <p>Once per turn, use your Reaction when damage reduces your Blood Price temporary Health on the source creature. Grant another creature within 30 feet {callingRules.vitalCircuitHealth(summary.attributeModifiers.spirit)} temporary Health. Expiry, replacement and Vital Circuit's own pool cannot trigger it.</p>
    </>}
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the range, trigger and available Reaction; for an external source, damage reduced the selected Blood Price pool.</label>
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><AbilityPreview option={o}/><p>{o.costs.map(c=>`${c.amount} ${c.poolId.split(':').at(-1)} (${state.pools[c.poolId]??0} remaining)`).join('; ')||'No resource cost.'}</p><button disabled={o.available===false||!confirmed||Boolean(firstMissingAbilityCost(o.costs,state.pools))} onClick={()=>activate(o)}>Use {o.name}</button></article>)}
    {unbrokenCurrentUnlocked(summary.paths.tidecaller,summary.callingLevels.tidecaller)&&<p>Unbroken Current is selected in the damage controls. It resolves before Unconscious, only when the damage would reduce you to zero without killing you outright.</p>}
  </fieldset></section>;
}
