import { ReferenceList } from '../CharacterSheetSectionBits/CharacterSheetSectionBits'
import { SectionCard, SectionCardHeader } from '../../../components/ui/SectionCard/SectionCard'
import './CharacterSheetReferenceGroups.css'

function CharacterSheetReferenceGroups({ referenceGroups }) {
  return (
    <SectionCard className="character-sheet__panel character-sheet__panel--wide">
      <SectionCardHeader
        className="character-sheet__panel-header"
        title="Core Checks"
        description="Checks are the primary rolls used during gameplay. Trained skills can modify them when the situation fits."
      />

      <div className="character-sheet__skill-groups">
        {referenceGroups.map((group) => (
          <section key={group.key} className="character-sheet__skill-group">
            <header className="character-sheet__skill-group-header">
              <div>
                <h3>{group.label}</h3>
              </div>
            </header>

            <ReferenceList entries={group.entries} variant="skill-chart" />
          </section>
          ))}
      </div>
    </SectionCard>
  )
}

export default CharacterSheetReferenceGroups
