import { useState } from 'react';
import { callingCantripEligible } from '@crossworld/sanguine-engine/spells/casting-sources';
import { weaponMasteryEligible } from '@crossworld/sanguine-engine/training';
import { grayNetReplacementOptions, spellMasterySpellEligible, alwaysPreparedAfterMastery } from '@crossworld/sanguine-engine/callings';
const grayNetLabels = { 'colossus-slayer': 'Colossus Slayer', 'horde-breaker': 'Horde Breaker',
  'escape-the-horde': 'Escape the Horde', 'multiattack-defense': 'Multiattack Defense' };
export default function RestSelections({ character, rules, busy, onOperation }) {
  const summary = character.rulesSummary;
  const [choices, setChoices] = useState({});
  const casting = summary.spellcasting.shipwright;
  const sections = Object.entries(summary.pathSelections).flatMap(([id, value]) => {
    const options = [];
    if (value.mastery?.length) options.push({ id, key: 'mastery', count: value.mastery.length,
      values: rules.equipment.items.filter(weapon => weaponMasteryEligible(weapon,id,summary.equipmentTraining.weapons,true))
        .map(weapon => ({ id: weapon.id, name: weapon.name })), selected: value.mastery });
    if (id === 'shipwright') {
      options.push({ id, key: 'cantrips', count: casting.cantrips.length, values: rules.spells.filter(s => callingCantripEligible(s,id)), selected: casting.cantrips });
      if (casting.spellMastery.length) options.push({ id, key: 'spellMastery', count: 2, values: rules.spells.filter(s =>
        (casting.folio.includes(s.id)||casting.spellMastery.includes(s.id)) && spellMasterySpellEligible(s)), selected: casting.spellMastery });
    }
    for (const key of ['hunterPrey','defensiveTactics']) {
      const available=grayNetReplacementOptions(summary.paths[id],summary.callingLevels[id],key);
      if(available.length)options.push({id,key,count:1,values:available.map(optionId=>({id:optionId,name:grayNetLabels[optionId]})),selected:[value[key]],shortRest:true});
    }
    return options;
  });
  return <details><summary>Rest replacements and engineering folio</summary>
    <p>Replace selections at a Long Rest. The server enforces each Calling’s replacement limits.</p>
    <fieldset disabled={busy}>{sections.map(section => {
      const key = `${section.id}:${section.key}`;
      const selected = choices[key] ?? section.selected;
      const mastery=section.key==='spellMastery';
      const nextAlways=mastery?alwaysPreparedAfterMastery(casting.alwaysPrepared,casting.spellMastery,selected):[];
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
