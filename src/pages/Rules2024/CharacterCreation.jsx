import { callingRoles, creationStages, stageIndexFor } from '../../game/creator/creationStages';
import { attributeModifier } from '@crossworld/sanguine-engine/attributes';
import { CatalogCards, FeatureCards, CallingPaths, CreatorReview } from '../../game/creator/CreatorViews';
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
import { creationWithLineage, hasLineageChoices, lineageFields } from '../../game/creator/lineageChoices';
import './CharacterCreation.css';

const steps = ['Identity','Origin','Background','Calling','Attributes','Training','Abilities and feats','Equipment','Spells','Review'];
const lineageStep = 'Lineage';
const previewSteps = ['Training', 'Abilities and feats', 'Equipment', 'Spells', 'Review'];
const stepChoices = {
  Training: ['skills', 'backgroundSkills', 'backgroundTool', 'instrument', 'expertise', 'languages', 'callingLanguages'],
  'Abilities and feats': ['mastery', 'style', 'divineOrder', 'featTraining', 'initiateAttribute', 'initiateList'],
  Equipment: ['equipment'],
  Spells: ['cantrips', 'prepared', 'folio', 'initiateCantrips', 'initiateSpell', 'styleCantrips'],
};
const initialScores = { might:8, agility:15, resolve:15, wit:10, instinct:10, spirit:13 };

export default function CharacterCreation({ withLineage = false }) {
  const { token, setCharacters } = useAuth();
  const navigate = useNavigate();
  const [rules,setRules]=useState(null);
  const [step,setStep]=useState('Identity');
  const [lineageId, setLineageId] = useState('');
  const [lineageChoices, setLineageChoices] = useState({});
  const [catalogAttempt, setCatalogAttempt] = useState(0);
  const heading = useRef(null);
  const [identity,setIdentity]=useState({name:'',notes:''});
  const [scores,setScores]=useState(initialScores);
  const [callingId,setCalling]=useState('corsair');
  const [creation,setCreation]=useState({originId:'yuma-core',backgroundId:'deckhand',method:'point-buy',increases:{might:2},equipment:'pack',size:'medium'});
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
  const headers={Authorization:`Bearer ${token}`};
  useEffect(()=>{let active=true;getCharacterRules(token)
    .then(result=>{if(active)setRules(result);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[token,catalogAttempt]);
  function changeCreation(changes, resetChoices = true) {
    setCreation({ ...creation, ...changes });
    if (resetChoices) { setChoices({}); setPendingChoice(null); }
    setSummary(null);
    setError('');
  }
  function clearExpertise() {
    setChoices(previous => {
      if (!previous.expertise) return previous;
      const next = { ...previous };
      delete next.expertise;
      return next;
    });
  }

  function customChange(key, value) {
    const custom = { ...creation.custom, [key]: value };
    const kept = Object.keys(creation.increases).filter(id => custom.attributes.includes(id));
    const [first, second] = [...new Set([...kept, ...custom.attributes])];
    if (!second) setSplit(false);
    changeCreation({ custom, ...(first && {
      increases: creationBackgroundIncreases(first, second, split && Boolean(second)),
    }) });
  }
  function reportError(e){
    setError(e.message);setErrorPath(e.fieldPath);
    const field=e.fieldPath??'';
    if(['name','pronouns','appearance','portraitUrl','notes'].includes(field))setStep('Identity');
    else if(withLineage && field.startsWith('creation.lineage')) {
      setStep(lineageStep);
      if (field.includes('.skill')) setError('Choose Lineage Training you do not already receive from your Calling or Background.');
      if (field.includes('.originFeat')) setError('Choose an eligible Origin feat and complete its options. Check for duplicate Training or feats.');
    }
    else if(field.startsWith('purchases')||field==='firstLevel.choices.equipment')setStep('Equipment');
    else if(field.startsWith('attributes')||field.startsWith('baseAttributes'))setStep('Attributes');
    else if(field.startsWith('creation.origin'))setStep('Origin');
    else if(field.startsWith('creation.background')||field.startsWith('creation.custom')||field.startsWith('creation.increases'))setStep('Background');
    else if(field==='firstLevel.callingId')setStep('Calling');
  }
  async function preview(nextChoices = choices, nextPurchases = purchases, includeLineage = step === 'Review', draftCreation = creation) {
    const previewCreation = draft => request('/archipelago/characters/preview', {
      method: 'POST', headers,
      body: JSON.stringify({
        attributes: scores, creation: draft,
        firstLevel: { callingId, choices: nextChoices }, purchases: nextPurchases,
      }),
    });
    // The server resolves ordinary Training first. Expertise can then use Lineage Training.
    const useFullCreation = !withLineage || includeLineage || Boolean(nextChoices.expertise);
    setBusy(true);
    setError('');
    try {
      const lineageCreation = creationWithLineage(draftCreation, lineageId, lineageChoices);
      let result = await previewCreation(!withLineage ? draftCreation : useFullCreation
        ? lineageCreation : creationWithLineage(draftCreation, lineageId, {}));
      setChoices(nextChoices);
      if (!useFullCreation && (step === 'Calling' || step === 'Attributes' || step === 'Training') &&
          result.requiredChoices.find(choice => stepChoices.Training.includes(choice.key))?.key === 'expertise') {
        result = await previewCreation(lineageCreation);
      }
      setSummary(result);
      return result;
    } catch (error) {
      reportError(error);
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);setError('');
    try {
      const body=JSON.stringify({
        ...identity,attributes:scores,creation:fullCreation,firstLevel:{callingId,choices},purchases,
      });
      if(createAttempt.current?.body!==body)createAttempt.current={body,operationId:crypto.randomUUID()};
      const result=await request('/archipelago/characters',{method:'POST',headers:{...headers,'Idempotency-Key':createAttempt.current.operationId},body});
      setCharacters(old=>[result,...old.filter(c=>c._id!==result._id)]);navigate('/characters/'+result._id);
    } catch(e) {reportError(e);} finally {saving.current = false;setBusy(false);}
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
    ? summary?.requiredChoices.find(choice => stage.steps.some(name => stepChoices[name]?.includes(choice.key)))
    : requiredChoice;
  const attributes = withLineage && usedPoints !== undefined
    ? creationScores(scores, origin.attribute, Object.keys(attributeNames), eligibleAttributes, creation.increases)
    : null;

  function selectBackground(id) {
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

  function selectCalling(id) {
    setCalling(id);
    setChoices({});
    setPendingChoice(null);
    setSummary(null);
  }

  function adjustScore(id, increment) {
    setScores({ ...scores, [id]: scores[id] + increment });
    setPendingChoice(null);
    setSummary(null);
    setChoices({});
  }
  function goTo(next) {
    setError('');
    setErrorPath(null);
    setStep(next);
  }

  async function continueDraft() {
    if (step === 'Identity' && identity.name.trim().length < 2) {
      setError('Enter a character name with at least two characters.');
      return;
    }
    if (step === lineageStep && (!lineage || !hasLineageChoices(lineageFields(lineage, rules), lineageChoices, rules))) {
      setError('Choose a Lineage and complete its starting selections.');
      return;
    }
    if (active('Background') && background.id === 'custom' &&
        (creation.custom.attributes.length !== 3 || creation.custom.skills.length !== 2)) {
      setError('Choose three eligible attributes and two Background skills.');
      return;
    }
    if (active('Attributes') && (usedPoints === undefined || usedPoints > POINT_BUY_BUDGET || attributes?.error)) {
      setError(attributes?.error || 'Set all six base scores within the point-buy range and budget.');
      return;
    }
    const nextStage = creationStages[stageIndex + 1];
    const next = nextStage.steps[0];
    if (usesPreview || nextStage.steps.some(name => previewSteps.includes(name))) {
      const result = await preview(choices, purchases, next === 'Review');
      if (!result) return;
      if (result.requiredChoices.some(choice => stage.steps.some(name => stepChoices[name]?.includes(choice.key)))) {
        setError('Complete the required selection on this step to continue.');
        return;
      }
      if (next === 'Review' && result.requiredChoices.some(choice => choice.id.startsWith('creation.lineage'))) {
        setStep(lineageStep);
        setError('Complete the remaining Lineage and Origin feat choices before reviewing.');
        return;
      }
    }
    goTo(next);
  }

  const legacyHeader = <>
    <header className="character-creation__hero"><p>Sanguine Archipelago</p><h1>Create your character</h1>
      <p>Choose your roots, discipline and equipment. Your origin never restricts your Calling or Path.</p></header>
    <nav aria-label="Character creation steps" className="character-creation__nav">{steps.map((name,index)=><button key={name}
      aria-current={step===name?'step':undefined} onClick={()=>setStep(name)} disabled={busy}>{index+1}. {name}</button>)}</nav>
    <CommandError message={error} fieldPath={errorPath}/>
  </>;
  const content = <section className={withLineage ? 'sa-creator__surface' : 'character-creation__surface'} aria-label={withLineage ? stage.title : step}>
      <h2 ref={heading} tabIndex={withLineage ? -1 : undefined}>{withLineage ? stage.title : (position + 1) + '. ' + step}</h2>
      <fieldset disabled={busy}>
        {step===lineageStep && <LineageStep rules={rules} lineage={lineage} values={lineageChoices}
          onSelect={id => { setLineageId(id); setLineageChoices({}); setPendingChoice(null); clearExpertise(); setSummary(null); setError(''); }}
          onChange={(key, value) => {
            setLineageChoices(previous => ({ ...previous, [key]: value }));
            if (['skill', 'skills', 'originFeat'].includes(key)) clearExpertise();
            setSummary(null);
            setError('');
          }} />}
        {active('Identity')&&<><IdentityFields value={identity} onChange={setIdentity} storyOnly={withLineage}/>
          {!withLineage && <><label>Size <select value={creation.size} onChange={e=>changeCreation({size:e.target.value})}>{creationSizes.map(size=><option key={size} value={size}>{size==='medium'?'Medium':'Small'}</option>)}</select></label>
          <p>Humanoid; base walking Speed 30 feet. Narrative notes impose no automatic penalties.</p></>}</>}
        {active('Origin')&&<>{withLineage ? <CatalogCards label="Origin" entries={rules.creation.origins} value={creation.originId}
          onChange={id => changeCreation({ originId: id })} describe={entry => entry.summary} /> : (<label>Origin <select value={creation.originId} onChange={e=>changeCreation({originId:e.target.value})}>
          {rules.creation.origins.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>)}
          <p>{origin.summary}</p><p>{origin.lore}</p><p>+1 {attributeNames[origin.attribute]}; cultural language: {origin.name}.</p></>}
        {active('Background')&&<>{withLineage ? <CatalogCards label="Background" entries={rules.creation.backgrounds} value={creation.backgroundId}
          onChange={selectBackground} describe={entry => rules.feats.find(feat => feat.id === entry.feat)?.name} />
          : <label>Background <select value={creation.backgroundId} onChange={e => selectBackground(e.target.value)}>
            {rules.creation.backgrounds.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>}
          <p>Background grants two skills, one tool, an Origin feat and a total of +2 attributes.</p>
          {background.id==='custom'?<>
            <label>Three eligible attributes <select multiple value={creation.custom.attributes} onChange={e=>customChange('attributes',Array.from(e.target.selectedOptions,o=>o.value))}>
              {Object.entries(attributeNames).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
            <label>Two background skills <select multiple value={creation.custom.skills} onChange={e=>customChange('skills',Array.from(e.target.selectedOptions,o=>o.value))}>
              {rules.skills.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
            <label>Tool <select value={creation.custom.tool} onChange={e=>customChange('tool',e.target.value)}>{rules.creation.tools.map(id=><option key={id} value={id}>{id.replaceAll('-',' ')}</option>)}</select></label>
            <label>Origin feat <select value={creation.custom.feat} onChange={e=>customChange('feat',e.target.value)}>{rules.feats.filter(f=>f.category==='origin').map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></label>
          </>:<><p>Skills: {background.skills.map(id=>rules.skills.find(s=>s.id===id).name).join(', ')}.</p><p>Tool: {background.tool}. Feat: {rules.feats.find(f=>f.id===background.feat).name}.</p></>}
          <label><input type="checkbox" checked={split} onChange={e=>{setSplit(e.target.checked);increases(firstAttribute,secondAttribute,e.target.checked);}}/>Split +1 between two attributes</label>
          <label>First attribute <select value={firstAttribute} onChange={e=>increases(e.target.value,secondAttribute)}>{eligibleAttributes.map(id=><option key={id} value={id}>{attributeNames[id]}</option>)}</select></label>
          {split&&<label>Second attribute <select value={secondAttribute} onChange={e=>increases(firstAttribute,e.target.value)}>{eligibleAttributes.map(id=><option key={id} value={id} disabled={id===firstAttribute}>{attributeNames[id]}</option>)}</select></label>}
        </>}
        {active('Calling')&&<>{withLineage ? <CatalogCards label="Calling" entries={rules.callings} value={callingId}
          onChange={selectCalling} describe={entry => callingRoles[entry.id]} />
          : <label>Calling <select value={callingId} onChange={e => selectCalling(e.target.value)}>
            {rules.callings.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>}
          {withLineage ? <><h3>Starting features</h3><FeatureCards calling={calling} />
            <CallingPaths calling={calling} rules={rules} /></> :
            <details><summary>Calling progression and four Paths</summary><CallingProgression calling={calling} rules={rules}/></details>}</>}
        {active('Attributes')&&<><p>Point buy: {usedPoints===undefined?'enter valid base scores':`${usedPoints} / ${POINT_BUY_BUDGET}`}. Base scores {POINT_BUY_MINIMUM_SCORE}–{POINT_BUY_MAXIMUM_SCORE}; final creation maximum {maximumCreationScore}.</p>
          {withLineage ? <div className="sa-attribute-grid">
            {Object.entries(attributeNames).map(([id, name]) => {
              const score = attributes?.scores?.[id];
              const modifier = score === undefined ? null : attributeModifier(score);
              return <section className="sa-attribute" key={id}>
                <h3>{name}</h3>
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
        {active('Training')&&<p>Select Calling skills first, then retain background skills and replace duplicates. Training and Expertise are calculated by the server.</p>}
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

        {usesPreview&&<>{(!withLineage || !summary) && <button type="button" onClick={()=>preview()} disabled={usedPoints===undefined||usedPoints>POINT_BUY_BUDGET}>Refresh choices</button>}
          {displayedChoice&&<RequiredChoice key={displayedChoice.id} rules={rules} choice={displayedChoice} tiles={withLineage}
            initialSelected={pendingChoice?.id === displayedChoice.id ? pendingChoice.selected : undefined}
            onDraftChange={selected => setPendingChoice({ id: displayedChoice.id, selected })}
            onChange={async changes => {
              if (await preview({ ...choices, ...changes })) setPendingChoice(null);
            }}/>}
          {summary&&<p role="status">{summary.decisionsComplete?'All required selections are complete.':`${summary.requiredChoices.length} required selections remain.`}</p>}
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
        <CharacterPreview name={identity.name} lineage={lineage?.name} calling={calling.name}
          appearance={{ ...defaultAppearance, lineageId: lineageId || null }} />
      </aside>
      <GamePanel className="sa-creator__decisions">
        <nav aria-label="Character creation stages">
          <ol className="sa-steps">{creationStages.map(({ title, steps: sections }, index) => <li key={title}>
            <GameButton aria-label={title} title={title} disabled={busy || index > stageIndex}
              aria-current={index === stageIndex ? 'step' : undefined} onClick={() => goTo(sections[0])}>
              <span aria-hidden="true" />
            </GameButton>
          </li>)}</ol>
        </nav>
        <CommandError message={error} fieldPath={errorPath}/>
        {content}
        <footer className="sa-actions">
          <GameButton disabled={busy || stageIndex === 0}
            onClick={() => goTo(creationStages[stageIndex - 1].steps[0])}>Back</GameButton>
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
