import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { request } from '../../lib/api';
import { CallingProgression, RequiredChoice, RulesSummary } from './Rules2024Views';
import { attributeNames } from './labels';
import IdentityFields from './IdentityFields';
import CommandError from './CommandError';
import './CharacterCreation.css';

const steps = ['Identity','Origin','Background','Calling','Attributes','Training','Abilities and feats','Equipment','Spells','Review'];
const initialScores = { might:8, agility:15, resolve:15, wit:10, instinct:10, spirit:13 };
const pointCosts = {8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9};

export default function CharacterCreation() {
  const { token, setCharacters } = useAuth();
  const navigate = useNavigate();
  const [rules,setRules]=useState(null);
  const [step,setStep]=useState(0);
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
  const headers={Authorization:`Bearer ${token}`};
  useEffect(()=>{let active=true;request('/archipelago/system/character-rules?version=SA-CHAR-1',{headers:{Authorization:`Bearer ${token}`}})
    .then(result=>{if(active)setRules(result);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[token]);
  function changeCreation(changes) { setCreation({...creation,...changes});setChoices({});setSummary(null);setError(''); }
  function customChange(key,value) {changeCreation({custom:{...creation.custom,[key]:value}});}
  function reportError(e){
    setError(e.message);setErrorPath(e.fieldPath);
    const field=e.fieldPath??'';
    if(['name','pronouns','appearance','portraitUrl','notes'].includes(field))setStep(0);
    else if(field.startsWith('purchases')||field==='firstLevel.choices.equipment')setStep(7);
    else if(field.startsWith('attributes')||field.startsWith('baseAttributes'))setStep(4);
    else if(field.startsWith('creation.origin'))setStep(1);
    else if(field.startsWith('creation.background')||field.startsWith('creation.custom'))setStep(2);
    else if(field==='firstLevel.callingId')setStep(3);
  }
  async function preview(nextChoices=choices,nextPurchases=purchases) {
    setBusy(true);setError('');
    try {
      const result=await request('/archipelago/characters/preview',{method:'POST',headers,
        body:JSON.stringify({attributes:scores,creation,firstLevel:{callingId,choices:nextChoices},purchases:nextPurchases})});
      setChoices(nextChoices);setSummary(result);
    } catch(e) {reportError(e);} finally {setBusy(false);}
  }
  async function save() {
    setBusy(true);setError('');
    try {
      const body=JSON.stringify({
        ...identity,attributes:scores,creation,firstLevel:{callingId,choices},purchases,
      });
      if(createAttempt.current?.body!==body)createAttempt.current={body,operationId:crypto.randomUUID()};
      const result=await request('/archipelago/characters',{method:'POST',headers:{...headers,'Idempotency-Key':createAttempt.current.operationId},body});
      setCharacters(old=>[result,...old.filter(c=>c._id!==result._id)]);navigate('/characters/'+result._id);
    } catch(e) {reportError(e);} finally {setBusy(false);}
  }
  if(!rules)return <main className="page-shell"><p role={error?'alert':'status'}>{error||'Loading character rules…'}</p></main>;
  const background=rules.creation.backgrounds.find(b=>b.id===creation.backgroundId);
  const origin=rules.creation.origins.find(o=>o.id===creation.originId);
  const calling=rules.callings.find(c=>c.id===callingId);
  const eligibleAttributes=background.id==='custom'?creation.custom.attributes:background.attributes;
  const usedPoints=Object.values(scores).reduce((sum,score)=>sum+(pointCosts[score]??100),0);
  const firstAttribute=Object.keys(creation.increases)[0];
  const secondAttribute=Object.keys(creation.increases)[1]??eligibleAttributes.find(a=>a!==firstAttribute);
  const stepChoices={5:['skills','backgroundSkills','backgroundTool','instrument','expertise','languages','callingLanguages'],6:['mastery','style','divineOrder','featTraining','initiateAttribute','initiateList'],7:['equipment'],8:['cantrips','prepared','folio','initiateCantrips','initiateSpell','styleCantrips']};
  const requiredChoice=step===9?summary?.requiredChoices[0]:summary?.requiredChoices.find(c=>stepChoices[step]?.includes(c.key));
  function increases(first,second,isSplit=split){changeCreation({increases:isSplit?{[first]:1,[second]:1}:{[first]:2}});}
  return <main className="page-shell character-creation">
    <header className="character-creation__hero"><p>Sanguine Archipelago</p><h1>Create your character</h1>
      <p>Choose your roots, discipline and equipment. Your origin never restricts your Calling or Path.</p></header>
    <nav aria-label="Character creation steps" className="character-creation__nav">{steps.map((name,index)=><button key={name}
      aria-current={step===index?'step':undefined} onClick={()=>setStep(index)} disabled={busy}>{index+1}. {name}</button>)}</nav>
    <CommandError message={error} fieldPath={errorPath}/>
    <section className="character-creation__surface" aria-label={steps[step]}>
      <h2>{step+1}. {steps[step]}</h2>
      <fieldset disabled={busy}>
        {step===0&&<><IdentityFields value={identity} onChange={setIdentity}/>
          <label>Size <select value={creation.size} onChange={e=>changeCreation({size:e.target.value})}><option value="medium">Medium</option><option value="small">Small</option></select></label>
          <p>Humanoid; base walking Speed 30 feet. Narrative notes impose no automatic penalties.</p></>}
        {step===1&&<><label>Origin <select value={creation.originId} onChange={e=>changeCreation({originId:e.target.value})}>
          {rules.creation.origins.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
          <p>{origin.summary}</p><p>{origin.lore}</p><p>+1 {attributeNames[origin.attribute]}; cultural language: {origin.name}.</p></>}
        {step===2&&<><label>Background <select value={creation.backgroundId} onChange={e=>{
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
        {step===3&&<><label>Calling <select value={callingId} onChange={e=>{setCalling(e.target.value);setChoices({});setSummary(null);}}>{rules.callings.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <details><summary>Calling progression and four Paths</summary><CallingProgression calling={calling} rules={rules}/></details><p>Your Path is selected at level 3.</p></>}
        {step===4&&<><p>Point buy: {usedPoints} / 27. Base scores 8–15; final creation maximum 17.</p>
          <div className="character-creation__attributes">{Object.entries(attributeNames).map(([id,name])=><label key={id}>{name}<input type="number" min={8} max={15} value={scores[id]} onChange={e=>{setScores({...scores,[id]:Number(e.target.value)});setSummary(null);setChoices({});}}/></label>)}</div>
          <p>Origin +1 {attributeNames[origin.attribute]}; background {Object.entries(creation.increases).map(([id,n])=>`+${n} ${attributeNames[id]}`).join(', ')}.</p></>}
        {step===5&&<p>Select Calling skills first, then retain background skills and replace duplicates. Training and Expertise are calculated by the server.</p>}
        {step===6&&<p>Resolve all required feat subchoices, languages and class abilities below. Passive grants apply automatically.</p>}
        {step===7&&<><label>Background equipment <select value={creation.equipment} onChange={e=>changeCreation({equipment:e.target.value})}>
          {background.id!=='custom'&&<option value="pack">Background package</option>}<option value="gold">50 GP</option></select></label>
          <p>Choose a Calling equipment package or its gold alternative in the required selections below. Gear begins carried; equip it on your saved sheet.</p></>}
        {step===7&&<fieldset><legend>Optional starting purchases</legend><label>Starting item to buy <select value={purchaseId} onChange={e=>setPurchaseId(e.target.value)}>{rules.equipment.items.filter(i=>Number.isSafeInteger(i.costCp)&&!i.magic).map(i=><option key={i.id} value={i.id}>{i.name}: {i.costCp} copper{i.units?` per ${i.units}`:''}</option>)}</select></label>{rules.equipment.items.find(d=>d.id===purchaseId)?.purchaseScrollLevel!==undefined&&<label>Starting scroll spell <select value={purchaseSpell} onChange={e=>setPurchaseSpell(e.target.value)}><option value="">Choose exact spell</option>{rules.spells.filter(s=>s.level===rules.equipment.items.find(d=>d.id===purchaseId).purchaseScrollLevel).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}<label>Starting purchase quantity <input type="number" min={1} max={100000} value={purchaseQuantity} onChange={e=>setPurchaseQuantity(Number(e.target.value))}/></label><button disabled={!choices.equipment||!Number.isSafeInteger(purchaseQuantity)||purchaseQuantity<1} onClick={()=>{const next=[...purchases,{definitionId:purchaseId,quantity:purchaseQuantity,...(rules.equipment.items.find(d=>d.id===purchaseId)?.purchaseScrollLevel!==undefined?{spellId:purchaseSpell}:{})}];setPurchases(next);setSummary(null);preview(choices,next);}}>Add starting purchase and validate price</button><ul>{purchases.map((p,i)=><li key={i}>{rules.equipment.items.find(d=>d.id===p.definitionId)?.name}: {p.quantity}<button onClick={()=>{const next=purchases.filter((_,index)=>index!==i);setPurchases(next);setSummary(null);preview(choices,next);}}>Remove purchase {i+1}</button></li>)}</ul><p>The server validates the entire basket against both starting balances; invalid purchases block saving.</p></fieldset>}
        {step===8&&<p>Select the exact number of eligible cantrips and preparations. Shipwrights also choose six initial folio spells. Feature spells do not consume ordinary preparation count.</p>}
        {step>=5&&<><button type="button" onClick={()=>preview()} disabled={usedPoints>27}>Validate choices and preview</button>
          {requiredChoice&&<RequiredChoice key={requiredChoice.id} rules={rules} choice={requiredChoice}
            onChange={changes=>preview({...choices,...changes})}/>}
          {summary&&<p role="status">{summary.decisionsComplete?'All required selections are complete.':`${summary.requiredChoices.length} required selections remain.`}</p>}
        </>}
        {step===9&&<><p>{identity.name||'Unnamed character'} — {origin.name}, {background.name}, {calling.name} level 1.</p>
          {summary?.creationEquipment&&<><p>Starting copper after purchases: {summary.creationEquipment.goldCp}.</p><ul>{summary.creationEquipment.items.map((i,index)=><li key={index}>{i.name}: {i.quantity}</li>)}</ul></>}
          {summary&&<RulesSummary summary={summary} rules={rules} title="Review character"/>}
          <button type="button" disabled={!summary?.decisionsComplete||identity.name.trim().length<2} onClick={save}>Save character</button></>}
      </fieldset>
    </section>
    <footer className="character-creation__footer"><button disabled={busy||step===0} onClick={()=>setStep(step-1)}>Back</button>
      <span>Step {step+1} of {steps.length}</span><button disabled={busy||step===9} onClick={()=>setStep(step+1)}>Continue</button></footer>
  </main>;
}
