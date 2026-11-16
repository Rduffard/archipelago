import {firstMissingAbilityCost,chainbreakerHitModes,chainbreakerKneelConditions} from '@crossworld/sanguine-engine/callings';
import {useState} from 'react';
import AbilityPreview from './AbilityPreview';
export default function ReaverPathControls({character,rules,busy,onCommand}){
  const summary=character.rulesSummary,state=character.rulesRuntime;
  const [targets,setTargets]=useState(''),[source,setSource]=useState(''),[dc,setDC]=useState(15),[total,setTotal]=useState(10),[mode,setMode]=useState('restrained'),[eventId,setEventId]=useState(''),[turn,setTurn]=useState(''),[distance,setDistance]=useState(15),[weapon,setWeapon]=useState(''),[confirmed,setConfirmed]=useState(false);
  const options=summary.abilityOptions.filter(o=>/^(stormhide-|chainbreaker-|colossus-|reaver-path-hit|bloodwake-retaliation)/.test(o.handler));if(!options.length)return null;
  const weapons=character.inventory.filter(i=>[character.loadout.mainHand,character.loadout.offHand].includes(i.instanceId)&&rules.equipment.items.some(d=>d.id===i.definitionId&&d.kind==='weapon'));
  function activate(o){const self=['stormhide-walking','colossus-stance','colossus-suppress'].includes(o.handler);onCommand('ability.activate',{optionId:o.id,targetIds:self?[]:targets.split(',').map(s=>s.trim()).filter(Boolean),parameters:{confirmed,conditionSource:source,dc,checkTotal:total,mode,eventId,distanceFeet:distance,objectId:weapon||weapons[0]?.instanceId},...(['reaver-path-hit','stormhide-pulse'].includes(o.handler)?{turnId:o.handler==='reaver-path-hit'?state.ownerTurn?.id:turn}:{})});}
  return <section className="character-creation__surface" aria-label="Reaver Path actions"><h2>Reaver Path actions</h2><fieldset disabled={busy}>
    <label>Creature targets, separated by commas <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={500}/></label>
    <label>Trigger event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label><label>Enemy turn ID for Walking Storm <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>
    <label>Grapple or failed-save source <input value={source} onChange={e=>setSource(e.target.value)} maxLength={100}/></label><label>Source save or grapple DC <input type="number" min={1} max={1000} value={dc} onChange={e=>setDC(Number(e.target.value))}/></label><label>Failed save total <input type="number" value={total} onChange={e=>setTotal(Number(e.target.value))}/></label>
    <label>Chainbreaker hit or failed-save trigger <select value={mode} onChange={e=>setMode(e.target.value)}>{[...chainbreakerHitModes,...chainbreakerKneelConditions,'unarmed'].map(id=><option key={id}>{id}</option>)}</select></label>
    <label>Stormhide leap distance, feet <input type="number" min={1} max={15} value={distance} onChange={e=>setDistance(Number(e.target.value))}/></label>
    <label>Equipped weapon for Rage hit <select value={weapon||weapons[0]?.instanceId||''} onChange={e=>setWeapon(e.target.value)}><option value="">Choose weapon</option>{weapons.map(i=><option key={i.instanceId} value={i.instanceId}>{rules.equipment.items.find(d=>d.id===i.definitionId)?.name}</option>)}</select></label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms trigger, sight, range, available Reaction and a visible unoccupied supporting landing space when leaping</label>
    <p>Walking Storm is once per Rage; resolve each enemy's start of turn separately. Thunderous Landing requires Rage at level ten. Leap movement provokes normally. Suppressing Reef Skin removes both its damage reduction and Speed penalty until your next turn.</p>
    {summary.colossus&&<p>Colossus effective size: {summary.colossus.effectiveSize}; carrying multiplier {summary.colossus.carryingMultiplier}. Own-turn melee reach bonus: {summary.colossus.ownTurnMeleeReachBonus} feet.</p>}
    {summary.chainbreaker&&<p>Refuse the Yoke: {summary.chainbreaker.saveAdvantageAgainst.join(', ')||'unlocked at six'}; rescuer range {summary.chainbreaker.rescuerAuraFeet} feet.</p>}
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><p>{o.costs.map(c=>`${c.amount} ${c.poolId.split(':').at(-1)} (${state.pools[c.poolId]??0} remaining)`).join('; ')||'No resource cost.'}</p>
      <AbilityPreview option={o}/>
      <button disabled={o.available===false||!confirmed||Boolean(firstMissingAbilityCost(o.costs,state.pools))} onClick={()=>activate(o)}>Use {o.name}</button>
    </article>)}
  </fieldset></section>;
}
