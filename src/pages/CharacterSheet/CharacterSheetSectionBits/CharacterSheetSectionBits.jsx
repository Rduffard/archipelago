import HoverInfo from '../../../components/ui/HoverInfo/HoverInfo'
import './CharacterSheetSectionBits.css'

export function ReferenceList({ entries, variant = 'default' }) {
  return (
    <div className={`character-sheet__reference-list character-sheet__reference-list--${variant}`}>
      {entries.map((entry) => (
        <HoverInfo
          as="article"
          key={entry.key}
          className={`character-sheet__reference-row ${
            !entry.value && !entry.modifier ? 'is-text-only' : ''
          }`}
          content={entry.detail}
          contentClassName="character-sheet__reference-detail"
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
        </HoverInfo>
      ))}
    </div>
  )
}

export function PipTrack({ current, label, max }) {
  const pipCount = Math.max(max ?? 0, current ?? 0)
  const safeCurrent = Math.max(0, Math.min(current ?? 0, pipCount))

  return (
    <div className="character-sheet__tracker-pips" aria-label={`${label}: ${current} of ${max}`}>
      {Array.from({ length: pipCount }).map((_, index) => (
        <span
          key={`${label}-${index}`}
          className={index < safeCurrent ? 'is-filled' : ''}
        />
      ))}
    </div>
  )
}

export function TrackerCard({ current, detail, label, max, tone = 'default' }) {
  return (
    <HoverInfo
      as="article"
      className={`character-sheet__tracker-card character-sheet__tracker-card--${tone}`}
      content={detail}
      contentClassName="character-sheet__tracker-detail"
    >
      <div className="character-sheet__tracker-head">
        <strong>{label}</strong>
        <span>
          {current}/{max}
        </span>
      </div>
      <PipTrack current={current} label={label} max={max} />
    </HoverInfo>
  )
}
