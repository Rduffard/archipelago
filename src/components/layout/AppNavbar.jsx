import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/map', label: 'Lore Map' },
  { to: '/characters', label: 'Characters' },
  { to: '/campaigns/new', label: 'Campaigns' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/settings', label: 'Settings' },
]

function AppNavbar({ onSignOut }) {
  return (
    <header className="app-navbar">
      <div className="app-navbar__brand">
        <p className="app-navbar__eyebrow">Crossworld Creative</p>
        <span>Sanguine Archipelago</span>
      </div>

      <nav className="app-navbar__links" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `app-navbar__link ${isActive ? 'is-active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="app-navbar__signout" onClick={onSignOut}>
        Sign Out
      </button>
    </header>
  )
}

export default AppNavbar
