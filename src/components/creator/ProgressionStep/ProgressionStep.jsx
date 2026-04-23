import {
  getNodeUnlockState,
  getRemainingAdvancement,
  getVisibleRankedSpecializations,
} from './progressionStepHelpers'
import CreatorStepFrame from '../shared/CreatorStepFrame/CreatorStepFrame'
import {
  CreatorField,
  CreatorInput,
  CreatorLabel,
  CreatorSectionHeader,
  CreatorSelect,
} from '../shared/CreatorForm/CreatorForm'
import '../shared/CreatorChoiceStyles/CreatorChoiceStyles.css'
import '../shared/CreatorSurfaceStyles/CreatorSurfaceStyles.css'
import './ProgressionStep.css'

function ProgressionFields({ onProgressionChange, progression, specializations, isCustomPath }) {
  return (
    <div className="creator-grid">
      <CreatorField>
        <CreatorLabel htmlFor="progression-rank">Rank</CreatorLabel>
        <CreatorInput
          id="progression-rank"
          type="number"
          min="1"
          max="20"
          value={progression.rank}
          onChange={(event) => onProgressionChange('rank', event.target.value)}
        />
      </CreatorField>

      <CreatorField>
        <CreatorLabel htmlFor="progression-skill-points">Skill Points</CreatorLabel>
        <CreatorInput
          id="progression-skill-points"
          type="number"
          min="0"
          value={progression.skillPoints}
          onChange={(event) => onProgressionChange('skillPoints', event.target.value)}
        />
      </CreatorField>

      <CreatorField>
        <CreatorLabel htmlFor="progression-advancement-points">Advancement Points</CreatorLabel>
        <CreatorInput
          id="progression-advancement-points"
          type="number"
          min="0"
          value={progression.advancementPoints}
          onChange={(event) => onProgressionChange('advancementPoints', event.target.value)}
        />
      </CreatorField>

      <CreatorField>
        <CreatorLabel htmlFor="progression-specialization-path">Specialization Path</CreatorLabel>
        <CreatorSelect
          id="progression-specialization-path"
          value={progression.specializationPath}
          onChange={(event) => onProgressionChange('specializationPath', event.target.value)}
        >
          <option value="">Choose a specialization path</option>
          {isCustomPath ? (
            <option value={progression.specializationPath}>{progression.specializationPath}</option>
          ) : null}
          {specializations.map((specialization) => (
            <option key={specialization.id} value={specialization.id}>
              {specialization.name}
            </option>
          ))}
        </CreatorSelect>
      </CreatorField>
    </div>
  )
}

function SpecializationNodeRow({
  advancementSpent,
  node,
  onNodeToggle,
  progression,
  remainingAdvancement,
  unlockedNodes,
}) {
  const { canAfford, isUnlocked, meetsRank } = getNodeUnlockState({
    node,
    progression,
    remainingAdvancement,
    unlockedNodes,
  })

  return (
    <label
      className={`attribute-row attribute-row--specialization ${isUnlocked ? 'is-selected' : ''}`}
    >
      <div>
        <h3>{node.name}</h3>
        <p>{node.summary}</p>
        <p className="creator-skill-links">
          Rank {node.rankRequired} / Cost {node.cost}
        </p>
        <p className="creator-loadout-hint">{node.effect}</p>
        {!meetsRank ? (
          <p className="creator-skill-links">Requires rank {node.rankRequired} to unlock.</p>
        ) : null}
        {!canAfford ? (
          <p className="creator-skill-links">Not enough banked advancement points.</p>
        ) : null}
      </div>

      <div className="attribute-row__controls">
        <input
          type="checkbox"
          checked={isUnlocked}
          disabled={(!meetsRank || !canAfford) && !isUnlocked}
          onChange={(event) => onNodeToggle(node.id, event.target.checked)}
        />
      </div>
    </label>
  )
}

function ActiveSpecializationPanel({
  activeSpecialization,
  advancementSpent,
  onNodeToggle,
  progression,
  remainingAdvancement,
  unlockedNodes,
}) {
  return (
    <section className="choice-group">
      <CreatorSectionHeader title={activeSpecialization.name} description={activeSpecialization.summary} />
      <p className="creator-loadout-hint">
        Recommended callings: {activeSpecialization.recommendedCallings.join(' / ')}
      </p>
      {activeSpecialization.recommendationReasons?.length ? (
        <p className="creator-skill-links">
          Why it fits: {activeSpecialization.recommendationReasons.join(', ')}
        </p>
      ) : null}

      <div className="points-banner">
        <div>
          <span className="creator-summary__label">Advancement Spend</span>
          <p>Unlocking a node spends from the banked advancement pool automatically.</p>
        </div>
        <strong>
          {remainingAdvancement} banked / {advancementSpent} invested
        </strong>
      </div>

      <div className="attribute-list">
        {activeSpecialization.nodes.map((node) => (
          <SpecializationNodeRow
            key={node.id}
            advancementSpent={advancementSpent}
            node={node}
            onNodeToggle={onNodeToggle}
            progression={progression}
            remainingAdvancement={remainingAdvancement}
            unlockedNodes={unlockedNodes}
          />
        ))}
      </div>
    </section>
  )
}

function RecommendedPathCard({ onProgressionChange, specialization, showScore = false }) {
  return (
    <button
      type="button"
      className="choice-card choice-card--compact"
      onClick={() => onProgressionChange('specializationPath', specialization.id)}
    >
      <h3>{specialization.name}</h3>
      <p>{specialization.summary}</p>
      {showScore ? (
        <p className="creator-skill-links">Fit score {specialization.recommendationScore}</p>
      ) : null}
      {specialization.recommendationReasons?.length ? (
        <p className="creator-loadout-hint">
          {specialization.recommendationReasons.join(', ')}
        </p>
      ) : null}
    </button>
  )
}

function InactiveSpecializationPanel({
  onProgressionChange,
  rankedSpecializations,
  recommendedSpecializations,
}) {
  const visibleRankedSpecializations = getVisibleRankedSpecializations(rankedSpecializations)

  return (
    <div className="creator-stack creator-stack--specialization">
      <CreatorField className="creator-field--wide">
        <CreatorLabel>Unlocked Nodes</CreatorLabel>
        <p className="creator-loadout-hint">
          Choose a specialization path to unlock structured advancement nodes.
        </p>
      </CreatorField>

      {recommendedSpecializations.length ? (
        <section className="choice-group">
          <CreatorSectionHeader
            title="Recommended Paths"
            description="These fit the current calling well and give us a strong default direction."
          />

          <div className="choice-grid">
            {recommendedSpecializations.map((specialization) => (
              <RecommendedPathCard
                key={specialization.id}
                onProgressionChange={onProgressionChange}
                showScore
                specialization={specialization}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!recommendedSpecializations.length && rankedSpecializations.length ? (
        <section className="choice-group">
          <CreatorSectionHeader
            title="Open Paths"
            description="No path has a strong affinity yet, so these are sorted neutrally for exploration."
          />

          <div className="choice-grid">
            {visibleRankedSpecializations.map((specialization) => (
              <RecommendedPathCard
                key={specialization.id}
                onProgressionChange={onProgressionChange}
                specialization={specialization}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function ProgressionStep({
  progression,
  specializations,
  activeSpecialization,
  recommendedSpecializations,
  rankedSpecializations,
  advancementSpent,
  onProgressionChange,
}) {
  const unlockedNodes = progression.unlockedNodes ?? []
  const isCustomPath = progression.specializationPath && !activeSpecialization
  const remainingAdvancement = getRemainingAdvancement(progression)

  function handleNodeToggle(nodeId, checked) {
    const node = activeSpecialization?.nodes?.find((entry) => entry.id === nodeId)

    if (!node) {
      return
    }

    const nextUnlockedNodes = checked
      ? [...new Set([...unlockedNodes, nodeId])]
      : unlockedNodes.filter((entry) => entry !== nodeId)
    const nextAdvancementPoints = checked
      ? Math.max(0, remainingAdvancement - node.cost)
      : remainingAdvancement + node.cost

    onProgressionChange('unlockedNodes', nextUnlockedNodes)
    onProgressionChange('advancementPoints', nextAdvancementPoints)
  }

  return (
    <CreatorStepFrame
      step="Step 7"
      title="Chart advancement"
      description="Set the character's current rank, banked progression currency, and the specialization track they've already begun to carve open."
    >

      <ProgressionFields
        onProgressionChange={onProgressionChange}
        progression={progression}
        specializations={specializations}
        isCustomPath={isCustomPath}
      />

      {activeSpecialization ? (
        <div className="creator-stack creator-stack--specialization">
          <ActiveSpecializationPanel
            activeSpecialization={activeSpecialization}
            advancementSpent={advancementSpent}
            onNodeToggle={handleNodeToggle}
            progression={progression}
            remainingAdvancement={remainingAdvancement}
            unlockedNodes={unlockedNodes}
          />
        </div>
      ) : (
        <InactiveSpecializationPanel
          onProgressionChange={onProgressionChange}
          rankedSpecializations={rankedSpecializations}
          recommendedSpecializations={recommendedSpecializations}
        />
      )}
    </CreatorStepFrame>
  )
}

export default ProgressionStep
