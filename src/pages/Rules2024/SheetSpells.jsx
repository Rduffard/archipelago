import PreparationChoices from "./PreparationChoices";
import SpellActions from './SpellActions';
import SpellRerolls from './SpellRerolls';
import FolioControls from './FolioControls';
import { displayName } from '../../game/creator/choiceLabels';

export default function SheetSpells({ activeSection, character, rules, commandBusy, busy, command, resource }) {
  const summary = character.rulesSummary;
  const state = character.rulesRuntime;
  const characterId = character._id;
  return (
    <section className="sa-dossier sa-dossier--spells" hidden={activeSection !== "Spells"} aria-label="Spells">
    <h2>Spells</h2>
    {summary.spellSlots.some(Boolean) && <dl className="sa-slot-bank" aria-label="Spell slots">
      {summary.spellSlots.map((max, index) => max > 0 && <div key={index}>
        <dt>Level {index + 1}</dt>
        <dd><span aria-hidden="true" className="sa-slot-bank__pips">
          {Array.from({ length: Math.max(max, state.slots[index] ?? 0) }, (_, slot) =>
            <i key={slot} data-filled={slot < (state.slots[index] ?? 0)} />)}
        </span><strong>{state.slots[index] ?? 0} / {max}</strong></dd>
      </div>)}
    </dl>}
    <SpellActions character={character} rules={rules} busy={commandBusy} onCommand={command} />
    {summary.lineage?.spells?.length > 0 && <div className="sa-sheet__innate">
      <h3>Innate spells</h3>
      <ul>{summary.lineage.spells.map(grant => {
        const spell = rules.spells.find(entry => entry.id === grant.spellId);
        return <li key={grant.grantKey}>
          <strong>{spell?.name ?? displayName(grant.spellId)}</strong>{' · '}
          {grant.unlocked ? grant.poolId ? (state.pools[grant.poolId] ?? 0) + ' free casts remaining' : 'Cantrip' : 'Unlocks at level ' + grant.unlockLevel}
          {grant.unlocked && spell?.description && <details><summary>Spell description</summary><p>{spell.description}</p></details>}
        </li>;
      })}</ul>
    </div>}
    <SpellRerolls character={character} busy={commandBusy} onCommand={command} />
    <FolioControls key={'folio-'+characterId} character={character} rules={rules} busy={commandBusy} onCommand={command}/>
    <PreparationChoices key={'preparation-'+characterId} summary={summary} rules={rules} state={state} busy={busy} onOperation={resource} />
    </section>
  );
}
