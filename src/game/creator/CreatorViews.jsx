import { SelectionCard } from '../ui/GameUI';
import { attributeNames } from '../../pages/Rules2024/labels';

export function CatalogCards({ label, entries, value, onChange, describe }) {
  return <fieldset className="sa-lineages">
    <legend>{label}</legend>
    {entries.map(entry => <SelectionCard key={entry.id} name={label} value={entry.id}
      title={entry.name} description={describe?.(entry)} selected={entry.id === value}
      onChange={() => onChange(entry.id)} />)}
  </fieldset>;
}

export function FeatureCards({ calling, future = false }) {
  const rows = future ? calling.progression.slice(1) : calling.progression.slice(0, 1);
  return <div className="sa-feature-list">{rows.flatMap(row => row.features.map((feature, index) =>
    <details key={row.callingLevel + ':' + index}>
      <summary>{feature.rules[0]?.name ?? feature.name}{future && ' · Level ' + row.callingLevel}</summary>
      {feature.rules.map((rule, ruleIndex) => <p key={ruleIndex}>{rule.description}</p>)}
    </details>
  ))}</div>;
}

export function CallingPaths({ calling, rules }) {
  return <div className="sa-feature-list">
    <h3>Paths · Level 3</h3>
    {rules.paths.filter(path => path.callingId === calling.id).map(path => <details key={path.id}>
      <summary>{path.name}</summary>
      <p>{path.description}</p>
    </details>)}
  </div>;
}

export function CreatorReview({ summary, rules, identity, calling, choices, spellKeys }) {
  const spellNames = ids => ids.map(id => rules.spells.find(spell => spell.id === id)?.name ?? id).join(', ');
  return <>
    {identity.pronouns && <p>{identity.pronouns}</p>}
    {identity.appearance && <p>{identity.appearance}</p>}
    <dl className="sa-review">
      {Object.entries(attributeNames).map(([id, name]) => <div key={id}>
        <dt>{name}</dt><dd>{summary.attributes[id]}</dd>
      </div>)}
      <div><dt>Training</dt><dd>{summary.training.map(id => rules.skills.find(skill => skill.id === id)?.name ?? id).join(', ')}</dd></div>
      <div><dt>Feats</dt><dd>{summary.feats.map(id => rules.feats.find(feat => feat.id === id)?.name ?? id).join(', ')}</dd></div>
      <div><dt>Calling features</dt><dd><FeatureCards calling={calling} /></dd></div>
      {Object.entries(choices).filter(([key]) => spellKeys.includes(key)).map(([key, ids]) =>
        <div key={key}><dt>{key.replace(/([A-Z])/g, ' $1')}</dt><dd>{spellNames(ids)}</dd></div>)}
    </dl>
  </>;
}
