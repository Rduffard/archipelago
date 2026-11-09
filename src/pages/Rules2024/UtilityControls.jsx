import {useState} from 'react';
import AbilityPreview from './AbilityPreview';
export default function UtilityControls({character,busy,onCommand}){
  const summary=character.rulesSummary,state=character.rulesRuntime,options=summary.abilityOptions.filter(o=>/^(corsair-|gray-defense|broker-resist)/.test(o.handler));
  const [targets,setTargets]=useState(''),[eventId,setEventId]=useState(''),[turn,setTurn]=useState(''),[mode,setMode]=useState('cover'),[object,setObject]=useState(''),[dc,setDC]=useState(15),[amount,setAmount]=useState(1),[type,setType]=useState('lightning'),[confirmed,setConfirmed]=useState(false);
  if(!options.length)return null;
  return <section className="character-creation__surface" aria-label="Tactical utility actions"><h2>Tactical utility actions</h2><fieldset disabled={busy}>
    <label>Utility targets, separated by commas <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={500}/></label><label>Utility trigger event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    <label>External damage turn ID <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>
    <label>Cover or Fast Hands task <select value={mode} onChange={e=>setMode(e.target.value)}>{['cover','heavy-obscurement','lock','trap','pocket'].map(id=><option key={id}>{id}</option>)}</select></label>
    <label>Fast Hands object ID <input value={object} onChange={e=>setObject(e.target.value)} maxLength={100}/></label><label>Fast Hands DC <input type="number" min={1} max={1000} value={dc} onChange={e=>setDC(Number(e.target.value))}/></label>
    <label>Unresolved damage for Resistance Reaction <input type="number" min={1} max={1000000} value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label><label>Resistance damage type <select value={type} onChange={e=>setType(e.target.value)}>{['acid','bludgeoning','cold','fire','force','lightning','necrotic','piercing','poison','psychic','radiant','slashing','thunder'].map(id=><option key={id}>{id}</option>)}</select></label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the action, trigger, range, available Reaction and cover or heavy obscurement outside enemy sight</label>
    <p>Hide requires three-quarters or total cover, or heavy obscurement; DC 15. Steady Aim requires no movement and sets all Speeds to zero through turn end, even after its one attack. Resolve that attack with the GM, then record it here. Superior Defense protects you through the triggering turn; record original incoming damage in Health so Resistance applies once. Eye of the Bargain grants Resistance to only its chosen damage instance.</p>
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><AbilityPreview option={o}/><button disabled={o.available===false||!confirmed||o.costs.some(c=>(state.pools[c.poolId]??0)<c.amount)} onClick={()=>onCommand('ability.activate',{optionId:o.id,targetIds:targets.split(',').map(s=>s.trim()).filter(Boolean),parameters:{confirmed,eventId,mode,objectId:object,dc,incomingDamage:amount,damageType:type},turnId:o.handler.startsWith('corsair-')?state.ownerTurn?.id:turn})}>Use {o.name}</button></article>)}
    <button disabled={!confirmed||!turn.trim()} onClick={()=>onCommand('turn.trigger-end',{turnId:turn,confirmed})}>Record triggering turn ended</button>
  </fieldset></section>;
}
