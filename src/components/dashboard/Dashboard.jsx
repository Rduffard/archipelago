import { Link } from 'react-router-dom'
import CharacterRoster from '../characters/CharacterRoster'
import PageHeader from '../layout/PageHeader'
import './Dashboard.css'

const dashboardActions = [
  {
    to: '/characters/new',
    eyebrow: 'Create',
    title: 'Create a Character',
    description: 'Forge a new calling, origin, and stat spread for the next voyage.',
  },
  {
    to: '/campaigns/new',
    eyebrow: 'Create',
    title: 'Create a Campaign',
    description: 'Start the framework for a crew, a DM, and a long arc across the islands.',
  },
  {
    to: '/campaigns/open',
    eyebrow: 'Discover',
    title: 'Search Open Campaigns',
    description: 'Browse public tables and find a place to bring an existing character.',
  },
  {
    to: '/achievements',
    eyebrow: 'Progress',
    title: 'Achievements',
    description: 'Track milestones, relic paths, and the stories your account has built.',
  },
  {
    to: '/settings',
    eyebrow: 'Manage',
    title: 'Settings',
    description: 'Tune account preferences, presentation, and eventually media uploads.',
  },
]

function Dashboard({ user, characters }) {
  return (
    <main className="dashboard-page">
      <PageHeader
        eyebrow="Dashboard"
        title={user.name}
        description="Your Crossworld account now opens into Archipelago. Characters live here, but the identity stays shared."
      />

      <section className="dashboard-summary-strip">
        <div className="dashboard-stat">
          <span>Characters</span>
          <strong>{characters.length} / 20</strong>
        </div>
        <div className="dashboard-stat">
          <span>Campaigns</span>
          <strong>0 / 3</strong>
        </div>
        <div className="dashboard-stat">
          <span>Status</span>
          <strong>Voyage Ready</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="dashboard-card__header">
            <h2>Command Deck</h2>
            <p>The normal dashboard stuff lives here now. The creator has its own route.</p>
          </div>

          <div className="dashboard-action-grid">
            {dashboardActions.map((action) => (
              <Link key={action.to} className="dashboard-action-card" to={action.to}>
                <span className="dashboard-action-card__eyebrow">{action.eyebrow}</span>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card__header">
            <h2>Character Roster</h2>
            <p>Your saved sheets, ready for campaign assignment later.</p>
          </div>

          <CharacterRoster characters={characters} limit={5} />
        </article>
      </section>
    </main>
  )
}

export default Dashboard
