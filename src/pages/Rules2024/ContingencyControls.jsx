import {useState} from 'react';

export function PendingContingency({character,rules,busy,onCommand}){
  const [confirmedId,setConfirmedId]=useState(null);
  const pending=character.rulesRuntime.effects.find(e=>e.contingency);
  if(!pending)return null;
  const confirmed=confirmedId===pending.id;
  const spell=rules.spells.find(s=>s.id===pending.contingency.spellId);
  return <fieldset key={pending.id} disabled={busy}><legend>Pending Contingency</legend>
    <p>{spell?.name} activates on you when this trigger first occurs: {pending.contingency.trigger}.</p>
    {character.permissions?.canGM!==false&&<>
      <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmedId(e.target.checked?pending.id:null)}/>GM confirms the trigger just occurred for the first time</label>
      <button disabled={!confirmed} onClick={()=>{setConfirmedId(null);onCommand('contingency.trigger',{effectId:pending.id,confirmed});}}>Resolve Contingency trigger</button>
    </>}
    {character.permissions?.isOwner!==false&&<button onClick={()=>onCommand('effect.end',{effectId:pending.id})}>Cancel Contingency</button>}
  </fieldset>;
}

export default function ContingencyControls({choices,value,onChange,rules,inventory,slots,primarySlot}){
  const selected=choices.find(o=>o.key===value?.key),spell=rules.spells.find(s=>s.id===selected?.spellId);
  const update=fields=>onChange({...value,...fields});
  return <fieldset><legend>Contingent spell and trigger</legend>
    <p>Both slots are spent now. The second spell takes effect only on you after the trigger. Keep the statuette on your person. Casting Contingency again replaces the pending spell.</p>
    <label>Contingent spell <select value={value?.key??''} onChange={e=>update({key:e.target.value,slotLevel:0,materialIds:[],focusId:'',confirmed:false})}>
      <option value="">Choose a spell that can target you</option>
      {choices.map(o=><option key={o.key} value={o.key}>{rules.spells.find(s=>s.id===o.spellId)?.name} ({o.feat?'Magic Initiate':o.callingId})</option>)}
    </select></label>
    {spell&&<>
      <label>Contingent spell slot <select value={value.slotLevel||''} onChange={e=>update({slotLevel:Number(e.target.value)})}>
        <option value="">Choose a second slot</option>
        {slots.slice(0,5).map((count,i)=><option key={i} value={i+1} disabled={i+1<spell.level||count<=Number(i+1===primarySlot)}>Level {i+1}</option>)}
      </select></label>
      {(rules.spellMaterials?.[spell.id]??[]).map(r=><p key={r.kind}>Required: {r.count} {r.kind.replaceAll('-',' ')} worth at least {r.minValueCp} cp each.</p>)}
      {!!rules.spellMaterials?.[spell.id]?.length&&<label>Contingent spell priced materials <select multiple value={value.materialIds} onChange={e=>update({materialIds:Array.from(e.target.selectedOptions,o=>o.value)})}>
        {inventory.map(item=><option key={item.instanceId} value={item.instanceId}>{item.customName||rules.equipment.items.find(d=>d.id===item.definitionId)?.name}</option>)}
      </select></label>}
      <label>Contingent spell focus or pouch <select value={value.focusId} onChange={e=>update({focusId:e.target.value})}>
        <option value="">Automatically choose an eligible focus</option>
        {inventory.filter(i=>rules.equipment.items.find(d=>d.id===i.definitionId)?.focus).map(i=><option key={i.instanceId} value={i.instanceId}>{i.customName||rules.equipment.items.find(d=>d.id===i.definitionId)?.name}</option>)}
      </select></label>
    </>}
    <label>Trigger description <input value={value?.trigger??''} onChange={e=>update({trigger:e.target.value,confirmed:false})} maxLength={500}/></label>
    <label><input type="checkbox" checked={Boolean(value?.confirmed)} onChange={e=>update({confirmed:e.target.checked})}/>GM confirms the ten-minute casting, that the contingent spell can target me, and the trigger</label>
  </fieldset>;
}
