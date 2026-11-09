import {useState} from 'react';
export default function FolioControls({character,rules,busy,onCommand}){
  const state=character.rulesRuntime,casting=character.rulesSummary.spellcasting.shipwright;
  const [discovery,setDiscovery]=useState(''),[book,setBook]=useState(''),[remembered,setRemembered]=useState([]),[start,setStart]=useState(()=>new Date(state.worldTime??Date.now()).toISOString().slice(0,16)),[end,setEnd]=useState(''),[confirmed,setConfirmed]=useState(false);
  if(!casting)return null;
  const sources=(state.spellDiscoveries??[]).filter(d=>!casting.folio.includes(d.spellId)&&rules.spells.find(s=>s.id===d.spellId)?.level<=casting.slots.length),selected=sources.find(d=>d.discoveryId+'|'+d.spellId===discovery);
  const memory=[...new Set([...(state.preparations.shipwright??[]),...casting.alwaysPrepared])].filter(id=>state.folioMemory?.includes(id)&&state.folioUnavailable?.includes(id));
  const timing={startedAt:Date.parse(start+'Z'),completedAt:Date.parse(end+'Z'),confirmed};
  return <section className="character-creation__surface" aria-label="Engineering folio"><h2>Engineering folio</h2><p>Available: {casting.folio.map(id=>rules.spells.find(s=>s.id===id)?.name).join(', ')||'None'}.</p>
    <fieldset disabled={busy}>
      <label>GM-recorded discovery <select value={discovery} onChange={e=>setDiscovery(e.target.value)}><option value="">Choose approved source</option>{sources.map(d=><option key={d.discoveryId+'|'+d.spellId} value={d.discoveryId+'|'+d.spellId}>{d.discoveryId}: {rules.spells.find(s=>s.id===d.spellId)?.name}</option>)}</select></label>
      <label>Transcription start (UTC) <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)}/></label>
      <label>Transcription completion (UTC) <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)}/></label>
      <label>Lost or replacement folio ID <input value={book} onChange={e=>setBook(e.target.value)} maxLength={100}/></label>
      <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the source, folio identity and completed transcription time</label>
      <p>Copying costs 50 GP and two hours per spell level. Rebuilding remembered prepared spells costs 10 GP and one hour per spell level. Costs use your saved copper balance; transcription advances the world clock.</p>
      <button disabled={!confirmed||!selected||!end} onClick={()=>onCommand('spells.copy',{spellId:selected.spellId,discoveryId:selected.discoveryId,...timing})}>Copy discovered spell</button>
      <button disabled={!confirmed||!book.trim()||!casting.folio.length} onClick={()=>onCommand('folio.lose',{folioId:book,confirmed})}>Record lost folio</button>
      {!!memory.length&&<><label>Currently prepared memories to rebuild <select multiple size={6} value={remembered} onChange={e=>setRemembered(Array.from(e.target.selectedOptions,o=>o.value))}>{memory.map(id=><option key={id} value={id}>{rules.spells.find(s=>s.id===id)?.name}</option>)}</select></label><button disabled={!confirmed||!book.trim()||!remembered.length||!end} onClick={()=>onCommand('folio.rebuild',{folioId:book,spellIds:remembered,...timing})}>Rebuild selected prepared spells</button></>}
      {!!state.folioUnavailable?.length&&<p>Lost unprepared spells are unavailable until rediscovered. Already prepared spells remain usable; rebuilding never restores forgotten spells automatically.</p>}
    </fieldset>
  </section>;
}
