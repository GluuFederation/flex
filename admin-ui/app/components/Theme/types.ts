export type ThemeContextState = {
  style: string
  color: string
  onChangeTheme?: (theme: Partial<{ style: string; color: string }>) => void
}
