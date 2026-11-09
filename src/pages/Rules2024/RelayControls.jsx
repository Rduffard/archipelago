import {useState} from 'react';
import AbilityPreview from './AbilityPreview';

export default function RelayControls({summary,state,busy,onCommand}){
  const [objectId,setObjectId]=useState('');
  const [confirmed,setConfirmed]=useState(false);
  const [distance,setDistance]=useState(15);
  const [near,setNear]=useState(false);
  const [damage,setDamage]=useState(0);
  const [damageType,setDamageType]=useState('bludgeoning');
  const [targets,setTargets]=useState('');
  const relays=state.effects.filter(e=>e.objectType==='relay'&&e.health.current>0&&(!summary.activeRelayIds||summary.activeRelayIds.includes(e.id)));
  const selected=relays.find(e=>e.id===objectId)??relays[0];
  const options=(summary.abilityOptions??[]).filter(o=>o.handler.startsWith('relay-'));
  if(!options.length)return null;
  function activate(option){
    const parameters=option.handler==='relay-place'?{confirmed,...(relays.length>=(summary.totalLevel>=14?2:1)&&summary.totalLevel>=14?{replaceObjectId:selected?.id}:{})}
      :{objectId:selected?.id,...(option.handler==='relay-proximity'?{withinTenFeet:near}:{confirmed}),...(option.handler==='relay-move'?{distanceFeet:distance}:{})};
    onCommand('ability.activate',{optionId:option.id,parameters,
      ...(option.handler==='relay-discharge'?{targetIds:targets.split(',').map(id=>id.trim()).filter(Boolean)}:{})});
  }
  return <section className="character-creation__surface" aria-label="Aether relays"><h2>Aether relays</h2>
    <p>Relays last one minute. Confirm placement and movement with the GM; your own sight still determines spell targeting.</p>
    <fieldset disabled={busy}>
      <label>Owned relay <select value={selected?.id??''} onChange={e=>setObjectId(e.target.value)}><option value="" disabled>No relay selected</option>{relays.map((r,i)=><option key={r.id} value={r.id}>Relay {i+1}: {r.health.current}/{r.health.max} Health</option>)}</select></label>
      <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms unoccupied placement within 30 feet, movement within 60 feet, or all Discharge targets without exemptions</label>
      <label>Mobile relay movement in feet <input type="number" min={0} max={15} value={distance} onChange={e=>setDistance(Number(e.target.value))}/></label>
      {summary.totalLevel>=6&&<label><input type="checkbox" checked={near} onChange={e=>setNear(e.target.checked)}/>I am within ten feet of the selected relay</label>}
      {options.some(o=>o.handler==='relay-discharge')&&<label>All Discharge targets within 10 feet, including allies <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={1000}/></label>}
      {options.map(option=><div key={option.id}><p>{option.name}: {option.action}. {option.costs.map(c=>`${c.amount} Relay use (${state.pools[c.poolId]} remaining)`).join(', ')}</p>
        <AbilityPreview option={option}/>
        
        <button disabled={option.available===false||option.costs.some(c=>state.pools[c.poolId]<c.amount)||(option.handler!=='relay-place'&&!selected)||(option.handler!=='relay-proximity'&&!confirmed)} onClick={()=>activate(option)}>{option.name}</button></div>)}
      {selected&&<><p>Selected relay: Guard {selected.guard}; immune to Poison and Psychic. {selected.mobile?'Mobile.':'Grounded.'}</p>
        <label>Incoming object damage <input type="number" min={0} value={damage} onChange={e=>setDamage(Number(e.target.value))}/></label>
        <label>Object damage type <select value={damageType} onChange={e=>setDamageType(e.target.value)}>{['acid','bludgeoning','cold','fire','force','lightning','necrotic','piercing','poison','psychic','radiant','slashing','thunder'].map(id=><option key={id}>{id}</option>)}</select></label>
        <button onClick={()=>onCommand('object.damage',{effectId:selected.id,amount:damage,damageType})}>Apply damage to relay</button>
      </>}
    </fieldset>
  </section>;
}
