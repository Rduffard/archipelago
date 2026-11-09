import {useState} from 'react';

export default function AdvancementReplacements({before,preview,event,rules,busy,onChange}){
  const [kind,setKind]=useState(''),[from,setFrom]=useState(''),[to,setTo]=useState('');
  const calling=Object.keys(before.callingLevels)[0],n=before.totalLevel+1;
  const sources=[];
  if(calling==='tidecaller'&&n>2)sources.push({id:'metamagic',name:'Metamagic',known:before.pathSelections.tidecaller.metamagic,options:rules.metamagic});
  if(before.pathSelections[calling]?.styleCantrips?.length)sources.push({id:'style',name:'Cantrip fighting style',known:before.pathSelections[calling].styleCantrips,options:rules.spells.filter(s=>s.level===0&&s.callings.includes(calling==='navigator'?'druid':'doctor'))});
  if(['doctor','tidecaller'].includes(calling))sources.push({id:'cantrip',name:'Calling cantrip',known:before.pathSelections[calling].cantrips,options:rules.spells.filter(s=>s.level===0&&s.callings.includes(calling))});
  if(calling==='tidecaller')sources.push({id:'prepared',name:'Prepared Tidecaller spell',known:before.spellcasting.tidecaller.prepared.filter(id=>!preview.spellcasting.tidecaller.alwaysPrepared.includes(id)),options:rules.spells.filter(s=>s.level>0&&s.level<=preview.spellSlots.length&&s.callings.includes(calling)&&!preview.spellcasting.tidecaller.alwaysPrepared.includes(s.id))});
  for(const grant of before.featSpellcasters??[])sources.push({id:'initiate:'+grant.grantKey,name:'Magic Initiate ('+grant.list+')',known:[...grant.cantrips,grant.spell],options:rules.spells.filter(s=>s.level<=1&&s.callings.includes(grant.list)),grantKey:grant.grantKey});
  const source=sources.find(s=>s.id===kind)??sources[0];
  if(!source)return null;
  const old=source.known.includes(from)?from:source.known[0];
  const oldSpell=rules.spells.find(s=>s.id===old);
  const options=source.options.filter(o=>!source.known.includes(o.id)&&(!source.grantKey||o.level===oldSpell?.level));
  const target=options.some(o=>o.id===to)?to:options[0]?.id;
  const name=id=>rules.spells.find(s=>s.id===id)?.name??rules.metamagic.find(s=>s.id===id)?.name??id;
  function replace(){
    const choices={...event.choices};
    if(source.id==='metamagic')choices.metamagicReplacement={from:old,to:target};
    else if(source.id==='style')choices.styleCantripReplacement={from:old,to:target};
    else if(source.grantKey)choices.initiateReplacements=[...(choices.initiateReplacements??[]).filter(r=>r.grantKey!==source.grantKey),{grantKey:source.grantKey,from:old,to:target}];
    else{
      const key=source.id==='cantrip'?'cantrips':'prepared';
      const selected=choices[key]??preview.pathSelections[calling][key];
      choices[key]=selected.map(id=>id===old?target:id);
    }
    onChange(choices);
  }
  return <fieldset disabled={busy}><legend>Optional level replacements</legend>
    <p>Replace at most one eligible spell or option from each source. The preview validates list, level and replacement limits before advancement.</p>
    <label>Replacement source <select value={source.id} onChange={e=>{setKind(e.target.value);setFrom('');setTo('');}}>{sources.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
    <label>Replace <select value={old} onChange={e=>{setFrom(e.target.value);setTo('');}}>{source.known.map(id=><option key={id} value={id}>{name(id)}</option>)}</select></label>
    <label>New option <select value={target??''} onChange={e=>setTo(e.target.value)}>{options.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
    <button disabled={!target} onClick={replace}>Preview replacement</button>
  </fieldset>;
}
