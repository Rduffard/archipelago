import {useState} from 'react';
import {brassOutriderPassingShot,recklessAttackUnlocked} from '@crossworld/sanguine-engine/callings';
export default function AttackRecords({character,busy,onCommand}){
  const [eventId,setEvent]=useState(''),[targetId,setTarget]=useState(''),[turnId,setTurn]=useState(''),[attribute,setAttribute]=useState('might'),[hit,setHit]=useState(true),[critical,setCritical]=useState(false),[damageType,setDamageType]=useState('bludgeoning'),[reckless,setReckless]=useState(false),[confirmed,setConfirmed]=useState(false);
  const s=character.rulesSummary,state=character.rulesRuntime;
  const [weaponId,setWeaponId]=useState('');
  const weapons=character.equipment?.attacks?.filter(attack=>!attack.requiresTwoHandGrip)??[];
  const selectedWeapon=weapons.find(attack=>attack.instanceId===weaponId);
  return <details><summary>Record attack outcomes</summary><fieldset disabled={busy}>
    <p>Resolve the roll with your GM, then record it once here. These records track Reckless Attack, Studied Attacks, Steady Aim, the end of Hide, and Rage extension. Use the same hit ID when resolving damage riders.</p>
    {s.recklessAttack&&<p>Reckless Attack is active: Might attacks have Advantage, and attacks against you have Advantage until your next turn starts.</p>}
    {s.studiedAttackTargets?.length>0&&<p>Studied Attacks: your next attack against {s.studiedAttackTargets.join(', ')} has Advantage before your next turn ends.</p>}
    <label>Attack event ID <input value={eventId} maxLength={100} onChange={e=>setEvent(e.target.value)}/></label>
    <label>Attack target ID <input value={targetId} maxLength={100} onChange={e=>setTarget(e.target.value)}/></label>
    {!state.ownerTurn?.open&&<label>External attack turn ID <input value={turnId} maxLength={100} onChange={e=>setTurn(e.target.value)}/></label>}<label>Attack attribute <select value={attribute} onChange={e=>setAttribute(e.target.value)}>{['might','agility','resolve','wit','instinct','spirit'].map(a=><option key={a}>{a}</option>)}</select></label>
    <label><input type="checkbox" checked={hit} onChange={e=>setHit(e.target.checked)}/>The attack hit</label>
    {((brassOutriderPassingShot(s.paths.gunslinger,s.callingLevels.gunslinger))||s.paths.warden==='lantern-vigil')&&<label>Weapon used for the first weapon hit <select value={selectedWeapon?.instanceId??''} onChange={e=>setWeaponId(e.target.value)}>
      <option value="">Non-weapon attack</option>{weapons.map(attack=><option key={attack.instanceId} value={attack.instanceId}>{attack.name}</option>)}
    </select></label>}
    {s.paths.reaver==='bloodwake'&&<><label>Frenzy weapon or Unarmed Strike damage type <select value={damageType} onChange={e=>setDamageType(e.target.value)}>{['bludgeoning','piercing','slashing','acid','cold','fire','force','lightning','necrotic','poison','psychic','radiant','thunder'].map(t=><option key={t}>{t}</option>)}</select></label><label><input type="checkbox" checked={critical} onChange={e=>setCritical(e.target.checked)}/>This attack was a Critical Hit</label></>}
    {recklessAttackUnlocked(s.callingLevels.reaver)&&<label><input type="checkbox" checked={reckless} onChange={e=>setReckless(e.target.checked)}/>Choose Reckless Attack on this turn's first attack</label>}
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the roll, target, attribute and outcome</label>
    <button disabled={!confirmed||!eventId.trim()||!targetId.trim()||(!state.ownerTurn?.open&&!turnId.trim())} onClick={()=>onCommand('attack.record',{eventId,targetId,attribute,hit,reckless,confirmed,critical,damageType,...(selectedWeapon?{weaponId:selectedWeapon.instanceId}:{}),...(!state.ownerTurn?.open?{turnId}:{})})}>Record attack</button>
  </fieldset></details>;
}
