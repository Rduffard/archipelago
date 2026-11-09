import {useState} from 'react';
export default function FeatControls({character,rules,busy,onCommand}){
  const {rulesSummary:summary,rulesRuntime:state}=character;
  const [confirmed,setConfirmed]=useState(false),[eventId,setEventId]=useState(''),[turnId,setTurnId]=useState(''),[target,setTarget]=useState('');
  const [selected,setSelected]=useState(''),[sides,setSides]=useState(20),[originalRoll,setOriginalRoll]=useState(1),[combatId,setCombatId]=useState('');
  const [weaponId,setWeaponId]=useState(''),[critical,setCritical]=useState(false),[sign,setSign]=useState('bonus'),[total,setTotal]=useState(10),[amount,setAmount]=useState(1),[distance,setDistance]=useState(30),[trigger,setTrigger]=useState('attack'),[damageType,setDamageType]=useState('slashing'),[kitId,setKitId]=useState('');
  const feats=summary.feats.filter(id=>rules.featOperations?.some(o=>o.featId===id)),feat=feats.includes(selected)?selected:feats[0],weapons=character.equipment?.attacks??[],kits=character.inventory.filter(i=>i.definitionId==='healer-kit');
  const weapon=weapons.find(w=>w.instanceId===weaponId)??weapons[0],kit=kits.find(i=>i.instanceId===kitId)??kits[0];
  const savedTurn=state.ownerTurn?.open?state.ownerTurn.id:state.inCombat?state.externalCastingTurn:null;
  const turnLimited=feat==='savage-attacker'||feat==='grappler';
  const usedThisTurn=Object.values(state.featState??{}).some(record=>record.featId===feat&&record.turns.includes(savedTurn??turnId.trim()));
  const turnReason=feat==='grappler'&&!state.ownerTurn?.open?'Punch and Grab requires your open turn.':
    turnLimited&&state.inCombat&&!savedTurn?'Ask the GM to record the current encounter turn.':
    turnLimited&&usedThisTurn?'This feat was already used this turn.':null;
  function use(){const parameters={};
    if(feat==='savage-attacker')Object.assign(parameters,{weaponId:weapon?.instanceId,critical});
    if(feat==='alert')Object.assign(parameters,{allyTotal:total,consent:confirmed});
    if(feat==='boon-of-fate')Object.assign(parameters,{sign,total});
    if(feat==='boon-of-dimensional-travel')Object.assign(parameters,{distanceFeet:distance,trigger});
    if(feat==='boon-of-irresistible-offense')Object.assign(parameters,{naturalRoll:20,damageType});
    if(feat==='field-responder')parameters.kitId=kit?.instanceId;
    if(feat==='harbor-defender')parameters.incomingDamage=amount;
    onCommand('feat.use',{featId:feat,confirmed,eventId,...(turnLimited&&!savedTurn?{turnId:turnId.trim()}:{}),parameters,targetIds:target.trim()?[target.trim()]:[]});
  }
  return <section className="character-creation__surface" aria-label="Feats and Inspiration"><h2>Feats and Inspiration</h2><fieldset disabled={busy}>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the feat trigger, range, targets and any required ally consent</label>
    <label>Stable roll or action event ID <input value={eventId} onChange={e=>setEventId(e.target.value)} maxLength={100}/></label>
    <p>Heroic Inspiration: {state.inspiration?'available':'none'}. One use maximum; the new roll must be used.</p>
    {character.permissions?.canGM!==false&&<button disabled={!confirmed} onClick={()=>onCommand('inspiration.grant',{confirmed})}>Record GM Inspiration award</button>}
    <label>Die size <select value={sides} onChange={e=>setSides(Number(e.target.value))}>{[4,6,8,10,12,20,100].map(n=><option key={n} value={n}>d{n}</option>)}</select></label>
    <label>Original die result <input type="number" min={1} max={sides} value={originalRoll} onChange={e=>setOriginalRoll(Number(e.target.value))}/></label>
    <button disabled={!state.inspiration||!confirmed||!eventId.trim()} onClick={()=>onCommand('inspiration.spend',{confirmed,eventId,sides,originalRoll})}>Spend Inspiration and reroll</button>
    <label>Combat ID <input value={combatId} onChange={e=>setCombatId(e.target.value)} maxLength={100}/></label>
    <button disabled={!confirmed||!combatId.trim()} onClick={()=>onCommand('initiative.record',{combatId,confirmed})}>Roll and save Initiative</button>
    {state.initiative&&<p>Saved Initiative: {state.initiative.total} ({state.initiative.combatId}). {state.initiative.firstRoundExtraTurnOffset!==undefined?`Reef Knife Reflexes: take a second turn in the first round only at Initiative ${state.initiative.total+state.initiative.firstRoundExtraTurnOffset}.`:''}</p>}
    {state.effects.some(e=>e.endsAfterAction)&&<button disabled={!confirmed} onClick={()=>onCommand('action.record',{action:'action',confirmed})}>Record action and end Merge with Shadows</button>}
    {!!feats.length&&<><label>Triggered feat <select value={feat} onChange={e=>setSelected(e.target.value)}>{feats.map(id=><option key={id} value={id}>{rules.feats.find(f=>f.id===id)?.name}</option>)}</select></label>
      <p>{rules.feats.find(f=>f.id===feat)?.description}</p>
      {turnLimited&&(savedTurn?<p>Recorded turn: {savedTurn}.</p>:!state.inCombat&&feat==='savage-attacker'&&<label>Turn ID (consistent table label) <input value={turnId} onChange={e=>setTurnId(e.target.value)} maxLength={100}/></label>)}
      {turnReason&&<p>{turnReason}</p>}
      <label>One target's stable ID <input value={target} onChange={e=>setTarget(e.target.value)} maxLength={100}/></label>
      {feat==='savage-attacker'&&<><label>Wielded weapon <select value={weapon?.instanceId??''} onChange={e=>setWeaponId(e.target.value)}>{weapons.map(w=><option key={w.instanceId} value={w.instanceId}>{w.name}</option>)}</select></label><label><input type="checkbox" checked={critical} onChange={e=>setCritical(e.target.checked)}/>Confirmed critical hit</label><p>Rolls only the weapon dice twice; use either total. Sneak Attack and spell-rider dice are excluded.</p></>}
      {['alert','boon-of-fate'].includes(feat)&&<label>{feat==='alert'?'Willing ally Initiative total':'Original D20 Test total'} <input type="number" value={total} onChange={e=>setTotal(Number(e.target.value))}/></label>}
      {feat==='boon-of-fate'&&<label>Adjustment <select value={sign} onChange={e=>setSign(e.target.value)}><option value="bonus">Add 2d4</option><option value="penalty">Subtract 2d4</option></select></label>}
      {feat==='boon-of-dimensional-travel'&&<><label>Immediately completed action <select value={trigger} onChange={e=>setTrigger(e.target.value)}><option value="attack">Attack</option><option value="magic">Magic</option></select></label><label>Visible unoccupied teleport distance, feet <input type="number" min={0} max={30} value={distance} onChange={e=>setDistance(Number(e.target.value))}/></label></>}
      {feat==='boon-of-irresistible-offense'&&<label>Natural twenty attack's damage type <select value={damageType} onChange={e=>setDamageType(e.target.value)}>{rules.damageTypes.map(id=><option key={id}>{id}</option>)}</select></label>}
      {feat==='field-responder'&&<label>Healer kit <select value={kit?.instanceId??''} onChange={e=>setKitId(e.target.value)}>{kits.map(i=><option key={i.instanceId} value={i.instanceId}>{i.chargesCurrent} charges ({i.instanceId})</option>)}</select></label>}
      {feat==='harbor-defender'&&<label>Incoming attack damage before Resistance <input type="number" min={1} value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label>}
      <button disabled={!confirmed||!eventId.trim()||Boolean(turnReason)||turnLimited&&!savedTurn&&!turnId.trim()||feat==='savage-attacker'&&(!weapon||weapon.requiresTwoHandGrip)} onClick={use}>Use {rules.feats.find(f=>f.id===feat)?.name}</button>
    </>}
    {Object.entries(state.featState??{}).map(([source,r])=><p key={source}>{r.featId}: {r.spent?'expended until Initiative or a rest':r.events.length+' saved event(s)'}</p>)}
  </fieldset></section>;
}
