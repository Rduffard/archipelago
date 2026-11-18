import {firstMissingAbilityCost,actionSurgeAdditionalActions} from '@crossworld/sanguine-engine/callings';
import { displayName } from '../../game/creator/choiceLabels';
import {useState} from 'react';
import {breakwaterBarrier,searUndeadUnlocked,preserveLife,restoringTouchConditions,restoringTouchCostPerCondition,silentKeelVehicleLengthLimit} from '@crossworld/sanguine-engine/callings';
import RelayControls from './RelayControls';
import ChargeControls from './ChargeControls';
import CorsairPathControls from './CorsairPathControls';
import EnvoyControls from './EnvoyControls';
import ConduitControls from './ConduitControls';
import AbilityPreview from './AbilityPreview';
export default function AbilityActions({summary,state,busy,onCommand}){
  const [targets,setTargets]=useState('');const [note,setNote]=useState('');
  const [amount,setAmount]=useState(1);const [rest,setRest]=useState('');
  const [confirmed,setConfirmed]=useState(false);const [seconds,setSeconds]=useState(0);
  const [objectId,setObjectId]=useState(''),[mode,setMode]=useState('creatures'),[turn,setTurn]=useState('');
  const [objectMissingHealth,setObjectMissingHealth]=useState(''),[vehicleLengthFeet,setVehicleLengthFeet]=useState('');
  const [salvageMinutes,setSalvageMinutes]=useState('');
  const [passers,setPassers]=useState(''),[width,setWidth]=useState(10),[height,setHeight]=useState(5),[bend,setBend]=useState(false);
  const [credit,setCredit]=useState(1),[project,setProject]=useState(''),[projectKind,setProjectKind]=useState('repair');
  const [checkId,setCheckId]=useState(''),[checkTotal,setCheckTotal]=useState(0),[checkDC,setCheckDC]=useState(10),[extraAction,setExtraAction]=useState('attack');
  const [saveAttribute,setSaveAttribute]=useState('resolve'),[originalRoll,setOriginalRoll]=useState(1),[damageType,setDamageType]=useState('radiant'),[sear,setSear]=useState(true);
  const [touchConditions,setTouchConditions]=useState([]),[allocations,setAllocations]=useState({});
  const options=summary.abilityOptions??[];
  const actionGroups = new Map();
  for (const option of options) {
    if (option.handler.startsWith('relay-')) continue;
    const timing = displayName(option.action) || 'Other abilities';
    if (!actionGroups.has(timing)) actionGroups.set(timing, []);
    actionGroups.get(timing).push(option);
  }
  const maximumPreserveLifeHealing=preserveLife(summary.callingLevels.doctor).maximumHealing;
  const needsAmount=options.some(o=>['lay-heal','preserve-life','burden','uncanny-dodge'].includes(o.handler));
  const needsTriage=options.some(o=>['triage','triage-antidote'].includes(o.handler));
  const needsRevival=options.some(o=>o.handler==='impossible-operation');
  const evidenceHandlers=['presence','warden-touch','preserve-life','burden','uncanny-dodge','indomitable','stroke-luck','spark-damage','turn-undead','abjure','salvage','ghost-repair','ghost-sabotage','silent-keel','unseen-consequence','barrier','barrier-hour','barrier-reduce','tactical-mind','action-surge','keeper-stabilize','keeper-heal','keeper-dawn','clean-bill','plague-antidote','plague-quarantine','triage','triage-antidote'];
  const needsConfirmation=needsRevival||options.some(o=>evidenceHandlers.includes(o.handler));
  const hasBarrier=options.some(o=>['barrier','barrier-hour'].includes(o.handler));
  const barrier=hasBarrier?breakwaterBarrier(summary.totalLevel,summary.trainingBonus,summary.pathSelections.shipwright?.fortification,summary.attributeModifiers.wit):null;
  const searUnlocked=searUndeadUnlocked(summary.totalLevel);
  const hasGhost=summary.paths.shipwright==='drydock-ghost';
  function activate(option){
    if(option.handler==='warden-touch'){onCommand('ability.activate',{optionId:option.id,targetIds:targets.split(',').map(s=>s.trim()).filter(Boolean),parameters:{confirmed,conditions:touchConditions}});return;}
    if(option.handler==='preserve-life'){const targetIds=targets.split(',').map(s=>s.trim()).filter(Boolean);onCommand('ability.activate',{optionId:option.id,targetIds,parameters:{confirmed,allocations:targetIds.map(targetId=>({targetId,amount:allocations[targetId]??0}))}});return;}
    const parameters={};
    if(option.handler==='lay-heal'||option.handler==='preserve-life')parameters.amount=amount;
    if(option.handler==='triage'||option.handler==='triage-antidote')parameters.targetRestEpoch=rest;
    if(evidenceHandlers.includes(option.handler))parameters.confirmed=confirmed;
    if(['salvage','ghost-repair','ghost-sabotage'].includes(option.handler))parameters.objectId=objectId;
    if(option.handler==='salvage')parameters.salvageMinutes=Number(salvageMinutes);
    if(option.handler==='ghost-repair')parameters.objectMissingHealth=Number(objectMissingHealth);
    if(option.handler==='silent-keel'){
      parameters.mode=mode;
      if(mode==='vehicle')parameters.vehicleLengthFeet=Number(vehicleLengthFeet);
    }
    if(option.handler==='tactical-mind')Object.assign(parameters,{eventId:checkId,checkTotal,dc:checkDC});
    if(['indomitable','stroke-luck'].includes(option.handler))Object.assign(parameters,{eventId:checkId,checkTotal,dc:checkDC,saveAttribute,originalRoll});
    if(['burden','uncanny-dodge'].includes(option.handler))parameters.incomingDamage=amount;
    if(option.handler==='spark-damage')parameters.damageType=damageType;
    if(option.handler==='turn-undead')parameters.sear=searUnlocked&&sear;
    if(option.handler==='action-surge')parameters.extraAction=extraAction;
    if(['barrier','barrier-hour'].includes(option.handler))Object.assign(parameters,{passers:passers.split(',').map(s=>s.trim()).filter(Boolean),widthFeet:width,heightFeet:height,bend});
    if(option.handler==='impossible-operation')Object.assign(parameters,{bodyIntact:confirmed,consent:confirmed,deathSeconds:seconds});
    if(option.handler==='path-action'&&option.featureId==='path:iron-covenant:take-the-burden:15')parameters.incomingDamage=amount;
    const manualTurn=option.handler==='unseen-consequence'||option.handler==='action-surge'&&!state.ownerTurn?.open;
    onCommand('ability.activate',{optionId:option.id,targetIds:targets.split(',').map(s=>s.trim()).filter(Boolean),note,parameters,...(manualTurn?{turnId:turn.trim()}:{})});
  }
  return <section className="character-creation__surface" aria-label="Ability management"><h2>Abilities</h2>
    <p>Declare targets and resolve positioning, saves and world effects with the GM. Resource costs and your character's state are saved by these controls.</p>
    <fieldset disabled={busy}><legend>Ability controls</legend>
      {actionGroups.size > 0 && <details className="sa-ability-setup"><summary>Set targets and table rulings</summary>
      <label>Target names or stable table IDs, separated by commas <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={500}/></label>
      <label>Effect note <input value={note} onChange={e=>setNote(e.target.value)} maxLength={500}/></label>
      {options.some(o=>o.handler==='warden-touch')&&<fieldset><legend>Restoring Touch conditions, {restoringTouchCostPerCondition} Lay On Hands each</legend>{restoringTouchConditions.map(id=><label key={id}><input type="checkbox" checked={touchConditions.includes(id)} onChange={e=>setTouchConditions(e.target.checked?[...touchConditions,id]:touchConditions.filter(v=>v!==id))}/>{id}</label>)}</fieldset>}
      {options.some(o=>o.handler==='preserve-life')&&<fieldset><legend>Preserve Life allocation, at most {maximumPreserveLifeHealing} Health</legend><p>Choose Bloodied creatures in range; each can regain Health only up to half its maximum.</p>{targets.split(',').map(s=>s.trim()).filter(Boolean).map(id=><label key={id}>Healing for {id}<input type="number" min={1} max={maximumPreserveLifeHealing} value={allocations[id]??0} onChange={e=>setAllocations({...allocations,[id]:Number(e.target.value)})}/></label>)}</fieldset>}
      {needsAmount&&<label>Healing allocation or incoming damage <input type="number" min={0} value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label>}
      {needsTriage&&<label>Target's last completed rest (consistent table label) <input value={rest} onChange={e=>setRest(e.target.value)} maxLength={100}/></label>}
      {needsConfirmation&&<label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>GM confirms the option's stated conditions{needsTriage?', including sight and touch within 5 feet for Triage':''}</label>}
      {options.some(o=>['tactical-mind','indomitable','stroke-luck'].includes(o.handler))&&<><label>Failed ability check ID <input value={checkId} onChange={e=>setCheckId(e.target.value)} maxLength={100}/></label>
        <label>Original failed check total <input type="number" min={-100} max={1000} value={checkTotal} onChange={e=>setCheckTotal(Number(e.target.value))}/></label>
        <label>GM-confirmed check DC <input type="number" min={1} max={1000} value={checkDC} onChange={e=>setCheckDC(Number(e.target.value))}/></label>
        <p>Tactical Mind adds a server-rolled d10; a continued failure refunds the Second Wind use.</p></>}
      {options.some(o=>o.handler==='indomitable')&&<label>Failed saving throw attribute <select value={saveAttribute} onChange={e=>setSaveAttribute(e.target.value)}>{['might','agility','resolve','wit','instinct','spirit'].map(id=><option key={id}>{id}</option>)}</select></label>}
      {options.some(o=>o.handler==='stroke-luck')&&<label>Original failed d20 <input type="number" min={1} max={20} value={originalRoll} onChange={e=>setOriginalRoll(Number(e.target.value))}/></label>}
      {options.some(o=>o.handler==='spark-damage')&&<label>Divine Spark damage type <select value={damageType} onChange={e=>setDamageType(e.target.value)}><option value="radiant">Radiant</option><option value="necrotic">Necrotic</option></select></label>}
      {options.some(o=>o.handler==='turn-undead')&&searUnlocked&&<label><input type="checkbox" checked={sear} onChange={e=>setSear(e.target.checked)}/>Sear Undead: roll Radiant damage against failed saves without ending Turn Undead</label>}
      {options.some(o=>o.handler==='action-surge')&&<>{state.ownerTurn?.open?<p>Action Surge uses your recorded turn: {state.ownerTurn.id}.</p>:!state.inCombat&&<label>Action Surge turn ID <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>}
        <label>Additional action <select value={extraAction} onChange={e=>setExtraAction(e.target.value)}>{actionSurgeAdditionalActions.map(id=><option key={id} value={id}>{id}</option>)}</select></label>
        <p>Confirm this is your turn. Action Surge grants one additional non-Magic action, at most once per turn.</p></>}
      {hasGhost&&<><label>Stable object or wreck ID <input value={objectId} onChange={e=>setObjectId(e.target.value)} maxLength={100}/></label>
        {options.some(o=>o.handler==='salvage')&&<label>Completed minutes salvaging the wreck <input type="number" min={10} step={1} value={salvageMinutes} onChange={e=>setSalvageMinutes(e.target.value)}/></label>}
        <label>Object's missing Health for Ghost Patch <input type="number" min={1} value={objectMissingHealth} onChange={e=>setObjectMissingHealth(e.target.value)}/></label>
        {options.some(o=>o.handler==='silent-keel')&&<>
          <label>Silent Keel target kind <select value={mode} onChange={e=>setMode(e.target.value)}><option value="creatures">Up to six willing creatures</option><option value="vehicle">One vehicle</option></select></label>
          {mode==='vehicle'?<label>Vehicle length in feet (up to {silentKeelVehicleLengthLimit}) <input type="number" min={0.1} max={silentKeelVehicleLengthLimit} step="any" value={vehicleLengthFeet} onChange={e=>setVehicleLengthFeet(e.target.value)}/></label>:<p>Enter <code>self</code> among the creature targets to shroud your character.</p>}
        </>}
        {options.some(option=>option.handler==='unseen-consequence')&&<label>Turn ID for ending inside a structure <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>}</>}
      {hasBarrier&&<><label>Barrier width, feet <input type="number" min={1} max={barrier.width} value={width} onChange={e=>setWidth(Number(e.target.value))}/></label>
        <label>Barrier height, feet <input type="number" min={1} max={barrier.height} value={height} onChange={e=>setHeight(Number(e.target.value))}/></label>
        {barrier.maximumPassers>0&&<><label>Permitted passers, stable IDs separated by commas <input value={passers} onChange={e=>setPassers(e.target.value)} maxLength={500}/></label>
          <label><input type="checkbox" checked={bend} onChange={e=>setBend(e.target.checked)}/>One right-angle bend</label></>}</>}
      {needsRevival&&<label>Seconds since death, if reviving <input type="number" min={0} max={60} value={seconds} onChange={e=>setSeconds(Number(e.target.value))}/></label>}
      </details>}
      {Array.from(actionGroups, ([timing, group]) => <section className="sa-action-group" key={timing}>
        <h3>{timing}</h3>
        {group.map(option=>{
        const insufficient=Boolean(firstMissingAbilityCost(option.costs,state.pools));
        const unavailable=insufficient||option.available===false;
        const unavailableReason=insufficient?'Insufficient resources':option.unavailableReason;
        const costLabel = option.costs.map(c => c.amount + ' ' + displayName(c.poolId.split(':').at(-1))).join(', ');
        return <details key={option.id}><summary>{option.name}{costLabel && <small> · {costLabel}</small>}
          {unavailable && <small> · {unavailableReason || 'Unavailable'}</small>}</summary><p>{option.description}</p>
          {option.completionRules&&<p>{option.completionRules}</p>}
          {!['measured-charge','grand-battery'].includes(option.handler)&&<AbilityPreview option={option}/>}
          <p>{option.costs.length?option.costs.map(c=>`${c.amount} ${displayName(c.poolId.split(':').at(-1))} (${state.pools[c.poolId]??0} remaining)`).join('; '):'No resource cost.'}</p>
          {!['measured-charge','grand-battery','squall','broker-credit','sacred','nimbus','nimbus-pulse'].includes(option.handler)&&!/^(rider-|corsair-|gray-defense|broker-resist|suppressor-|outrider-|echo-|tempest-|starwake-|mangrove-|stormhide-|chainbreaker-|colossus-|reaver-path-hit|bloodwake-retaliation)/.test(option.handler)&&!option.handler.startsWith('freeport-')&&!option.handler.startsWith('vigil-')&&!option.handler.startsWith('covenant-')&&!option.handler.startsWith('conduit-')&&!option.handler.startsWith('envoy-')&&!option.handler.startsWith('lantern-')&&!option.handler.startsWith('duelist-')&&<button disabled={unavailable} onClick={()=>activate(option)}>{unavailableReason||'Use '+option.name}</button>}
        </details>;
        })}
      </section>)}
      <h3>Recorded effects</h3>{!state.effects?.length && <p>No active effects.</p>}{(state.effects??[]).map(effect=><article key={effect.id}><h4>{effect.name}</h4><p>{effect.note}</p>
        {effect.health&&<p>Object Health {effect.health.current}/{effect.health.max}; Guard {effect.guard}; {effect.cover} cover.</p>}
        {effect.expiresAt&&<p>Expires {new Date(effect.expiresAt).toLocaleTimeString()}.</p>}
        {effect.featureId==='path:drydock-ghost:silent-keel:10'&&effect.mode==='creatures'&&<>
          <p>Shrouded creatures have Advantage on Stealth checks and leave no mundane tracks. Record a creature's attack or spell to end its shroud.</p>
          <ul>{effect.targetIds.map(targetId=><li key={targetId}>{targetId}{' '}
            <button onClick={()=>onCommand('silent-keel.end-target',{effectId:effect.id,targetId,trigger:'attack',confirmed:true})}>Confirm {targetId} attacked</button>{' '}
            <button onClick={()=>onCommand('silent-keel.end-target',{effectId:effect.id,targetId,trigger:'spell',confirmed:true})}>Confirm {targetId} cast a spell</button>
          </li>)}</ul>
        </>}
        <button onClick={()=>onCommand('effect.end',{effectId:effect.id})}>End {effect.name}</button></article>)}
    </fieldset>
    {hasGhost&&options.some(option=>option.handler==='salvage')&&<fieldset disabled={busy}><legend>Salvaged parts: {state.salvageCp??0} cp</legend><p>Parts fund repairs or crafting and cannot be sold.</p>
      <label>Project ID <input value={project} onChange={e=>setProject(e.target.value)} maxLength={100}/></label>
      <label>Project kind <select value={projectKind} onChange={e=>setProjectKind(e.target.value)}><option value="repair">Repair</option><option value="craft">Crafting</option></select></label>
      <label>Parts to spend, cp <input type="number" min={1} max={state.salvageCp??0} value={credit} onChange={e=>setCredit(Number(e.target.value))}/></label>
      <button disabled={!confirmed||!project.trim()||credit>(state.salvageCp??0)} onClick={()=>onCommand('craft.spend-salvage',{amountCp:credit,projectId:project,kind:projectKind,confirmed})}>Spend salvaged parts</button>
    </fieldset>}
    <RelayControls summary={summary} state={state} busy={busy} onCommand={onCommand}/>
    <ChargeControls summary={summary} state={state} busy={busy} onCommand={onCommand}/>
    <CorsairPathControls summary={summary} state={state} busy={busy} onCommand={onCommand}/>
    <EnvoyControls summary={summary} state={state} busy={busy} onCommand={onCommand}/>
    <ConduitControls summary={summary} state={state} busy={busy} onCommand={onCommand}/>
  </section>;
}
