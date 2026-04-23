import { Link } from 'react-router-dom'
import DetailPill from '../../../components/ui/DetailPill'
import './CharacterSheetHeader.css'

function CharacterSheetHeader({
  calling,
  character,
  characterRank,
  deleteError,
  isDeleting,
  onDelete,
  origin,
}) {
  return (
    <article className="dashboard-card character-sheet__toolbar">
      <div className="character-sheet__toolbar-main">
        <div className="character-sheet__toolbar-copy">
          <h1>{character.name}</h1>
          <p>
            {calling ? calling.name : character.calling} | {origin ? origin.name : character.origin} | Rank {characterRank}
            {character.pronouns ? ` | ${character.pronouns}` : ''}
          </p>
        </div>

        <div className="character-sheet__hero-pills">
          {calling?.primaryStats?.length ? (
            <DetailPill detail={`${calling.name} leans on ${calling.primaryStats.join(' and ')} most heavily.`}>
              {calling.primaryStats.join(' / ')}
            </DetailPill>
          ) : null}
          {origin?.bonus ? (
            <DetailPill detail={`${origin.summary} This grants ${origin.bonus} to your starting attributes.`}>
              {origin.bonus}
            </DetailPill>
          ) : null}
          {character.notes ? <DetailPill detail={character.notes}>Notes</DetailPill> : null}
        </div>
      </div>

      <div className="character-sheet__actions">
        <Link className="character-sheet__action-link" to={`/characters/${character._id}/edit`}>
          Edit
        </Link>
        <Link className="character-sheet__action-link" to="/characters/new">
          New
        </Link>
        <button
          className="character-sheet__delete"
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {deleteError ? <p className="dashboard-card__error">{deleteError}</p> : null}
    </article>
  )
}

export default CharacterSheetHeader
