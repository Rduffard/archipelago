import {useState} from 'react';
import {leveledCallingSpellEligible} from '@crossworld/sanguine-engine/spells/casting-sources';
export default function CharacterAuthorityControls({character,rules,busy,onCommand}){
  const [reason,setReason]=useState(''),[item,setItem]=useState(''),[quantity,setQuantity]=useState(1),[copper,setCopper]=useState(0);
  const [discoveryId,setDiscoveryId]=useState(''),[spellId,setSpellId]=useState('');
  const [saleItem,setSaleItem]=useState(''),[saleQuantity,setSaleQuantity]=useState(1),[proceeds,setProceeds]=useState(0),[unequip,setUnequip]=useState(false);
  const permissions=character.permissions,level=character.rulesSummary.totalLevel;
  if(!permissions)return null;
  return <section className="character-creation__surface" aria-label="Character permissions"><h2>GM permissions and milestones</h2>
    <p>{character.campaignId?'Campaign character: advancement needs a recorded GM milestone.':'Solo character: you control advancement and act as GM for awards.'}</p>
    {!permissions.canGM&&character.campaignId&&<p>{permissions.canAdvance?'Your next milestone is authorized.':'Your campaign GM must authorize the next milestone before you can advance.'}</p>}
    {(character.rulesRuntime.milestones??[]).map(m=><p key={m.level}>Level {m.level}: {m.reason} — {m.used?'used':'authorized'}.</p>)}
    {permissions.canGM&&<fieldset disabled={busy}><legend>{permissions.role==='campaign-gm'?'Campaign GM':'Solo GM'} actions</legend>
      <label>Milestone or award reason <input value={reason} onChange={e=>setReason(e.target.value)} maxLength={500}/></label>
      {character.campaignId&&level<maximumCharacterLevel&&<button disabled={!reason.trim()||(character.rulesRuntime.milestones??[]).some(m=>m.level===level+1)} onClick={()=>onCommand('milestone.authorize',{level:level+1,reason})}>Authorize level {level+1} milestone</button>}
      <label>Catalog item to award <select value={item} onChange={e=>setItem(e.target.value)}><option value="">Coin only</option>{rules.equipment.items.filter(d=>d.purchaseScrollLevel===undefined).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
      {item==='spell-scroll'&&<label>Awarded scroll spell identity <select value={spellId} onChange={e=>setSpellId(e.target.value)}><option value="">Choose exact spell</option>{rules.spells.map(s=><option key={s.id} value={s.id}>{s.name} (level {s.level})</option>)}</select></label>}
      <label>Award quantity <input type="number" min={1} max={100000} value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label>
      <label>Copper to award <input type="number" min={0} max={1000000000} value={copper} onChange={e=>setCopper(Number(e.target.value))}/></label>
      <button disabled={!reason.trim()||!item&&!copper||item==='spell-scroll'&&!spellId} onClick={()=>onCommand('equipment.award',{reason,goldCp:copper,...(item?{definitionId:item,quantity,...(item==='spell-scroll'?{spellId}:{})}:{})})}>Record GM award</button>
      <label>Owned item to sell <select value={saleItem} onChange={e=>setSaleItem(e.target.value)}><option value="">Choose owned item</option>{character.inventory.map(i=><option key={i.instanceId} value={i.instanceId}>{i.customName||rules.equipment.items.find(d=>d.id===i.definitionId)?.name} ({i.quantity})</option>)}</select></label>
      <label>Sale quantity <input type="number" min={1} value={saleQuantity} onChange={e=>setSaleQuantity(Number(e.target.value))}/></label><label>Total GM-approved sale proceeds, copper <input type="number" min={0} value={proceeds} onChange={e=>setProceeds(Number(e.target.value))}/></label>
      <label><input type="checkbox" checked={unequip} onChange={e=>setUnequip(e.target.checked)}/>Unequip the selected item as part of its sale</label>
      <button disabled={!reason.trim()||!saleItem} onClick={()=>onCommand('equipment.sell',{instanceId:saleItem,quantity:saleQuantity,proceedsCp:proceeds,reason,unequip})}>Record GM-approved sale</button>
      {character.rulesSummary.spellcasting.shipwright&&<><label>Discovered source ID <input value={discoveryId} onChange={e=>setDiscoveryId(e.target.value)} maxLength={100}/></label><label>Discovered Shipwright spell <select value={spellId} onChange={e=>setSpellId(e.target.value)}><option value="">Choose spell</option>{rules.spells.filter(s=>leveledCallingSpellEligible(s,'shipwright')).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><button disabled={!reason.trim()||!discoveryId.trim()||!spellId} onClick={()=>onCommand('spells.discover',{discoveryId,spellId,reason})}>Record spell discovery</button></>}
    </fieldset>}
  </section>;
}
import {maximumCharacterLevel} from '@crossworld/sanguine-engine/progression';
