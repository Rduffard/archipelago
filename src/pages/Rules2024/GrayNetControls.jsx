import {useState} from 'react';
export default function GrayNetControls({character,rules,busy,onCommand}){
  const [targetId,setTarget]=useState(''),[originalTargetId,setOriginal]=useState(''),[eventId,setEvent]=useState(''),[turnId,setTurn]=useState(''),[weaponId,setWeapon]=useState(''),[critical,setCritical]=useState(false),[confirmed,setConfirmed]=useState(false);
  const s=character.rulesSummary;if(s.paths.navigator!=='gray-net')return null;
  const choice=s.pathSelections.navigator,weapons=character.equipment.attacks;
  return <details><summary>Gray Net prey and defense</summary><fieldset disabled={busy}>
    <p>Prey: {choice.hunterPrey}. Defense: {choice.defensiveTactics??'not yet acquired'}. Replace these choices during a Short or Long Rest.</p>
    {!!s.huntersLoreTargets?.length&&<p>Gray Net Lore: ask the GM for Immunities, Resistances and Vulnerabilities of {s.huntersLoreTargets.join(', ')}, the current marked target.</p>}
    <label>Prey target or incoming attacker ID <input value={targetId} onChange={e=>setTarget(e.target.value)} maxLength={100}/></label>
    <label>Original Horde Breaker target ID <input value={originalTargetId} onChange={e=>setOriginal(e.target.value)} maxLength={100}/></label>
    <label>Prey event ID <input value={eventId} onChange={e=>setEvent(e.target.value)} maxLength={100}/></label><label>Prey or enemy turn ID <input value={turnId} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>
    <label>Prey equipped weapon <select value={weaponId} onChange={e=>setWeapon(e.target.value)}><option value="">Choose weapon</option>{weapons.map(a=><option key={a.instanceId} value={a.instanceId}>{rules.equipment.items.find(d=>d.id===a.weapon.id)?.name??a.weapon.name}</option>)}</select></label>
    <label><input type="checkbox" checked={critical} onChange={e=>setCritical(e.target.checked)}/>The Colossus Slayer hit was critical</label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms missing Health for Colossus Slayer; for Horde Breaker, same weapon, different target within five feet of the original and weapon range, not attacked this turn; for defense, an incoming attack hit</label>
    {[choice.hunterPrey,...(choice.defensiveTactics==='multiattack-defense'?['multiattack-defense']:[])].map(mode=><button key={mode} disabled={!confirmed||!eventId.trim()||!targetId.trim()||!turnId.trim()} onClick={()=>onCommand('navigator.prey',{mode,eventId,targetId,originalTargetId,turnId,weaponId,critical,missingHealth:true,confirmed})}>Record {mode}</button>)}
    {s.opportunityAttacksAgainstHaveDisadvantage&&<p>Escape the Horde: Opportunity Attacks against you have Disadvantage.</p>}
    {s.multiattackDefenseSources?.map(e=><p key={e.turnId+e.targetId}>{e.targetId}'s subsequent attacks against you have Disadvantage through turn {e.turnId}.</p>)}
  </fieldset></details>;
}
