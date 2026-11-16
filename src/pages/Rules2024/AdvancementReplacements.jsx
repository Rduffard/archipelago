import {useState} from 'react';
import {cantripStyleSpellEligible,styleCantripReplacementAvailable} from '@crossworld/sanguine-engine/callings';
import {spellPreparationEligible} from '@crossworld/sanguine-engine/preparations';
import {replaceMagicInitiateSpell,magicInitiateReplacementAvailable} from '@crossworld/sanguine-engine/feats';
import {metamagicReplacementAvailable} from '@crossworld/sanguine-engine/spells/metamagic';
import {callingCantripEligible} from '@crossworld/sanguine-engine/spells/casting-sources';

export default function AdvancementReplacements({before,preview,event,rules,busy,onChange}){
  const [kind,setKind]=useState(''),[from,setFrom]=useState(''),[to,setTo]=useState('');
  const calling=Object.keys(before.callingLevels)[0],n=before.totalLevel+1;
  const sources=[];
  if(metamagicReplacementAvailable(calling,n))sources.push({id:'metamagic',name:'Metamagic',known:before.pathSelections.tidecaller.metamagic,options:rules.metamagic});
  if(styleCantripReplacementAvailable(n)&&before.pathSelections[calling]?.styleCantrips?.length)sources.push({id:'style',name:'Cantrip fighting style',known:before.pathSelections[calling].styleCantrips,options:rules.spells.filter(spell=>cantripStyleSpellEligible(calling,spell))});
  if(['doctor','tidecaller'].includes(calling))sources.push({id:'cantrip',name:'Calling cantrip',known:before.pathSelections[calling].cantrips,options:rules.spells.filter(s=>callingCantripEligible(s,calling))});
  if(calling==='tidecaller')sources.push({id:'prepared',name:'Prepared Tidecaller spell',known:before.spellcasting.tidecaller.prepared.filter(id=>!preview.spellcasting.tidecaller.alwaysPrepared.includes(id)),options:rules.spells.filter(spell=>spellPreparationEligible(calling,spell,preview.spellcasting.tidecaller))});
  if(magicInitiateReplacementAvailable(n))for(const grant of before.featSpellcasters??[])sources.push({id:'initiate:'+grant.grantKey,name:'Magic Initiate ('+grant.list+')',known:[...grant.cantrips,grant.spell],options:rules.spells,grantKey:grant.grantKey,grant});
  const source=sources.find(s=>s.id===kind)??sources[0];
  if(!source)return null;
  const old=source.known.includes(from)?from:source.known[0];
  const options=source.options.filter(option=>source.grant
    ? replaceMagicInitiateSpell(source.grant,old,option.id)
    : !source.known.includes(option.id));
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
