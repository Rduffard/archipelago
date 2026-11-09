import {useState} from 'react';
import ContingencyControls,{PendingContingency} from './ContingencyControls';
export default function SpellActions({character,rules,busy,onCommand}){
  const [selected,setSelected]=useState('');const [source,setSource]=useState('auto');const [slot,setSlot]=useState(1);
  const [metamagic,setMetamagic]=useState([]);const [damageType,setDamageType]=useState('fire');
  const [originalDamageType,setOriginalDamageType]=useState('fire');const [carefulTargets,setCarefulTargets]=useState('');const [heightenedTarget,setHeightenedTarget]=useState('');const [freeMetamagic,setFreeMetamagic]=useState('');
  const [targets,setTargets]=useState('');const [materials,setMaterials]=useState([]);const [turn,setTurn]=useState('');
  const [originRelay,setOriginRelay]=useState('');const [teleportFrom,setTeleportFrom]=useState('');const [teleportTo,setTeleportTo]=useState('');const [relayConfirmed,setRelayConfirmed]=useState(false);
  const [focusId,setFocusId]=useState('');
  const [overchannel,setOverchannel]=useState(false),[dragonNoConcentration,setDragonNoConcentration]=useState(false);
  const [sculptTargets,setSculptTargets]=useState(''),[sculptConfirmed,setSculptConfirmed]=useState(false);
  const [contingency,setContingency]=useState(null);
  const [triggerEventId,setTriggerEventId]=useState(''),[triggerConfirmed,setTriggerConfirmed]=useState(false);
  const s=character.rulesSummary;
  const spells=Object.entries(s.spellcasting).flatMap(([callingId,casting])=>[...new Set([...casting.cantrips,...character.rulesRuntime.preparations[callingId],...casting.alwaysPrepared,...(callingId==='shipwright'?casting.folio.filter(id=>rules.spells.find(spell=>spell.id===id)?.ritual):[])])].map(spellId=>({key:callingId+'|'+spellId,callingId,spellId})));
  for(const feat of s.featSpellcasters??[])for(const spellId of [...feat.cantrips,feat.spell])spells.push({key:feat.grantKey+'|'+spellId,callingId:Object.keys(s.callingLevels)[0],spellId,feat});
  if(s.callingLevels.doctor>=10)for(const spell of rules.spells.filter(spell=>spell.callings.includes('doctor')&&spell.level<=5&&!spell.castingTime.startsWith('Reaction')||s.callingLevels.doctor===20&&spell.id==='wish'))spells.push({key:'intervention|'+spell.id,callingId:'doctor',spellId:spell.id,intervention:true});
  const choice=spells.find(item=>item.key===selected)??spells[0];
  if(!choice)return null;
  const spell=rules.spells.find(spell=>spell.id===choice.spellId),casting=s.spellcasting[choice.callingId];
  const mode=choice.intervention?'intervention':source==='auto'?(choice.feat?'free':'slot'):source;
  const availableSlots=s.spellSlots.map((_,i)=>i+1).filter(level=>level>=spell.level&&character.rulesRuntime.slots[level-1]>0);
  const slotLevel=availableSlots.includes(slot)?slot:availableSlots[0];
  const relays=character.rulesRuntime.effects.filter(e=>e.objectType==='relay');
  const state=character.rulesRuntime,castingTurn=state.ownerTurn?.open?state.ownerTurn.id:state.inCombat?state.externalCastingTurn:null;
  const quickenedOffTurn=metamagic.includes('quickened-spell')&&!state.ownerTurn?.open;
  const castingTrigger=!choice.intervention&&rules.spellProfiles[spell.id]?.castingTrigger;
  const targetIds=targets.split(',').map(id=>id.trim()).filter(Boolean);
  const triggerReady=!castingTrigger||triggerConfirmed&&triggerEventId.trim()&&
    (castingTrigger!=='hit'||targetIds.length===1&&(!state.inCombat||state.ownerTurn?.open));
  const isContingency=spell.id==='contingency';
  const contingentChoices=isContingency?spells.filter(o=>!o.intervention&&rules.contingencySpellIds?.includes(o.spellId)&&
    (o.feat||[...state.preparations[o.callingId],...s.spellcasting[o.callingId].alwaysPrepared].includes(o.spellId))):[];
  const contingentChoice=contingentChoices.find(o=>o.key===contingency?.key);
  const contingencyReady=contingentChoice&&!state.inCombat&&!state.ownerTurn?.open&&contingency.confirmed&&contingency.trigger?.trim()&&contingency.slotLevel&&
    state.slots[contingency.slotLevel-1]>Number(contingency.slotLevel===slotLevel);
  function cast(){
    const sourceId=choice.feat?choice.feat.grantKey:source;
    onCommand('spell.cast',{spellId:spell.id,callingId:choice.callingId,source:choice.feat?sourceId:mode,
      ...(spell.level>0&&mode==='slot'?{slotLevel}:{}),
      ...(mode==='ritual'?{ritual:true}:{}),metamagic,
      parameters:{...(s.paths.tidecaller==='omen-diver'&&s.callingLevels.tidecaller>=18&&spell.id==='summon-dragon'?{dragonNoConcentration}:{}),...(!choice.feat&&s.paths.shipwright==='powder-saint'?{overchannel}:{}),...(focusId?{focusId}:{}),damageType,originalDamageType,heightenedTarget,exemptTargets:carefulTargets.split(',').map(s=>s.trim()).filter(Boolean),...(freeMetamagic?{freeMetamagic}:{}),...(!choice.feat&&choice.callingId==='shipwright'&&spell.level===0&&originRelay?{originRelayId:originRelay,relayOriginConfirmed:relayConfirmed}:{}),
        ...(!choice.feat&&choice.callingId==='shipwright'&&spell.level>0&&teleportFrom?{teleport:{from:teleportFrom,to:teleportTo,confirmed:relayConfirmed}}:{}),...(s.paths.shipwright==='powder-saint'&&s.callingLevels.shipwright>=6&&spell.school==='evocation'&&sculptTargets.trim()?{sculptTargets:sculptTargets.split(',').map(s=>s.trim()).filter(Boolean),sculptConfirmed}:{})},targets:isContingency?[]:targetIds,materialIds:materials,
      ...(castingTrigger?{trigger:{eventId:triggerEventId,confirmed:triggerConfirmed}}:{}),
      ...(!castingTurn&&turn?{turnId:turn}:{}),
      ...(isContingency&&contingencyReady?{contingency:{spellId:contingentChoice.spellId,callingId:contingentChoice.callingId,
        ...(contingentChoice.feat?{source:contingentChoice.feat.grantKey}:{}),slotLevel:contingency.slotLevel,trigger:contingency.trigger,
        confirmed:contingency.confirmed,materialIds:contingency.materialIds,...(contingency.focusId?{focusId:contingency.focusId}:{})}}:{}),
    });
  }
  return <section className="character-creation__surface" aria-label="Spell casting"><h2>Spells</h2>
    <PendingContingency character={character} rules={rules} busy={busy} onCommand={onCommand}/>
    <fieldset disabled={busy}>
    <label>Available spell <select value={choice.key} onChange={e=>{setSelected(e.target.value);setSource('auto');setMetamagic([]);setMaterials([]);setFocusId('');setFreeMetamagic('');setOverchannel(false);setTriggerEventId('');setTriggerConfirmed(false);}}>
      {spells.map(item=><option key={item.key} value={item.key}>{rules.spells.find(spell=>spell.id===item.spellId)?.name} ({item.intervention?'Divine Intervention':item.feat?'Magic Initiate':item.callingId})</option>)}</select></label>
    <p>{spell.description}</p><p>Spell attack {choice.feat?.attackModifier??casting?.attackModifier}; save DC {choice.feat?.saveDC??casting?.saveDC}.</p>
    {s.paths.shipwright==='powder-saint'&&s.callingLevels.shipwright>=6&&spell.school==='evocation'&&rules.spellProfiles[spell.id]?.savingThrow&&<><label>Sculpt Spells protected targets, included among casting targets <input value={sculptTargets} onChange={e=>setSculptTargets(e.target.value)} maxLength={1000}/></label><label><input type="checkbox" checked={sculptConfirmed} onChange={e=>setSculptConfirmed(e.target.checked)}/>GM confirms these are visible other creatures affected by this Evocation</label><p>Choose at most one plus the casting level. They automatically succeed on saves and take no damage when success normally halves it.</p></>}
    {s.paths.tidecaller==='omen-diver'&&s.callingLevels.tidecaller>=18&&spell.id==='summon-dragon'&&<><p>Dragon Companion waives Material components for free and slot castings.</p><label><input type="checkbox" checked={dragonNoConcentration} onChange={e=>setDragonNoConcentration(e.target.checked)}/>Summon without Concentration for one minute</label></>}
    {choice.intervention&&<p>Divine Intervention: Magic action, no spell slot or Material components. Uses remaining: {character.rulesRuntime.pools['doctor:intervention']??0}. Wish cooldown: {character.rulesRuntime.interventionCooldown?.longRestsRemaining??0} Long Rests.</p>}
    {spell.level>0&&!choice.intervention&&<label>Casting source <select value={mode} onChange={e=>setSource(e.target.value)}><option value="slot" disabled={!availableSlots.length}>Spell slot</option>
      {choice.feat&&<option value="free" disabled={character.rulesRuntime.pools[choice.feat.poolId]<1}>Magic Initiate free cast ({character.rulesRuntime.pools[choice.feat.poolId]??0} remaining)</option>}
      {!choice.feat&&s.paths.tidecaller==='omen-diver'&&s.callingLevels.tidecaller>=18&&spell.id==='summon-dragon'&&<option value="dragon-companion">Dragon Companion free cast ({character.rulesRuntime.pools['omen-diver:companion']??0} remaining)</option>}
      {!choice.feat&&spell.ritual&&<option value="ritual">Ritual (+10 minutes)</option>}
      {!choice.feat&&casting?.spellMastery.includes(spell.id)&&<option value="mastery">Spell Mastery</option>}
      {!choice.feat&&casting?.signatureSpells.includes(spell.id)&&<option value="signature">Signature Spell</option>}
      {!choice.feat&&choice.callingId==='navigator'&&spell.id==='hunter-s-mark'&&<option value="favored-enemy">Favored Enemy free cast</option>}
      {!choice.feat&&choice.callingId==='warden'&&spell.id==='divine-smite'&&<option value="smite-free">Free Smite</option>}
      {!choice.feat&&choice.callingId==='warden'&&spell.id==='find-steed'&&<option value="steed-free">Free Steed</option>}
    </select></label>}
    {spell.level>0&&mode==='slot'&&<label>Slot level <select value={slotLevel??''} onChange={e=>setSlot(Number(e.target.value))}><option value="" disabled>Choose an available slot</option>{s.spellSlots.map((_,i)=><option key={i} value={i+1} disabled={i+1<spell.level||character.rulesRuntime.slots[i]<1}>Level {i+1}: {character.rulesRuntime.slots[i]} remaining</option>)}</select></label>}
    {!isContingency&&<label>Targets, separated by commas <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={500}/></label>}
    {castingTrigger&&<fieldset><legend>Casting trigger</legend>
      <p>{spell.castingTime}.</p>
      <label>Spell trigger event ID <input value={triggerEventId} onChange={e=>{setTriggerEventId(e.target.value);setTriggerConfirmed(false);}} maxLength={100}/></label>
      <label><input type="checkbox" checked={triggerConfirmed} onChange={e=>setTriggerConfirmed(e.target.checked)}/>GM confirms the printed trigger just occurred and the action is available</label>
    </fieldset>}
    {isContingency&&<ContingencyControls choices={contingentChoices} value={contingency} onChange={setContingency} rules={rules} inventory={character.inventory} slots={state.slots} primarySlot={slotLevel}/>}
    {isContingency&&(state.inCombat||state.ownerTurn?.open)&&<p>Complete Contingency's ten-minute casting outside a recorded turn.</p>}
    {castingTurn?<p>Casting turn: {castingTurn}.</p>:state.inCombat?<p>Ask the GM to record the current encounter turn before casting.</p>:<label>Turn label for table-adjudicated features <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>}
    {!choice.feat&&s.paths.shipwright==='powder-saint'&&s.callingLevels.shipwright>=14&&<label><input type="checkbox" checked={overchannel} onChange={e=>setOverchannel(e.target.checked)}/>Overchannel: maximum spell damage on this turn; {(character.rulesRuntime.counters.overchannel??0)===0?'first use has no backlash':`${(character.rulesRuntime.counters.overchannel??0)+1}d12 Necrotic backlash per slot level, ignoring Resistance and Immunity`}. Uses since Long Rest: {character.rulesRuntime.counters.overchannel??0}.</label>}
    {!choice.feat&&choice.callingId==='shipwright'&&s.paths.shipwright==='sparkwrite-aetherist'&&<fieldset><legend>Relay casting</legend>
      {spell.level===0&&<label>Cantrip range origin <select value={originRelay} onChange={e=>setOriginRelay(e.target.value)}><option value="">My position</option>{relays.map((r,i)=><option key={r.id} value={r.id}>Relay {i+1}</option>)}</select></label>}
      {spell.level>0&&s.totalLevel>=14&&<><label>Twin Circuit departure <select value={teleportFrom} onChange={e=>setTeleportFrom(e.target.value)}><option value="">No teleport</option>{relays.map((r,i)=><option key={r.id} value={r.id}>Relay {i+1}</option>)}</select></label>
        <label>Twin Circuit destination <select value={teleportTo} onChange={e=>setTeleportTo(e.target.value)}><option value="">Choose destination</option>{relays.filter(r=>r.id!==teleportFrom).map(r=><option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}</select></label></>}
      <label><input type="checkbox" checked={relayConfirmed} onChange={e=>setRelayConfirmed(e.target.checked)}/>GM confirms my sight and, for teleportation, relays within 60 feet, departure within five feet and a visible unoccupied arrival within five feet</label>
      <p>Relay-origin cantrips and Twin Circuit each require a consistent turn label and are limited to once per turn.</p>
    </fieldset>}
    {!choice.intervention&&<label>Priced material components <select multiple value={materials} onChange={e=>setMaterials(Array.from(e.target.selectedOptions,o=>o.value))}>{character.inventory.map(item=><option key={item.instanceId} value={item.instanceId}>{item.customName||rules.equipment.items.find(d=>d.id===item.definitionId)?.name}</option>)}</select></label>}
    {!choice.intervention&&<label>Material focus or pouch <select value={focusId} onChange={e=>setFocusId(e.target.value)}><option value="">Automatically use an eligible carried focus or pouch</option>{character.inventory.filter(i=>rules.equipment.items.find(d=>d.id===i.definitionId)?.focus).map(i=><option key={i.instanceId} value={i.instanceId}>{i.customName||rules.equipment.items.find(d=>d.id===i.definitionId)?.name}</option>)}</select></label>}
    <p>Somatic components need a free hand. A held Material focus can use that same hand; a focus does not satisfy a Somatic-only spell. Priced or consumed materials need a free handling hand.</p>
    {!choice.intervention&&(rules.spellMaterials?.[spell.id]??[]).map((r,i)=><p key={i}>Required: {r.count} {r.kind.replaceAll('-',' ')} worth at least {r.minValueCp} cp each{r.perTarget?' per target':''}. {r.consumed?'Consumed when cast.':'Retained after casting.'}</p>)}
    {!choice.intervention&&spell.id==='gentle-repose'&&<p>Consumes two copper pieces from your coin balance.</p>}
    {s.pathSelections.tidecaller?.metamagic?.length>0&&<><label>Metamagic <select multiple value={metamagic} onChange={e=>{setMetamagic(Array.from(e.target.selectedOptions,o=>o.value));setFreeMetamagic('');}}>
      {s.pathSelections.tidecaller.metamagic.filter(id=>!['empowered-spell','seeking-spell'].includes(id)).map(id=>{
        const option=rules.metamagic.find(o=>o.id===id);
        const needsSavingThrow=['careful-spell','heightened-spell'].includes(id)&&!rules.spellProfiles[spell.id]?.savingThrow;
        return <option key={id} value={id} disabled={needsSavingThrow}>{option?.name} ({option?.cost} points){needsSavingThrow?' — requires a saving throw':''}</option>;
      })}
    </select></label>
      {metamagic.map(id=><p key={id}>{rules.metamagic.find(o=>o.id===id)?.description}</p>)}
      {metamagic.includes('careful-spell')&&<label>Careful protected targets (comma separated, included above) <input value={carefulTargets} onChange={e=>setCarefulTargets(e.target.value)}/></label>}
      {metamagic.includes('heightened-spell')&&<label>Heightened target (included above) <input value={heightenedTarget} onChange={e=>setHeightenedTarget(e.target.value)}/></label>}
      {metamagic.includes('transmuted-spell')&&<><label>Original damage type <select value={originalDamageType} onChange={e=>setOriginalDamageType(e.target.value)}>{['acid','cold','fire','lightning','poison','thunder'].map(id=><option key={id}>{id}</option>)}</select></label><label>New damage type <select value={damageType} onChange={e=>setDamageType(e.target.value)}>{['acid','cold','fire','lightning','poison','thunder'].map(id=><option key={id}>{id}</option>)}</select></label></>}
      {s.callingLevels.tidecaller>=20&&<label>Arcane Apotheosis: free option this turn <select value={freeMetamagic} onChange={e=>setFreeMetamagic(e.target.value)}><option value="">Pay normal costs</option>{metamagic.map(id=><option key={id}>{id}</option>)}</select></label>}
    </>}
    {quickenedOffTurn&&<p>Quickened Spell requires a Bonus Action on your own recorded turn.</p>}
    <button disabled={!triggerReady||quickenedOffTurn||!castingTurn&&state.inCombat||isContingency&&!contingencyReady||choice.intervention&&(!(character.rulesRuntime.pools['doctor:intervention']>0)||character.rulesRuntime.interventionCooldown?.longRestsRemaining>0)||spell.level>0&&(mode==='slot'&&!slotLevel||choice.feat&&mode==='free'&&!(character.rulesRuntime.pools[choice.feat.poolId]>0))} onClick={cast}>Cast {spell.name}</button>
  </fieldset></section>;
}
