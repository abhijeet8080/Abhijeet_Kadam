export type ThemeMode = "light" | "dark"

export type ColorThemeId =
  | "dark-plus"
  | "monokai"
  | "github-dark"
  | "dracula"
  | "solarized-dark"
  | "nord"
  | "one-dark"
  | "tokyo-night"
  | "gruvbox-dark"
  | "catppuccin-mocha"
  | "night-owl"
  | "light-plus"
  | "github-light"
  | "solarized-light"
  | "gruvbox-light"
  | "catppuccin-latte"

export type ColorThemeMeta = {
  id: ColorThemeId
  label: string
  /** Which appearance this palette targets */
  mode: ThemeMode
}

export const COLOR_THEMES: ColorThemeMeta[] = [
  { id: "dark-plus", label: "Dark+ (default)", mode: "dark" },
  { id: "monokai", label: "Monokai", mode: "dark" },
  { id: "github-dark", label: "GitHub Dark", mode: "dark" },
  { id: "dracula", label: "Dracula", mode: "dark" },
  { id: "solarized-dark", label: "Solarized Dark", mode: "dark" },
  { id: "nord", label: "Nord", mode: "dark" },
  { id: "one-dark", label: "One Dark", mode: "dark" },
  { id: "tokyo-night", label: "Tokyo Night", mode: "dark" },
  { id: "gruvbox-dark", label: "Gruvbox Dark", mode: "dark" },
  { id: "catppuccin-mocha", label: "Catppuccin Mocha", mode: "dark" },
  { id: "night-owl", label: "Night Owl", mode: "dark" },
  { id: "light-plus", label: "Light+ (default)", mode: "light" },
  { id: "github-light", label: "GitHub Light", mode: "light" },
  { id: "solarized-light", label: "Solarized Light", mode: "light" },
  { id: "gruvbox-light", label: "Gruvbox Light", mode: "light" },
  { id: "catppuccin-latte", label: "Catppuccin Latte", mode: "light" },
]

export const DEFAULT_DARK_THEME_ID: ColorThemeId = "dark-plus"
export const DEFAULT_LIGHT_THEME_ID: ColorThemeId = "light-plus"

export function getThemeMeta(id: ColorThemeId): ColorThemeMeta | undefined {
  return COLOR_THEMES.find((t) => t.id === id)
}
