import {useState} from 'react';
import AbilityPreview from './AbilityPreview';
export default function StormBrokerControls({character,busy,onCommand}){
  const [exempt,setExempt]=useState(''),[ally,setAlly]=useState(''),[eventId,setEvent]=useState(''),[zone,setZone]=useState(''),[roundNumber,setRound]=useState(1),[creditTurn,setCreditTurn]=useState(''),[note,setNote]=useState(''),[confirmed,setConfirmed]=useState(false);
  const s=character.rulesSummary,state=character.rulesRuntime;if(s.paths.navigator!=='storm-broker')return null;
  const options=s.abilityOptions.filter(o=>['squall','broker-credit'].includes(o.handler)),squalls=state.effects.filter(e=>e.featureId==='path:storm-broker:barometer-instinct:3');
  return <details><summary>Storm Broker Squalls and credit</summary><fieldset disabled={busy}>
    <label>Squall position and adjudication note <input value={note} onChange={e=>setNote(e.target.value)} maxLength={500}/></label>
    <label>Visible creatures exempt from the new Squall, separated by commas <input value={exempt} onChange={e=>setExempt(e.target.value)} maxLength={500}/></label>
    <p>Before level seven choose no exemptions. Borrowed Squall permits at most your Instinct modifier, minimum one. Squalls do not stack. Roll Initiative to identify the combat before granting credit; it is once per round outside your turn.</p>
    <label>Captain's Credit ally ID <input value={ally} onChange={e=>setAlly(e.target.value)} maxLength={100}/></label><label>Captain's Credit success event ID <input value={eventId} onChange={e=>setEvent(e.target.value)} maxLength={100}/></label>
    <label>Current combat round <input type="number" min={1} max={100000} value={roundNumber} onChange={e=>setRound(Number(e.target.value))}/></label><label>External success turn ID <input value={creditTurn} onChange={e=>setCreditTurn(e.target.value)} maxLength={100}/></label>
    <label>Credit source Squall <select value={zone||squalls[0]?.id||''} onChange={e=>setZone(e.target.value)}><option value="">Choose active Squall</option>{squalls.map(e=><option key={e.id} value={e.id}>{e.zone}: {e.id}</option>)}</select></label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms a center within sixty feet and visible exemptions; for credit, this ally succeeded on an attack or save inside my Squall, visible within sixty feet outside my turn in the stated combat round</label>
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><AbilityPreview option={o}/><button disabled={o.available===false||!confirmed||o.costs.some(cost=>(state.pools[cost.poolId]??0)<cost.amount)} onClick={()=>onCommand('ability.activate',{optionId:o.id,targetIds:o.handler==='broker-credit'?[ally.trim()]:[],note,parameters:{confirmed,...(o.handler==='squall'?{exemptTargets:exempt.split(',').map(s=>s.trim()).filter(Boolean)}:{eventId,roundNumber,objectId:zone||squalls[0]?.id})},...(o.handler==='broker-credit'?{turnId:creditTurn}:{})})}>Use {o.name}</button></article>)}
  </fieldset></details>;
}
