import { createContext, useEffect, useState } from 'react'
import { getArchipelagoSystemBlueprint } from '../lib/api'
import { useAuth } from '../hooks/useAuth'

const SystemContext = createContext(null)

export function SystemProvider({ children }) {
  const { token } = useAuth()
  const [blueprint, setBlueprint] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(token))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setBlueprint(null)
      setError('')
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function loadBlueprint() {
      setIsLoading(true)
      setError('')

      try {
        const nextBlueprint = await getArchipelagoSystemBlueprint(token)

        if (!cancelled) {
          setBlueprint(nextBlueprint)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
          setBlueprint(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadBlueprint()

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <SystemContext.Provider
      value={{
        blueprint,
        isBlueprintLoading: isLoading,
        blueprintError: error,
      }}
    >
      {children}
    </SystemContext.Provider>
  )
}

export default SystemContext
