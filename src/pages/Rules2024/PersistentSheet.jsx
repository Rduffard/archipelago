import { choiceTitle, displayName } from '../../game/creator/choiceLabels';
import { ResourceBar, SectionTabs, GameButton } from '../../game/ui/GameUI';
import CharacterPreview from '../../game/scene/CharacterPreview';
import { defaultAppearance } from '../../game/scene/appearance';
import './CharacterSheet.css';
import './CharacterDossier.css';
import { lazy, Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { request } from "../../lib/api";
import PersistentResources from "./PersistentResources";
import PersistentEquipment from "./PersistentEquipment";
import AbilityActions from './AbilityActions';
import CastingTurnControls from './CastingTurnControls';
import {PendingContingency} from './ContingencyControls';
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
import LineageSummary from "./LineageSummary";
import RequiredChoice from "./RequiredChoice";
import { RulesSummary } from "./Rules2024Views";
import "./Rules2024.css";
import './CharacterCreation.css';

const SheetSpells = lazy(() => import('./SheetSpells'));
const sections = ['Actions', 'Checks', 'Inventory', 'Spells', 'Vitals and rest', 'Journal', 'Next Level'];

export default function PersistentSheet({ editing = false }) {
  const { characterId } = useParams();
  const { token, setCharacters } = useAuth();
  const [section, setSection] = useState(editing ? 'Journal' : 'Actions');
  const [journalEditing, setJournalEditing] = useState(editing);
  const [openedSpells, setOpenedSpells] = useState(false);
  function selectSection(nextSection) {
    if (nextSection === 'Spells') setOpenedSpells(true);
    setSection(nextSection);
  }
  const activeSection = section;
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
  const lineage = rules.creation.lineages?.find(entry => entry.id === summary.lineage?.id)?.name;
  const callingEntry = rules.callings.find(entry => entry.id === character.calling);
  const calling = callingEntry?.name;
  const nextFeatures = callingEntry?.progression?.find(row =>
    row.callingLevel === summary.callingLevels[character.calling] + 1)?.features ?? [];
  const paths = Object.values(summary.paths).map(id => rules.paths.find(entry => entry.id === id)?.name).filter(Boolean);
  const origin = rules.creation.origins.find(entry => entry.id === summary.originId)?.name ?? character.origin;
  const background = rules.creation.backgrounds.find(entry => entry.id === character.rulesLedger.creation?.backgroundId)?.name;
  const movement = Object.entries(summary.movement).filter(([, speed]) => typeof speed === 'number' && speed > 0);
  return <main className="sa-sheet rules-2024 character-creation">
    <div className="sa-sheet__hero">
      <CharacterPreview appearance={{ ...defaultAppearance, lineageId: summary.lineage?.id ?? null }}
        key={characterId} portraitUrl={character.portraitUrl} showIdentity={false} deferScene />
      <header className="sa-sheet__identity">
        <GameButton to="/characters">Your roster</GameButton>
        <p className="sa-sheet__calling">{[lineage, calling, ...paths].filter(Boolean).join(' · ')} · Level {summary.totalLevel}</p>
        <h1>{character.name}</h1>
        <p>{[origin, background, character.pronouns].filter(Boolean).join(' · ')}</p>
        <div className="sa-sheet__vitals">
          <ResourceBar label="Health" current={state.health.current} maximum={state.health.max} />
          {state.temporaryHealth > 0 && <small>+{state.temporaryHealth} temporary Health</small>}
          <button type="button" onClick={() => setSection('Vitals and rest')}>Manage vitals</button>
        </div>
        <dl className="sa-sheet__stats">
          {character.equipment?.guard != null && <div><dt>Guard</dt><dd>{character.equipment.guard}</dd></div>}
          {summary.initiative && <div><dt>Initiative</dt><dd>{summary.initiative.modifier >= 0 ? '+' : ''}{summary.initiative.modifier}</dd></div>}
          <div><dt>Training bonus</dt><dd>+{summary.trainingBonus}</dd></div>
          {movement.map(([mode, speed]) => <div key={mode}><dt>{displayName(mode)} speed</dt><dd>{speed} ft</dd></div>)}
        </dl>
        <div className="sa-sheet__readiness">
          {!character.equipment?.attacks?.length && <GameButton onClick={() => selectSection('Inventory')}>Equip a weapon</GameButton>}
          {(summary.spellSlots.some(Boolean) || summary.lineage?.spells?.some(spell => spell.unlocked)) && <GameButton onClick={() => selectSection('Spells')}>
            Spells{summary.spellSlots.some(Boolean) && ' · ' + state.slots.reduce((total, count) => total + count, 0) + ' / ' + summary.spellSlots.reduce((total, count) => total + count, 0) + ' slots'}
          </GameButton>}
        </div>
      </header>
    </div>
    <SectionTabs label="Character sheet sections" sections={sections} active={activeSection} onSelect={selectSection} />
    <CommandError message={error} fieldPath={errorDetails?.fieldPath} conflict={errorDetails?.status===409} busy={busy} onRefresh={refreshConflict}/>
    {pendingCommand&&!busy&&<button onClick={()=>command(null,null,pendingCommand)}>Retry interrupted command</button>}
    <OperationResult result={operationResult}/>
    <section className="sa-dossier sa-dossier--journal" hidden={activeSection !== "Journal"} aria-label="Journal">
    <div className="sa-dossier__heading">
      <h2>Journal</h2>
      {!journalEditing && <button type="button" onClick={() => setJournalEditing(true)}>Edit journal</button>}
    </div>
    <div className="sa-logbook">
      <article className="sa-logbook__page">
        <h3>{character.name}’s log</h3>
        {character.notes?.trim()
          ? <p className="sa-sheet__notes">{character.notes}</p>
          : <p>Record encounters, loose ends, and names worth remembering.</p>}
      </article>
      {journalEditing && <form className="sa-logbook__editor" onSubmit={async event => {
        event.preventDefault();
        const saved = await command('identity.patch', details);
        if (saved) setJournalEditing(false);
      }}>
        <fieldset disabled={busy || Boolean(pendingCommand)}>
          <legend>Edit journal</legend>
          <label>Session notes <textarea data-field-path="notes" rows={9} maxLength={5000}
            value={details.notes} onChange={event => setDetails({ ...details, notes: event.target.value })} /></label>
          <details><summary>Character identity</summary>
            <IdentityFields value={details} onChange={setDetails} nameLabel="Name" hideNotes />
          </details>
          <button type="submit">Save journal</button>
          <button type="button" onClick={() => setJournalEditing(false)}>Close editor</button>
        </fieldset>
      </form>}
    </div>
    <details><summary>Character management and activity</summary>
      <CharacterAuthorityControls character={character} rules={rules} busy={busy || Boolean(pendingCommand)} onCommand={command} />
      <RebuildControls key={'rebuild-' + characterId} character={character} rules={rules} busy={busy || Boolean(pendingCommand)} onCommand={command} />
      <AuditHistory key={characterId} loadPage={cursor => request(base + '/commands?limit=20' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : ''), { headers })} revision={character.documentRevision} />
    </details>
    <LineageSummary lineage={summary.lineage} state={state} rules={rules} />
    </section>
    <section className="sa-dossier sa-dossier--vitals" hidden={activeSection !== "Vitals and rest"} aria-label="Vitals and rest">
    <h2>Vitals and rest</h2>
    <div className="sa-vital-workspace">
    <div>
    <PersistentResources summary={summary} state={state} busy={busy} onOperation={resource} />
    </div>
    <div>
    <CharacterStateControls permissions={character.permissions} summary={summary} state={state} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    <RestPlanner key={state.restSession?state.restSession.id+':'+(state.restSession.interruptions?.length??0):String(state.worldTime)} summary={summary} state={state} draft={restDraft} busy={busy||Boolean(pendingCommand)} onCommand={command} onDismiss={()=>setRestDraft(null)}/>
    <RestSelections key={'rest-' + (state.restEpoch??'none')} character={character} rules={rules} busy={busy} onOperation={resource}/>
    </div>
    </div>
    </section>
    <section className="sa-dossier sa-dossier--actions" hidden={activeSection !== "Actions"} aria-label="Actions">
    <h2>Actions</h2>
    <div className="sa-combat-workspace">
    <section className="sa-sheet__weapons" aria-label="Weapon attacks">
      <h3>Weapon attacks</h3>
      {character.equipment?.attacks?.length ? <ul>{character.equipment.attacks.map(attack =>
        <li key={attack.instanceId}>
          <strong className="sa-weapon-name">{attack.name}</strong>
          <span className="sa-weapon-modifier"><b>{attack.attackModifier >= 0 ? '+' : ''}{attack.attackModifier}</b> to hit</span>
          <span>{attack.weapon.damage.count}d{attack.weapon.damage.sides}{attack.damageModifier ? (attack.damageModifier > 0 ? ' + ' : ' − ') + Math.abs(attack.damageModifier) : ''} {attack.damageTypeOptions.join(' or ')}</span>
          {attack.weapon.reachFeet > 0 && <span>{attack.weapon.reachFeet} ft reach</span>}
          {attack.weapon.rangeFeet && <span>{attack.weapon.rangeFeet.normal}/{attack.weapon.rangeFeet.long} ft range</span>}
          {attack.mastery && <small>Mastery · {displayName(attack.mastery)}</small>}
          {attack.requiresTwoHandGrip && <small>Requires a two-handed grip</small>}
          {attack.heavyDisadvantage && <small>Disadvantage from Heavy</small>}
          {!attack.requiresTwoHandGrip && <AttackRecords character={character} weapon={attack}
            busy={busy||Boolean(pendingCommand)} onCommand={command}/>}
        </li>)}</ul> : <p>Equip a weapon to see its attack and damage here.</p>}
      <GameButton onClick={() => setSection('Inventory')}>Manage equipped gear</GameButton>
    </section>
    <div className="sa-combat-workspace__abilities">
    <AbilityActions summary={summary} state={state} busy={busy||Boolean(pendingCommand)} onCommand={command} />
    </div>
    </div>
    <details className="sa-sheet__reference"><summary>Situational actions and table rulings</summary>
    <StrikeControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command} />
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
    <FeatControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command} />
    </details>
    <details><summary>Learned features and Training</summary>
      <RulesSummary summary={summary} rules={rules} title="Character reference" referenceOnly />
    </details>
    </section>
    {openedSpells && <Suspense fallback={activeSection === 'Spells' ? <p role="status">Loading spell controls.</p> : null}>
      <SheetSpells activeSection={activeSection} character={character} rules={rules}
        commandBusy={busy || Boolean(pendingCommand)} busy={busy} command={command} resource={resource} />
    </Suspense>}
    <section className="sa-dossier sa-dossier--inventory" hidden={activeSection !== "Inventory"} aria-label="Inventory">
    <h2>Inventory</h2>
    <PersistentEquipment expanded character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command}/>
    </section>
    <section hidden={activeSection !== "Checks"} aria-label="Checks">
      <RulesSummary summary={summary} rules={rules} title="Attributes and skills" equipment={character.equipment} playerChecks />
      <details><summary>Tool checks</summary>
        <ToolCheckControls character={character} rules={rules} busy={busy||Boolean(pendingCommand)} onCommand={command} />
      </details>
    </section>
    <section className="sa-dossier sa-dossier--advance" hidden={activeSection !== "Next Level"} aria-label="Next Level">
    <h2>Next Level</h2>
    <div className="sa-level-course">
      <div><span>Current level</span><strong>{summary.totalLevel}</strong><span>{[calling, ...paths].filter(Boolean).join(' · ')}</span></div>
      {summary.totalLevel < maximumCharacterLevel && <div><span>Next level</span><strong>{summary.totalLevel + 1}</strong><span>{calling}</span></div>}
    </div>
    <div className="sa-advancement-workspace">
    <div>
    {summary.totalLevel >= maximumCharacterLevel && <p>You have reached the maximum character level.</p>}
    {nextFeatures.length > 0 && <div><h3>Upcoming features</h3><ul className="sa-sheet__progression">{nextFeatures.map((feature, index) => <li key={index}>
      {feature.rules[0]?.description ? <details><summary>{feature.rules[0].name ?? feature.name}</summary><p>{feature.rules[0].description}</p></details>
        : feature.rules[0]?.name ?? feature.name}
    </li>)}</ul></div>}
    <details><summary>Advancement history</summary><ol>{character.rulesLedger.levels.map((level, i) => <li key={i}>
      Character level {i + 1}: {rules.callings.find(c => c.id === level.callingId)?.name}.
      {Object.entries(level.choices ?? {}).map(([key, value]) => <p key={key}>{choiceTitle(key)}{Array.isArray(value) && value.every(item => typeof item === 'string') ? ' · ' + value.map(id => displayName(id, rules)).join(', ') : typeof value === 'string' ? ' · ' + displayName(value, rules) : ''}</p>)}
    </li>)}</ol></details>
    <button disabled={busy} onClick={() => { setError(''); request(base, { headers }).then(setCharacter).catch(e => setError(e.message)); }}>Reload saved character</button>
    </div>
    <fieldset disabled={busy || Boolean(pendingCommand) || summary.totalLevel >= maximumCharacterLevel}>
      <legend>Advancement</legend>
      {!preview && <button onClick={() => act("preview", { callingId, choices: {} }, true)}>Preview next level</button>}
      {preview && <>
        <header className="sa-advancement-preview">
          <h3>Level {preview.totalLevel} preview</h3>
          <p>{preview.decisionsComplete ? 'Ready to review and save' : 'Complete the required choices below'}</p>
          <details><summary>Full character preview</summary>
            <RulesSummary summary={preview} rules={rules} title="Proposed next level" />
            <LineageSummary lineage={preview.lineage} rules={rules} headingId="advancement-lineage" />
          </details>
        </header>
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
    </div>
    </section>
  </main>;
}
import {maximumCharacterLevel} from '@crossworld/sanguine-engine/progression';
