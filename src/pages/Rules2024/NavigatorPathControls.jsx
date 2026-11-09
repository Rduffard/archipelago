import {useState} from 'react';
import AbilityPreview from './AbilityPreview';
export default function NavigatorPathControls({character,rules,busy,onCommand}){
  const summary=character.rulesSummary,state=character.rulesRuntime;
  const [targets,setTargets]=useState(''),[ally,setAlly]=useState(''),[destinations,setDestinations]=useState(''),[weapon,setWeapon]=useState(''),[eventId,setEventId]=useState(''),[turn,setTurn]=useState(''),[mode,setMode]=useState('none'),[damage,setDamage]=useState(1),[confirmed,setConfirmed]=useState(false);
  const options=summary.abilityOptions.filter(o=>/^(starwake-|mangrove-)/.test(o.handler));if(!options.length)return null;
  const weapons=character.inventory.filter(i=>[character.loadout.mainHand,character.loadout.offHand].includes(i.instanceId)&&rules.equipment.items.some(d=>d.id===i.definitionId&&d.kind==='weapon'));
  const ids=value=>value.split(',').map(s=>s.trim()).filter(Boolean);
  function activate(o){onCommand('ability.activate',{optionId:o.id,targetIds:ids(targets),parameters:{confirmed,eventId,objectId:weapon||weapons[0]?.instanceId,advantageTargets:ids(ally),areas:ids(destinations),mode,incomingDamage:damage},...(['starwake-hit','mangrove-predator'].includes(o.handler)?{turnId:state.ownerTurn?.id}:o.handler==='mangrove-hit'?{turnId:turn}:{})});}
  return <section className="character-creation__surface" aria-label="Navigator Path actions"><h2>Navigator Path actions</h2><fieldset disabled={busy}>
    <label>Creature targets, separated by commas <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={500}/></label>
    <label>Trigger event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    <label>Triggering turn ID for Rooted Ambush <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>
    <label>Guided ally within five feet of the hit target <input value={ally} onChange={e=>setAlly(e.target.value)} maxLength={100}/></label>
    <label>Homeward destinations, self first, separated by commas <input value={destinations} onChange={e=>setDestinations(e.target.value)} maxLength={500}/></label>
    <label>Equipped weapon for the hit <select value={weapon||weapons[0]?.instanceId||''} onChange={e=>setWeapon(e.target.value)}><option value="">Choose weapon</option>{weapons.map(i=><option key={i.instanceId} value={i.instanceId}>{rules.equipment.items.find(d=>d.id===i.definitionId)?.name}</option>)}</select></label>
    <label>Cover or Patient Predator trigger <select value={mode} onChange={e=>setMode(e.target.value)}>{['none','cover','heavy-obscurement','started-hidden-in-cover'].map(id=><option key={id}>{id}</option>)}</select></label>
    <label>Unresolved incoming damage for Vanish <input type="number" min={1} max={1000000} value={damage} onChange={e=>setDamage(Number(e.target.value))}/></label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the trigger, first eligible hit, willingness, sight, range, cover and distinct unoccupied supporting destinations</label>
    <p>Passage grants a movement speed, not extra movement. Homeward includes you and ends Passage. Rooted Ambush requires your active Hunter’s Mark. Vanish halves the unresolved hit and its movement provokes normally; cover Hide uses a new Agility (Stealth) check against DC 15.</p>
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><p>{o.costs.map(c=>`${c.amount} ${c.poolId.split(':').at(-1)} (${state.pools[c.poolId]??0} remaining)`).join('; ')||'No resource cost.'}</p>
      <AbilityPreview option={o}/>
      <button disabled={o.available===false||!confirmed||o.costs.some(c=>(state.pools[c.poolId]??0)<c.amount)} onClick={()=>activate(o)}>Use {o.name}</button>
    </article>)}
  </fieldset></section>;
}
