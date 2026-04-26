import './CharacterSheetSectionBits.css'

export function ReferenceList({ entries, variant = 'default' }) {
  return (
    <div className={`character-sheet__reference-list character-sheet__reference-list--${variant}`}>
      {entries.map((entry) => (
        <article
          key={entry.key}
          className={`character-sheet__reference-row ${entry.detail ? 'has-detail' : ''} ${
            !entry.value && !entry.modifier ? 'is-text-only' : ''
          }`}
          tabIndex={entry.detail ? 0 : undefined}
        >
          <div className="character-sheet__reference-main">
            <div className="character-sheet__reference-copy">
              <strong>{entry.label}</strong>
              {entry.meta ? <span>{entry.meta}</span> : null}
            </div>
            {entry.value || entry.modifier ? (
              <div className="character-sheet__reference-values">
                {entry.value ? <span className="character-sheet__reference-score">{entry.value}</span> : null}
                {entry.modifier ? <span className="character-sheet__reference-modifier">{entry.modifier}</span> : null}
              </div>
            ) : null}
          </div>
          {entry.detail ? <div className="character-sheet__reference-detail">{entry.detail}</div> : null}
        </article>
      ))}
    </div>
  )
}

export function TrackerCard({ current, detail, label, max, tone = 'default' }) {
  const pipCount = Math.max(max ?? 0, current ?? 0)
  const safeCurrent = Math.max(0, Math.min(current ?? 0, pipCount))

  return (
    <article
      className={`character-sheet__tracker-card ${detail ? 'has-detail' : ''} character-sheet__tracker-card--${tone}`}
      tabIndex={detail ? 0 : undefined}
    >
      <div className="character-sheet__tracker-head">
        <strong>{label}</strong>
        <span>
          {current}/{max}
        </span>
      </div>
      <div className="character-sheet__tracker-pips" aria-hidden="true">
        {Array.from({ length: pipCount }).map((_, index) => (
          <span
            key={`${label}-${index}`}
            className={index < safeCurrent ? 'is-filled' : ''}
          />
        ))}
      </div>
      {detail ? <div className="character-sheet__tracker-detail">{detail}</div> : null}
    </article>
  )
}
