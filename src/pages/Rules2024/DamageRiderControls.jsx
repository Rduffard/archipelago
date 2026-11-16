import {useState} from 'react';
import {damageRiderModes,divineStrikeDamageTypes} from '@crossworld/sanguine-engine/callings';
import AbilityPreview from './AbilityPreview';
export default function DamageRiderControls({character,rules,busy,onCommand}){
  const summary=character.rulesSummary,state=character.rulesRuntime;
  const [targets,setTargets]=useState(''),[source,setSource]=useState(''),[eventId,setEventId]=useState(''),[mode,setMode]=useState('normal'),[type,setType]=useState('radiant'),[amount,setAmount]=useState(0),[confirmed,setConfirmed]=useState(false),[riderTurn,setRiderTurn]=useState('');
  const options=summary.abilityOptions.filter(o=>o.handler.startsWith('rider-'));if(!options.length)return null;
  const weapons=character.inventory.filter(i=>[character.loadout.mainHand,character.loadout.offHand].includes(i.instanceId)&&rules.equipment.items.some(d=>d.id===i.definitionId&&d.kind==='weapon'));
  return <section className="character-creation__surface" aria-label="Weapon and spell damage riders"><h2>Weapon and spell damage riders</h2><fieldset disabled={busy}>
    <label>Damage or vitality target IDs, separated by commas <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={500}/></label>
    <label>Rider source casting or equipped weapon <select value={source} onChange={e=>setSource(e.target.value)}><option value="">Choose recorded source (or Unarmed Strike)</option>{weapons.map(i=><option key={i.instanceId} value={i.instanceId}>{rules.equipment.items.find(d=>d.id===i.definitionId).name}</option>)}{(state.castings??[]).map(c=><option key={c.castId} value={c.castId}>{c.spellId}: {c.castId}</option>)}</select></label>
    <label>Damage rider turn ID for once-per-turn secondary Mark damage <input value={riderTurn} onChange={e=>setRiderTurn(e.target.value)} maxLength={100}/></label>
    <label>Damage rider event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    <label>Hit or avoided-cantrip outcome <select value={mode} onChange={e=>setMode(e.target.value)}>{damageRiderModes.map(id=><option key={id}>{id}</option>)}</select></label>
    <label>Divine Strike damage type <select value={type} onChange={e=>setType(e.target.value)}>{divineStrikeDamageTypes.map(type=><option key={type} value={type}>{type==='radiant'?'Radiant':'Necrotic'}</option>)}</select></label>
    <label>Original cantrip damage before Potent Cantrip halves it <input type="number" min={0} max={1000000} value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the source spell dealt damage or the equipped weapon hit, eligible targets and ranges, Critical Hit and save outcomes</label>
    <p>Riders grant their own extra dice or modifier only. Inoculated uses a recorded spell healing event and one actually healed recipient; the next Poisoned save has Advantage for up to one hour. End that saved effect after the save. Superior Gray Net prey uses the same Mark damage event, with its marked creature first and a different visible creature within thirty feet second; it is once per turn. Divine Strike is once on your turn; Radiant Strikes applies to each distinct melee weapon or Unarmed Strike hit. Elemental Affinity and Empowered Evocation modify only one damage roll of a recorded casting. Potent Cantrip’s half damage carries no additional effect.</p>
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><AbilityPreview option={o}/><button disabled={o.available===false||!confirmed} onClick={()=>onCommand('ability.activate',{optionId:o.id,targetIds:targets.split(',').map(s=>s.trim()).filter(Boolean),parameters:{confirmed,objectId:source,eventId,mode,damageType:type,amount},...(['rider-divine','rider-mark-transfer'].includes(o.handler)?{turnId:state.ownerTurn?.id}:o.handler==='rider-mark-secondary'?{turnId:riderTurn||state.ownerTurn?.id}:{})})}>Use {o.name}</button></article>)}
  </fieldset></section>;
}
