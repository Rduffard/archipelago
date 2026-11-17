import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POINT_BUY_BUDGET, POINT_BUY_MINIMUM_SCORE, POINT_BUY_MAXIMUM_SCORE, calculatePointBuyCost } from '@crossworld/sanguine-engine/point-buy';
import { creationSizes, backgroundGoldAlternative, backgroundEquipmentEligible, maximumCreationScore,
  creationBackgroundIncreases } from '@crossworld/sanguine-engine/progression';
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
const lineageSteps = [steps[0], lineageStep, ...steps.slice(1)];
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
    if (resetChoices) setChoices({});
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
  function customChange(key,value) {changeCreation({custom:{...creation.custom,[key]:value}});}
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
    else if(field.startsWith('creation.background')||field.startsWith('creation.custom'))setStep('Background');
    else if(field==='firstLevel.callingId')setStep('Calling');
  }
  async function preview(nextChoices = choices, nextPurchases = purchases, includeLineage = step === 'Review') {
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
      let result = await previewCreation(useFullCreation ? fullCreation : creationWithLineage(creation, lineageId, {}));
      setChoices(nextChoices);
      if (!useFullCreation && (step === 'Attributes' || step === 'Training') &&
          result.requiredChoices.find(choice => stepChoices.Training.includes(choice.key))?.key === 'expertise') {
        result = await previewCreation(fullCreation);
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
  function increases(first,second,isSplit=split){changeCreation({increases:creationBackgroundIncreases(first,second,isSplit)});}
  const stepOrder = withLineage ? lineageSteps : steps;
  const position = stepOrder.indexOf(step);
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
    if (step === 'Attributes' && (usedPoints === undefined || usedPoints > POINT_BUY_BUDGET)) {
      setError('Set all six base scores within the point-buy range and budget.');
      return;
    }
    const next = stepOrder[position + 1];
    if (previewSteps.includes(next)) {
      const result = await preview(choices, purchases, next === 'Review');
      if (!result) return;
      if (next !== 'Review' && result.requiredChoices.some(choice => stepChoices[step]?.includes(choice.key))) {
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
  const content = <section className={withLineage ? 'sa-creator__surface' : 'character-creation__surface'} aria-label={step}>
      <h2 ref={heading} tabIndex={withLineage ? -1 : undefined}>{withLineage ? step : (position + 1) + '. ' + step}</h2>
      <fieldset disabled={busy}>
        {step===lineageStep && <LineageStep rules={rules} lineage={lineage} values={lineageChoices}
          onSelect={id => { setLineageId(id); setLineageChoices({}); clearExpertise(); setSummary(null); setError(''); }}
          onChange={(key, value) => {
            setLineageChoices(previous => ({ ...previous, [key]: value }));
            if (['skill', 'skills', 'originFeat'].includes(key)) clearExpertise();
            setSummary(null);
            setError('');
          }} />}
        {step==='Identity'&&<><IdentityFields value={identity} onChange={setIdentity}/>
          {!withLineage && <><label>Size <select value={creation.size} onChange={e=>changeCreation({size:e.target.value})}>{creationSizes.map(size=><option key={size} value={size}>{size==='medium'?'Medium':'Small'}</option>)}</select></label>
          <p>Humanoid; base walking Speed 30 feet. Narrative notes impose no automatic penalties.</p></>}</>}
        {step==='Origin'&&<><label>Origin <select value={creation.originId} onChange={e=>changeCreation({originId:e.target.value})}>
          {rules.creation.origins.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
          <p>{origin.summary}</p><p>{origin.lore}</p><p>+1 {attributeNames[origin.attribute]}; cultural language: {origin.name}.</p></>}
        {step==='Background'&&<><label>Background <select value={creation.backgroundId} onChange={e=>{
          const b=rules.creation.backgrounds.find(b=>b.id===e.target.value);setSplit(false);
          changeCreation({backgroundId:b.id,increases:{[b.attributes[0]]:2},equipment:b.id==='custom'?'gold':'pack',
            ...(b.id==='custom'?{custom:{attributes:['might','agility','resolve'],skills:['athletics','survival'],tool:rules.creation.tools[0],feat:'alert'}}:{custom:undefined})});
        }}>{rules.creation.backgrounds.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
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
        {step==='Calling'&&<><label>Calling <select value={callingId} onChange={e=>{setCalling(e.target.value);setChoices({});setSummary(null);}}>{rules.callings.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <details><summary>Calling progression and four Paths</summary><CallingProgression calling={calling} rules={rules}/></details><p>Your Path is selected at level 3.</p></>}
        {step==='Attributes'&&<><p>Point buy: {usedPoints===undefined?'enter valid base scores':`${usedPoints} / ${POINT_BUY_BUDGET}`}. Base scores {POINT_BUY_MINIMUM_SCORE}–{POINT_BUY_MAXIMUM_SCORE}; final creation maximum {maximumCreationScore}.</p>
          <div className="character-creation__attributes">{Object.entries(attributeNames).map(([id,name])=><label key={id}>{name}<input type="number" min={POINT_BUY_MINIMUM_SCORE} max={POINT_BUY_MAXIMUM_SCORE} value={scores[id]} onChange={e=>{setScores({...scores,[id]:Number(e.target.value)});setSummary(null);setChoices({});}}/></label>)}</div>
          <p>Origin +1 {attributeNames[origin.attribute]}; background {Object.entries(creation.increases).map(([id,n])=>`+${n} ${attributeNames[id]}`).join(', ')}.</p></>}
        {step==='Training'&&<p>Select Calling skills first, then retain background skills and replace duplicates. Training and Expertise are calculated by the server.</p>}
        {step==='Abilities and feats'&&<p>Resolve all required feat subchoices, languages and class abilities below. Passive grants apply automatically.</p>}
        {step==='Equipment'&&<><label>Background equipment <select value={creation.equipment} onChange={e=>changeCreation({equipment:e.target.value}, !withLineage)}>
          {backgroundEquipmentEligible(background.id,'pack')&&<option value="pack">Background package</option>}<option value="gold">{backgroundGoldAlternative} GP</option></select></label>
          <p>Choose a Calling equipment package or its gold alternative in the required selections below. Gear begins carried; equip it on your saved sheet.</p></>}
        {step==='Equipment'&&<fieldset><legend>Optional starting purchases</legend><label>Starting item to buy <select value={purchaseId} onChange={e=>setPurchaseId(e.target.value)}>{rules.equipment.items.filter(i=>Number.isSafeInteger(i.costCp)&&!i.magic).map(i=><option key={i.id} value={i.id}>{i.name}: {i.costCp} copper{i.units?` per ${i.units}`:''}</option>)}</select></label>{rules.equipment.items.find(d=>d.id===purchaseId)?.purchaseScrollLevel!==undefined&&<label>Starting scroll spell <select value={purchaseSpell} onChange={e=>setPurchaseSpell(e.target.value)}><option value="">Choose exact spell</option>{rules.spells.filter(s=>s.level===rules.equipment.items.find(d=>d.id===purchaseId).purchaseScrollLevel).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}<label>Starting purchase quantity <input type="number" min={1} max={100000} value={purchaseQuantity} onChange={e=>setPurchaseQuantity(Number(e.target.value))}/></label><button disabled={!choices.equipment||!Number.isSafeInteger(purchaseQuantity)||purchaseQuantity<1} onClick={()=>{const next=[...purchases,{definitionId:purchaseId,quantity:purchaseQuantity,...(rules.equipment.items.find(d=>d.id===purchaseId)?.purchaseScrollLevel!==undefined?{spellId:purchaseSpell}:{})}];setPurchases(next);setSummary(null);preview(choices,next);}}>Add starting purchase and validate price</button><ul>{purchases.map((p,i)=><li key={i}>{rules.equipment.items.find(d=>d.id===p.definitionId)?.name}: {p.quantity}<button onClick={()=>{const next=purchases.filter((_,index)=>index!==i);setPurchases(next);setSummary(null);preview(choices,next);}}>Remove purchase {i+1}</button></li>)}</ul><p>The server validates the entire basket against both starting balances; invalid purchases block saving.</p></fieldset>}
        {step==='Spells'&&<p>Select the exact number of eligible cantrips and preparations. Shipwrights also choose six initial folio spells. Feature spells do not consume ordinary preparation count.</p>}
        {previewSteps.includes(step)&&<><button type="button" onClick={()=>preview()} disabled={usedPoints===undefined||usedPoints>POINT_BUY_BUDGET}>Validate choices and preview</button>
          {requiredChoice&&<RequiredChoice key={requiredChoice.id} rules={rules} choice={requiredChoice}
            onChange={changes=>preview({...choices,...changes})}/>}
          {summary&&<p role="status">{summary.decisionsComplete?'All required selections are complete.':`${summary.requiredChoices.length} required selections remain.`}</p>}
        </>}
        {step==='Review'&&<><p>{identity.name||'Unnamed character'} — {lineage && lineage.name + ', '}{origin.name}, {background.name}, {calling.name} level 1.</p>
          {summary?.creationEquipment&&<><p>Starting copper after purchases: {summary.creationEquipment.goldCp}.</p><ul>{summary.creationEquipment.items.map((i,index)=><li key={index}>{i.name}: {i.quantity}</li>)}</ul></>}
          {summary?.lineage && <LineageSummary lineage={summary.lineage} rules={rules} />}
          {summary&&<RulesSummary summary={summary} rules={rules} title="Review character"/>}
          <button type="button" disabled={!summary?.decisionsComplete||identity.name.trim().length<2} onClick={save}>Save character</button></>}
      </fieldset>
    </section>;

  if (withLineage) return <main className="sa-creator">
    <header className="sa-creator__header">
      <div><h1>Character Creator</h1><p>Step {position + 1} of {stepOrder.length}</p></div>
      <GameButton to="/characters">Your roster</GameButton>
    </header>
    <nav aria-label="Character creation steps">
      <ol className="sa-steps">{stepOrder.map((id, index) => <li key={id}>
        <GameButton disabled={busy || index > position}
          aria-current={id === step ? 'step' : undefined} onClick={() => goTo(id)}>
          {id}
        </GameButton>
      </li>)}</ol>
    </nav>
    <div className="sa-creator__body">
      <GamePanel>
        <CommandError message={error} fieldPath={errorPath}/>
        {content}
        <footer className="sa-actions">
          <GameButton disabled={busy || position === 0} onClick={() => goTo(stepOrder[position - 1])}>Back</GameButton>
          {step !== 'Review' && <GameButton disabled={busy} onClick={continueDraft}>Continue</GameButton>}
        </footer>
      </GamePanel>
      <aside className="sa-creator__aside">
        <CharacterPreview name={identity.name} appearance={{ ...defaultAppearance, lineageId: lineageId || null }} />
      </aside>
    </div>
  </main>;

  return <main className="page-shell character-creation">
    {legacyHeader}
    {content}
    <footer className="character-creation__footer"><button disabled={busy||step==='Identity'} onClick={()=>setStep(steps[position - 1])}>Back</button>
      <span>Step {position + 1} of {steps.length}</span><button disabled={busy||step==='Review'} onClick={()=>setStep(steps[position + 1])}>Continue</button></footer>
  </main>;
}
