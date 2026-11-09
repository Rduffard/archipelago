import { useState } from 'react';
export default function RestSelections({ character, rules, busy, onOperation }) {
  const summary = character.rulesSummary;
  const [choices, setChoices] = useState({});
  const casting = summary.spellcasting.shipwright;
  const sections = Object.entries(summary.pathSelections).flatMap(([id, value]) => {
    const options = [];
    if (value.mastery?.length) options.push({ id, key: 'mastery', count: value.mastery.length,
      values: rules.equipment.items.filter(w => w.kind === 'weapon' && w.mastery &&
        (id !== 'reaver' || w.type === 'melee') && (summary.equipmentTraining.weapons.includes(w.category) ||
        summary.equipmentTraining.weapons.includes(w.id) || (summary.equipmentTraining.weapons.includes('martial:finesse-or-light') &&
          w.properties.some(p => ['finesse', 'light'].includes(p.id))))).map(w => ({ id: w.id, name: w.name })), selected: value.mastery });
    if (id === 'shipwright') {
      options.push({ id, key: 'cantrips', count: casting.cantrips.length, values: rules.spells.filter(s => s.level === 0 && s.callings.includes(id)), selected: casting.cantrips });
      if (casting.spellMastery.length) options.push({ id, key: 'spellMastery', count: 2, values: rules.spells.filter(s =>
        (casting.folio.includes(s.id)||casting.spellMastery.includes(s.id)) && [1, 2].includes(s.level) && ['Action','Action or Ritual'].includes(s.castingTime)), selected: casting.spellMastery });
    }
    if(summary.paths[id]==='gray-net'){
      options.push({id,key:'hunterPrey',count:1,values:[{id:'colossus-slayer',name:'Colossus Slayer'},{id:'horde-breaker',name:'Horde Breaker'}],selected:[value.hunterPrey],shortRest:true});
      if(summary.callingLevels[id]>=7)options.push({id,key:'defensiveTactics',count:1,values:[{id:'escape-the-horde',name:'Escape the Horde'},{id:'multiattack-defense',name:'Multiattack Defense'}],selected:[value.defensiveTactics],shortRest:true});
    }
    return options;
  });
  return <details><summary>Rest replacements and engineering folio</summary>
    <p>Replace selections at a Long Rest. The server enforces each Calling’s replacement limits.</p>
    <fieldset disabled={busy}>{sections.map(section => {
      const key = `${section.id}:${section.key}`;
      const selected = choices[key] ?? section.selected;
      const mastery=section.key==='spellMastery';
      const nextAlways=mastery?[...casting.alwaysPrepared.filter(id=>!casting.spellMastery.includes(id)),...selected]:[];
      const ordinary=mastery?(choices['shipwright:preparations']??character.rulesRuntime.preparations.shipwright).filter(id=>!nextAlways.includes(id)):[];
      const operation={type:'long-rest',selections:{[section.id]:{[section.key]:selected}},...(mastery?{preparations:{shipwright:ordinary}}:{})};
      return <div key={key}><label>{section.id} {section.key}: choose {section.count}
        <select multiple size={6} value={selected} onChange={e => setChoices({ ...choices, [key]: Array.from(e.target.selectedOptions, o => o.value) })}>
          {section.values.map(value => <option key={value.id} value={value.id}>{value.name}</option>)}
        </select></label>
        {mastery&&<label>Ordinary preparations after Mastery change: choose {casting.preparedCount}
          <select multiple size={8} value={ordinary} onChange={e=>setChoices({...choices,'shipwright:preparations':Array.from(e.target.selectedOptions,o=>o.value)})}>
            {rules.spells.filter(s=>(casting.folio.includes(s.id)||casting.memorized?.includes(s.id))&&!nextAlways.includes(s.id)).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select></label>}
        <button disabled={selected.length !== section.count||mastery&&ordinary.length!==casting.preparedCount} onClick={() => onOperation(operation)}>Long Rest and replace</button>
        {section.shortRest&&<button disabled={selected.length!==section.count} onClick={()=>onOperation({type:'short-rest',selections:{[section.id]:{[section.key]:selected}}})}>Short Rest and replace</button>}
      </div>;
    })}
    </fieldset>
  </details>;
}
