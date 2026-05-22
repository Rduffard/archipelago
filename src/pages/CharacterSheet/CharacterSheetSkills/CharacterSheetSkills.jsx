import { ReferenceList } from '../CharacterSheetSectionBits/CharacterSheetSectionBits'
import { SectionCard, SectionCardEmpty, SectionCardHeader } from '../../../components/ui/SectionCard/SectionCard'
import './CharacterSheetSkills.css'

function CharacterSheetSkills({ skillGroups }) {
  return (
    <SectionCard className="character-sheet__panel character-sheet__panel--wide">
      <SectionCardHeader
        className="character-sheet__panel-header"
        title="Trained Skills"
        description="Skills are trained specialties that enhance checks through bonuses, permissions, or situational advantages."
      />

      {skillGroups.length ? (
        <div className="character-sheet__skill-groups">
          {skillGroups.map((group) => (
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
      ) : (
        <SectionCardEmpty>No canonical skills are available right now.</SectionCardEmpty>
      )}
    </SectionCard>
  )
}

export default CharacterSheetSkills
