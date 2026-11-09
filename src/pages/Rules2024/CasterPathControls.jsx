import {useState} from 'react';
import AbilityPreview from './AbilityPreview';
export default function CasterPathControls({character,busy,onCommand}){
  const summary=character.rulesSummary,state=character.rulesRuntime;
  const [targets,setTargets]=useState(''),[castId,setCastId]=useState(''),[eventId,setEventId]=useState(''),[turn,setTurn]=useState(''),[attribute,setAttribute]=useState('spirit'),[total,setTotal]=useState(10),[dc,setDC]=useState(15),[condition,setCondition]=useState(''),[source,setSource]=useState(''),[type,setType]=useState('thunder'),[passenger,setPassenger]=useState(''),[confirmed,setConfirmed]=useState(false);
  const options=summary.abilityOptions.filter(o=>/^(echo-|tempest-)/.test(o.handler));if(!options.length)return null;
  function activate(o){const own=['echo-link','tempest-pulse','tempest-convert'].includes(o.handler),external=['echo-pattern','tempest-damage'].includes(o.handler);onCommand('ability.activate',{optionId:o.id,targetIds:targets.split(',').map(s=>s.trim()).filter(Boolean),parameters:{confirmed,objectId:castId||state.castings?.at(-1)?.castId,eventId,saveAttribute:attribute,checkTotal:total,dc,mode:condition,conditionSource:source,damageType:type,...(passenger?{targetId:passenger}:{})},...(own?{turnId:state.ownerTurn?.id}:external?{turnId:turn}:{})});}
  return <section className="character-creation__surface" aria-label="Tidecaller Path actions"><h2>Tidecaller Path actions</h2><fieldset disabled={busy}>
    <label>Creature targets, separated by commas <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={500}/></label>
    <label>Source casting <select value={castId||state.castings?.at(-1)?.castId||''} onChange={e=>setCastId(e.target.value)}><option value="">Choose a saved casting</option>{(state.castings??[]).map(c=><option key={c.castId} value={c.castId}>{c.spellId}: {c.castId}</option>)}</select></label>
    <label>Trigger event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    <label>Enemy save or spell damage turn ID <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>
    <label>Failed save attribute <select value={attribute} onChange={e=>setAttribute(e.target.value)}>{['wit','instinct','spirit'].map(id=><option key={id}>{id}</option>)}</select></label>
    <label>Failed save total <input type="number" value={total} onChange={e=>setTotal(Number(e.target.value))}/></label><label>Save DC <input type="number" min={1} max={1000} value={dc} onChange={e=>setDC(Number(e.target.value))}/></label>
    <label>Unwritten Self condition to end <select value={condition} onChange={e=>setCondition(e.target.value)}><option value="">None</option><option value="charmed">Charmed</option><option value="frightened">Frightened</option></select></label>
    <label>Condition source <input value={source} onChange={e=>setSource(e.target.value)} maxLength={100}/></label>
    <label>Next spell conversion destination <select value={type} onChange={e=>setType(e.target.value)}><option value="lightning">Lightning</option><option value="thunder">Thunder</option></select></label>
    <label>Eye of the Storm willing adjacent passenger <input value={passenger} onChange={e=>setPassenger(e.target.value)} maxLength={100}/></label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the unresolved trigger, sight, range, willingness, language understanding and eligible passenger size and landing space</label>
    <p>Clear targets for personal saves and storm activations. Shared Recollection counts all linked creatures against Training Bonus; include yourself to join. Recalled Pattern leaves the enemy save unchanged. Storm Pulse immediately follows the selected levelled casting on your turn. Conversion is consumed by your next Tidecaller spell this turn, including a spell with no eligible damage.</p>
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><AbilityPreview option={o}/><p>{o.costs.map(c=>`${c.amount} ${c.poolId.split(':').at(-1)} (${state.pools[c.poolId]??0} remaining)`).join('; ')||'No resource cost.'}</p><button disabled={o.available===false||!confirmed||o.costs.some(c=>(state.pools[c.poolId]??0)<c.amount)} onClick={()=>activate(o)}>Use {o.name}</button></article>)}
  </fieldset></section>;
}
