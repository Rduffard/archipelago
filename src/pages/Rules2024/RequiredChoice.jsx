import startingEquipment from '@crossworld/sanguine-engine/equipment/starting-equipment';
import { choiceTitle, skillExamples, equipmentQuantities } from '../../game/creator/choiceLabels';
import { useState } from "react";
import { RuleDetails } from '../../game/ui/RuleDetails';
import { attributeNames } from './labels';
import ruleLabel from './ruleLabel';

export default function RequiredChoice({ choice, rules, onChange, initialSelected=[], tiles=false, onDraftChange, unavailable = {}, prompt }) {
  unavailable = { ...unavailable, ...choice.unavailable };
  tiles ||= Boolean(choice.unavailable);
  const [selected, setSelected] = useState(()=>[...new Set([...(tiles ? choice.requiredOptions ?? [] : []), ...initialSelected])].filter(id=>choice.options.includes(id) && !unavailable[id]).slice(0,choice.count));
  function toggle(id) {
    if (unavailable[id] || !choice.options.includes(id)) return;
    const next = selected.includes(id) ? selected.filter(option => option !== id) : choice.count === 1 ? [id] : [...selected, id];
    setSelected(next);
    onDraftChange?.(next);
  }
  const [search, setSearch] = useState('');
  const [first, setFirst] = useState("might");
  const [feat, setFeat] = useState(choice.options.includes('ability-score-improvement')?'ability-score-improvement':choice.options[0]);
  const [split, setSplit] = useState(false);
  const [second, setSecond] = useState("agility");
  const featDefinition=rules.feats.find(f=>f.id===feat);
  const allowedAttributes=featDefinition?.attributeOptions??(feat==='grappler'||feat==='boon-of-irresistible-offense'?['might','agility']:feat==='boon-of-spell-recall'?['wit','instinct','spirit']:Object.keys(attributeNames));
  const firstChoice=allowedAttributes.includes(first)?first:allowedAttributes[0];
  if (choice.key === "feat")
    return (
      <fieldset>
        <legend>Feat choice</legend>
        <p>
          Choose an eligible feat. Its required subchoices are requested before saving.
        </p>
        <select
          aria-label="Feat"
          value={feat}
          onChange={(event) => setFeat(event.target.value)}
        >
          {choice.options.map((id) => (
            <option key={id} value={id}>
              {ruleLabel(id, rules)}
            </option>
          ))}
        </select>
        <p>{featDefinition?.description}</p>
        {feat === 'ability-score-improvement' && <>
          <label><input type="checkbox" checked={split} onChange={e => setSplit(e.target.checked)} />Increase two attributes by 1</label>
          {split && <select aria-label="Second improved attribute" value={second} onChange={e => setSecond(e.target.value)}>
            {Object.entries(attributeNames).map(([id, name]) => <option key={id} value={id} disabled={id === first}>{name}</option>)}
          </select>}
        </>}
        {rules.feats.find(f=>f.id===feat)?.category!=='origin'&&<select
          aria-label="Improved attribute"
          value={firstChoice}
          onChange={(event) => setFirst(event.target.value)}
        >
          {Object.entries(attributeNames).filter(([id])=>allowedAttributes.includes(id)).map(([id, name]) => (
            <option value={id} key={id}>
              {name}
            </option>
          ))}
        </select>}
        <button
          type="button"
          disabled={feat === 'ability-score-improvement' && split && first === second}
          onClick={() =>
            onChange({
              feat,
              increases: rules.feats.find(f=>f.id===feat)?.category==='origin' ? {} : feat === 'ability-score-improvement' && split ? { [first]: 1, [second]: 1 } : {
                [firstChoice]: feat === "ability-score-improvement" ? 2 : 1,
              },
            })
          }
        >
          Confirm feat
        </button>
      </fieldset>
    );
  return (
    <fieldset className={tiles ? 'sa-choice-field' : undefined}>
      <legend>
        {prompt ?? choiceTitle(choice.key)}
      </legend>
      {!prompt && choice.requiredOptions?.length > 0 && <p>
        Granted by Background · {choice.requiredOptions.map(id => ruleLabel(id, rules)).join(', ')}.
        {choice.requiredOptions.length < choice.count && ' Choose a replacement for each skill you already have.'}
      </p>}
      {tiles ? <>
        <p role="status">{selected.length - (choice.requiredOptions?.length ?? 0)} of {choice.count - (choice.requiredOptions?.length ?? 0)} selected</p>
        {choice.options.length > 12 && (choice.requiredOptions?.length ?? 0) < choice.count && <label>Filter choices <input type="search" value={search}
          onChange={event => setSearch(event.target.value)} /></label>}
        <div className="sa-choice-grid">
          {[...new Set([...choice.options, ...Object.keys(unavailable)])].filter(id => !choice.requiredOptions?.includes(id) &&
            (selected.includes(id) || ruleLabel(id, rules).toLowerCase().includes(search.trim().toLowerCase()))).map(id => {
            const checked = selected.includes(id);
            if (unavailable[id]) return <div key={id} className="sa-card sa-card--unavailable" tabIndex={0} aria-disabled="true">
              <span><strong>{ruleLabel(id, rules)}</strong><small>{unavailable[id]}</small></span>
            </div>;
            const spell = rules.spells.find(entry => entry.id === id);
            const kit = choice.key === 'equipment' ? (rules.startingEquipment ?? startingEquipment.packages)[choice.callingId] : null;
            const option = kit?.[id.replace(/^pack-/, '')];
            const skill = rules.skills.find(entry => entry.id === id.replace(/^skill:/, ''));
            const item = rules.equipment.items.find(entry => entry.id === id);
            const itemDetails = [item?.damage, ...(Array.isArray(item?.properties) ? item.properties : [])]
              .filter(value => typeof value === 'string').join(' · ');
            const equipmentTitle = ['gold', 'starting-gold'].includes(id) && kit ? kit.gold + ' GP' : option?.items ? 'Package ' + id.replace(/^pack-/, '').toUpperCase() : null;
            const equipmentItems = option?.items && equipmentQuantities(option.items, item => ruleLabel(item, rules))
              .map(({ name, quantity }) => quantity > 1 ? name + ' ×' + quantity : name).join(', ');
            return <div key={id} className="sa-choice-option"><label className="sa-card">
              <input type="checkbox" checked={checked} disabled={choice.count > 1 && !checked && selected.length >= choice.count}
                onChange={() => toggle(id)} />
              <span><strong>{equipmentTitle ?? ruleLabel(id, rules)}</strong>
                {skill && <small>{attributeNames[skill.attribute]}{choice.key !== 'featTraining' && ' · ' + skillExamples[skill.id]}</small>}
                {spell && <small>{spell.level === 0 ? 'Cantrip' : 'Level ' + spell.level}{spell.school && ' · ' + spell.school}</small>}
                {equipmentItems && <small>{equipmentItems}</small>}
              </span>
            </label>
            {(spell?.description || item?.description || itemDetails) &&
              <RuleDetails title={ruleLabel(id, rules) + ' details'}>{spell?.description || item?.description || itemDetails}</RuleDetails>}
            </div>;
          })}
        </div>
        {selected.map(id => rules.feats.find(feat => feat.id === id)).filter(entry => entry?.description)
          .map(entry => <RuleDetails key={entry.id} title={entry.name + ' details'}>{entry.description}</RuleDetails>)}
      </> : <select
        multiple
        size={Math.min(8, Math.max(2, choice.options.length))}
        aria-label={choice.key}
        value={selected}
        onChange={(event) =>
          setSelected(
            Array.from(event.target.selectedOptions, (option) => option.value)
          )
        }
      >
        {choice.options.map((id) => (
          <option key={id} value={id}>
            {ruleLabel(id, rules)}
          </option>
        ))}
      </select>}
      {onChange && <button
        type="button"
        disabled={selected.length !== choice.count}
        onClick={() => onChange({ [choice.key]: selected })}
      >
        Confirm choice
      </button>}
    </fieldset>
  );
}
