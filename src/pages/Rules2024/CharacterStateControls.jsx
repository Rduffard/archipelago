import {useState} from 'react';
import CastingTurnControls from './CastingTurnControls';
export default function CharacterStateControls({summary,state,rules,busy,onCommand,permissions}){
  const types=rules?.damageTypes??[],conditions=rules?.conditions??[];
  const [amount,setAmount]=useState(1),[damageType,setDamageType]=useState('slashing'),[attack,setAttack]=useState(true),[critical,setCritical]=useState(false);
  const [source,setSource]=useState(''),[condition,setCondition]=useState('poisoned'),[active,setActive]=useState(true),[exhaustion,setExhaustion]=useState(state.exhaustion??0);
  const [temp,setTemp]=useState(0),[confirmed,setConfirmed]=useState(false);
  const [relentlessTotal,setRelentlessTotal]=useState(10);
  const [unbroken,setUnbroken]=useState(false);
  const [agilitySave,setAgilitySave]=useState('none');
  const [world,setWorld]=useState(()=>new Date(state.worldTime??Date.now()).toISOString().slice(0,16));
  const death=state.deathSaves??{successes:0,failures:0,stable:false,dead:false};
  return <section className="character-creation__surface" aria-label="Health, conditions and time"><h2>Health, conditions and time</h2>
    <p>Health {state.health.current}/{state.health.max}; temporary Health {state.temporaryHealth}. {death.dead?'Dead.':death.stable?'Stable.':''}</p>
    <p>Conditions: {summary.conditions?.join(', ')||'None'}. Exhaustion: {state.exhaustion??0}.</p>
    <fieldset disabled={busy}><legend>GM adjudication</legend>
      <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms recorded damage, condition sources and world or turn timing</label>
      <label>Damage or healing amount <input type="number" min={0} max={1000000} value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label>
      <label>Damage type <select value={damageType} onChange={e=>setDamageType(e.target.value)}>{types.map(id=><option key={id}>{id}</option>)}</select></label>
      <label><input type="checkbox" checked={attack} onChange={e=>setAttack(e.target.checked)}/>Damage from an attack</label>
      <label><input type="checkbox" checked={critical} onChange={e=>setCritical(e.target.checked)}/>Critical Hit</label>
      <p>Enter damage before your character's Resistance and Reef Skin; the server applies those, then temporary Health.</p>
      <label>Agility save for an effect that normally deals half damage on success <select value={agilitySave} onChange={e=>setAgilitySave(e.target.value)}><option value="none">No such save</option><option value="success">Succeeded</option><option value="failure">Failed</option></select></label><p>For that save, enter damage before its save reduction. Evasion applies automatically while available.</p>
      {summary.paths.tidecaller==='sanguine-conduit'&&summary.callingLevels.tidecaller>=18&&<label><input type="checkbox" checked={unbroken} onChange={e=>setUnbroken(e.target.checked)}/>Use Unbroken Current Reaction if this damage would reduce me to zero without killing me outright ({state.pools['sanguine-conduit:unbroken-current']??0} remaining)</label>}
      <button disabled={!confirmed||death.dead} onClick={()=>onCommand('health.damage',{amount,damageType,attack,critical,confirmed,...(unbroken?{unbrokenCurrent:true}:{}),...(agilitySave==='none'?{}:{agilityHalfSave:agilitySave})})}>Take damage</button>
      <button disabled={!confirmed||death.dead} onClick={()=>onCommand('health.apply',{healthDelta:amount})}>Receive healing</button>
      {state.health.current===0&&<><p>Death saves: {death.successes} successes, {death.failures} failures.</p>
        <button disabled={death.stable||death.dead||Boolean(state.pendingRelentlessRage)} onClick={()=>onCommand('death-save.roll',{})}>Roll death saving throw</button></>}
      {state.pendingRelentlessRage&&<><p>Resolve Relentless Rage before falling Unconscious: Resolve DC {state.pendingRelentlessRage.dc}.</p>
        <button onClick={()=>onCommand('relentless-rage.resolve',{})}>Roll Relentless Rage save</button>
        <label>GM-recorded Resolve save total <input type="number" min={-100} max={200} value={relentlessTotal} onChange={e=>setRelentlessTotal(Number(e.target.value))}/></label>
        <button disabled={!confirmed} onClick={()=>onCommand('relentless-rage.resolve',{total:relentlessTotal,confirmed})}>Record Relentless Rage save</button></>}
      {(state.concentrationChecks??[]).map(check=><div key={check.id}><p>Pending Concentration save: DC {check.dc} after {check.damage} damage{summary.concentrationSaveAdvantage?' (advantage)':''}.</p>
        <button onClick={()=>onCommand('concentration.resolve',{checkId:check.id})}>Roll Concentration save</button></div>)}
      <label>Condition or temporary Health source <input value={source} onChange={e=>setSource(e.target.value)} maxLength={100}/></label>
      <label>Condition <select value={condition} onChange={e=>setCondition(e.target.value)}>{conditions.map(id=><option key={id}>{id}</option>)}</select></label>
      <label><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)}/>This condition source is active</label>
      <button disabled={!confirmed||!source.trim()} onClick={()=>onCommand('condition.record',{conditionId:condition,source,active,confirmed})}>Record condition source</button>
      <label>Exhaustion level <input type="number" min={0} max={6} value={exhaustion} onChange={e=>setExhaustion(Number(e.target.value))}/></label>
      <button disabled={!confirmed||!source.trim()} onClick={()=>onCommand('condition.record',{conditionId:'exhaustion',source,level:exhaustion,confirmed})}>Record Exhaustion</button>
      <label>Chosen temporary Health pool <input type="number" min={0} max={10000} value={temp} onChange={e=>setTemp(Number(e.target.value))}/></label>
      <p>Choose one pool, even if smaller; pools never add together. Zero clears the pool.</p>
      <button disabled={!confirmed||!source.trim()} onClick={()=>onCommand('temp-health.choose',{amount:temp,source,confirmed})}>Choose temporary Health</button>
      <label>World time (UTC) <input type="datetime-local" value={world} onChange={e=>setWorld(e.target.value)}/></label>
      <p>Recorded world time: {state.worldTime!==undefined?new Date(state.worldTime).toISOString():'Set the GM calendar to begin explicit time tracking.'}</p>
      <button disabled={!confirmed||!world} onClick={()=>onCommand('time.advance',{worldTime:Date.parse(world+'Z'),confirmed})}>Advance world time and expire effects</button>
      {summary.raging&&summary.callingLevels.reaver<15&&['attack-roll','forced-save','bonus-action'].map(reason=><button key={reason} disabled={!confirmed||!state.ownerTurn?.open} onClick={()=>onCommand('rage.extend',{reason,confirmed})}>Extend Rage: {reason.replaceAll('-',' ')}</button>)}
    </fieldset>
    <CastingTurnControls character={{rulesRuntime:state,permissions}} busy={busy} onCommand={onCommand}/>
  </section>;
}
