import { SelectionCard } from '../ui/GameUI';
import { lineageFeatFields, lineageFields } from './lineageChoices';

const title = id => id.replaceAll('-', ' ').replace(/^./, letter => letter.toUpperCase());

function ChoiceField({ label, count = 1, options, value, onChange }) {
  if (count === 1) return <label className="sa-field">
    {label}
    <select value={value ?? ''} onChange={event => onChange(event.target.value || undefined)}>
      <option value="">Choose {label.toLowerCase()}</option>
      {options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
    </select>
  </label>;
  const selected = value ?? [];
  return <fieldset className="sa-field">
    <legend>{label} (choose {count})</legend>
    {options.map(option => <label key={option.id}>
      <input type="checkbox" checked={selected.includes(option.id)}
        disabled={selected.length >= count && !selected.includes(option.id)}
        onChange={event => onChange(event.target.checked
          ? [...selected, option.id] : selected.filter(id => id !== option.id))} />
      {option.name}
    </label>)}
  </fieldset>;
}

function OriginFeatOptions({ feat, rules, onChange }) {
  const options = feat.options ?? {};
  return lineageFeatFields(feat, rules).map(field => <ChoiceField key={field.key} {...field}
    value={options[field.key]} onChange={value => onChange({
      ...feat,
      options: field.key === 'list'
        ? { list: value, attribute: options.attribute }
        : { ...options, [field.key]: value },
    })} />);
}

export default function LineageStep({ rules, lineage, values, onSelect, onChange }) {
  const heritage = lineage?.heritages?.[values.heritage];
  const feat = values.originFeat;
  const spells = heritage?.spells ?? lineage?.spells ?? [];
  const form = rules.creation.beastshifterForms.find(entry => entry.id === values.formId);
  const size = values.size ?? lineage?.size;
  return <>
    <p>Lineage determines inherited traits, movement, and starting abilities. Origin is where you come from, and Calling is your discipline.</p>
    <fieldset className="sa-lineages">
      <legend>Choose a Lineage</legend>
      {rules.creation.lineages?.map(entry => <SelectionCard key={entry.id} name="lineage" value={entry.id}
        title={entry.name} description={entry.description} selected={entry.id === lineage?.id}
        onChange={() => onSelect(entry.id)} />)}
    </fieldset>
    {lineage && <div className="sa-lineage-details">
      <h3>Starting traits</h3>
      <p>{size && title(size) + ' '}{title(lineage.type)}</p>
      <ul>{lineage.traits.map(trait => <li key={trait.id}>{trait.name}</li>)}</ul>
      <p>{Object.entries({ ...lineage.movement, walk: heritage?.walk ?? lineage.movement.walk })
        .map(([mode, speed]) => `${title(mode)} ${speed} ft`).join(' · ')}</p>
      {(heritage?.darkvision ?? lineage.darkvision) > 0 && <p>Darkvision {heritage?.darkvision ?? lineage.darkvision} ft</p>}
      {lineage.resistances?.length > 0 && <p>Damage resistance: {lineage.resistances.join(', ')}.</p>}
      {lineage.saveAdvantages?.length > 0 && <p>Advantage on saves against {
        lineage.saveAdvantages.map(condition => title(condition)).join(', ')}.</p>}
      {spells.length > 0 && <p>Innate spells as you advance: {
        spells.map(id => rules.spells.find(spell => spell.id === id)?.name ?? title(id)).join(', ')}.</p>}
      {form && <p>{form.name}: {
        Object.entries(form.movement).map(([mode, speed]) => title(mode) + ' ' + speed + ' ft').join(', ')}.</p>}
      {lineage.choices?.formId && <p>Choose a level-one form. More forms become available as you advance.</p>}
      {(lineage.choices?.skill || lineage.choices?.skills) && <p>Choose skills you won’t receive from your Calling or Background.</p>}
      {lineageFields(lineage, rules).map(field => <ChoiceField key={field.key} {...field}
        value={field.key === 'originFeat' ? feat?.id : values[field.key]}
        onChange={value => onChange(field.key, field.key === 'originFeat' && value ? { id: value } : value)} />)}
      {feat && <>
        <p>{rules.feats.find(entry => entry.id === feat.id)?.description}</p>
        <OriginFeatOptions feat={feat} rules={rules} onChange={value => onChange('originFeat', value)} />
      </>}
    </div>}
  </>;
}
