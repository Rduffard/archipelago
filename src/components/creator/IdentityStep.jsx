import { callings, originPaths, origins } from '../../data/gameData'

function WorldPathStep({ identity, onIdentityChange }) {
  const selectedPath = originPaths.find((path) => path.id === identity.path)
  const islandOrigins = origins.filter((origin) => origin.path === 'archipelago')
  const selectedOrigin = origins.find((origin) => origin.id === identity.originId)
  const isArchipelagoExpanded = identity.path === 'archipelago'
  const orderedPaths = [
    originPaths.find((path) => path.id === 'yuma'),
    originPaths.find((path) => path.id === 'archipelago'),
    originPaths.find((path) => path.id === 'lilin'),
  ].filter(Boolean)

  return (
    <section className="creator-panel">
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">Step 1</p>
        <h2>Set the character&apos;s roots</h2>
        <p>
          New players can stay with the two main powers. Lore-heavy players can open the
          Archipelago and choose from the island-born origins.
        </p>
      </div>

      <div className="creator-grid">
        <div className="creator-field">
          <label htmlFor="character-name">Name</label>
          <input
            id="character-name"
            name="name"
            type="text"
            placeholder="Captain, exile, prophet..."
            value={identity.name}
            onChange={(event) => onIdentityChange('name', event.target.value)}
          />
        </div>

        <div className="creator-field">
          <label htmlFor="character-pronouns">Pronouns</label>
          <input
            id="character-pronouns"
            name="pronouns"
            type="text"
            placeholder="Optional"
            value={identity.pronouns}
            onChange={(event) => onIdentityChange('pronouns', event.target.value)}
          />
        </div>
      </div>

      <div className="choice-group">
        <div className="choice-group__header">
          <h3>World Path</h3>
          <p>Pick a straightforward faction start or open the islands for more nuanced identity.</p>
        </div>

        <div
          className={`choice-grid choice-grid--paths ${
            isArchipelagoExpanded ? 'is-archipelago-open' : ''
          }`}
        >
          {orderedPaths.map((path) => {
            const isSelected = identity.path === path.id
            const isDimmed = Boolean(identity.path) && path.id !== identity.path

            return (
              <button
                key={path.id}
                type="button"
                className={`choice-card choice-card--path ${isSelected ? 'is-selected' : ''} ${
                  isDimmed ? 'is-dimmed' : ''
                }`}
                onClick={() => onIdentityChange('path', path.id)}
              >
                <div className="choice-card__topline">
                  <span className="choice-card__label">{path.name}</span>
                  {path.id === 'yuma' ? (
                    <span className="choice-card__pill">Tech-forged</span>
                  ) : null}
                  {path.id === 'lilin' ? (
                    <span className="choice-card__pill">Old magic</span>
                  ) : null}
                  {path.id === 'archipelago' ? (
                    <span className="choice-card__pill">Nuanced start</span>
                  ) : null}
                </div>
                <span className="choice-card__meta">{path.description}</span>
                <p>{path.summary}</p>
              </button>
            )
          })}
        </div>
      </div>

      {isArchipelagoExpanded ? (
        <section className="choice-group choice-group--nested">
          <div className="choice-group__header choice-group__header--split">
            <div>
              <h3>Archipelago Origins</h3>
              <p>
                Picking the islands is a deeper choice. Strong upside, real drawbacks, and more
                lore texture.
              </p>
            </div>

            <button
              type="button"
              className="creator-inline-back"
              onClick={() => onIdentityChange('path', '')}
            >
              Back to world paths
            </button>
          </div>

          <div className="choice-grid">
            {islandOrigins.map((origin) => {
              const isSelected = identity.originId === origin.id
              const suggestedCalling = callings.find((calling) =>
                origin.recommendedCallings.includes(calling.id),
              )?.name

              return (
                <button
                  key={origin.id}
                  type="button"
                  className={`choice-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onIdentityChange('originId', origin.id)}
                >
                  <div className="choice-card__topline">
                    <span className="choice-card__label">{origin.name}</span>
                    {suggestedCalling ? (
                      <span className="choice-card__pill">Nuanced origin</span>
                    ) : null}
                  </div>
                  <span className="choice-card__meta">{origin.summary}</span>
                  <p>{origin.lore}</p>
                  <div className="choice-card__stats">
                    <span>{origin.bonus}</span>
                    <span>{origin.passive}</span>
                    <span>{origin.drawback}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      ) : null}

      {selectedPath ? (
        <section className="creator-highlight creator-highlight--origin">
          <span className="creator-highlight__eyebrow">
            {isArchipelagoExpanded ? 'Selected Island Origin' : 'Selected World Path'}
          </span>
          <h3>{selectedOrigin?.name || selectedPath.name}</h3>
          <p>{isArchipelagoExpanded ? selectedOrigin?.lore : selectedPath.selectedBio}</p>
          <div className="choice-card__stats">
            {selectedOrigin ? (
              <>
                <span>{selectedOrigin.bonus}</span>
                <span>{selectedOrigin.passive}</span>
                <span>{selectedOrigin.drawback}</span>
              </>
            ) : (
              <>
                <span>Empire-born origin auto-assigned</span>
                <span>
                  {selectedPath.id === 'yuma' ? 'Recommended for new players' : 'Arcane-first start'}
                </span>
              </>
            )}
          </div>
        </section>
      ) : null}
    </section>
  )
}

function CallingStep({ identity, onIdentityChange }) {
  const selectedCalling = callings.find((calling) => calling.id === identity.callingId)

  return (
    <section className="creator-panel">
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">Step 2</p>
        <h2>Choose your calling</h2>
        <p>Pick the playstyle first, then we can layer culture and stats around it.</p>
      </div>

      <div className="choice-group">
        <div className="choice-group__header">
          <h3>Calling</h3>
          <p>Soft archetypes define playstyle without locking the whole build.</p>
        </div>
        <div className="choice-grid">
          {callings.map((calling) => {
            const isSelected = identity.callingId === calling.id

            return (
              <button
                key={calling.id}
                type="button"
                className={`choice-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onIdentityChange('callingId', calling.id)}
              >
                <span className="choice-card__label">{calling.name}</span>
                <span className="choice-card__meta">{calling.focus}</span>
                <p>{calling.description}</p>
                <div className="choice-card__tags">
                  <span>{calling.primaryStats.join(' / ')}</span>
                  <span>{calling.passive}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedCalling ? (
        <section className="creator-highlight">
          <span className="creator-highlight__eyebrow">Selected Calling</span>
          <h3>{selectedCalling.name}</h3>
          <p>{selectedCalling.description}</p>
          <div className="choice-card__stats">
            <span>{selectedCalling.passive}</span>
            <span>{selectedCalling.starterAbility}</span>
          </div>
        </section>
      ) : null}
    </section>
  )
}

export { WorldPathStep, CallingStep }
