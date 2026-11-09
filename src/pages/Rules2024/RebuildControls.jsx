import {useState} from 'react';
import {RequiredChoice,RulesSummary} from './Rules2024Views';
import {attributeNames} from './labels';
export default function RebuildControls({character,rules,busy,onCommand}){
  const proposal=character.rulesRuntime.rebuildProposal,isOwner=character.permissions?.isOwner!==false;
  const [ledger,setLedger]=useState(()=>structuredClone(proposal?.ledger??character.rulesLedger)),[reason,setReason]=useState(proposal?.reason??''),[review,setReview]=useState(null),[dirty,setDirty]=useState(false),[accepted,setAccepted]=useState(false);
  const targetLevel=character.rulesLedger.levels.length,shown=review??(proposal?{...character.rebuildReview,proposalId:proposal.proposalId,complete:true}:null);
  function edit(next){setLedger(next);setDirty(true);setReview(null);setAccepted(false);}
  function restart(changes={}){const next={...ledger,...changes};next.levels=[{callingId:next.levels[0].callingId,choices:{}}];edit(next);}
  async function preview(next=ledger){setLedger(next);setAccepted(false);const response=await onCommand('rebuild.preview',{ledger:next,reason});if(response){setLedger(response.operationResult.draftLedger);setReview(response.operationResult);setDirty(false);}}
  const requirement=shown?.summary?.requiredChoices?.[0];
  const background=rules.creation.backgrounds.find(b=>b.id===ledger.creation.backgroundId),backgroundAttributes=background.id==='custom'?ledger.creation.custom.attributes:background.attributes;
  function creationChange(changes){restart({creation:{...ledger.creation,...changes}});}
  return <details className="character-creation__surface"><summary>Rebuild character with GM consent</summary><p>A rebuild keeps your level, possessions and copper. It ends active effects, loses temporary Health and created slots, never heals, preserves expenditure and starts newly acquired pools empty. Campaign changes require the GM to approve the exact preview.</p>
    {isOwner&&<fieldset disabled={busy}>
      <label>Rebuild reason <input value={reason} onChange={e=>{setReason(e.target.value);setDirty(true);setAccepted(false);}} maxLength={500}/></label>
      <label>Rebuilt Calling <select value={ledger.levels[0].callingId} onChange={e=>restart({levels:[{callingId:e.target.value,choices:{}}]})}>{rules.callings.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Rebuilt origin <select value={ledger.creation.originId} onChange={e=>creationChange({originId:e.target.value})}>{rules.creation.origins.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
      <label>Rebuilt background <select value={ledger.creation.backgroundId} onChange={e=>{const b=rules.creation.backgrounds.find(x=>x.id===e.target.value),c={...ledger.creation,backgroundId:b.id,increases:{[b.attributes[0]]:2}};if(b.id==='custom'){c.custom={attributes:['might','agility','resolve'],skills:['athletics','survival'],tool:rules.creation.tools[0],feat:'alert'};c.equipment='gold';}else delete c.custom;restart({creation:c});}}>{rules.creation.backgrounds.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
      <label>Rebuilt size <select value={ledger.creation.size??'medium'} onChange={e=>creationChange({size:e.target.value})}><option value="small">Small</option><option value="medium">Medium</option></select></label>
      {Object.entries(attributeNames).map(([id,label])=><label key={id}>Rebuilt base {label}<input type="number" min={8} max={15} value={ledger.baseAttributes[id]} onChange={e=>restart({baseAttributes:{...ledger.baseAttributes,[id]:Number(e.target.value)}})}/></label>)}
      <p>Point buy permits at most 27 points. Origin adds one; background adds two.</p>
      <label>Background attribute increase <select value={JSON.stringify(ledger.creation.increases)} onChange={e=>creationChange({increases:JSON.parse(e.target.value)})}>{backgroundAttributes.flatMap((id,i)=>[<option key={id} value={JSON.stringify({[id]:2})}>{attributeNames[id]} +2</option>,...backgroundAttributes.slice(i+1).map(other=><option key={id+other} value={JSON.stringify({[id]:1,[other]:1})}>{attributeNames[id]} +1, {attributeNames[other]} +1</option>)])}</select></label>
      {background.id==='custom'&&<>
        <label>Custom background eligible attributes (choose three)<select multiple value={ledger.creation.custom.attributes} onChange={e=>creationChange({custom:{...ledger.creation.custom,attributes:Array.from(e.target.selectedOptions,o=>o.value)}})}>{Object.entries(attributeNames).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
        <label>Custom background skills (choose two)<select multiple value={ledger.creation.custom.skills} onChange={e=>creationChange({custom:{...ledger.creation.custom,skills:Array.from(e.target.selectedOptions,o=>o.value)}})}>{rules.skills.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        <label>Custom background tool<select value={ledger.creation.custom.tool} onChange={e=>creationChange({custom:{...ledger.creation.custom,tool:e.target.value}})}>{rules.creation.tools.map(id=><option key={id}>{id}</option>)}</select></label>
        <label>Custom Origin feat<select value={ledger.creation.custom.feat} onChange={e=>creationChange({custom:{...ledger.creation.custom,feat:e.target.value}})}>{['alert','skilled','savage-attacker','magic-initiate'].map(id=><option key={id}>{id}</option>)}</select></label>
      </>}
      <p>Rebuilt ledger: {ledger.levels.length} of {targetLevel} levels. Starting-equipment choices record the build only; no replacement equipment or copper is issued.</p>
      {ledger.levels.map((event,index)=><button key={index} onClick={()=>edit({...ledger,levels:[...ledger.levels.slice(0,index),{callingId:event.callingId,choices:{}}]})}>Choose level {index+1} again</button>)}
      <button disabled={!reason.trim()} onClick={()=>preview()}>Preview rebuild choices and consequences</button>
      {!dirty&&requirement&&<RequiredChoice key={requirement.id+character.documentRevision} choice={requirement} rules={rules} onChange={changes=>{const next=structuredClone(ledger);next.levels[requirement.callingLevel-1].choices={...next.levels[requirement.callingLevel-1].choices,...changes};preview(next);}}/>}
      {!dirty&&shown?.summary?.decisionsComplete&&ledger.levels.length<targetLevel&&<button onClick={()=>preview({...ledger,levels:[...ledger.levels,{callingId:ledger.levels[0].callingId,choices:{}}]})}>Build level {ledger.levels.length+1}</button>}
    </fieldset>}
    {shown?.complete&&<><p>Proposal: {shown.proposalId}. {proposal?.reason??reason}</p><p>Health after rebuild: {shown.consequences?.health.after} / {shown.consequences?.health.max}. Ended effects: {shown.consequences?.endedEffectIds.length}. Temporary Health lost: {shown.consequences?.temporaryHealthLost}.</p>
      <ul>{Object.entries(shown.consequences?.pools??{}).map(([id,n])=><li key={id}>{id}: {n} remaining after rebuild.</li>)}</ul><p>Ordinary slots after rebuild: {shown.consequences?.slots.join(' / ')||'none'}. Hit Dice: {Object.entries(shown.consequences?.hitDice??{}).map(([die,n])=>`${die}: ${n}`).join(', ')||'none'}. Created slots lost: {shown.consequences?.createdSlotsLost.join(' / ')||'none'}.</p>
        {!!shown.consequences?.endedAttunementIds?.length&&<p>Attunement ends because the new build loses the prerequisite: {shown.consequences.endedAttunementIds.map(id=>{const item=character.inventory.find(i=>i.instanceId===id);return rules.equipment.items.find(d=>d.id===item?.definitionId)?.name??id;}).join(', ')}. You keep these items.</p>}
        {shown.summary&&<RulesSummary summary={shown.summary} rules={rules} title="Proposed rebuild"/>}
      {character.permissions?.canGM&&<button disabled={busy||dirty||!proposal} onClick={()=>onCommand('rebuild.approve',{proposalId:proposal.proposalId})}>Approve this exact rebuild</button>}
      {isOwner&&<><label><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/>I accept all previewed resource consequences and no new equipment</label><button disabled={busy||dirty||!accepted||!proposal||Boolean(character.campaignId&&!proposal.approvedBy)} onClick={()=>onCommand('rebuild.commit',{proposalId:proposal.proposalId,acceptConsequences:true})}>Commit approved rebuild</button></>}
    </>}
  </details>;
}
