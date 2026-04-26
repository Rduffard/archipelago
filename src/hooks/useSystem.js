import { useContext } from 'react'
import SystemContext from '../contexts/SystemContext'

export function useSystem() {
  const context = useContext(SystemContext)

  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider')
  }

  return context
}
