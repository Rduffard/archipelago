import {useState} from 'react';

export default function PersistentEquipment({character,rules,busy,onCommand}){
  const [definitionId,setDefinitionId]=useState(rules.equipment.items[0].id);
  const [quantity,setQuantity]=useState(1),[mergeTarget,setMergeTarget]=useState('');
  const [presetName,setPresetName]=useState(''),[scrollSpell,setScrollSpell]=useState('');
  const [weaponId,setWeaponId]=useState(''),[ammunitionId,setAmmunitionId]=useState(''),[actionId,setActionId]=useState(''),[actionType,setActionType]=useState('attack');
  const {inventory,loadout,equipment}=character;
  const definition=id=>rules.equipment.items.find(d=>d.id===id);
  const label=item=>item.customName||definition(item.definitionId)?.name;
  const equipped=id=>['armor','mainHand','offHand'].some(s=>loadout[s]===id);
  const purchase=definition(definitionId);
  const ranged=equipment.attacks.filter(a=>a.weapon.ammunitionType),weapon=ranged.find(a=>a.instanceId===weaponId)??ranged[0];
  const ammunition=inventory.filter(i=>i.definitionId&&definition(i.definitionId)?.kind!=='weapon'&&definition(i.definitionId)?.ammunitionType===weapon?.weapon.ammunitionType);
  const ammo=ammunition.find(i=>i.instanceId===ammunitionId)??ammunition[0];
  function equip(slot,value){onCommand('equipment.equip',{loadout:{...loadout,[slot]:value||null}});}
  return <details><summary>Equipment and Guard {equipment.guard}</summary>
    <p>Available coin: {character.goldCp} cp. Purchases use catalog prices. Awards and sale prices require GM authorization.</p>
    {equipment.carrying&&<p>Known carried weight: {Number(equipment.carrying.knownWeightLb.toFixed(2))} lb; capacity {equipment.carrying.capacityLb} lb; push, drag or lift {equipment.carrying.pushDragLiftLb} lb. {equipment.carrying.unknownWeightInstances.length?`${equipment.carrying.unknownWeightInstances.length} item(s) need GM weight adjudication.`:''}</p>}
    <fieldset disabled={busy}>
      {['mainHand','offHand','armor'].map(slot=><label key={slot}>{slot==='armor'?'Armor':slot==='mainHand'?'Main hand':'Off hand'}
        <select value={loadout[slot]||''} onChange={e=>equip(slot,e.target.value)}><option value="">None</option>
          {inventory.filter(item=>{const d=definition(item.definitionId);return d&&(slot==='armor'?d.kind==='armor':['weapon','shield'].includes(d.kind)||d.profile?.held);})
            .map(item=><option key={item.instanceId} value={item.instanceId}>{label(item)}</option>)}
        </select></label>)}
      <label>Grip <select value={loadout.grip} onChange={e=>onCommand('equipment.equip',{loadout:{...loadout,grip:e.target.value}})}><option value="one">One hand</option><option value="two">Two hands</option></select></label>
      <label>Quantity to buy, consume or split <input type="number" min={1} max={100000} value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label>
      <ul>{inventory.map(item=>{const d=definition(item.definitionId),stackable=!d||d.stackable;
        return <li key={item.instanceId}>{label(item)} x {item.quantity}{item.chargesCurrent!==undefined?' — '+item.chargesCurrent+' charges':''}
          {d?.description&&<details><summary>Item rules</summary><p>{d.description}</p></details>}
          {!equipped(item.instanceId)&&(item.chargesCurrent!==undefined||!d||d.consumable||d.ammunitionType)&&<button onClick={()=>onCommand('equipment.consume',{instanceId:item.instanceId,quantity})}>Use {label(item)}</button>}
          {stackable&&!equipped(item.instanceId)&&item.quantity>1&&<button disabled={quantity>=item.quantity} onClick={()=>onCommand('equipment.split',{instanceId:item.instanceId,quantity})}>Split {label(item)}</button>}
          {stackable&&!equipped(item.instanceId)&&<button disabled={!mergeTarget||mergeTarget===item.instanceId} onClick={()=>onCommand('equipment.merge',{from:item.instanceId,to:mergeTarget})}>Merge into selected stack</button>}
        </li>;})}</ul>
      <label>Merge destination <select value={mergeTarget} onChange={e=>setMergeTarget(e.target.value)}><option value="">Choose a stack</option>{inventory.filter(i=>!equipped(i.instanceId)&&(!i.definitionId||definition(i.definitionId)?.stackable)).map(i=><option key={i.instanceId} value={i.instanceId}>{label(i)} ({i.quantity})</option>)}</select></label>
      <label>Item to purchase <select value={definitionId} onChange={e=>setDefinitionId(e.target.value)}>{rules.equipment.items.filter(item=>Number.isSafeInteger(item.costCp)).map(item=><option key={item.id} value={item.id}>{item.name} - {item.costCp} cp{item.units?' per '+item.units:''}</option>)}</select></label>
      <button disabled={!Number.isSafeInteger(quantity)||quantity<1||purchase.costCp*quantity>character.goldCp} onClick={()=>onCommand('equipment.buy',{definitionId,quantity,...(purchase.purchaseScrollLevel!==undefined?{spellId:scrollSpell}:{})})}>Buy item</button>
      {purchase.purchaseScrollLevel!==undefined&&<label>Purchased scroll spell <select value={scrollSpell} onChange={e=>setScrollSpell(e.target.value)}><option value="">Choose exact spell</option>{rules.spells.filter(s=>s.level===purchase.purchaseScrollLevel).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}
      {purchase.description&&<p>{purchase.description}</p>}
      {purchase.contents&&<p>Pack purchases unpack automatically: {purchase.contents.map(c=>`${c.quantity} ${definition(c.definitionId)?.name}`).join(', ')}.</p>}
      <label>Loadout preset name <input value={presetName} maxLength={80} onChange={e=>setPresetName(e.target.value)}/></label>
      <button disabled={!presetName.trim()} onClick={()=>onCommand('equipment.preset.save',{id:crypto.randomUUID(),name:presetName,loadout})}>Save current loadout</button>
      {(character.presets??[]).map(p=><button key={p.id} onClick={()=>onCommand('equipment.preset.apply',{id:p.id})}>Apply {p.name}</button>)}
      {weapon&&<fieldset><legend>Ammunition expenditure</legend>
        <p>Record shots after declaring attacks with the GM. This spends ammunition and enforces Loading; it does not resolve attacks.</p>
        <label>Ammunition weapon <select value={weapon.instanceId} onChange={e=>setWeaponId(e.target.value)}>{ranged.map(a=><option key={a.instanceId} value={a.instanceId}>{a.name}</option>)}</select></label>
        <label>Matching ammunition <select value={ammo?.instanceId??''} onChange={e=>setAmmunitionId(e.target.value)}><option value="" disabled>No ammunition</option>{ammunition.map(i=><option key={i.instanceId} value={i.instanceId}>{label(i)} ({i.quantity} rounds)</option>)}</select></label>
        <label>Action ID (reuse for all shots in this action) <input value={actionId} onChange={e=>setActionId(e.target.value)} maxLength={100}/></label>
        <label>Action type <select value={actionType} onChange={e=>setActionType(e.target.value)}><option value="attack">Attack Action</option><option value="bonus">Bonus Action attack</option><option value="reaction">Reaction attack</option></select></label>
        <button disabled={!ammo||!actionId.trim()} onClick={()=>onCommand('equipment.fire',{weaponId:weapon.instanceId,ammunitionId:ammo.instanceId,shots:quantity,actionId,actionType})}>Spend ammunition for {quantity} shot{quantity===1?'':'s'}</button>
      </fieldset>}
    </fieldset>
    {equipment.restrictions.untrainedArmor&&<p role="status">Armor lacks Training: physical checks have disadvantage and spellcasting is blocked.</p>}
    {equipment.restrictions.untrainedShield&&<p role="status">Shield lacks Training and grants no Guard bonus.</p>}
    <p>Weapon mastery: {character.rulesSummary.weaponMastery.join(', ')||'None'}.</p>
    <ul>{equipment.attacks.map(attack=><li key={attack.instanceId}>{attack.name}: attack modifier {attack.attackModifier>=0?'+':''}{attack.attackModifier}{attack.heavyDisadvantage?'; Heavy: disadvantage (attribute below 13)':''}{attack.requiresTwoHandGrip?'; requires two hands to attack':''}{attack.damageTypeOptions?.length>1?'; Sacred Weapon: choose normal or Radiant damage on each hit':''}</li>)}</ul>
  </details>;
}

