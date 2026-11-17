import { Link } from 'react-router-dom'
import CharacterRoster from '../../components/characters/CharacterRoster'
import '../../components/dashboard/Dashboard.css'
import PageHeader from '../../components/layout/PageHeader'
import { useAuth } from '../../hooks/useAuth'
import { characterCreationPath } from '../../game/creator/previewEnabled'
import '../shared/PageShell.css'
import './CharactersPage.css'

function CharactersPage() {
  const { characters } = useAuth()

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Characters"
        title="Your Roster"
        description="Open a saved sheet or register an unassigned character from its campaign page."
      />

      <section className="characters-toolbar">
        <div className="dashboard-stat">
          <span>Total Characters</span>
          <strong>{characters.length} / 20</strong>
        </div>

        <Link className="characters-toolbar__cta" to={characterCreationPath}>
          Create a Character
        </Link>
      </section>

      <section className="dashboard-card">
        <div className="dashboard-card__header">
          <h2>Roster</h2>
          <p><Link to="/campaigns/open">Open your campaigns</Link></p>
        </div>

        <CharacterRoster characters={characters} createPath={characterCreationPath} />
      </section>
    </main>
  )
}

export default CharactersPage
