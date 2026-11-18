import { choiceTitle, skillExamples } from '../../game/creator/choiceLabels';
import { callingRoles, creationStages, stageIndexFor, prerequisiteStage } from '../../game/creator/creationStages';
import { attributeModifier } from '@crossworld/sanguine-engine/attributes';
import { CatalogCards, FeatureCards, CallingPaths, CreatorReview, OriginCards, RuleDetails, TrainingOverview, CheckCards } from '../../game/creator/CreatorViews';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POINT_BUY_BUDGET, POINT_BUY_MINIMUM_SCORE, POINT_BUY_MAXIMUM_SCORE, calculatePointBuyCost } from '@crossworld/sanguine-engine/point-buy';
import { creationSizes, backgroundGoldAlternative, backgroundEquipmentEligible, maximumCreationScore,
  creationBackgroundIncreases, creationScores } from '@crossworld/sanguine-engine/progression';
import { useAuth } from '../../hooks/useAuth';
import { getCharacterRules, request } from '../../lib/api';
import { CallingProgression, LineageSummary, RequiredChoice, RulesSummary } from './Rules2024Views';
import { attributeNames } from './labels';
import IdentityFields from './IdentityFields';
import CommandError from './CommandError';
import { GameButton, GamePanel } from '../../game/ui/GameUI';
import CharacterPreview from '../../game/scene/CharacterPreview';
import { defaultAppearance } from '../../game/scene/appearance';
import LineageStep from '../../game/creator/LineageStep';
import { creationWithLineage, hasLineageChoices, lineageFields, splitLineageFields } from '../../game/creator/lineageChoices';
import './CharacterCreation.css';

const steps = ['Identity','Origin','Background','Calling','Attributes','Training','Abilities and feats','Equipment','Spells','Review'];
const lineageStep = 'Lineage';
const previewSteps = ['Training', 'Abilities and feats', 'Equipment', 'Spells', 'Review'];
const stepChoices = {
  Training: ['skills', 'backgroundSkills', 'backgroundTool', 'instrument', 'expertise', 'languages', 'callingLanguages', 'scholar', 'featTraining'],
  'Abilities and feats': ['mastery', 'style', 'divineOrder', 'initiateAttribute', 'initiateList'],
  Equipment: ['equipment'],
  Spells: ['cantrips', 'prepared', 'folio', 'initiateCantrips', 'initiateSpell', 'styleCantrips'],
};
const initialScores = { might:8, agility:15, resolve:15, wit:10, instinct:10, spirit:13 };

export default function CharacterCreation({ withLineage = false }) {
  const { token, setCharacters } = useAuth();
  const navigate = useNavigate();
  const [rules,setRules]=useState(null);
  const [step,setStep]=useState('Identity');
  const [completed, setCompleted] = useState([]);
  const [originGroup, setOriginGroup] = useState('');
  const [errorSection, setErrorSection] = useState(null);
  const [lineageId, setLineageId] = useState('');
  const [lineageChoices, setLineageChoices] = useState({});
  const [catalogAttempt, setCatalogAttempt] = useState(0);
  const heading = useRef(null);
  const [identity,setIdentity]=useState({name:'',notes:''});
  const [scores,setScores]=useState(initialScores);
  const [callingId,setCalling]=useState(withLineage ? '' : 'corsair');
  const [creation,setCreation]=useState({originId:withLineage ? '' : 'yuma-core',backgroundId:'deckhand',method:'point-buy',increases:{might:2},equipment:'pack',size:'medium'});
  const [split,setSplit]=useState(false);
  const [choices,setChoices]=useState({});
  const [pendingChoice, setPendingChoice] = useState(null);
  const [purchases,setPurchases]=useState([]),[purchaseId,setPurchaseId]=useState('dagger'),[purchaseQuantity,setPurchaseQuantity]=useState(1),[purchaseSpell,setPurchaseSpell]=useState('');
  const [summary,setSummary]=useState(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [errorPath,setErrorPath]=useState(null);
  const createAttempt=useRef(null);
  const saving = useRef(false);
  const lineage = rules?.creation.lineages?.find(entry => entry.id === lineageId);
  const fullCreation = withLineage ? creationWithLineage(creation, lineageId, lineageChoices) : creation;
  useEffect(() => { if (withLineage) heading.current?.focus(); }, [step, withLineage, rules]);
  const lineageOptions = lineage ? lineageFields(lineage, rules) : [];
  const { contextual: contextualFields, structural: structuralFields } = splitLineageFields(lineageOptions);
  const structuralValues = Object.fromEntries(structuralFields.map(({ key }) => [key, lineageChoices[key]]));
  const contextualComplete = hasLineageChoices(contextualFields, lineageChoices, rules);
  const headers={Authorization:`Bearer ${token}`};
  useEffect(() => {
    const controller = new AbortController();
    getCharacterRules(token, controller.signal)
      .then(result => { if (!controller.signal.aborted) setRules(result); })
      .catch(error => { if (!controller.signal.aborted) setError(error.message); });
    return () => controller.abort();
  }, [token, catalogAttempt]);
  function changeCreation(changes, resetChoices = true) {
    setCreation(previous => ({ ...previous, ...changes }));
    if (resetChoices && !withLineage) { setChoices({}); setPendingChoice(null); }
    setSummary(null);
    setError('');
    setErrorSection(null);
  }
  function invalidate(...sections) {
    setCompleted(previous => previous.filter(index => !sections.some(section => index === stageIndexFor(section))));
    setSummary(null);
  }

  function clearChoices(keys) {
    setChoices(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => !keys.includes(key))));
    setPendingChoice(previous => keys.includes(previous?.key) ? null : previous);
  }

  function clearBackgroundChoices() {
    clearChoices(['backgroundSkills', 'backgroundTool', 'instrument', 'featTraining',
      'initiateAttribute', 'initiateList', 'initiateCantrips', 'initiateSpell', 'expertise', 'scholar']);
    invalidate('Training', 'Abilities and feats', 'Equipment', 'Review');
  }

  function clearExpertise() {
    clearChoices(['expertise', 'scholar']);
    invalidate('Training', 'Review');
  }

  function customChange(key, value) {
    const custom = { ...creation.custom, [key]: value };
    if (withLineage && key !== 'attributes') clearBackgroundChoices();
    const kept = Object.keys(creation.increases).filter(id => custom.attributes.includes(id));
    const [first, second] = [...new Set([...kept, ...custom.attributes])];
    if (!second) setSplit(false);
    changeCreation({ custom, ...(first && {
      increases: creationBackgroundIncreases(first, second, split && Boolean(second)),
    }) });
  }
  function reportError(e, action){
    if (withLineage) {
      const field = e.fieldPath ?? '';
      const section = /^creation\.lineage\.choices\.(skill|originFeat)/.test(field) ? 'Training'
        : field.startsWith('creation.lineage') ? 'Lineage'
        : field.startsWith('purchases') || field === 'firstLevel.choices.equipment' ? 'Equipment'
        : field.startsWith('creation.origin') ? 'Origin'
        : field.startsWith('creation.background') || field.startsWith('creation.custom') ? 'Background'
        : field.startsWith('attributes') || field.startsWith('baseAttributes') ? 'Attributes'
        : ['name', 'pronouns', 'appearance', 'portraitUrl', 'notes'].includes(field) ? 'Identity' : null;
      const detail = field.startsWith('creation.lineage.choices.skill')
        ? 'Choose Lineage Training you do not already receive from your Calling, Background, or feat.'
        : field.startsWith('creation.lineage.choices.originFeat')
          ? 'Check your Lineage Origin feat for duplicate feats, Training, or spell lists.'
          : e.message;
      setError(action + ' failed. ' + (e.status ? detail : 'The server could not be reached. Try again.'));
      setErrorSection(section);
      setErrorPath(section && stageIndexFor(section) === stageIndexFor(step) ? e.fieldPath : null);
      return;
    }
    setError(e.message);setErrorPath(e.fieldPath);
    const field=e.fieldPath??'';
    if(['name','pronouns','appearance','portraitUrl','notes'].includes(field))setStep('Identity');
    else if(field.startsWith('purchases')||field==='firstLevel.choices.equipment')setStep('Equipment');
    else if(field.startsWith('attributes')||field.startsWith('baseAttributes'))setStep('Attributes');
    else if(field.startsWith('creation.origin'))setStep('Origin');
    else if(field.startsWith('creation.background')||field.startsWith('creation.custom')||field.startsWith('creation.increases'))setStep('Background');
    else if(field==='firstLevel.callingId')setStep('Calling');
  }
  async function preview(nextChoices = choices, nextPurchases = [], includeLineage = step === 'Review' || completed.includes(stageIndexFor('Training')), draftCreation = creation, draftLineage = lineageChoices) {
    const previewCreation = draft => request('/archipelago/characters/preview', {
      method: 'POST', headers,
      body: JSON.stringify({
        attributes: scores, creation: draft,
        firstLevel: { callingId, choices: nextChoices }, purchases: nextChoices.equipment?.length ? nextPurchases : [],
      }),
    });
    // The server resolves ordinary Training first. Expertise can then use Lineage Training.
    const useFullCreation = !withLineage || includeLineage || Boolean(nextChoices.expertise || nextChoices.scholar);
    setBusy(true);
    setError('');
    setErrorSection(null);
    setErrorPath(null);
    try {
      const lineageCreation = creationWithLineage(draftCreation, lineageId, draftLineage);
      let result = await previewCreation(!withLineage ? draftCreation : useFullCreation
        ? lineageCreation : creationWithLineage(draftCreation, lineageId, structuralValues));
      const nextTraining = result.requiredChoices.find(choice => stepChoices.Training.includes(choice.key));
      setChoices(nextChoices);
      setSummary(result);
      if (!useFullCreation && contextualComplete && ['expertise', 'scholar'].includes(nextTraining?.key)) {
        result = await previewCreation(lineageCreation);
        setSummary(result);
      }
      return result;
    } catch (error) {
      reportError(error, 'Rules check');
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);setError('');setErrorSection(null);setErrorPath(null);
    try {
      const body=JSON.stringify({
        ...identity,attributes:scores,creation:fullCreation,firstLevel:{callingId,choices},purchases,
      });
      if(createAttempt.current?.body!==body)createAttempt.current={body,operationId:crypto.randomUUID()};
      const result=await request('/archipelago/characters',{method:'POST',headers:{...headers,'Idempotency-Key':createAttempt.current.operationId},body});
      setCharacters(old=>[result,...old.filter(c=>c._id!==result._id)]);navigate('/characters/'+result._id);
    } catch(e) {reportError(e, 'Save');} finally {saving.current = false;setBusy(false);}
  }
  if (withLineage && (!rules || !rules.creation.lineages?.length)) return <main className="sa-creator">
    <GamePanel title="Character Creator">
      <p role={error || rules ? 'alert' : 'status'}>{error || (rules ? 'This server does not offer Lineage creation yet.' : 'Loading character rules.')}</p>
      {error && <GameButton onClick={() => { setError(''); setCatalogAttempt(value => value + 1); }}>Retry catalog</GameButton>}
      <GameButton to="/characters/new">Open current creator</GameButton>
    </GamePanel>
  </main>;
  if(!rules)return <main className="page-shell"><p role={error?'alert':'status'}>{error||'Loading character rules…'}</p></main>;
  const background=rules.creation.backgrounds.find(b=>b.id===creation.backgroundId);
  const origin=rules.creation.origins.find(o=>o.id===creation.originId);
  const calling=rules.callings.find(c=>c.id===callingId);
  const eligibleAttributes=background.id==='custom'?creation.custom.attributes:background.attributes;
  let usedPoints;
  try {
    usedPoints=calculatePointBuyCost(scores);
  } catch (error) {
    if (!(error instanceof TypeError || error instanceof RangeError)) throw error;
  }
  const firstAttribute=Object.keys(creation.increases)[0];
  const secondAttribute=Object.keys(creation.increases)[1]??eligibleAttributes.find(a=>a!==firstAttribute);
  const requiredChoice=step==='Review'?summary?.requiredChoices.find(choice => !choice.id.startsWith('creation.lineage')):summary?.requiredChoices.find(c=>stepChoices[step]?.includes(c.key));
  function increases(first, second, isSplit = split) {
    const alternate = second === first ? eligibleAttributes.find(id => id !== first) : second;
    changeCreation({ increases: creationBackgroundIncreases(first, alternate, isSplit) });
  }
  const stageIndex = stageIndexFor(step);
  const stage = creationStages[stageIndex];
  const position = steps.indexOf(step);
  const active = name => withLineage ? stage.steps.includes(name) : step === name;
  const usesPreview = withLineage ? stage.steps.some(name => previewSteps.includes(name)) : previewSteps.includes(step);
  const displayedChoice = withLineage && step !== 'Review'
    ? summary?.requiredChoices.find(choice => stage.steps.some(name => stepChoices[name]?.includes(choice.key)) &&
      (contextualComplete || !['expertise', 'scholar'].includes(choice.key)))
    : requiredChoice;
  const attributes = withLineage && origin && usedPoints !== undefined
    ? creationScores(scores, origin.attribute, Object.keys(attributeNames), eligibleAttributes, creation.increases)
    : null;

  function selectBackground(id) {
    if (id === background.id) return;
    if (withLineage) clearBackgroundChoices();
    const entry = rules.creation.backgrounds.find(item => item.id === id);
    setSplit(false);
    changeCreation({
      backgroundId: id, increases: { [entry.attributes[0]]: 2 },
      equipment: id === 'custom' ? 'gold' : 'pack',
      custom: id === 'custom' ? {
        attributes: ['might', 'agility', 'resolve'], skills: ['athletics', 'survival'],
        tool: rules.creation.tools[0], feat: 'alert',
      } : undefined,
    });
  }

  function selectOrigin(id) {
    const language = rules.creation.origins.find(entry => entry.id === id)?.language;
    if (language && choices.languages?.includes(language)) {
      clearChoices(['languages', 'callingLanguages']);
      invalidate('Training', 'Review');
    } else if (language && choices.callingLanguages?.includes(language)) {
      clearChoices(['callingLanguages']);
      invalidate('Training', 'Review');
    }
    changeCreation({ originId: id }, false);
  }

  function selectCalling(id) {
    if (id === callingId) return;
    setCalling(id);
    if (withLineage) {
      clearChoices(Object.keys(choices).filter(key => !['languages', 'instrument', 'initiateList', 'initiateAttribute', 'initiateCantrips', 'initiateSpell'].includes(key)));
      invalidate('Training', 'Abilities and feats', 'Equipment', 'Review');
    } else setChoices({});
    setPendingChoice(null);
    setSummary(null);
  }

  function editCallingSkills() {
    const { skills, backgroundSkills, featTraining, expertise, scholar, ...unrelated } = choices;
    void backgroundSkills;
    void featTraining;
    void expertise;
    void scholar;
    invalidate('Training', 'Review');
    setPendingChoice({ id: callingId + ':1:skills', key: 'skills', selected: skills });
    preview(unrelated, [], false);
  }

  function adjustScore(id, increment) {
    setScores(previous => ({ ...previous, [id]: previous[id] + increment }));
    setError('');
    if (!withLineage) {
      setPendingChoice(null);
      setSummary(null);
      setChoices({});
    }
  }
  function goTo(next) {
    setError('');
    setErrorPath(null);
    setErrorSection(null);
    setStep(next);
  }

  const trainingStage = stageIndexFor('Training');
  function missingFor(index) {
    const sections = creationStages[index].steps;
    if (sections.includes('Identity') && identity.name.trim().length < 2)
      return 'Enter a character name with at least two characters.';
    if (sections.includes('Lineage')) {
      if (!lineage) return 'Choose a Lineage.';
      const fields = structuralFields;
      if (!hasLineageChoices(fields, structuralValues, rules)) {
        const missing = fields.filter(field => !hasLineageChoices([field], lineageChoices, rules));
        return 'Complete ' + (missing.map(field => field.label.toLowerCase()).join(', ') || 'your Lineage feat options') + '.';
      }
    }
    if (sections.includes('Origin') && !origin)
      return originGroup === 'archipelago' ? 'Choose your island.' : 'Choose where your character comes from.';
    if (sections.includes('Background') && background.id === 'custom' &&
        (creation.custom.attributes.length !== 3 || creation.custom.skills.length !== 2))
      return 'Choose three eligible attributes and two Background skills.';
    if (sections.includes('Calling') && !calling) return 'Choose a Calling.';
    if (sections.includes('Attributes') && (usedPoints === undefined || usedPoints > POINT_BUY_BUDGET || attributes?.error))
      return attributes?.error || 'Set all six base scores within the point-buy range and budget.';
    return '';
  }

  const prerequisites = withLineage ? creationStages.map((_, index) => missingFor(index)) : [];
  const blockerFor = index => prerequisiteStage(prerequisites, completed, index);

  async function openStage(index) {
    const next = creationStages[index].steps[0];
    goTo(next);
    if (index >= trainingStage && (!summary || next === 'Review')) {
      await preview(choices, index >= stageIndexFor('Equipment') ? purchases : [], index > trainingStage);
    }
  }

  async function continueDraft() {
    if (prerequisites[stageIndex]) {
      setError(prerequisites[stageIndex]);
      return;
    }
    if (usesPreview) {
      if (stageIndex === trainingStage && !contextualComplete &&
          (!displayedChoice || ['expertise', 'scholar'].includes(displayedChoice.key))) {
        setError('Complete your Lineage Training and Origin feat options.');
        return;
      }
      const result = await preview(choices, active('Equipment') ? purchases : [], stageIndex > trainingStage);
      if (!result) return;
      const required = result.requiredChoices.find(choice => stage.steps.some(name => stepChoices[name]?.includes(choice.key)));
      if (required) {
        const selected = pendingChoice?.id === required.id ? pendingChoice.selected : required.requiredOptions ?? [];
        const name = choiceTitle(required.key);
        const remaining = required.count - selected.length;
        setError(remaining > 0 ? 'Choose ' + remaining + ' more for ' + name + '.' : 'Confirm your selection for ' + name + '.');
        return;
      }
      if (stageIndex === trainingStage && !(await preview(choices, [], true))) return;
      if (active('Spells') && !result.decisionsComplete) {
        const unresolved = result.requiredChoices[0];
        const section = Object.keys(stepChoices).find(name => stepChoices[name].includes(unresolved?.key));
        setErrorSection(section ?? (unresolved?.id.startsWith('creation.lineage') ? 'Training' : null));
        setError(unresolved ? 'Complete ' + choiceTitle(unresolved.key) + ' before saving.' : 'Review the starting choices before saving.');
        return;
      }
    }
    setCompleted(previous => [...new Set([...previous, stageIndex])]);
    await openStage(stageIndex + 1);
  }

  const legacyHeader = <>
    <header className="character-creation__hero"><p>Sanguine Archipelago</p><h1>Create your character</h1>
      <p>Choose your roots, discipline and equipment. Your origin never restricts your Calling or Path.</p></header>
    <nav aria-label="Character creation steps" className="character-creation__nav">{steps.map((name,index)=><button key={name}
      aria-current={step===name?'step':undefined} onClick={()=>setStep(name)} disabled={busy}>{index+1}. {name}</button>)}</nav>
    <CommandError message={error} fieldPath={errorPath}/>
  </>;
  const customAttributeOptions = Object.entries(attributeNames).map(([id, name]) => ({ id, name }));
  const backgroundAttributeOptions = customAttributeOptions.filter(entry => eligibleAttributes.includes(entry.id));
  const content = <section aria-invalid={withLineage && Boolean(error) || undefined} className={withLineage ? 'sa-creator__surface' : 'character-creation__surface'} aria-label={withLineage ? stage.title : step}>
      <h2 ref={heading} tabIndex={withLineage ? -1 : undefined}>{withLineage ? stage.title : (position + 1) + '. ' + step}</h2>
      <fieldset disabled={busy}>
        {step===lineageStep && <LineageStep rules={rules} lineage={lineage} values={lineageChoices}
          fields={structuralFields} onSelect={id => { setLineageId(id); setLineageChoices({}); setPendingChoice(null); clearExpertise(); setSummary(null); setError(''); }}
          onChange={(key, value) => {
            setLineageChoices(previous => ({ ...previous, [key]: value }));
            if (['skill', 'skills', 'originFeat'].includes(key)) clearExpertise();
            setSummary(null);
            setError('');
          }} />}
        {active('Identity')&&<><IdentityFields value={identity} onChange={value => { setIdentity(value); if (withLineage) setError(''); }} storyOnly={withLineage}/>
          {!withLineage && <><label>Size <select value={creation.size} onChange={e=>changeCreation({size:e.target.value})}>{creationSizes.map(size=><option key={size} value={size}>{size==='medium'?'Medium':'Small'}</option>)}</select></label>
          <p>Humanoid; base walking Speed 30 feet. Narrative notes impose no automatic penalties.</p></>}</>}
        {active('Origin')&&<>{withLineage ? <OriginCards origins={rules.creation.origins} group={originGroup}
          origin={origin} onGroup={(group, id) => {
            setOriginGroup(group);
            selectOrigin(id);
          }} onIsland={selectOrigin} /> : (<label>Origin <select value={creation.originId} onChange={e=>changeCreation({originId:e.target.value})}>
          {rules.creation.origins.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>)}
          {origin && <><p>{origin.lore}</p><p>Origin grants +1 {attributeNames[origin.attribute]} and the local language.</p></>}</>}
        {active('Background')&&<>{withLineage ? <CatalogCards label="Background" entries={rules.creation.backgrounds} value={creation.backgroundId}
          onChange={selectBackground} describe={entry => rules.feats.find(feat => feat.id === entry.feat)?.name} />
          : <label>Background <select value={creation.backgroundId} onChange={e => selectBackground(e.target.value)}>
            {rules.creation.backgrounds.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>}
          <p>Background grants two skills, one tool, an Origin feat and a total of +2 attributes.</p>
          {background.id==='custom'?<>
            {withLineage ? <>
              <CheckCards label="Eligible Background attributes" count={3} entries={customAttributeOptions}
                selected={creation.custom.attributes} onChange={value => customChange('attributes', value)} />
              <CheckCards label="Background skills" count={2} entries={rules.skills}
                selected={creation.custom.skills} onChange={value => customChange('skills', value)}
                describe={skill => attributeNames[skill.attribute] + ' · ' + skillExamples[skill.id]} />
            </> : <>
            <label>Three eligible attributes <select multiple value={creation.custom.attributes} onChange={e=>customChange('attributes',Array.from(e.target.selectedOptions,o=>o.value))}>
              {Object.entries(attributeNames).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
            <label>Two background skills <select multiple value={creation.custom.skills} onChange={e=>customChange('skills',Array.from(e.target.selectedOptions,o=>o.value))}>
              {rules.skills.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
            </>}
            <label>Tool <select value={creation.custom.tool} onChange={e=>customChange('tool',e.target.value)}>{rules.creation.tools.map(id=><option key={id} value={id}>{id.replaceAll('-',' ')}</option>)}</select></label>
            <label>Origin feat <select value={creation.custom.feat} onChange={e=>customChange('feat',e.target.value)}>{rules.feats.filter(f=>f.category==='origin').map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></label>
          </>:<><p>Skills: {background.skills.map(id=>rules.skills.find(s=>s.id===id).name).join(', ')}.</p><p>Tool: {background.tool}. Feat: {rules.feats.find(f=>f.id===background.feat).name}.</p></>}
          <label><input type="checkbox" checked={split} onChange={e=>{setSplit(e.target.checked);increases(firstAttribute,secondAttribute,e.target.checked);}}/>Split +1 between two attributes</label>
          {withLineage ? <>
            <CatalogCards label={split ? 'First +1 bonus' : 'Apply +2 to'} entries={backgroundAttributeOptions}
              value={firstAttribute} onChange={id => increases(id, secondAttribute)} />
            {split && <CatalogCards label="Second +1 bonus" value={secondAttribute}
              entries={backgroundAttributeOptions.filter(entry => entry.id !== firstAttribute)}
              onChange={id => increases(firstAttribute, id)} />}
          </> : <>
          <label>First attribute <select value={firstAttribute} onChange={e=>increases(e.target.value,secondAttribute)}>{eligibleAttributes.map(id=><option key={id} value={id}>{attributeNames[id]}</option>)}</select></label>
          {split&&<label>Second attribute <select value={secondAttribute} onChange={e=>increases(firstAttribute,e.target.value)}>{eligibleAttributes.map(id=><option key={id} value={id} disabled={id===firstAttribute}>{attributeNames[id]}</option>)}</select></label>}
          </>}
        </>}
        {active('Calling')&&<>{withLineage && <p>Your Calling determines your starting abilities and Training. Each Calling offers four Paths starting at Calling level 3.</p>}{withLineage ? <CatalogCards label="Calling" entries={rules.callings} value={callingId}
          onChange={selectCalling} describe={entry => callingRoles[entry.id]} />
          : <label>Calling <select value={callingId} onChange={e => selectCalling(e.target.value)}>
            {rules.callings.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>}
          {withLineage ? calling && <><h3>Starting features</h3><FeatureCards calling={calling} />
            <CallingPaths calling={calling} rules={rules} /></> :
            <details><summary>Calling progression and four Paths</summary><CallingProgression calling={calling} rules={rules}/></details>}</>}
        {active('Attributes')&&<><p>Point buy: {usedPoints===undefined?'enter valid base scores':`${usedPoints} / ${POINT_BUY_BUDGET}`}. Base scores {POINT_BUY_MINIMUM_SCORE}–{POINT_BUY_MAXIMUM_SCORE}; final creation maximum {maximumCreationScore}.</p>
          {withLineage ? <div className="sa-attribute-grid">
            {Object.entries(attributeNames).map(([id, name]) => {
              const score = attributes?.scores?.[id];
              const modifier = score === undefined ? null : attributeModifier(score);
              return <section className="sa-attribute" key={id}>
                <RuleDetails title={name}>{name} checks and saves use this modifier. The final score includes your Origin and Background bonuses.</RuleDetails>
                <div>
                  <GameButton aria-label={'Lower ' + name} disabled={scores[id] <= POINT_BUY_MINIMUM_SCORE}
                    onClick={() => adjustScore(id, -1)}>−</GameButton>
                  <output aria-label={name + ' base score'}>{scores[id]}</output>
                  <GameButton aria-label={'Raise ' + name} disabled={scores[id] >= POINT_BUY_MAXIMUM_SCORE ||
                    calculatePointBuyCost({ ...scores, [id]: scores[id] + 1 }) > POINT_BUY_BUDGET}
                    onClick={() => adjustScore(id, 1)}>+</GameButton>
                </div>
                <small>{score === undefined ? 'Check bonuses' : score + ' final · ' + (modifier >= 0 ? '+' : '') + modifier + ' modifier'}</small>
              </section>;
            })}
          </div> : <div className="character-creation__attributes">{Object.entries(attributeNames).map(([id,name])=><label key={id}>{name}<input type="number" min={POINT_BUY_MINIMUM_SCORE} max={POINT_BUY_MAXIMUM_SCORE} value={scores[id]} onChange={e=>{setScores({...scores,[id]:Number(e.target.value)});setSummary(null);setChoices({});}}/></label>)}</div>}
          {withLineage && <p role="status">{attributes?.error || (POINT_BUY_BUDGET - usedPoints) + " points remaining"}</p>}
          <p>Origin +1 {attributeNames[origin.attribute]}; background {Object.entries(creation.increases).map(([id,n])=>`+${n} ${attributeNames[id]}`).join(', ')}.</p></>}
        {active('Training') && (withLineage
          ? <TrainingOverview rules={rules} background={background} creation={creation} choices={choices} summary={summary}
              onEditCallingSkills={choices.skills && !displayedChoice ? editCallingSkills : undefined} />
          : <p>Select Calling skills first, then retain background skills and replace duplicates.</p>)}
        {active('Abilities and feats') && <><h3>Starting features</h3><FeatureCards calling={calling} />
          <p>Origin feat: {rules.feats.find(feat => feat.id === (creation.custom?.feat ?? background.feat))?.name}.</p>
          <details><summary>Future features by level</summary><FeatureCards calling={calling} future /></details></>}
        {active('Equipment')&&<>{withLineage ? <CatalogCards label="Background equipment" value={creation.equipment}
          onChange={equipment => { changeCreation({ equipment }, false); preview(choices, purchases, false, { ...creation, equipment }); }}
          entries={[
            ...(backgroundEquipmentEligible(background.id, 'pack') ? [{ id: 'pack', name: 'Background package' }] : []),
            { id: 'gold', name: backgroundGoldAlternative + ' GP' },
          ]} describe={entry => entry.id === 'pack' ? background.items?.join(', ') : 'Buy starting gear below'} />
          : (<label>Background equipment <select value={creation.equipment} onChange={e=>changeCreation({equipment:e.target.value}, !withLineage)}>
          {backgroundEquipmentEligible(background.id,'pack')&&<option value="pack">Background package</option>}<option value="gold">{backgroundGoldAlternative} GP</option></select></label>)}
          <p>Choose a Calling equipment package or its gold alternative in the required selections below. Gear begins carried; equip it on your saved sheet.</p></>}
        {active('Equipment')&&<details className="sa-outfitter"><summary>Buy starting gear</summary><fieldset><legend>Optional starting purchases</legend><label>Starting item to buy <select value={purchaseId} onChange={e=>setPurchaseId(e.target.value)}>{rules.equipment.items.filter(i=>Number.isSafeInteger(i.costCp)&&!i.magic).map(i=><option key={i.id} value={i.id}>{i.name}: {i.costCp} copper{i.units?` per ${i.units}`:''}</option>)}</select></label>{rules.equipment.items.find(d=>d.id===purchaseId)?.purchaseScrollLevel!==undefined&&<label>Starting scroll spell <select value={purchaseSpell} onChange={e=>setPurchaseSpell(e.target.value)}><option value="">Choose exact spell</option>{rules.spells.filter(s=>s.level===rules.equipment.items.find(d=>d.id===purchaseId).purchaseScrollLevel).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}<label>Starting purchase quantity <input type="number" min={1} max={100000} value={purchaseQuantity} onChange={e=>setPurchaseQuantity(Number(e.target.value))}/></label><button disabled={!choices.equipment||!Number.isSafeInteger(purchaseQuantity)||purchaseQuantity<1} onClick={()=>{const next=[...purchases,{definitionId:purchaseId,quantity:purchaseQuantity,...(rules.equipment.items.find(d=>d.id===purchaseId)?.purchaseScrollLevel!==undefined?{spellId:purchaseSpell}:{})}];setPurchases(next);setSummary(null);preview(choices,next);}}>Add starting purchase and validate price</button><ul>{purchases.map((p,i)=><li key={i}>{rules.equipment.items.find(d=>d.id===p.definitionId)?.name}: {p.quantity}<button onClick={()=>{const next=purchases.filter((_,index)=>index!==i);setPurchases(next);setSummary(null);preview(choices,next);}}>Remove purchase {i+1}</button></li>)}</ul><p>The server validates the entire basket against both starting balances; invalid purchases block saving.</p></fieldset></details>}

        {usesPreview&&<>{(!withLineage || !summary) && <button type="button" onClick={()=>preview(choices, active('Equipment') || active('Review') ? purchases : [])} disabled={usedPoints===undefined||usedPoints>POINT_BUY_BUDGET}>Refresh choices</button>}
          {displayedChoice&&<RequiredChoice key={displayedChoice.id} rules={rules} choice={displayedChoice} tiles={withLineage}
            initialSelected={pendingChoice?.id === displayedChoice.id ? pendingChoice.selected : undefined}
            onDraftChange={selected => setPendingChoice({ id: displayedChoice.id, key: displayedChoice.key, selected })}
            onChange={async changes => {
              if (await preview({ ...choices, ...changes }, !withLineage || active('Equipment') ? purchases : [], withLineage && stageIndex > trainingStage)) setPendingChoice(null);
            }}/>}
          {withLineage && active('Training') && contextualFields.length > 0 && summary &&
            (!displayedChoice || ['expertise', 'scholar'].includes(displayedChoice.key)) &&
            <LineageStep rules={rules} lineage={lineage} values={lineageChoices} contextual
              fields={contextualFields} excludedFeat={creation.custom?.feat ?? background.feat}
              excludedSkills={summary.training?.filter(id => !summary.lineage?.trainedSkills?.includes(id) &&
                !summary.lineage?.originFeat?.options?.training?.includes('skill:' + id))}
              onChange={(key, value) => {
                const next = { ...lineageChoices, [key]: value };
                setLineageChoices(next);
                clearChoices(['expertise', 'scholar']);
                setCompleted(previous => previous.filter(index => index !== trainingStage));
                setError('');
                const { expertise, scholar, ...otherChoices } = choices;
                void expertise;
                void scholar;
                if (hasLineageChoices(contextualFields, next, rules)) {
                  preview(otherChoices, [], true, creation, next);
                }
              }} />}
          {summary && (active('Review') || !withLineage) && <p role="status">{summary.decisionsComplete ? 'All required selections are complete.' : `${summary.requiredChoices.length} required selections remain.`}</p>}
        </>}
        {(active('Equipment') || active('Review')) && summary?.creationEquipment && (
          <section className={withLineage ? 'sa-kit' : undefined}>
            <h3>Starting kit</h3>
            <p>{summary.creationEquipment.goldCp} copper available</p>
            <ul>{summary.creationEquipment.items.map((item, index) =>
              <li key={index}>{item.name} × {item.quantity}</li>)}</ul>
          </section>
        )}
        {active('Review')&&<><p>{identity.name||'Unnamed character'} — {lineage && lineage.name + ', '}{origin.name}, {background.name}, {calling.name} level 1.</p>
          {summary?.lineage && <LineageSummary lineage={summary.lineage} rules={rules} />}
          {summary && (withLineage
            ? <CreatorReview summary={summary} rules={rules} identity={identity} calling={calling}
                choices={choices} spellKeys={stepChoices.Spells} />
            : <RulesSummary summary={summary} rules={rules} title="Review character"/> )}
          {withLineage && summary && !summary.decisionsComplete && <ul className="sa-review-errors">
            {summary.requiredChoices.map(choice => {
              const section = Object.keys(stepChoices).find(name => stepChoices[name].includes(choice.key)) ?? 'Training';
              return <li key={choice.id}><GameButton onClick={() => openStage(stageIndexFor(section))}>
                Complete {choiceTitle(choice.key)}
              </GameButton></li>;
            })}
          </ul>}
          <button type="button" data-create={withLineage || undefined} disabled={!summary?.decisionsComplete||identity.name.trim().length<2} onClick={save}>Save character</button></>}
      </fieldset>
    </section>;

  if (withLineage) return <main className="sa-creator">
    <header className="sa-creator__header">
      <h1>Create your character</h1>
      <GameButton to="/characters">Your roster</GameButton>
    </header>
    <div className="sa-creator__body">
      <aside className="sa-creator__aside">
        <CharacterPreview name={identity.name} lineage={lineage?.name} calling={calling?.name}
          appearance={{ ...defaultAppearance, lineageId: lineageId || null }} />
      </aside>
      <GamePanel className="sa-creator__decisions">
        <nav aria-label="Character creation stages">
          <ol className="sa-steps">{creationStages.map(({ title }, index) => {
            const blocker = blockerFor(index);
            const status = index === stageIndex ? 'Current' : blocker >= 0 ? 'Requires ' + creationStages[blocker].title
              : !prerequisites[index] && (index < trainingStage || completed.includes(index)) ? 'Complete' : 'Available';
            return <li key={title}>
              <GameButton disabled={busy} aria-disabled={blocker >= 0 || undefined}
                aria-current={index === stageIndex ? 'step' : undefined}
                onClick={() => { if (blocker < 0) openStage(index); }}>
                {title}<small>{status}</small>
              </GameButton>
            </li>;
          })}</ol>
        </nav>
        <CommandError message={error} fieldPath={errorPath}/>
        {errorSection && stageIndexFor(errorSection) !== stageIndex && blockerFor(stageIndexFor(errorSection)) < 0 &&
          <GameButton onClick={() => openStage(stageIndexFor(errorSection))}>Go to {errorSection}</GameButton>}
        {content}
        <footer className="sa-actions">
          <GameButton disabled={busy || stageIndex === 0}
            onClick={() => openStage(stageIndex - 1)}>Back</GameButton>
          {step !== 'Review' && <GameButton disabled={busy} onClick={continueDraft}>Continue</GameButton>}
        </footer>
      </GamePanel>
    </div>
  </main>;

  return <main className="page-shell character-creation">
    {legacyHeader}
    {content}
    <footer className="character-creation__footer"><button disabled={busy||step==='Identity'} onClick={()=>setStep(steps[position - 1])}>Back</button>
      <span>Step {position + 1} of {steps.length}</span><button disabled={busy||step==='Review'} onClick={()=>setStep(steps[position + 1])}>Continue</button></footer>
  </main>;
}
