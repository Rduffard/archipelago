import { getSystemReputationTier, getSystemReputationTrack } from '../../../data/archipelagoSystemSelectors'
import { getAttributeLabel, getRollModifier } from '../../../lib/character'
import { SectionCard, SectionCardEmpty, SectionCardHeader } from '../../../components/ui/SectionCard/SectionCard'
import { ATTRIBUTE_KEYS, toReferenceEntries } from '../characterSheetHelpers'
import { ReferenceList, TrackerCard } from '../CharacterSheetSectionBits/CharacterSheetSectionBits'
import './CharacterSheetOverview.css'

function CharacterSheetOverview({
  abilities,
  activeReputation,
  attributeDetails,
  blueprint,
  character,
  corruption,
  focus,
  health,
  identityEntries,
  originBonus,
  progressionEntries,
  stamina,
  traits,
  woundTrack,
}) {
  return (
    <section className="character-sheet__overview-shell">
      <div className="character-sheet__overview-grid">
        <SectionCard className="character-sheet__panel character-sheet__panel--compact">
          <SectionCardHeader className="character-sheet__panel-header" title="Sheet Core" />

          <div className="character-sheet__stat-board">
            <section className="character-sheet__stat-section">
              <header>
                <h3>Attributes</h3>
              </header>
              <ReferenceList
                entries={ATTRIBUTE_KEYS.map((key) => ({
                  key,
                  label: getAttributeLabel(key),
                  meta: originBonus?.key === key ? `+${originBonus.amount}` : '',
                  value: character.attributes?.[key] ?? 0,
                  modifier: getRollModifier(character.attributes?.[key] ?? 0),
                  detail: `${attributeDetails[key]}\n\nModifier: ${getRollModifier(character.attributes?.[key] ?? 0)}${
                    originBonus?.key === key ? `\nOrigin Bonus: +${originBonus.amount}` : ''
                  }`,
                }))}
              />
            </section>
          </div>
        </SectionCard>

        <div className="character-sheet__middle-stack">
          <SectionCard className="character-sheet__panel character-sheet__panel--stacked">
            <SectionCardHeader className="character-sheet__panel-header" title="Abilities" />

            {abilities.length ? (
              <ReferenceList
                entries={toReferenceEntries(
                  abilities.map((ability) => ({
                    key: `${ability.source}-${ability.label}`,
                    label: ability.label,
                    meta: ability.source,
                    detail: ability.detail,
                  })),
                  { prefix: 'ability' },
                )}
                variant="tight"
              />
            ) : (
              <SectionCardEmpty>No abilities recorded yet.</SectionCardEmpty>
            )}
          </SectionCard>

          <SectionCard className="character-sheet__panel character-sheet__panel--stacked">
            <SectionCardHeader className="character-sheet__panel-header" title="Trackers" />

            <div className="character-sheet__tracker-grid">
              <TrackerCard
                label="Health"
                current={health.current}
                max={health.max}
                detail={`Current: ${health.current}\nMax: ${health.max}\nPulled from the saved resource track and defaults to Vitality when absent.`}
                tone="health"
              />
              <TrackerCard
                label="Stamina"
                current={stamina.current}
                max={stamina.max}
                detail={`Current: ${stamina.current}\nMax: ${stamina.max}\nTracks physical exertion, movement bursts, and martial ability costs.`}
                tone="default"
              />
              <TrackerCard
                label="Focus"
                current={focus.current}
                max={focus.max}
                detail={`Current: ${focus.current}\nMax: ${focus.max}\nUses the canonical mental and arcane resource track.`}
                tone="arcane"
              />
              <TrackerCard
                label="Wounds"
                current={woundTrack.current}
                max={woundTrack.max}
                detail={`Current wounds: ${woundTrack.current}\nCapacity: ${woundTrack.max}\nTracks active wound entries on the sheet.`}
                tone="danger"
              />
              <TrackerCard
                label="Corruption"
                current={corruption.current}
                max={corruption.max}
                detail={`Current: ${corruption.current}\nMax: ${corruption.max}\nDefaults to an empty track unless corruption data is saved.`}
                tone="corruption"
              />
            </div>
          </SectionCard>
        </div>

        <div className="character-sheet__top-stack">
          <SectionCard className="character-sheet__panel character-sheet__panel--stacked">
            <SectionCardHeader className="character-sheet__panel-header" title="Identity" />

            {identityEntries.length ? (
              <ReferenceList entries={identityEntries} variant="tight" />
            ) : (
              <SectionCardEmpty>No background details recorded yet.</SectionCardEmpty>
            )}
          </SectionCard>

          <SectionCard className="character-sheet__panel character-sheet__panel--stacked">
            <SectionCardHeader className="character-sheet__panel-header" title="Progression" />

            <ReferenceList entries={progressionEntries} variant="tight" />
          </SectionCard>

          <SectionCard className="character-sheet__panel character-sheet__panel--stacked">
            <SectionCardHeader className="character-sheet__panel-header" title="Identity Tags" />

            {traits.length ? (
              <ReferenceList
                entries={toReferenceEntries(
                  traits.map((trait) => ({
                    key: `${trait.source}-${trait.label}`,
                    label: trait.label,
                    meta: trait.source,
                    detail: trait.detail,
                  })),
                  { prefix: 'trait' },
                )}
                variant="tight"
              />
            ) : (
              <SectionCardEmpty>No identity tags recorded yet.</SectionCardEmpty>
            )}
          </SectionCard>

          <SectionCard className="character-sheet__panel character-sheet__panel--stacked">
            <SectionCardHeader className="character-sheet__panel-header" title="Reputation" />

            {activeReputation.length ? (
              <ReferenceList
                entries={activeReputation.map((entry) => {
                  const numericScore = Number(entry.value)
                  const track = getSystemReputationTrack(entry.key, blueprint)
                  const tier = getSystemReputationTier(numericScore, blueprint)

                  return {
                    ...entry,
                    detail: `${tier.label}. ${tier.effect}\n\n${track?.scope ?? 'No scope notes yet.'}`,
                  }
                })}
                variant="reputation"
              />
            ) : (
              <SectionCardEmpty>No reputation pressure recorded yet.</SectionCardEmpty>
            )}
          </SectionCard>
        </div>
      </div>
    </section>
  )
}

export default CharacterSheetOverview
