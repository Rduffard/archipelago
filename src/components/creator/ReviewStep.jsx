import { callings, origins } from '../../data/gameData'

function ReviewStep({ identity, attributeValues, derivedStats }) {
  const calling = callings.find((entry) => entry.id === identity.callingId)
  const origin = origins.find((entry) => entry.id === identity.originId)

  return (
    <section className="creator-panel">
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">Step 3</p>
        <h2>Review the character frame</h2>
        <p>
          This is still boilerplate, but it already reflects your system: calling, origin, points, and derived stats.
        </p>
      </div>

      <div className="review-grid">
        <article className="review-card">
          <h3>Identity</h3>
          <dl>
            <div>
              <dt>Name</dt>
              <dd>{identity.name || 'Unnamed'}</dd>
            </div>
            <div>
              <dt>Pronouns</dt>
              <dd>{identity.pronouns || 'Unspecified'}</dd>
            </div>
            <div>
              <dt>Calling</dt>
              <dd>{calling?.name || 'Choose one'}</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>{origin?.name || 'Choose one'}</dd>
            </div>
          </dl>
        </article>

        <article className="review-card">
          <h3>Attributes</h3>
          <dl>
            {Object.entries(attributeValues).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="review-card">
          <h3>Derived Stats</h3>
          <dl>
            {Object.entries(derivedStats).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  )
}

export default ReviewStep
