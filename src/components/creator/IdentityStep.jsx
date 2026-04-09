import { callings, originPaths, origins } from '../../data/gameData'

function IdentityStep({ identity, onIdentityChange }) {
  const selectedCalling = callings.find((calling) => calling.id === identity.callingId)

  return (
    <section className="creator-panel">
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">Step 1</p>
        <h2>Choose your calling</h2>
        <p>
          Start with the role this character is meant to play in the world.
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

function OriginStep({ identity, onIdentityChange }) {
  const visibleOrigins = origins.filter((origin) => origin.path === identity.path)
  return (
    <section className="creator-panel">
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">Step 2</p>
        <h2>Choose your origin</h2>
        <p>
          Pick the world path first, then choose the island or power that shaped this character.
        </p>
      </div>

      <div className="choice-group">
        <div className="choice-group__header">
          <h3>World path</h3>
          <p>Guided freedom first, then the deeper lore choices open underneath.</p>
        </div>
        <div className="choice-grid choice-grid--paths">
          {originPaths.map((path) => {
            const isSelected = identity.path === path.id

            return (
              <button
                key={path.id}
                type="button"
                className={`choice-card choice-card--compact ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onIdentityChange('path', path.id)}
              >
                <span className="choice-card__label">{path.name}</span>
                <p>{path.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="choice-group">
        <div className="choice-group__header">
          <h3>Origin</h3>
          <p>
            These are high-impact backgrounds: strong upside, real drawback, and a built-in story.
          </p>
        </div>
        <div className="choice-grid">
          {visibleOrigins.map((origin) => {
            const isSelected = identity.originId === origin.id
            const isRecommended = origin.recommendedCallings.includes(identity.callingId)

            return (
              <button
                key={origin.id}
                type="button"
                className={`choice-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onIdentityChange('originId', origin.id)}
              >
                <div className="choice-card__topline">
                  <span className="choice-card__label">{origin.name}</span>
                  {isRecommended ? <span className="choice-card__pill">Recommended</span> : null}
                </div>
                <p>{origin.summary}</p>
                <div className="choice-card__stats">
                  <span>{origin.bonus}</span>
                  <span>{origin.passive}</span>
                  <span>{origin.drawback}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { IdentityStep, OriginStep }
