import {useState} from 'react';
export default function StrikeControls({character,rules,busy,onCommand}){
  const {rulesSummary:s,rulesRuntime:state}=character,kind=s.callingLevels.corsair?'cunning':'brutal',level=s.callingLevels[kind==='cunning'?'corsair':'reaver']??0;
  const [options,setOptions]=useState([]),[target,setTarget]=useState(''),[targetSize,setTargetSize]=useState('medium'),[turnId,setTurnId]=useState(''),[eventId,setEventId]=useState(''),[weaponId,setWeaponId]=useState(''),[confirmed,setConfirmed]=useState(false),[critical,setCritical]=useState(false);
  const [hit,setHit]=useState(true);
  if(level<(kind==='cunning'?1:9))return null;
  const choices=(rules.strikeOptions?.[kind]??[]).filter(o=>level>=o.level&&(!o.path||s.paths.corsair===o.path)),maximum=kind==='cunning'?(level>=11?2:1):(level>=17?2:1),weapons=character.equipment.attacks;
  const weapon=weapons.find(a=>a.instanceId===weaponId)??(kind==='cunning'?weapons[0]:null),cost=choices.filter(o=>options.includes(o.id)).reduce((sum,o)=>sum+(o.cost??0),0);
  const dice=kind==='cunning'?(s.mechanics.corsair.sneakAttackDice-cost):(level>=17?2:1);
  const savedTurn=state.ownerTurn?.open?state.ownerTurn.id:state.inCombat?state.externalCastingTurn:null;
  const needsOwnerTurn=kind==='brutal'||options.includes('stealth-attack');
  const turnReady=needsOwnerTurn?state.ownerTurn?.open:Boolean(savedTurn||!state.inCombat&&turnId.trim());
  return <section className="character-creation__surface" aria-label="Strike choices"><h2>{kind==='cunning'?'Sneak Attack and Cunning Strike':'Brutal Strike'}</h2><fieldset disabled={busy}>
    <p>{kind==='cunning'?'Confirm a Sneak Attack hit with an eligible Finesse or Ranged weapon and no Disadvantage. Choose effects and remove their die costs before rolling.':'On your turn, use Reckless Attack and forgo ALL Advantage on one Might-based attack with no Disadvantage. Confirm the hit before rolling its extra damage.'} Maximum {maximum} distinct option(s).</p>
    <label>Strike weapon <select value={weapon?.instanceId??''} onChange={e=>setWeaponId(e.target.value)}><option value="">{kind==='brutal'?'Unarmed Strike':'Choose an equipped weapon'}</option>{weapons.map(w=><option key={w.instanceId} value={w.instanceId}>{w.name}</option>)}</select></label>
    <label>Strike options <select multiple value={options} onChange={e=>setOptions(Array.from(e.target.selectedOptions,o=>o.value))}>{choices.map(o=><option key={o.id} value={o.id}>{o.id.replaceAll('-',' ')}{o.cost?` (${o.cost}d6)` :''}</option>)}</select></label>
    <p>{cost} Sneak Attack dice forgone. Roll {Math.max(0,dice)*(critical?2:1)}d{kind==='cunning'?6:10} {kind==='cunning'?'Sneak Attack':'extra'} damage; weapon dice are resolved separately.</p>
    <label>Target stable ID <input value={target} onChange={e=>setTarget(e.target.value)} maxLength={100}/></label>
    <label>Target size (Trip) <select value={targetSize} onChange={e=>setTargetSize(e.target.value)}>{['tiny','small','medium','large','huge','gargantuan'].map(id=><option key={id}>{id}</option>)}</select></label>
    {savedTurn?<p>Recorded turn: {savedTurn}.</p>:state.inCombat?<p>Ask the GM to record the current encounter turn.</p>:!needsOwnerTurn&&<label>Turn ID <input value={turnId} onChange={e=>setTurnId(e.target.value)} maxLength={100}/></label>}
    <label>Stable hit event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    <label><input type="checkbox" checked={critical} onChange={e=>setCritical(e.target.checked)}/>Confirmed critical hit (double remaining damage dice)</label>
    {kind==='brutal'&&<label><input type="checkbox" checked={hit} onChange={e=>setHit(e.target.checked)}/>Chosen attack hit. Uncheck to record a miss: the selected attack is still used for this turn, with no extra damage or effects.</label>}
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the hit, strike trigger, range, Advantage/Disadvantage and target facts</label>
    {kind==='brutal'&&<p>Active owner turn: {state.ownerTurn?.open?state.ownerTurn.id:'start your turn first'}.</p>}
    {options.includes('stealth-attack')&&<p>Requires Invisible with condition source exactly “hide”. At your turn end, record Three-Quarters or Total Cover to retain it.</p>}
    <button disabled={!confirmed||!target.trim()||!eventId.trim()||!turnReady||options.length>maximum||dice<0} onClick={()=>onCommand('strike.resolve',{kind,options,targetId:target,targetSize,...(savedTurn?{}:{turnId:turnId.trim()}),eventId,confirmed,critical,disadvantage:false,...(kind==='brutal'?{reckless:true,hit}:{}),...(weapon?{weaponId:weapon.instanceId}:{})})}>Resolve strike dice and effects</button>
  </fieldset></section>;
}
