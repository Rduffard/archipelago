import { ATTRIBUTE_CAP, attributes } from '../../data/gameData'
import { getRemainingPoints } from '../../lib/character'

function AttributesStep({ attributeValues, onAttributeChange }) {
  const remainingPoints = getRemainingPoints(attributeValues)

  return (
    <section className="creator-panel">
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">Step 3</p>
        <h2>Spend your attribute points</h2>
        <p>
          Keep it readable and thematic: 12 points total, up to {ATTRIBUTE_CAP} in any one attribute.
        </p>
      </div>

      <div className="points-banner">
        <span>Points remaining</span>
        <strong>{remainingPoints}</strong>
      </div>

      <div className="attribute-list">
        {attributes.map((attribute) => {
          const value = attributeValues[attribute.key]

          return (
            <div key={attribute.key} className="attribute-row">
              <div>
                <h3>{attribute.name}</h3>
                <p>{attribute.description}</p>
              </div>

              <div className="attribute-row__controls">
                <button
                  type="button"
                  onClick={() => onAttributeChange(attribute.key, value - 1)}
                  disabled={value <= 0}
                >
                  -
                </button>
                <span>{value}</span>
                <button
                  type="button"
                  onClick={() => onAttributeChange(attribute.key, value + 1)}
                  disabled={value >= ATTRIBUTE_CAP || remainingPoints <= 0}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default AttributesStep
