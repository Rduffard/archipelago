import { GamePanel, ResourceBar } from './GameUI';

// Receives display data from the sheet adapter, independently of gameplay state.
export default function CharacterHud({ health, stamina, focus, animalHealth, guard, attributes,
  training, equipment, abilities, spells, lineageTraits }) {
  const sections = [
    ['Attributes', attributes], ['Training', training], ['Equipment', equipment],
    ['Abilities', abilities], ['Spells', spells], ['Lineage traits', lineageTraits],
  ];
  return <>
    <GamePanel title="Vitals">
      {[['Health', health], ['Stamina', stamina], ['Focus', focus], ['Animal-form Health', animalHealth]]
        .filter(([, pool]) => pool)
        .map(([label, pool]) => <ResourceBar key={label} label={label} {...pool} />)}
      {guard != null && <p>Guard <strong>{guard}</strong></p>}
    </GamePanel>
    {sections.filter(([, rows]) => rows?.length).map(([title, rows]) =>
      <GamePanel key={title} title={title}><dl className="sa-stats">
        {rows.map(({ id, label, value }) => <div key={id}>
          <dt>{label}</dt><dd>{value}</dd>
        </div>)}
      </dl></GamePanel>)}
  </>;
}
