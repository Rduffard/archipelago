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
  const remainingAdvancement = Math.max(0, progression.advancementPoints ?? 0)

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
    <section className="creator-panel">
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">Step 7</p>
        <h2>Chart advancement</h2>
        <p>
          Set the character&apos;s current rank, banked progression currency, and the specialization
          track they&apos;ve already begun to carve open.
        </p>
      </div>

      <div className="creator-grid">
        <div className="creator-field">
          <label htmlFor="progression-rank">Rank</label>
          <input
            id="progression-rank"
            type="number"
            min="1"
            max="20"
            value={progression.rank}
            onChange={(event) => onProgressionChange('rank', event.target.value)}
          />
        </div>

        <div className="creator-field">
          <label htmlFor="progression-skill-points">Skill Points</label>
          <input
            id="progression-skill-points"
            type="number"
            min="0"
            value={progression.skillPoints}
            onChange={(event) => onProgressionChange('skillPoints', event.target.value)}
          />
        </div>

        <div className="creator-field">
          <label htmlFor="progression-advancement-points">Advancement Points</label>
          <input
            id="progression-advancement-points"
            type="number"
            min="0"
            value={progression.advancementPoints}
            onChange={(event) => onProgressionChange('advancementPoints', event.target.value)}
          />
        </div>

        <div className="creator-field">
          <label htmlFor="progression-specialization-path">Specialization Path</label>
          <select
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
          </select>
        </div>
      </div>

      {activeSpecialization ? (
        <div className="creator-stack creator-stack--specialization">
          <section className="choice-group">
            <div className="choice-group__header">
              <h3>{activeSpecialization.name}</h3>
              <p>{activeSpecialization.summary}</p>
              <p className="creator-loadout-hint">
                Recommended callings: {activeSpecialization.recommendedCallings.join(' / ')}
              </p>
              {activeSpecialization.recommendationReasons?.length ? (
                <p className="creator-skill-links">
                  Why it fits: {activeSpecialization.recommendationReasons.join(', ')}
                </p>
              ) : null}
            </div>

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
              {activeSpecialization.nodes.map((node) => {
                const isUnlocked = unlockedNodes.includes(node.id)
                const meetsRank = progression.rank >= node.rankRequired
                const canAfford = isUnlocked || remainingAdvancement >= node.cost

                return (
                  <label
                    key={node.id}
                    className={`attribute-row attribute-row--specialization ${
                      isUnlocked ? 'is-selected' : ''
                    }`}
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
                        onChange={(event) => handleNodeToggle(node.id, event.target.checked)}
                      />
                    </div>
                  </label>
                )
              })}
            </div>
          </section>
        </div>
      ) : (
        <div className="creator-stack creator-stack--specialization">
          <div className="creator-field creator-field--wide">
            <label>Unlocked Nodes</label>
            <p className="creator-loadout-hint">
              Choose a specialization path to unlock structured advancement nodes.
            </p>
          </div>

          {recommendedSpecializations.length ? (
            <section className="choice-group">
              <div className="choice-group__header">
                <h3>Recommended Paths</h3>
                <p>These fit the current calling well and give us a strong default direction.</p>
              </div>

              <div className="choice-grid">
                {recommendedSpecializations.map((specialization) => (
                  <button
                    key={specialization.id}
                    type="button"
                    className="choice-card choice-card--compact"
                    onClick={() => onProgressionChange('specializationPath', specialization.id)}
                  >
                    <h3>{specialization.name}</h3>
                    <p>{specialization.summary}</p>
                    <p className="creator-skill-links">Fit score {specialization.recommendationScore}</p>
                    {specialization.recommendationReasons?.length ? (
                      <p className="creator-loadout-hint">
                        {specialization.recommendationReasons.join(', ')}
                      </p>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {!recommendedSpecializations.length && rankedSpecializations.length ? (
            <section className="choice-group">
              <div className="choice-group__header">
                <h3>Open Paths</h3>
                <p>No path has a strong affinity yet, so these are sorted neutrally for exploration.</p>
              </div>

              <div className="choice-grid">
                {rankedSpecializations.slice(0, 3).map((specialization) => (
                  <button
                    key={specialization.id}
                    type="button"
                    className="choice-card choice-card--compact"
                    onClick={() => onProgressionChange('specializationPath', specialization.id)}
                  >
                    <h3>{specialization.name}</h3>
                    <p>{specialization.summary}</p>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </section>
  )
}

export default ProgressionStep
