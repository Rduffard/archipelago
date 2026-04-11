import { Link } from 'react-router-dom'
import CharacterRoster from '../../components/characters/CharacterRoster'
import '../../components/dashboard/Dashboard.css'
import PageHeader from '../../components/layout/PageHeader'
import { useAuth } from '../../hooks/useAuth'
import '../shared/PageShell.css'
import './CharactersPage.css'

function CharactersPage() {
  const { characters } = useAuth()

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Characters"
        title="Your Roster"
        description="Every saved sheet lives here, independent from campaigns so you can reuse builds across stories."
      />

      <section className="characters-toolbar">
        <div className="dashboard-stat">
          <span>Total Characters</span>
          <strong>{characters.length} / 20</strong>
        </div>

        <Link className="characters-toolbar__cta" to="/characters/new">
          Create a Character
        </Link>
      </section>

      <section className="dashboard-card">
        <div className="dashboard-card__header">
          <h2>Roster</h2>
          <p>Eventually this page can support search, filters, and campaign assignment.</p>
        </div>

        <CharacterRoster characters={characters} />
      </section>
    </main>
  )
}

export default CharactersPage
