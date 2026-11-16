import {firstMissingAbilityCost,freePortDefaultSaveDC,freePortBreakConditions,freePortRerollConditions} from '@crossworld/sanguine-engine/callings';
import {useState} from 'react';
import {readyMeleeWeapon} from '@crossworld/sanguine-engine/equipment/weapon-projection';
import AbilityPreview from './AbilityPreview';
export default function WardenPathControls({character,busy,onCommand}){
  const summary=character.rulesSummary,state=character.rulesRuntime;
  const [target,setTarget]=useState(''),[source,setSource]=useState(''),[mode,setMode]=useState('restrained'),[magical,setMagical]=useState(false),[dc,setDC]=useState(freePortDefaultSaveDC),[originalRoll,setOriginalRoll]=useState(5),[total,setTotal]=useState(10),[eventId,setEventId]=useState(''),[turn,setTurn]=useState(''),[undead,setUndead]=useState(false),[confirmed,setConfirmed]=useState(false);
  const options=summary.abilityOptions.filter(o=>o.handler.startsWith('freeport-')||o.handler.startsWith('vigil-')||['sacred','nimbus','nimbus-pulse'].includes(o.handler));
  const [weapon,setWeapon]=useState('');
  if(!options.length)return null;
  const hit=state.ownerTurn?.open?state.ownerTurn.firstWeaponHit:null;
  const meleeWeapons=character.equipment?.attacks?.filter(attack=>readyMeleeWeapon(attack))??[];
  function activate(o){const area=['freeport-harbor','vigil-watch','vigil-dawn','sacred','nimbus'].includes(o.handler),watchHit=o.handler==='vigil-hit';onCommand('ability.activate',{optionId:o.id,targetIds:area?[]:[watchHit?hit.targetId:target.trim()],parameters:{confirmed,consent:confirmed,conditionSource:source,mode,magical,dc,originalRoll,checkTotal:total,eventId:watchHit?hit.eventId:eventId,objectId:watchHit?hit.weaponId:weapon||meleeWeapons[0]?.instanceId,undead},...(['vigil-hit','vigil-dawn-damage','nimbus-pulse'].includes(o.handler)?{turnId:watchHit?state.ownerTurn?.id:turn}:{})});}
  return <section className="character-creation__surface" aria-label="Warden Path actions"><h2>{summary.paths.warden==='lantern-vigil'?'Lantern Vigil':summary.paths.warden==='leviathan-anchor'?'Leviathan Anchor':'Oath of the Free Port'}</h2><fieldset disabled={busy}>
    {summary.smiteProtectionAura&&<p>Smite of Protection: allies in your {summary.smiteProtectionAura.radiusFeet}-foot aura have Half Cover until your next turn.</p>}
    {summary.holyNimbus&&<p>Holy Nimbus: sunlight fills your {summary.holyNimbus.radiusFeet}-foot aura; you have Advantage on saves forced by Fiends or Undead. Each enemy starting its turn inside takes {summary.holyNimbus.enemyStartTurnDamage} Radiant damage.</p>}
    <label>Target stable ID <input value={target} onChange={e=>setTarget(e.target.value)} maxLength={100}/></label>
    <label>Condition source to end or reroll <input value={source} onChange={e=>setSource(e.target.value)} maxLength={100}/></label>
    <label>Restraint or failed-save condition <select value={mode} onChange={e=>setMode(e.target.value)}>{[...new Set([...freePortBreakConditions,...freePortRerollConditions])].map(id=><option key={id}>{id}</option>)}</select></label>
    <label><input type="checkbox" checked={magical} onChange={e=>setMagical(e.target.checked)}/>Break the Chain source is magical</label>
    <label>Printed restraint or failed-save DC (15 if magical restraint has none) <input type="number" min={1} max={1000} value={dc} onChange={e=>setDC(Number(e.target.value))}/></label>
    <label>Original failed save d20 <input type="number" min={1} max={20} value={originalRoll} onChange={e=>setOriginalRoll(Number(e.target.value))}/></label>
    <label>Original failed save total <input type="number" value={total} onChange={e=>setTotal(Number(e.target.value))}/></label>
    <label>Stable hit, failed-save or target-turn event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    {options.some(o=>o.handler==='sacred')&&<label>Equipped Melee weapon for Sacred Weapon <select value={weapon||meleeWeapons[0]?.instanceId||''} onChange={e=>setWeapon(e.target.value)}><option value="">Choose equipped weapon</option>{meleeWeapons.map(a=><option key={a.instanceId} value={a.instanceId}>{a.name}</option>)}</select></label>}
    <label>Dawn target turn ID <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>
    <label><input type="checkbox" checked={undead} onChange={e=>setUndead(e.target.checked)}/>Target is Undead, or selected charm was caused by an Undead</label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the printed range, sight, willing target, trigger, available Reaction and first weapon hit when required</label>
    {summary.passageAura&&<p>Aura of Passage: {summary.passageAura.radiusFeet} feet; ignore nonmagical Difficult Terrain and gain Advantage to escape Grappled. {summary.passageAura.openHarbor?'Open Harbor: Advantage against Paralyzed/Restrained; Bonus Action Disengage.':''}</p>}
    {summary.clearSightAura&&<p>Aura of Clear Sight: {summary.clearSightAura.radiusFeet} feet; see through nonmagical fog and gain Advantage against Undead Frightened. Magical darkness remains opaque. {summary.clearSightAura.dawnSunlight?'Dawn: sunlight and Necrotic Resistance in the aura.':''}</p>}
    <p>Break the Chain ends only the selected Grappled/Restrained source. No Captive Left rerolls one failed Restrained/Paralyzed save; it never heals. Watch's first weapon hit uses your current open owner turn. Resolve target damage and healing prevention with the GM.</p>
    {options.map(o=><article key={o.id}><h3>{o.name}</h3><p>{o.description}</p><AbilityPreview option={o}/><p>{o.costs.map(c=>`${c.amount} ${c.poolId.split(':').at(-1)} (${state.pools[c.poolId]??0} remaining)`).join('; ')||'No resource cost.'}</p>{o.handler==='vigil-hit'&&hit&&!o.unavailableReason&&<p>Recorded first weapon hit: {hit.eventId} on {hit.targetId}.</p>}<button disabled={!confirmed||o.available===false||Boolean(firstMissingAbilityCost(o.costs,state.pools))} onClick={()=>activate(o)}>Use {o.name}</button></article>)}
  </fieldset></section>;
}
