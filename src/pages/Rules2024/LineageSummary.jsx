import { RuleDetails } from '../../game/ui/RuleDetails';
import { lineageTraitText } from '../../game/creator/lineageTraitText';
import { displayName } from '../../game/creator/choiceLabels';
import ruleLabel from './ruleLabel';

export default function LineageSummary({ lineage, state, rules, headingId = "character-lineage" }) {
  if (!lineage) return null;
  const definition = rules.creation.lineages?.find(entry => entry.id === lineage.id);
  const forms = lineage.animalForms;
  const savedForms = state?.animalForms;
  return <section aria-labelledby={headingId}>
    <h2 id={headingId}>Lineage</h2>
    <p>{definition?.name ?? lineage.id}</p>
    {lineage.traits?.length > 0 && <ul>
      {lineage.traits.map(trait => <li key={trait.id}><RuleDetails title={trait.name} tooltip>{lineageTraitText(trait)}</RuleDetails></li>)}
    </ul>}
    <p>{Object.entries(lineage.movement ?? {}).filter(([, speed]) => speed > 0)
      .map(([mode, speed]) => displayName(mode) + ' ' + speed + ' ft').join(' · ')}
      {lineage.senses?.darkvision > 0 && ' · Darkvision ' + lineage.senses.darkvision + ' ft'}</p>
    {lineage.damageResistances?.length > 0 && <p>Damage resistance: {lineage.damageResistances.join(', ')}.</p>}
    {lineage.maxHealthAdjustment > 0 && <p>Lineage Health bonus: +{lineage.maxHealthAdjustment}.</p>}
    {lineage.originFeat && <p>Origin feat: {ruleLabel(lineage.originFeat.id, rules)}.</p>}
    {lineage.heritage && <p>Heritage: {definition?.heritages?.[lineage.heritage]?.name ?? lineage.heritage}.</p>}
    {lineage.trainedSkills?.length > 0 && <p>Lineage Training: {lineage.trainedSkills.map(id => ruleLabel(id, rules)).join(', ')}.</p>}
    {lineage.spells?.length > 0 && <><h3>Innate spells</h3><ul>{lineage.spells.map(spell => <li key={spell.grantKey}>
      {ruleLabel(spell.spellId, rules)}{spell.unlocked ? ' (available)' : ' (level ' + spell.unlockLevel + ')'}
    </li>)}</ul></>}
    {forms?.knownForms?.length > 0 && <>
      <h3>Known animal forms</h3>
      <ul>{forms.knownForms.map(formId => {
        const form = rules.creation.beastshifterForms?.find(entry => entry.id === formId);
        const health = savedForms?.healthByForm?.[formId];
        const maximum = forms.maximumHealth?.[formId];
        return <li key={formId}>
          {form?.name ?? formId}
          {savedForms?.activeFormId === formId && ' (active)'}
          {health != null && maximum != null && ` · Health ${health}/${maximum}`}
        </li>;
      })}</ul>
    </>}
  </section>;
}
