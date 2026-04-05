"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  COLOR_THEMES,
  DEFAULT_DARK_THEME_ID,
  DEFAULT_LIGHT_THEME_ID,
  getThemeMeta,
  type ColorThemeId,
} from "@/lib/color-themes"

const STORAGE_KEY = "portfolio-color-theme"

type ColorThemeContextValue = {
  colorTheme: ColorThemeId
  setColorTheme: (id: ColorThemeId) => void
  themesForCurrentMode: typeof COLOR_THEMES
}

const ColorThemeContext = React.createContext<ColorThemeContextValue | null>(null)

function resolveStoredTheme(
  resolvedTheme: string | undefined,
  stored: string | null
): ColorThemeId {
  const isDark = resolvedTheme === "dark"
  const defaultId = isDark ? DEFAULT_DARK_THEME_ID : DEFAULT_LIGHT_THEME_ID
  if (!stored) return defaultId

  const meta = getThemeMeta(stored as ColorThemeId)
  if (!meta) return defaultId
  if (meta.mode === "dark" && !isDark) return DEFAULT_LIGHT_THEME_ID
  if (meta.mode === "light" && isDark) return DEFAULT_DARK_THEME_ID
  return stored as ColorThemeId
}

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [colorTheme, setColorThemeState] = React.useState<ColorThemeId>(
    DEFAULT_DARK_THEME_ID
  )

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted || resolvedTheme === undefined) return

    const stored = localStorage.getItem(STORAGE_KEY)
    const next = resolveStoredTheme(resolvedTheme, stored)
    if (stored !== next) {
      localStorage.setItem(STORAGE_KEY, next)
    }
    document.documentElement.setAttribute("data-color-theme", next)
    setColorThemeState(next)
  }, [mounted, resolvedTheme])

  const setColorTheme = React.useCallback(
    (id: ColorThemeId) => {
      const meta = getThemeMeta(id)
      if (!meta) return
      localStorage.setItem(STORAGE_KEY, id)
      document.documentElement.setAttribute("data-color-theme", id)
      setColorThemeState(id)
      if (meta.mode === "dark") setTheme("dark")
      else setTheme("light")
    },
    [setTheme]
  )

  const themesForCurrentMode = React.useMemo(() => {
    const isDark = resolvedTheme !== "light"
    return COLOR_THEMES.filter((t) => t.mode === (isDark ? "dark" : "light"))
  }, [resolvedTheme])

  const value = React.useMemo(
    () => ({
      colorTheme,
      setColorTheme,
      themesForCurrentMode,
    }),
    [colorTheme, setColorTheme, themesForCurrentMode]
  )

  return (
    <ColorThemeContext.Provider value={value}>{children}</ColorThemeContext.Provider>
  )
}

export function useColorTheme() {
  const ctx = React.useContext(ColorThemeContext)
  if (!ctx) {
    throw new Error("useColorTheme must be used within ColorThemeProvider")
  }
  return ctx
}
