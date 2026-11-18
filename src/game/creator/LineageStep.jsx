import { lineageTraitText } from './lineageTraitText';
import { RuleDetails } from '../ui/RuleDetails';
import { CatalogCards } from './CreatorViews';
import { SelectionCard } from '../ui/GameUI';
import { attributeNames } from '../../pages/Rules2024/labels';
import { skillExamples, displayName } from './choiceLabels';

const title = displayName;

function ChoiceField({ label, options, value, onChange }) {
  const description = option => option.attribute
    ? attributeNames[option.attribute] + ' · ' + skillExamples[option.id]
    : option.description;
  return <CatalogCards label={label} entries={options} value={value}
    onChange={onChange} describe={description} />;
}

export default function LineageStep({ rules, lineage, values, onSelect, onChange, fields }) {
  const heritage = lineage?.heritages?.[values.heritage];
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
      {fields.some(field => field.key === 'size') && <p>Small and Medium characters each normally occupy one square. Size matters when a rule compares creature sizes.</p>}
      <ul>{lineage.traits.map(trait => <li key={trait.id}><RuleDetails title={trait.name} tooltip>{lineageTraitText(trait)}</RuleDetails></li>)}</ul>
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
      {(lineage.choices?.skill || lineage.choices?.skills || lineage.choices?.originFeat) &&
        <p>Choose additional Lineage Training or feats during Training.</p>}
      {fields.map(({ key, ...field }) => <ChoiceField key={key} {...field}
        value={values[key]} onChange={value => onChange(key, value)} />)}
    </div>}
  </>;
}
