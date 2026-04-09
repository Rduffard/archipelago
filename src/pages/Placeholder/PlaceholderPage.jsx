import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'

const pageContent = {
  '/campaigns/new': {
    eyebrow: 'Campaigns',
    title: 'Create a Campaign',
    description: 'This will become the DM setup flow for invites, roster control, and campaign framing.',
  },
  '/campaigns/open': {
    eyebrow: 'Campaigns',
    title: 'Open Campaign Search',
    description: 'This will become the place to browse public tables and match characters to active crews.',
  },
  '/achievements': {
    eyebrow: 'Achievements',
    title: 'Achievements',
    description: 'This can hold progression, relic milestones, and account-wide accomplishments later on.',
  },
  '/settings': {
    eyebrow: 'Settings',
    title: 'Settings',
    description: 'Account preferences, media handling, and presentation controls can live here soon.',
  },
}

function PlaceholderPage() {
  const location = useLocation()
  const page = pageContent[location.pathname]

  return (
    <main className="standalone-page">
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        backTo="/dashboard"
        backLabel="Return to dashboard"
      />

      <section className="placeholder-card">
        <p>
          The route is in place now, so the dashboard can navigate like a real product instead of trapping
          everything on one screen.
        </p>
        <Link to="/dashboard">Return to dashboard</Link>
      </section>
    </main>
  )
}

export default PlaceholderPage
