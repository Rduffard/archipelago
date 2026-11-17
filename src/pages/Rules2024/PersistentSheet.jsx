import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { request } from "../../lib/api";
import PersistentResources from "./PersistentResources";
import PersistentEquipment from "./PersistentEquipment";
import PreparationChoices from "./PreparationChoices";
import AbilityActions from './AbilityActions';
import CastingTurnControls from './CastingTurnControls';
import {PendingContingency} from './ContingencyControls';
import SpellActions from './SpellActions';
import SpellRerolls from './SpellRerolls';
import RestPlanner from './RestPlanner';
import FeatureActions from './FeatureActions';
import RestSelections from './RestSelections';
import AdvancementReplacements from './AdvancementReplacements';
import OperationResult from './OperationResult';
import CharacterStateControls from './CharacterStateControls';
import FeatControls from './FeatControls';
import StrikeControls from './StrikeControls';
import ToolCheckControls from './ToolCheckControls';
import IdentityFields from './IdentityFields';
import AuditHistory from './AuditHistory';
import CovenantControls from './CovenantControls';
import WardenPathControls from './WardenPathControls';
import CharacterAuthorityControls from './CharacterAuthorityControls';
import FolioControls from './FolioControls';
import ReaverPathControls from './ReaverPathControls';
import NavigatorPathControls from './NavigatorPathControls';
import CasterPathControls from './CasterPathControls';
import GunslingerPathControls from './GunslingerPathControls';
import RebuildControls from './RebuildControls';
import MagicItemControls from './MagicItemControls';
import UtilityControls from './UtilityControls';
import AttackRecords from './AttackRecords';
import GrayNetControls from './GrayNetControls';
import StormBrokerControls from './StormBrokerControls';
import DamageRiderControls from './DamageRiderControls';
import HealingSpellControls from './HealingSpellControls';
import CommandError from './CommandError';
import ObjectUseControls from './ObjectUseControls';
import LineageAdvancement from '../../game/creator/LineageAdvancement';
import { LineageSummary, RequiredChoice, RulesSummary } from "./Rules2024Views";
import "./Rules2024.css";
import './CharacterCreation.css';

export default function PersistentSheet({ editing = false }) {
  const { characterId } = useParams();
  const { token, setCharacters } = useAuth();
  const [character, setCharacter] = useState(null);
  const [rules, setRules] = useState(null);
  const [error, setError] = useState("");
  const [errorDetails,setErrorDetails]=useState(null);
  const [busy, setBusy] = useState(false);
  const [pendingCommand,setPendingCommand]=useState(null);
  const [operationResult,setOperationResult]=useState(null);
  const [restDraft,setRestDraft]=useState(null);
  const [event, setEvent] = useState(null);
  const [preview, setPreview] = useState(null);
  const [callingId, setCallingId] = useState("corsair");
  const [details, setDetails] = useState({ name: "", notes: "",pronouns:'',appearance:'',portraitUrl:'' });
  const base = `/archipelago/characters/${characterId}`;
  const headers = { Authorization: `Bearer ${token}` };
  useEffect(() => {
    let active = true;
    Promise.all([
      request(`/archipelago/characters/${characterId}`, { headers: { Authorization: `Bearer ${token}` } }),
      request("/archipelago/system/character-rules?version=SA-CHAR-1", { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([c, r]) => {
      if (active) {
        setCharacter(c); setRules(r); setEvent(null); setPreview(null);
        setCallingId(c.calling);
        setDetails({ name: c.name, notes: c.notes ?? "",pronouns:c.pronouns??'',appearance:c.appearance??'',portraitUrl:c.portraitUrl??'' });
      }
    }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [characterId, token]);
  async function act(path, body, isPreview = false, method = "POST") {
    setBusy(true); setError("");
    try {
      const result = await request(`${base}/${path}`, {
        method, headers, body: JSON.stringify(body),
      });
      if (isPreview) { setEvent(body); setPreview(result); }
      else {
        setCharacter(result); setEvent(null); setPreview(null);
        setCharacters(previous => previous.map(c => c._id === result._id ? result : c));
      }
    } catch (e) { setError(e.message);setErrorDetails(e); }
    finally { setBusy(false); }
  }
  function resource(operation) {
    if(['short-rest','long-rest'].includes(operation.type)){setRestDraft(operation);return;}
    return command(['slot-to-sorcery','sorcery-to-slot'].includes(operation.type)?'resource.convert':'resource.adjust',operation);
  }
  async function command(type,payload,retry) {
    const envelope=retry??{operationId:crypto.randomUUID(),expectedRevision:character.documentRevision,rulesVersion:'SA-CHAR-1',type,payload};
    setBusy(true);setError('');setPendingCommand(envelope);
    try {
      const result=await request(base+'/commands',{method:'POST',headers,body:JSON.stringify(envelope)});
      setCharacter(result);setOperationResult(result.operationResult);setPendingCommand(null);
      setEvent(null);setPreview(null);
      if(type==='rest.complete'||type==='rest.cancel')setRestDraft(null);
      setCharacters(previous=>previous.map(c=>c._id===result._id?result:c));
      return result;
    }catch(e){setError(e.message);setErrorDetails(e);if(e.status)setPendingCommand(null);}
    finally{setBusy(false);}
  }
  async function refreshConflict(){setBusy(true);try{const saved=await request(base,{headers});setCharacter(saved);setCharacters(previous=>previous.map(c=>c._id===saved._id?saved:c));setError('');setErrorDetails(null);}catch(e){setError(e.message);setErrorDetails(e);}finally{setBusy(false);}}
  if (!character || !rules) return <main><p role="alert">{error || "Loading character."}</p></main>;
  const summary = character.rulesSummary;
  const state = character.rulesRuntime;
  if(character.permissions?.isOwner===false)return <main className="page-shell rules-2024 character-creation"><h1>GM review: {character.name}</h1><CastingTurnControls character={character} busy={busy||Boolean(pendingCommand)} onCommand={command}/><PendingContingency character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/><CommandError message={error} fieldPath={errorDetails?.fieldPath} conflict={errorDetails?.status===409} busy={busy} onRefresh={refreshConflict}/><OperationResult result={operationResult}/><CharacterAuthorityControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/><RebuildControls key={'rebuild-'+characterId} character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/><AuditHistory key={characterId} loadPage={cursor=>request(`${base}/commands?limit=20${cursor?'&cursor='+encodeURIComponent(cursor):''}`,{headers})} revision={character.documentRevision}/><RulesSummary summary={summary} rules={rules} title="Character sheet" equipment={character.equipment}/></main>;
  return <main className="page-shell rules-2024 character-creation">
    <h1>{character.name}</h1>
    <p>From {rules.creation.origins.find(o=>o.id===summary.originId)?.name??character.origin}. {character.notes}</p>
    <p>Manage your abilities, spellcasting, equipment, rests and Calling advancement.</p>
    <CommandError message={error} fieldPath={errorDetails?.fieldPath} conflict={errorDetails?.status===409} busy={busy} onRefresh={refreshConflict}/>
    {pendingCommand&&!busy&&<button onClick={()=>command(null,null,pendingCommand)}>Retry interrupted command</button>}
    <OperationResult result={operationResult}/>
    <CharacterAuthorityControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/><RebuildControls key={'rebuild-'+characterId} character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <AuditHistory key={characterId} loadPage={cursor=>request(`${base}/commands?limit=20${cursor?'&cursor='+encodeURIComponent(cursor):''}`,{headers})} revision={character.documentRevision}/>
    <details open={editing}>
      <summary>Identity and narrative notes</summary>
      <fieldset disabled={busy}>
        <IdentityFields value={details} onChange={setDetails} nameLabel="Name"/>
        <p>Origin is a creation choice; changing it requires a full rebuild.</p>
        <p>Narrative notes do not change attributes or apply penalties.</p>
        <button onClick={() => command('identity.patch',details)}>Save identity and notes</button>
      </fieldset>
    </details>
    <LineageSummary lineage={summary.lineage} state={state} rules={rules} />
    <PersistentResources summary={summary} state={state} busy={busy} onOperation={resource} />
    <CharacterStateControls permissions={character.permissions} summary={summary} state={state} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <RestPlanner key={state.restSession?state.restSession.id+':'+(state.restSession.interruptions?.length??0):String(state.worldTime)} state={state} draft={restDraft} busy={busy||Boolean(pendingCommand)} onCommand={command} onDismiss={()=>setRestDraft(null)}/>
    <AbilityActions summary={summary} state={state} busy={busy||Boolean(pendingCommand)} onCommand={command} />
    <CovenantControls character={character} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <WardenPathControls character={character} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <ReaverPathControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <NavigatorPathControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <CasterPathControls character={character} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <GunslingerPathControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <MagicItemControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <UtilityControls character={character} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <AttackRecords character={character} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <GrayNetControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <StormBrokerControls character={character} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <DamageRiderControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <HealingSpellControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <ObjectUseControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <FeatureActions summary={summary} state={state} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <SpellActions character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command} />
    <SpellRerolls character={character} busy={busy||Boolean(pendingCommand)} onCommand={command} />
    <FeatControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command} />
    <StrikeControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command} />
    <ToolCheckControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command} />
    <RestSelections key={'rest-' + (state.restEpoch??'none')} character={character} rules={rules} busy={busy} onOperation={resource}/>
    <FolioControls key={'folio-'+characterId} character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <PreparationChoices key={'preparation-'+characterId} summary={summary} rules={rules} state={state} busy={busy} onOperation={resource} />
    <PersistentEquipment character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <RulesSummary summary={summary} rules={rules} title="Character sheet" equipment={character.equipment} />
    <details><summary>Advancement history</summary><ol>{character.rulesLedger.levels.map((level, i) => <li key={i}>
      Character level {i + 1}: {rules.callings.find(c => c.id === level.callingId)?.name}.
      {Object.entries(level.choices ?? {}).map(([key, value]) => <p key={key}>{key}: {typeof value === 'object' ? JSON.stringify(value) : value}</p>)}
    </li>)}</ol></details>
    <button disabled={busy} onClick={() => { setError(''); request(base, { headers }).then(setCharacter).catch(e => setError(e.message)); }}>Reload saved character</button>
    <fieldset disabled={busy || Boolean(pendingCommand) || summary.totalLevel >= maximumCharacterLevel}>
      <legend>Advancement</legend>
      <label>Next Calling <select value={callingId} onChange={e => setCallingId(e.target.value)}>
        {rules.callings.filter(c=>c.id===character.calling).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select></label>
      <button onClick={() => act("preview", { callingId, choices: {} }, true)}>Preview next level</button>
      {preview && <>
        <RulesSummary summary={preview} rules={rules} title="Proposed next level" />
        <LineageSummary lineage={preview.lineage} rules={rules} headingId="advancement-lineage" />
        {preview.lineage?.animalForms?.pendingChoice && <LineageAdvancement
          key={preview.totalLevel} options={preview.lineage.animalForms.pendingChoice} rules={rules}
          onChange={lineageForm => act("preview", { ...event, lineageForm }, true)} />}
        {preview.requiredChoices[0] && preview.requiredChoices[0].key !== 'lineageForm' && <RequiredChoice key={preview.requiredChoices[0].id}
          choice={preview.requiredChoices[0]} rules={rules}
          initialSelected={['prepared','cantrips'].includes(preview.requiredChoices[0].key)?summary.spellcasting[callingId]?.[preview.requiredChoices[0].key]??[]:[]}
          onChange={changes => act("preview", { ...event, choices: { ...event.choices, ...changes } }, true)} />}
        {preview.requiredChoices[0]?.key==='prepared'&&callingId==='tidecaller'&&<p>Your existing eligible preparations are selected. Fill the new places; you may replace at most one previously prepared spell on this level.</p>}
        {preview.decisionsComplete&&<AdvancementReplacements before={summary} preview={preview} event={event} rules={rules} busy={busy}
          onChange={choices=>act('preview',{...event,choices},true)}/>}
        <button disabled={!preview.decisionsComplete||character.permissions?.canAdvance===false} onClick={() => command('advance', {level:preview.totalLevel,choices:event.choices,
          ...(event.lineageForm && { lineageForm: event.lineageForm })})}>Save advancement</button>
        <button onClick={() => { setPreview(null); setEvent(null); }}>Cancel advancement</button>
      </>}
    </fieldset>
  </main>;
}
import {maximumCharacterLevel} from '@crossworld/sanguine-engine/progression';
