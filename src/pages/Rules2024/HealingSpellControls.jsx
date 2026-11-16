import {useState} from 'react';
import {healingPhases,healingTargetsEligible} from '@crossworld/sanguine-engine/spells/healing';
export default function HealingSpellControls({character,rules,busy,onCommand}){
  const state=character.rulesRuntime,castings=(state.castings??[]).filter(c=>rules.healingSpellProfiles[c.spellId]);
  const [selected,setSelected]=useState(''),[targets,setTargets]=useState(''),[eventId,setEventId]=useState(''),[phase,setPhase]=useState('initial'),[turn,setTurn]=useState(''),[allocations,setAllocations]=useState({}),[confirmed,setConfirmed]=useState(false);
  if(!castings.length)return null;
  const cast=castings.find(c=>c.castId===selected)??castings.at(-1),profile=rules.healingSpellProfiles[cast.spellId],ids=targets.split(',').map(s=>s.trim()).filter(Boolean);
  return <section className="character-creation__surface" aria-label="Resolve healing spells"><h2>Resolve healing spells</h2><fieldset disabled={busy}>
    <label>Recorded healing casting <select value={cast.castId} onChange={e=>{setSelected(e.target.value);setTargets('');setPhase('initial');}}>{castings.map(c=><option key={c.castId} value={c.castId}>{c.spellId}, level {c.slotLevel}: {c.castId}</option>)}</select></label>
    <p>Recorded recipients: {(cast.targets??[]).join(', ')||'none; future castings must identify their targets before resolution'}.</p>
    <label>Healing recipient IDs, from the recorded casting <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={1000}/></label>
    <button onClick={()=>setTargets((cast.targets??[]).join(', '))}>Use all recorded healing recipients</button>
    <label>Healing event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    {profile.ticks&&<><label>Regenerate phase <select value={phase} onChange={e=>setPhase(e.target.value)}>{healingPhases.map(id=><option key={id} value={id}>{id==='initial'?'Initial healing':'Recipient start of turn'}</option>)}</select></label><label>Regeneration recipient turn ID <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label></>}
    {profile.budget&&<fieldset><legend>Divide at most {profile.budget} healing</legend>{ids.map(id=><label key={id}>Mass Heal for {id}<input type="number" min={1} max={profile.budget} value={allocations[id]??0} onChange={e=>setAllocations({...allocations,[id]:Number(e.target.value)})}/></label>)}</fieldset>}
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the casting completed and these original recipients satisfy range, sight and timing</label>
    <p>The server rolls healing once, applies Sanctuary upgrades and saves native recipients atomically. Prayer of Healing also grants its Short Rest recovery and requires a recipient Long Rest before another benefit. Regeneration requires its live source effect. Use the saved result for external tabletop recipients.</p>
    <button disabled={!confirmed||!eventId.trim()||!healingTargetsEligible(ids,profile.targets,cast.targets)} onClick={()=>onCommand('spell.heal',{castId:cast.castId,targetIds:ids,eventId,phase,...(phase==='regeneration-turn'?{turnId:turn}:{}),...(profile.budget?{allocations:ids.map(targetId=>({targetId,amount:allocations[targetId]??0}))}:{}),confirmed})}>Resolve and save spell healing</button>
  </fieldset></section>;
}
