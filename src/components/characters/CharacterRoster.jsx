import { Link } from 'react-router-dom'
import '../dashboard/Dashboard.css'
import './CharacterRoster.css'

function resourceSummary(track) {
  if (!Number.isFinite(track?.current) || !Number.isFinite(track?.max)) return "Unavailable"
  return `${track.current} / ${track.max}`
}

function CharacterRoster({ characters = [], limit, createPath = "/characters/new" }) {
  characters = characters ?? []
  const visibleCharacters = typeof limit === 'number' ? characters.slice(0, limit) : characters
  const hiddenCount = Math.max(characters.length - visibleCharacters.length, 0)

  if (!characters.length) {
    return (
      <p className="dashboard-card__empty">
        No characters yet. Start with <Link to={createPath}>Create a Character</Link> and your first saved
        sheet will land here.
      </p>
    )
  }

  return (
    <div className="roster-list">
      {visibleCharacters.map((character) => (
        <Link key={character._id} className="roster-item" to={`/characters/${character._id}`}>
          <div>
            <h3>{character.name}</h3>
            <p>
              {character.calling} from {character.origin}
            </p>
          </div>
          <div className="roster-item__stats">
            <span>Health {resourceSummary(character.resources?.health)}</span>
            <span>Level {character.progression?.rank} · SRD 5.2.1</span>
          </div>
        </Link>
      ))}

      {hiddenCount ? (
        <p className="dashboard-card__empty">
          {hiddenCount} more character{hiddenCount === 1 ? '' : 's'} waiting below deck.
        </p>
      ) : null}
    </div>
  )
}

export default CharacterRoster

