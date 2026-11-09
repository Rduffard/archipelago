import {useState} from 'react';
import AbilityPreview from './AbilityPreview';
export default function GunslingerPathControls({character,rules,busy,onCommand}){
  const summary=character.rulesSummary,state=character.rulesRuntime;
  const [targets,setTargets]=useState(''),[eventId,setEventId]=useState(''),[turn,setTurn]=useState(''),[weapon,setWeapon]=useState(''),[ammo,setAmmo]=useState(''),[distance,setDistance]=useState(10),[mount,setMount]=useState(false),[voluntary,setVoluntary]=useState(true),[confirmed,setConfirmed]=useState(false);
  const options=summary.abilityOptions.filter(o=>/^(suppressor-|outrider-)/.test(o.handler));if(!options.length)return null;
  const weapons=character.inventory.filter(i=>[character.loadout.mainHand,character.loadout.offHand].includes(i.instanceId)&&rules.equipment.items.some(d=>d.id===i.definitionId&&d.kind==='weapon'));
  const ammunition=character.inventory.filter(i=>rules.equipment.items.some(d=>d.id===i.definitionId&&d.kind!=='weapon'&&d.ammunitionType));
  function activate(o){
    if(o.handler==='outrider-passing'){
      const hit=state.ownerTurn?.firstWeaponHit;
      if(hit)onCommand('ability.activate',{optionId:o.id,targetIds:[hit.targetId],turnId:state.ownerTurn.id,parameters:{confirmed,eventId:hit.eventId,objectId:hit.weaponId}});
      return;
    }
    const self=['suppressor-hold','outrider-recoil'].includes(o.handler);
    onCommand('ability.activate',{optionId:o.id,targetIds:self?[]:targets.split(',').map(s=>s.trim()).filter(Boolean),parameters:{confirmed,eventId,objectId:weapon||weapons[0]?.instanceId,ammunitionId:ammo||ammunition[0]?.instanceId,distanceFeet:distance,mode:mount?'mount':'self'},...(['outrider-recoil','outrider-horizon'].includes(o.handler)?{turnId:state.ownerTurn?.id}:o.handler==='suppressor-hit'?{turnId:turn}:{})});
  }
  return <section className="character-creation__surface" aria-label="Gunslinger Path actions"><h2>Gunslinger Path actions</h2><fieldset disabled={busy}>
    <label>Targets, primary hit first, separated by commas <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={500}/></label>
    <label>Attack or movement trigger event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    <label>Triggering turn ID for Suppressing Fire <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>
    <label>Equipped weapon <select value={weapon||weapons[0]?.instanceId||''} onChange={e=>setWeapon(e.target.value)}><option value="">Choose weapon</option>{weapons.map(i=><option key={i.instanceId} value={i.instanceId}>{rules.equipment.items.find(d=>d.id===i.definitionId)?.name}</option>)}</select></label>
    <label>Ammunition for Crossing Denied or Horizon <select value={ammo||ammunition[0]?.instanceId||''} onChange={e=>setAmmo(e.target.value)}><option value="">Choose ammunition</option>{ammunition.map(i=><option key={i.instanceId} value={i.instanceId}>{i.definitionId}: {i.quantity}</option>)}</select></label>
    <label>Movement distance, feet <input type="number" min={0} max={10000} value={distance} onChange={e=>setDistance(Number(e.target.value))}/></label>
    <label><input type="checkbox" checked={mount} onChange={e=>setMount(e.target.checked)}/>Recoil moves a willing mount using its remaining movement</label>
    <label><input type="checkbox" checked={voluntary} onChange={e=>setVoluntary(e.target.checked)}/>Recorded movement uses voluntary Speed movement</label>
    <button disabled={!confirmed||!state.ownerTurn?.open||distance<1} onClick={()=>onCommand('movement.record',{feet:distance,voluntarySpeed:voluntary,eventId,confirmed})}>Record movement before the hit</button>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the attack or trigger, sight, range, first eligible hit, movement and available Reaction</label>
    <p>For Passing Shot, record movement first, then save the first hit using Record attack outcomes and choose its weapon. Passing Shot uses that saved hit. Overlapping Fields adds control to its secondary target with zero extra damage. Crossing Denied and Horizon spend ammunition here. Resolve their single attack with the GM without spending ammunition again. Crossing Denied cannot also apply Suppressing Fire.</p>
    {summary.entrenchedDrill&&<p>Entrenched Drill ranged Half Cover: {summary.entrenchedDrill.halfCoverAgainstRanged?'active':'inactive'}. Moving beyond five feet ends it; general Guard is unchanged.</p>}
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><p>{o.costs.map(c=>`${c.amount} ${c.poolId.split(':').at(-1)} (${state.pools[c.poolId]??0} remaining)`).join('; ')||'No resource cost.'}</p>
      <AbilityPreview option={o}/>
      <button disabled={o.available===false||!confirmed||o.costs.some(c=>(state.pools[c.poolId]??0)<c.amount)} onClick={()=>activate(o)}>Use {o.name}</button>
    </article>)}
  </fieldset></section>;
}
