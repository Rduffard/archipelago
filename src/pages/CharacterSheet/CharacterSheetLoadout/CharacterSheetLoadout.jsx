import { ReferenceList } from '../CharacterSheetSectionBits/CharacterSheetSectionBits'
import { SectionCard, SectionCardEmpty, SectionCardHeader } from '../../../components/ui/SectionCard/SectionCard'
import { toReferenceEntries } from '../characterSheetHelpers'
import './CharacterSheetLoadout.css'

function CharacterSheetLoadout({ character, visibleCatalogGroups }) {
  return (
    <SectionCard className="character-sheet__panel character-sheet__panel--wide">
      <SectionCardHeader className="character-sheet__panel-header" title="Loadout & Notes" />

      <div className="character-sheet__resource-groups">
        {visibleCatalogGroups.map((group) => (
          <section key={group.key} className="character-sheet__resource-group">
            <header className="character-sheet__resource-header">
              <h3>{group.title}</h3>
            </header>

            {group.entries.length ? (
              <ReferenceList
                entries={toReferenceEntries(
                  group.entries.map((entry) => ({
                    key: `${group.key}-${entry.label}-${entry.meta ?? 'base'}`,
                    label: entry.label,
                    meta: entry.meta ?? group.title,
                    detail: entry.detail,
                  })),
                  { prefix: group.key },
                )}
                variant="tight"
              />
            ) : (
              <SectionCardEmpty>{group.empty}</SectionCardEmpty>
            )}
          </section>
        ))}

        {character.notes ? (
          <section className="character-sheet__resource-group">
            <header className="character-sheet__resource-header">
              <h3>Notes</h3>
            </header>
            <div className="character-sheet__notes-panel">
              <p className="character-sheet__notes-copy">{character.notes}</p>
            </div>
          </section>
        ) : null}
      </div>
    </SectionCard>
  )
}

export default CharacterSheetLoadout
