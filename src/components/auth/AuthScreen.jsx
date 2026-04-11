import { useState } from 'react'
import './AuthScreen.css'

function AuthScreen({ onSubmit, isLoading, errorMessage }) {
  const [mode, setMode] = useState('signin')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(mode, formData)
  }

  return (
    <main className="auth-screen">
      <section className="auth-panel">
        <p className="auth-panel__eyebrow">Crossworld Creative</p>
        <h1>Sanguine Archipelago</h1>
        <p className="auth-panel__copy">
          Sign in to manage characters, track campaigns, and eventually roll live at the table.
        </p>

        <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === 'signin' ? 'is-active' : ''}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'is-active' : ''}
            onClick={() => setMode('signup')}
          >
            Create Account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' ? (
            <label>
              <span>Name</span>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Captain Romain"
              />
            </label>
          ) : null}

          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="captain@crossworldcreative.com"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="........"
              required
            />
          </label>

          {errorMessage ? <p className="auth-form__error">{errorMessage}</p> : null}

          <button className="auth-form__submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Working...' : mode === 'signin' ? 'Enter the Archipelago' : 'Create Account'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AuthScreen
