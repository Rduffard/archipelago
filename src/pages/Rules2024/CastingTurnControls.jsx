import {useState} from 'react';

export default function CastingTurnControls({character,busy,onCommand}){
  const [turn,setTurn]=useState(''),[confirmed,setConfirmed]=useState(false);
  const [cover,setCover]=useState('none');
  const [scene,setScene]=useState(null);
  const state=character.rulesRuntime;
  if(character.permissions?.canGM===false)return null;
  const light=scene?.light??state.environment?.light??'bright';
  const inCombat=scene?.inCombat??Boolean(state.inCombat);
  return <fieldset disabled={busy}><legend>GM encounter turn</legend>
    <p>Current casting turn: {(state.ownerTurn?.open?state.ownerTurn.id:state.externalCastingTurn)||'None'}.</p>
    <label>Encounter turn ID <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the actual encounter turn</label>
    <button disabled={!confirmed||!turn.trim()||state.ownerTurn?.open} onClick={()=>onCommand('turn.start',{turnId:turn,confirmed})}>Start owner turn</button>
    {state.pendingStealthCover!=null&&<label>Stealth Attack end-of-turn cover <select value={cover} onChange={e=>setCover(e.target.value)}>{['none','half','three-quarters','total'].map(id=><option key={id}>{id}</option>)}</select></label>}
    <button disabled={!confirmed||!state.ownerTurn?.open} onClick={()=>onCommand('turn.end',{turnId:state.ownerTurn.id,confirmed,cover})}>End owner turn</button>
    <button disabled={!confirmed||!turn.trim()||!state.inCombat||state.ownerTurn?.open} onClick={()=>onCommand('turn.external',{turnId:turn,confirmed})}>Record off-turn encounter turn</button>
    <label>Current light <select value={light} onChange={e=>setScene({...scene,light:e.target.value})}><option value="bright">Bright Light</option><option value="dim">Dim Light</option><option value="dark">Darkness</option></select></label>
    <label><input type="checkbox" checked={inCombat} onChange={e=>setScene({...scene,inCombat:e.target.checked})}/>In combat</label>
    <button disabled={!confirmed} onClick={()=>onCommand('scene.record',{light,inCombat,confirmed})}>Save GM scene conditions</button>
  </fieldset>;
}
