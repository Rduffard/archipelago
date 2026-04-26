import { createContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getUserSettings } from '../lib/api'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'cw_theme'
const DEFAULT_THEME = 'default'
const DEFAULT_THEME_FLAVOR = 'default'
const DEFAULT_ACCENT_OVERRIDE = ''
const APP_DEFAULT_THEME = 'dark'
const APP_DEFAULT_ACCENT = '#d1b38f'
const THEME_FLAVOR_ACCENTS = {
  default: APP_DEFAULT_ACCENT,
  crossworld: '#e5be6e',
  archipelago: '#d1b38f',
  squash: '#ff914d',
  paleshelter: '#efc878',
  taxicop: '#f4c84b',
  lilan: '#9ccf61',
  yuma: '#d88f4c',
}

function normalizeThemeMode(value) {
  return ['default', 'system', 'light'].includes(value) ? value : DEFAULT_THEME
}

function normalizeThemeFlavor(value) {
  return Object.hasOwn(THEME_FLAVOR_ACCENTS, value)
    ? value
    : DEFAULT_THEME_FLAVOR
}

function normalizeAccentColor(value) {
  if (typeof value !== 'string') {
    return DEFAULT_ACCENT_OVERRIDE
  }

  const normalizedValue = value.trim()
  return normalizedValue && normalizedValue !== 'default'
    ? normalizedValue
    : DEFAULT_ACCENT_OVERRIDE
}

function readStoredThemePreferences() {
  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return {
      themeMode: DEFAULT_THEME,
      themeFlavor: DEFAULT_THEME_FLAVOR,
      accentColor: DEFAULT_ACCENT_OVERRIDE,
    }
  }

  try {
    const parsed = JSON.parse(raw)

    return {
      themeMode: normalizeThemeMode(parsed?.theme ?? parsed?.themeMode),
      themeFlavor: normalizeThemeFlavor(parsed?.themeFlavor ?? parsed?.brandSkin),
      accentColor: normalizeAccentColor(parsed?.accentOverride ?? parsed?.accentColor),
    }
  } catch {
    return {
      themeMode: DEFAULT_THEME,
      themeFlavor: DEFAULT_THEME_FLAVOR,
      accentColor: DEFAULT_ACCENT_OVERRIDE,
    }
  }
}

function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return APP_DEFAULT_THEME
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function resolveThemeMode(themeMode, systemTheme) {
  if (themeMode === 'system') {
    return systemTheme
  }

  if (themeMode === DEFAULT_THEME) {
    return APP_DEFAULT_THEME
  }

  return themeMode
}

export function ThemeProvider({ children }) {
  const { token, user } = useAuth()
  const storedPreferences = readStoredThemePreferences()
  const [localThemeMode, setLocalThemeMode] = useState(storedPreferences.themeMode)
  const [localThemeFlavor, setLocalThemeFlavor] = useState(storedPreferences.themeFlavor)
  const [localAccentColor, setLocalAccentColor] = useState(storedPreferences.accentColor)
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme())

  const themeMode = normalizeThemeMode(user?.settings?.theme ?? localThemeMode)
  const storedThemeFlavor = normalizeThemeFlavor(
    user?.settings?.brandSkin ?? localThemeFlavor,
  )
  const accentColor = normalizeAccentColor(
    user?.settings?.accentColor ?? localAccentColor,
  )
  const resolvedTheme = resolveThemeMode(themeMode, systemTheme)
  const hasThemeOverride = themeMode !== DEFAULT_THEME
  const effectiveThemeFlavor = hasThemeOverride
    ? storedThemeFlavor
    : DEFAULT_THEME_FLAVOR
  const hasFlavorOverride = effectiveThemeFlavor !== DEFAULT_THEME_FLAVOR
  const nativeAccentColor =
    THEME_FLAVOR_ACCENTS[effectiveThemeFlavor] ?? APP_DEFAULT_ACCENT
  const hasAccentOverride = hasThemeOverride && Boolean(accentColor)
  const resolvedAccentColor = hasAccentOverride
    ? accentColor
    : nativeAccentColor

  useEffect(() => {
    if (hasThemeOverride) {
      document.documentElement.dataset.theme = resolvedTheme
      document.documentElement.dataset.themeMode = themeMode
    } else {
      delete document.documentElement.dataset.theme
      delete document.documentElement.dataset.themeMode
    }

    if (hasFlavorOverride) {
      document.documentElement.dataset.themeFlavor = effectiveThemeFlavor
      document.documentElement.dataset.brandSkin = effectiveThemeFlavor
    } else {
      delete document.documentElement.dataset.themeFlavor
      delete document.documentElement.dataset.brandSkin
    }

    document.documentElement.style.setProperty('--cw-accent', resolvedAccentColor)
    document.documentElement.style.setProperty(
      '--cw-accent-soft',
      `color-mix(in srgb, ${resolvedAccentColor} 16%, transparent)`,
    )

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        theme: themeMode,
        themeMode,
        themeFlavor: storedThemeFlavor,
        brandSkin: storedThemeFlavor,
        accentColor,
        accentOverride: accentColor,
      }),
    )
  }, [
    accentColor,
    effectiveThemeFlavor,
    hasFlavorOverride,
    hasThemeOverride,
    resolvedAccentColor,
    resolvedTheme,
    storedThemeFlavor,
    themeMode,
  ])

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!token || user?.settings) {
      return undefined
    }

    let cancelled = false

    getUserSettings(token)
      .then((response) => {
        if (cancelled) return

        setLocalThemeMode(normalizeThemeMode(response?.settings?.theme))
        setLocalThemeFlavor(
          normalizeThemeFlavor(response?.settings?.brandSkin),
        )
        setLocalAccentColor(
          normalizeAccentColor(response?.settings?.accentColor),
        )
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [token, user])

  const value = useMemo(
    () => ({
      theme: themeMode,
      themeMode,
      themeFlavor: storedThemeFlavor,
      effectiveThemeFlavor,
      brandSkin: storedThemeFlavor,
      accentColor,
      resolvedAccentColor,
      resolvedTheme,
      setTheme: setLocalThemeMode,
      setThemeMode: setLocalThemeMode,
      setThemeFlavor: setLocalThemeFlavor,
      setBrandSkin: setLocalThemeFlavor,
      setAccentColor: setLocalAccentColor,
    }),
    [
      accentColor,
      effectiveThemeFlavor,
      resolvedAccentColor,
      resolvedTheme,
      storedThemeFlavor,
      themeMode,
    ],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeContext
