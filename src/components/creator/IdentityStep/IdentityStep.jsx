import {
  getSystemCallings,
  getSystemOriginPaths,
  getSystemOrigins,
} from '../../../data/archipelagoSystemSelectors'
import { useSystem } from '../../../hooks/useSystem'
import DetailPill from '../../ui/DetailPill'
import CreatorStepFrame from '../shared/CreatorStepFrame/CreatorStepFrame'
import '../shared/CreatorChoiceStyles/CreatorChoiceStyles.css'
import './IdentityStep.css'
import {
  getEmpirePathHighlight,
  getEmpirePathHighlightDetail,
  getOrderedPaths,
  getOriginStartingReputationPreview,
  getOriginSuggestedCalling,
  getReputationPillDetail,
  getReputationPillLabel,
  getSelectedPathEyebrow,
  getSelectedPathSummary,
  getWorldPathBadge,
} from './identityStepHelpers'

function ReputationPreview({ entries, blueprint }) {
  if (!entries.length) {
    return null
  }

  return (
    <div className="creator-reputation-preview">
      <span className="creator-highlight__eyebrow">Starting Reputation</span>
      <div className="creator-reputation-preview__chips">
        {entries.map(([trackKey, score]) => (
          <DetailPill
            key={trackKey}
            tone={score > 0 ? 'positive' : 'negative'}
            detail={getReputationPillDetail(trackKey, score, blueprint)}
          >
            {getReputationPillLabel(trackKey, score, blueprint)}
          </DetailPill>
        ))}
      </div>
    </div>
  )
}

function WorldPathCard({ isDimmed, isSelected, onSelect, path }) {
  const badge = getWorldPathBadge(path.id)

  return (
    <button
      type="button"
      className={`choice-card choice-card--path ${isSelected ? 'is-selected' : ''} ${
        isDimmed ? 'is-dimmed' : ''
      }`}
      onClick={onSelect}
    >
      <div className="choice-card__topline">
        <span className="choice-card__label">{path.name}</span>
        {badge ? <span className="choice-card__pill">{badge}</span> : null}
      </div>
      <span className="choice-card__meta">{path.description}</span>
      <p>{path.summary}</p>
    </button>
  )
}

function OriginCard({ blueprint, callings, identity, onIdentityChange, origin }) {
  const isSelected = identity.originId === origin.id
  const suggestedCalling = getOriginSuggestedCalling(origin, callings)
  const startingReputation = getOriginStartingReputationPreview(origin.id, blueprint)

  return (
    <button
      type="button"
      className={`choice-card choice-card--origin ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onIdentityChange('originId', origin.id)}
    >
      <div className="choice-card__section choice-card__section--header">
        <div className="choice-card__topline">
          <span className="choice-card__label">{origin.name}</span>
          {origin.identityTag ? (
            <DetailPill tone="default" detail={origin.identityTagDetail}>
              {origin.identityTag}
            </DetailPill>
          ) : suggestedCalling ? (
            <span className="choice-card__pill">Island-born</span>
          ) : null}
        </div>
        <span className="choice-card__meta">{origin.summary}</span>
      </div>

      <div className="choice-card__section choice-card__section--body">
        <p>{origin.lore}</p>
      </div>

      <div className="choice-card__section choice-card__section--footer">
        <div className="choice-card__stats">
          <DetailPill detail={`${origin.summary} This grants ${origin.bonus} to your starting attributes.`}>
            {origin.bonus}
          </DetailPill>
          <DetailPill detail={origin.passiveRule}>{origin.passive}</DetailPill>
          <DetailPill detail={origin.drawbackRule}>{origin.drawback}</DetailPill>
        </div>
        <ReputationPreview entries={startingReputation} blueprint={blueprint} />
      </div>
    </button>
  )
}

function WorldPathStep({ identity, onIdentityChange }) {
  const { blueprint } = useSystem()
  const callings = getSystemCallings(blueprint)
  const originPaths = getSystemOriginPaths(blueprint)
  const origins = getSystemOrigins(blueprint)
  const orderedPaths = getOrderedPaths(originPaths)
  const selectedPath = originPaths.find((path) => path.id === identity.path)
  const islandOrigins = origins.filter((origin) => origin.path === 'archipelago')
  const selectedOrigin = origins.find((origin) => origin.id === identity.originId)
  const selectedOriginReputation = selectedOrigin
    ? getOriginStartingReputationPreview(selectedOrigin.id, blueprint, 4)
    : []
  const isArchipelagoExpanded = identity.path === 'archipelago'

  return (
    <CreatorStepFrame
      step="Step 1"
      title="Set the character's roots"
      description="New players can stay with the two main powers. Lore-heavy players can open the Archipelago and choose from the island-born origins."
    >

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

        <div className={`choice-grid choice-grid--paths ${isArchipelagoExpanded ? 'is-archipelago-open' : ''}`}>
          {orderedPaths.map((path) => (
            <WorldPathCard
              key={path.id}
              path={path}
              isSelected={identity.path === path.id}
              isDimmed={Boolean(identity.path) && path.id !== identity.path}
              onSelect={() => onIdentityChange('path', path.id)}
            />
          ))}
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
            {islandOrigins.map((origin) => (
              <OriginCard
                key={origin.id}
                blueprint={blueprint}
                callings={callings}
                identity={identity}
                onIdentityChange={onIdentityChange}
                origin={origin}
              />
            ))}
          </div>
        </section>
      ) : null}

      {selectedPath ? (
        <section className="creator-highlight creator-highlight--origin">
          <span className="creator-highlight__eyebrow">{getSelectedPathEyebrow(isArchipelagoExpanded)}</span>
          <h3>{isArchipelagoExpanded ? selectedOrigin?.name || 'Select an island origin' : selectedPath.name}</h3>
          <p>{getSelectedPathSummary({ isArchipelagoExpanded, selectedOrigin, selectedPath })}</p>

          <div className="choice-card__stats">
            {selectedOrigin ? (
              <>
                <DetailPill detail={`${selectedOrigin.summary} This grants ${selectedOrigin.bonus} to your starting attributes.`}>
                  {selectedOrigin.bonus}
                </DetailPill>
                <DetailPill detail={selectedOrigin.passiveRule}>{selectedOrigin.passive}</DetailPill>
                <DetailPill detail={selectedOrigin.drawbackRule}>{selectedOrigin.drawback}</DetailPill>
              </>
            ) : isArchipelagoExpanded ? (
              <>
                <DetailPill detail="Choose one of the island-born origins above to lock in your local identity.">
                  Select an island
                </DetailPill>
                <DetailPill detail="Your chosen island will determine the stat bonus, passive, drawback, and starting reputation.">
                  Island defines your roots
                </DetailPill>
              </>
            ) : (
              <>
                <DetailPill detail="Choosing Yuma or Lilin assigns their core homeland origin automatically.">
                  Empire-born origin auto-assigned
                </DetailPill>
                <DetailPill detail={getEmpirePathHighlightDetail(selectedPath.id)}>
                  {getEmpirePathHighlight(selectedPath.id)}
                </DetailPill>
              </>
            )}
          </div>

          <ReputationPreview entries={selectedOriginReputation} blueprint={blueprint} />
        </section>
      ) : null}
    </CreatorStepFrame>
  )
}

function CallingStep({ identity, onIdentityChange }) {
  const { blueprint } = useSystem()
  const callings = getSystemCallings(blueprint)
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
                className={`choice-card choice-card--calling ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onIdentityChange('callingId', calling.id)}
              >
                <div className="choice-card__section choice-card__section--header">
                  <span className="choice-card__label">{calling.name}</span>
                  <span className="choice-card__meta">{calling.focus}</span>
                </div>
                <div className="choice-card__section choice-card__section--body">
                  <p>{calling.description}</p>
                </div>
                <div className="choice-card__section choice-card__section--footer">
                  <div className="choice-card__tags">
                    <DetailPill detail={`${calling.name} leans on ${calling.primaryStats.join(' and ')} most heavily.`}>
                      {calling.primaryStats.join(' / ')}
                    </DetailPill>
                    <DetailPill detail={calling.passiveRule}>
                      Passive: {calling.passive}
                    </DetailPill>
                    <DetailPill detail={`${calling.starterAbilityType}. ${calling.starterAbilityRule}`}>
                      {calling.starterAbility}
                    </DetailPill>
                  </div>
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
            <DetailPill detail={`${selectedCalling.name} leans on ${selectedCalling.primaryStats.join(' and ')} most heavily.`}>
              {selectedCalling.primaryStats.join(' / ')}
            </DetailPill>
            <DetailPill detail={selectedCalling.passiveRule}>
              Passive: {selectedCalling.passive}
            </DetailPill>
            <DetailPill detail={`${selectedCalling.starterAbilityType}. ${selectedCalling.starterAbilityRule}`}>
              {selectedCalling.starterAbility}
            </DetailPill>
          </div>
        </section>
      ) : null}
    </section>
  )
}

export { WorldPathStep, CallingStep }
