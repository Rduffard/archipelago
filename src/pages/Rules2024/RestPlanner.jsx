import {useState} from 'react';
export default function RestPlanner({state,draft,busy,onCommand,onDismiss}){
  const [start,setStart]=useState(()=>new Date(state.worldTime??Date.now()).toISOString().slice(0,16));
  const [end,setEnd]=useState(()=>new Date(state.restSession?state.restSession.startedAt+(state.restSession.kind==='long-rest'?8+(state.restSession.interruptions?.length??0):1)*3600000:state.worldTime??Date.now()).toISOString().slice(0,16));
  const [interruption,setInterruption]=useState(start),[reason,setReason]=useState('initiative'),[resume,setResume]=useState(true),[nourished,setNourished]=useState(false);
  if(!draft&&!state.restSession)return null;
  const rest=state.restSession;
  const kind=rest?.kind??draft.type;
  return <section className="character-creation__surface" aria-label="Rest planner"><h2>{kind==='long-rest'?'Long Rest':'Short Rest'}</h2>
    <p>Record the GM's world time. A Short Rest needs one hour; a Long Rest needs eight hours and no benefit within the previous 24 hours. Report interruptions to the GM before completing.</p>
    {state.inCombat&&<p>End the encounter before {rest?'completing':'starting'} the rest.</p>}
    <fieldset disabled={busy}>
      {!rest?<><label>World start time (UTC) <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)}/></label>
        <label><input type="checkbox" checked={nourished} onChange={e=>setNourished(e.target.checked)}/>Appropriate food and water for Exhaustion recovery</label>
        <button disabled={state.inCombat} onClick={()=>{const {type,...options}=draft;onCommand('rest.start',{restId:crypto.randomUUID(),kind:type,startedAt:Date.parse(start+'Z'),options:{...options,nourished}});}}>Start rest with selected recovery/replacements</button>
        <button onClick={onDismiss}>Cancel proposal</button></>:<>
        <p>Started {new Date(rest.startedAt).toISOString()}. Choices are saved with this rest.</p>
        <p>{rest.interruptions?.length??0} interruptions. Each resumed Long Rest interruption adds one hour.</p>
        <label>World completion time (UTC) <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)}/></label>
        <button disabled={state.inCombat} onClick={()=>onCommand('rest.complete',{restId:rest.id,completedAt:Date.parse(end+'Z')})}>Complete rest</button>
        <button onClick={()=>onCommand('rest.cancel',{restId:rest.id})}>Cancel interrupted rest</button>
        <label>Interruption world time (UTC) <input type="datetime-local" value={interruption} onChange={e=>setInterruption(e.target.value)}/></label>
        <label>Interruption <select value={reason} onChange={e=>setReason(e.target.value)}><option value="initiative">Rolling Initiative</option><option value="non-cantrip-spell">Casting a non-cantrip spell</option><option value="damage">Taking damage</option><option value="exertion-hour">One hour of exertion</option></select></label>
        {kind==='long-rest'&&<label><input type="checkbox" checked={resume} onChange={e=>setResume(e.target.checked)}/>Resume immediately, adding one hour</label>}
        <button onClick={()=>onCommand('rest.interrupt',{restId:rest.id,at:Date.parse(interruption+'Z'),reason,resume,confirmed:true})}>Record GM-confirmed interruption</button>
      </>}
    </fieldset>
  </section>;
}
