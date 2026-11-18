import { displayName } from '../../game/creator/choiceLabels';
import {useState} from 'react';
import {arcaneApotheosisUnlocked,metamagicRerollOptions,metamagicNeedsSavingThrow,transmutedSpellDamageTypes} from '@crossworld/sanguine-engine/spells/metamagic';
import {availableCastingSlots} from '@crossworld/sanguine-engine/spell-slots';
import {contingentSlotAvailable,contingentSpellAvailable} from '@crossworld/sanguine-engine/spells/contingency';
import {freeCastingTerms,ritualSourceAllowed,spellTriggerTargetsEligible,castingSpellChoices} from '@crossworld/sanguine-engine/spells/casting-sources';
import {divineInterventionEligible,divineInterventionAvailable,dragonCompanionEligible,overchannelCastEligible,overchannelBacklash,sculptSpellsUnlocked,twinCircuitUnlocked,relayCastingEligible,relayCantripEligible} from '@crossworld/sanguine-engine/callings';
import ContingencyControls,{PendingContingency} from './ContingencyControls';
export default function SpellActions({character,rules,busy,onCommand}){
  const [spellSearch, setSpellSearch] = useState('');
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
  const spellById=id=>rules.spells.find(spell=>spell.id===id);
  const spells=Object.entries(s.spellcasting).flatMap(([callingId,casting])=>
    castingSpellChoices(callingId,casting,character.rulesRuntime.preparations[callingId],spellById)
      .map(spellId=>({key:callingId+'|'+spellId,callingId,spellId})));
  for(const feat of s.featSpellcasters??[])for(const spellId of [...feat.cantrips,feat.spell])spells.push({key:feat.grantKey+'|'+spellId,callingId:Object.keys(s.callingLevels)[0],spellId,feat});
  for (const innate of s.innateSpells ?? []) {
    if (innate.castSupported && innate.modes.length) spells.push({
      key: innate.grantKey, spellId: innate.spellId, innate,
    });
  }
  for(const spell of rules.spells.filter(spell=>divineInterventionEligible(spell,s.callingLevels.doctor)))spells.push({key:'intervention|'+spell.id,callingId:'doctor',spellId:spell.id,intervention:true});
  const choice=spells.find(item=>item.key===selected)??spells[0];
  if(!choice && s.lineage?.spells?.some(spell => spell.unlocked)) return null;
  if(!choice)return <div className="sa-sheet__empty">
    <h3>No Spells Available</h3>
    <p>Your character has no spells available to cast here. Spells granted by your Calling, Path, or other features appear as you unlock them.</p>
  </div>;
  const query = spellSearch.trim().toLowerCase();
  const visibleSpells = spells.filter(item => (spellById(item.spellId)?.name ?? displayName(item.spellId)).toLowerCase().includes(query));
  const spellGroups = Map.groupBy(visibleSpells, item => spellById(item.spellId)?.level ?? 0);
  function selectSpell(key) {
    setSelected(key);
    setSource('auto');
    setMetamagic([]);
    setMaterials([]);
    setFocusId('');
    setFreeMetamagic('');
    setOverchannel(false);
    setTriggerEventId('');
    setTriggerConfirmed(false);
  }
  const spell=rules.spells.find(spell=>spell.id===choice.spellId),casting=s.spellcasting[choice.callingId];
  const dragonCompanion=dragonCompanionEligible(spell.id,choice.callingId,s.paths.tidecaller,s.callingLevels.tidecaller);
  const freeOptionEnabled=sourceKey=>{
    if(choice.feat || choice.innate)return false;
    const terms=freeCastingTerms({source:sourceKey,spellId:spell.id,callingId:choice.callingId,casting,dragonCompanion});
    return Boolean(terms&&!terms.error);
  };
  const canSculpt=sculptSpellsUnlocked(s.paths.shipwright,s.callingLevels.shipwright,spell.school);
  const innate = choice.innate;
  const state=character.rulesRuntime,castingTurn=state.ownerTurn?.open?state.ownerTurn.id:state.inCombat?state.externalCastingTurn:null;
  const freeCasts = state.pools[(innate ?? choice.feat)?.poolId] ?? 0;
  const availableSlots=availableCastingSlots(s.spellSlots,state.slots,spell.level);
  const defaultInnateMode = innate?.modes.find(mode => mode === 'cantrip' || mode === 'free' && freeCasts > 0 ||
    mode === 'slot' && availableSlots.length) ?? innate?.modes[0];
  const mode=choice.intervention?'intervention':source==='auto'?(defaultInnateMode ?? (choice.feat && (freeCasts || !availableSlots.length) ? 'free' : 'slot')):source;
  const slotLevel=availableSlots.includes(slot)?slot:availableSlots[0];
  const canOverchannel=spell.level>0&&mode==='slot'&&overchannelCastEligible({
    callingId:choice.callingId,path:s.paths.shipwright,level:s.callingLevels.shipwright,initiate:choice.feat,
    slotLevel,damageTypes:rules.spellProfiles[spell.id]?.damageTypes??[],
  });
  const backlash=overchannelBacklash(character.rulesRuntime.counters.overchannel??0,slotLevel??1);
  const relays=character.rulesRuntime.effects.filter(e=>e.objectType==='relay');
  const castingBlocked = character.equipment?.restrictions.spellcastingBlocked ? 'Your armor prevents casting.'
    : state.concentrationChecks?.length ? 'Resolve pending Concentration saves before casting.' : '';
  const sourceUnavailable = mode === 'free' && !freeCasts || spell.level > 0 && mode === 'slot' && !slotLevel;
  const quickenedOffTurn=metamagic.includes('quickened-spell')&&!state.ownerTurn?.open;
  const castingTrigger=!choice.intervention&&rules.spellProfiles[spell.id]?.castingTrigger;
  const targetIds=targets.split(',').map(id=>id.trim()).filter(Boolean);
  const triggerReady=!castingTrigger||triggerConfirmed&&triggerEventId.trim()&&
    spellTriggerTargetsEligible(castingTrigger,{targetCount:targetIds.length,inCombat:state.inCombat,ownerTurnOpen:state.ownerTurn?.open});
  const isContingency=spell.id==='contingency';
  const contingentChoices=isContingency?spells.filter(o=>!o.intervention&&!o.innate&&contingentSpellAvailable(o.spellId,o.feat
    ?{grant:o.feat.spell,eligible:rules.contingencySpellIds??[]}
    :{prepared:state.preparations[o.callingId],alwaysPrepared:s.spellcasting[o.callingId].alwaysPrepared,eligible:rules.contingencySpellIds??[]})):[];
  const contingentChoice=contingentChoices.find(o=>o.key===contingency?.key);
  const contingencyReady=contingentChoice&&!state.inCombat&&!state.ownerTurn?.open&&contingency.confirmed&&contingency.trigger?.trim()&&contingency.slotLevel&&
    contingentSlotAvailable(state.slots,slotLevel,contingency.slotLevel);
  function cast(){
    const sourceId=choice.feat?choice.feat.grantKey:source;
    onCommand('spell.cast',{spellId:spell.id,...(innate ? { source: innate.grantKey, mode }
      : { callingId:choice.callingId, source:choice.feat?sourceId:mode }),
      ...(spell.level>0&&mode==='slot'?{slotLevel}:{}),
      ...(mode==='ritual'?{ritual:true}:{}),metamagic,
      parameters:{...(dragonCompanion?{dragonNoConcentration}:{}),...(!choice.feat&&s.paths.shipwright==='powder-saint'?{overchannel:canOverchannel&&overchannel}:{}),...(focusId?{focusId}:{}),damageType,originalDamageType,heightenedTarget,exemptTargets:carefulTargets.split(',').map(s=>s.trim()).filter(Boolean),...(freeMetamagic?{freeMetamagic}:{}),...(!choice.feat&&choice.callingId==='shipwright'&&spell.level===0&&originRelay?{originRelayId:originRelay,relayOriginConfirmed:relayConfirmed}:{}),
        ...(!choice.feat&&choice.callingId==='shipwright'&&spell.level>0&&teleportFrom?{teleport:{from:teleportFrom,to:teleportTo,confirmed:relayConfirmed}}:{}),...(canSculpt&&sculptTargets.trim()?{sculptTargets:sculptTargets.split(',').map(s=>s.trim()).filter(Boolean),sculptConfirmed}:{})},targets:isContingency?[]:targetIds,materialIds:materials,
      ...(castingTrigger?{trigger:{eventId:triggerEventId,confirmed:triggerConfirmed}}:{}),
      ...(!castingTurn&&turn?{turnId:turn}:{}),
      ...(isContingency&&contingencyReady?{contingency:{spellId:contingentChoice.spellId,callingId:contingentChoice.callingId,
        ...(contingentChoice.feat?{source:contingentChoice.feat.grantKey}:{}),slotLevel:contingency.slotLevel,trigger:contingency.trigger,
        confirmed:contingency.confirmed,materialIds:contingency.materialIds,...(contingency.focusId?{focusId:contingency.focusId}:{})}}:{}),
    });
  }
  return <section className="character-creation__surface" aria-label="Spell casting"><h3>Cast a spell</h3>
    <PendingContingency character={character} rules={rules} busy={busy} onCommand={onCommand}/>
    <fieldset disabled={busy} className="sa-grimoire">
      <div className="sa-grimoire__browser">
        <label>Find a spell <input type="search" value={spellSearch} onChange={event => setSpellSearch(event.target.value)} /></label>
        <div className="sa-grimoire__index" aria-label="Available spells">
        {!spellGroups.size && <p>No spells match your search.</p>}
        {[...spellGroups].sort(([left], [right]) => left - right).map(([level, items]) =>
          <div key={level} className="sa-grimoire__group">
            <h4>{level === 0 ? 'Cantrips' : 'Level ' + level}</h4>
            {items.map(item => {
              const name = spellById(item.spellId)?.name ?? displayName(item.spellId);
              const origin = item.innate ? 'Lineage' : item.intervention ? 'Divine Intervention' : item.feat
                ? 'Magic Initiate' : rules.callings.find(calling => calling.id === item.callingId)?.name ?? displayName(item.callingId);
              return <button type="button" key={item.key} aria-label={name + ' (' + origin + ')'}
              aria-pressed={item.key === choice.key} onClick={() => selectSpell(item.key)}>
                <strong>{name}</strong>
                <small>{origin}</small>
              </button>;
            })}
          </div>)}
      </div>
      </div>
      <div className="sa-grimoire__inspector">
      <h4>{spell.name}</h4>
    <p className="sa-sheet__spell-meta">{spell.level ? 'Level ' + spell.level : 'Cantrip'} · {displayName(spell.school)} · {spell.castingTime}</p><p>{spell.description}</p><p>Spell attack {innate?.attackModifier??choice.feat?.attackModifier??casting?.attackModifier}; save DC {innate?.saveDC??choice.feat?.saveDC??casting?.saveDC}.</p>
    {canSculpt&&rules.spellProfiles[spell.id]?.savingThrow&&<><label>Sculpt Spells protected targets, included among casting targets <input value={sculptTargets} onChange={e=>setSculptTargets(e.target.value)} maxLength={1000}/></label><label><input type="checkbox" checked={sculptConfirmed} onChange={e=>setSculptConfirmed(e.target.checked)}/>GM confirms these are visible other creatures affected by this Evocation</label><p>Choose at most one plus the casting level. They automatically succeed on saves and take no damage when success normally halves it.</p></>}
    {dragonCompanion&&<><p>Dragon Companion waives Material components for free and slot castings.</p><label><input type="checkbox" checked={dragonNoConcentration} onChange={e=>setDragonNoConcentration(e.target.checked)}/>Summon without Concentration for one minute</label></>}
    {choice.intervention&&<p>Divine Intervention: Magic action, no spell slot or Material components. Uses remaining: {character.rulesRuntime.pools['doctor:intervention']??0}. Wish cooldown: {character.rulesRuntime.interventionCooldown?.longRestsRemaining??0} Long Rests.</p>}
    {spell.level > 0 && innate && <label>Casting source <select value={mode} onChange={e => setSource(e.target.value)}>
      {innate.modes.map(mode => <option key={mode} value={mode} disabled={mode === 'free' ? !freeCasts : mode === 'slot' && !availableSlots.length}>
        {mode === 'free' ? 'Lineage free cast (' + freeCasts + ' remaining)' : 'Spell slot'}
      </option>)}
    </select></label>}
    {spell.level>0&&!choice.intervention&&!innate&&<label>Casting source <select value={mode} onChange={e=>{setSource(e.target.value);setOverchannel(false);}}><option value="slot" disabled={!availableSlots.length}>Spell slot</option>
      {choice.feat&&<option value="free" disabled={character.rulesRuntime.pools[choice.feat.poolId]<1}>Magic Initiate free cast ({character.rulesRuntime.pools[choice.feat.poolId]??0} remaining)</option>}
      {freeOptionEnabled('dragon-companion')&&<option value="dragon-companion">Dragon Companion free cast ({character.rulesRuntime.pools['omen-diver:companion']??0} remaining)</option>}
      {ritualSourceAllowed(spell,casting,choice.feat)&&<option value="ritual">Ritual (+10 minutes)</option>}
      {freeOptionEnabled('mastery')&&<option value="mastery">Spell Mastery</option>}
      {freeOptionEnabled('signature')&&<option value="signature">Signature Spell</option>}
      {freeOptionEnabled('favored-enemy')&&<option value="favored-enemy">Favored Enemy free cast</option>}
      {freeOptionEnabled('smite-free')&&<option value="smite-free">Free Smite</option>}
      {freeOptionEnabled('steed-free')&&<option value="steed-free">Free Steed</option>}
    </select></label>}
    {spell.level>0&&mode==='slot'&&<label>Slot level <select value={slotLevel??''} onChange={e=>setSlot(Number(e.target.value))}><option value="" disabled>Choose an available slot</option>{s.spellSlots.map((_,i)=><option key={i} value={i+1} disabled={!availableSlots.includes(i+1)}>Level {i+1}: {character.rulesRuntime.slots[i]} remaining</option>)}</select></label>}
    {!isContingency&&<label>Targets, separated by commas <input value={targets} onChange={e=>setTargets(e.target.value)} maxLength={500}/></label>}
    {castingTrigger&&<fieldset><legend>Casting trigger</legend>
      <p>{spell.castingTime}.</p>
      <label>Spell trigger event ID <input value={triggerEventId} onChange={e=>{setTriggerEventId(e.target.value);setTriggerConfirmed(false);}} maxLength={100}/></label>
      <label><input type="checkbox" checked={triggerConfirmed} onChange={e=>setTriggerConfirmed(e.target.checked)}/>GM confirms the printed trigger just occurred and the action is available</label>
    </fieldset>}
    {isContingency&&<ContingencyControls choices={contingentChoices} value={contingency} onChange={setContingency} rules={rules} inventory={character.inventory} slots={state.slots} primarySlot={slotLevel}/>}
    {isContingency&&(state.inCombat||state.ownerTurn?.open)&&<p>Complete Contingency's ten-minute casting outside a recorded turn.</p>}
    {castingTurn?<p>Casting turn: {castingTurn}.</p>:state.inCombat?<p>Ask the GM to record the current encounter turn before casting.</p>:<label>Turn label for table-adjudicated features <input value={turn} onChange={e=>setTurn(e.target.value)} maxLength={100}/></label>}
    {canOverchannel&&<label><input type="checkbox" checked={overchannel} onChange={e=>setOverchannel(e.target.checked)}/>Overchannel: maximum spell damage on this turn; {!backlash.diceCount?'first use has no backlash':`${backlash.diceCount}d${backlash.sides} Necrotic backlash at this slot level, ignoring Resistance and Immunity`}. Uses since Long Rest: {character.rulesRuntime.counters.overchannel??0}.</label>}
    {relayCastingEligible(choice.callingId,s.paths.shipwright,choice.feat)&&<fieldset><legend>Relay casting</legend>
      {relayCantripEligible(spell.level)&&<label>Cantrip range origin <select value={originRelay} onChange={e=>setOriginRelay(e.target.value)}><option value="">My position</option>{relays.map((r,i)=><option key={r.id} value={r.id}>Relay {i+1}</option>)}</select></label>}
      {twinCircuitUnlocked(s.callingLevels.shipwright,spell.level)&&<><label>Twin Circuit departure <select value={teleportFrom} onChange={e=>setTeleportFrom(e.target.value)}><option value="">No teleport</option>{relays.map((r,i)=><option key={r.id} value={r.id}>Relay {i+1}</option>)}</select></label>
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
      {s.pathSelections.tidecaller.metamagic.filter(id=>!metamagicRerollOptions.includes(id)).map(id=>{
        const option=rules.metamagic.find(o=>o.id===id);
        const needsSavingThrow=metamagicNeedsSavingThrow(id)&&!rules.spellProfiles[spell.id]?.savingThrow;
        return <option key={id} value={id} disabled={needsSavingThrow}>{option?.name} ({option?.cost} points){needsSavingThrow?' — requires a saving throw':''}</option>;
      })}
    </select></label>
      {metamagic.map(id=><p key={id}>{rules.metamagic.find(o=>o.id===id)?.description}</p>)}
      {metamagic.includes('careful-spell')&&<label>Careful protected targets (comma separated, included above) <input value={carefulTargets} onChange={e=>setCarefulTargets(e.target.value)}/></label>}
      {metamagic.includes('heightened-spell')&&<label>Heightened target (included above) <input value={heightenedTarget} onChange={e=>setHeightenedTarget(e.target.value)}/></label>}
      {metamagic.includes('transmuted-spell')&&<><label>Original damage type <select value={originalDamageType} onChange={e=>setOriginalDamageType(e.target.value)}>{transmutedSpellDamageTypes.map(id=><option key={id}>{id}</option>)}</select></label><label>New damage type <select value={damageType} onChange={e=>setDamageType(e.target.value)}>{transmutedSpellDamageTypes.map(id=><option key={id}>{id}</option>)}</select></label></>}
      {arcaneApotheosisUnlocked(s.callingLevels.tidecaller)&&<label>Arcane Apotheosis: free option this turn <select value={freeMetamagic} onChange={e=>setFreeMetamagic(e.target.value)}><option value="">Pay normal costs</option>{metamagic.map(id=><option key={id}>{id}</option>)}</select></label>}
    </>}
    {quickenedOffTurn&&<p>Quickened Spell requires a Bonus Action on your own recorded turn.</p>}
    {castingBlocked && <p role="status">{castingBlocked}</p>}
    {sourceUnavailable && <p role="status">{mode === 'free' ? 'No free casts remaining.' : 'No eligible spell slots remaining.'}</p>}
    <button disabled={Boolean(castingBlocked)||sourceUnavailable||!triggerReady||quickenedOffTurn||!castingTurn&&state.inCombat||isContingency&&!contingencyReady||choice.intervention&&!divineInterventionAvailable(state.pools['doctor:intervention'],state.interventionCooldown?.longRestsRemaining)} onClick={cast}>Cast {spell.name}</button>
  </div>
    </fieldset></section>;
}
