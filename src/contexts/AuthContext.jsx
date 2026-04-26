import { createContext, useEffect, useState } from 'react'
import { getCharacters, getCurrentUser, signIn, signUp } from '../lib/api'

const AuthContext = createContext(null)

const AUTH_KEY = 'cw_auth'
const LEGACY_AUTH_KEY = 'cw_archipelago_auth'

function readStoredAuth() {
  const raw = window.localStorage.getItem(AUTH_KEY)

  if (!raw) {
    const legacyRaw = window.localStorage.getItem(LEGACY_AUTH_KEY)

    if (!legacyRaw) {
      return { token: null, user: null }
    }

    try {
      const parsed = JSON.parse(legacyRaw)
      const migrated = {
        token: parsed?.token ?? null,
        user: parsed?.user ?? null,
      }

      window.localStorage.setItem(AUTH_KEY, JSON.stringify(migrated))
      window.localStorage.removeItem(LEGACY_AUTH_KEY)

      return migrated
    } catch {
      window.localStorage.removeItem(LEGACY_AUTH_KEY)
      return { token: null, user: null }
    }
  }

  try {
    const parsed = JSON.parse(raw)
    return {
      token: parsed?.token ?? null,
      user: parsed?.user ?? null,
    }
  } catch {
    window.localStorage.removeItem(AUTH_KEY)
    return { token: null, user: null }
  }
}

function writeStoredAuth({ token, user }) {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }))
  window.localStorage.removeItem(LEGACY_AUTH_KEY)
}

function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_KEY)
  window.localStorage.removeItem(LEGACY_AUTH_KEY)
}

export function AuthProvider({ children }) {
  const stored = readStoredAuth()

  const [token, setToken] = useState(stored.token)
  const [user, setUser] = useState(stored.user)
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(Boolean(stored.token))

  useEffect(() => {
    if (!token) {
      setUser(null)
      setCharacters([])
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function bootstrapSession() {
      setIsLoading(true)

      try {
        const [nextUser, nextCharacters] = await Promise.all([
          getCurrentUser(token),
          getCharacters(token),
        ])

        if (cancelled) {
          return
        }

        setUser(nextUser)
        setCharacters(nextCharacters)
        writeStoredAuth({ token, user: nextUser })
      } catch {
        if (!cancelled) {
          setToken(null)
          setUser(null)
          setCharacters([])
          clearStoredAuth()
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    bootstrapSession()

    return () => {
      cancelled = true
    }
  }, [token])

  async function login(credentials) {
    const result = await signIn(credentials)
    const nextUser = await getCurrentUser(result.token)

    setToken(result.token)
    setUser(nextUser)
    writeStoredAuth({ token: result.token, user: nextUser })

    const nextCharacters = await getCharacters(result.token)
    setCharacters(nextCharacters)

    return nextUser
  }

  async function signup(credentials) {
    await signUp(credentials)
    return login({
      email: credentials.email,
      password: credentials.password,
    })
  }

  function logout() {
    setToken(null)
    setUser(null)
    setCharacters([])
    clearStoredAuth()
  }

  const value = {
    token,
    user,
    characters,
    isLoading,
    login,
    signup,
    logout,
    setCharacters,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
