import getThemeColor, { themeConfig } from '@/context/theme/config'
import { THEME_LIGHT, THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import customColors from '@/customColors'

describe('getThemeColor', () => {
  it('returns the light palette for the light theme', () => {
    const config = getThemeColor(THEME_LIGHT)
    expect(config).toBe(themeConfig[THEME_LIGHT])
    expect(config.background).toBe(customColors.lightBackground)
    expect(config.fontColor).toBe(customColors.primaryDark)
    expect(config.borderColor).toBe(customColors.lightBorder)
  })

  it('returns the dark palette for the dark theme', () => {
    const config = getThemeColor(THEME_DARK)
    expect(config).toBe(themeConfig[THEME_DARK])
    expect(config.background).toBe(customColors.darkBackground)
    expect(config.fontColor).toBe(customColors.white)
    expect(config.borderColor).toBe(customColors.darkBorder)
  })

  it('falls back to the default theme for an unknown theme name', () => {
    const config = getThemeColor('not-a-real-theme')
    expect(config).toBe(themeConfig[DEFAULT_THEME])
  })

  it('falls back to the default theme for an empty string', () => {
    const config = getThemeColor('')
    expect(config).toBe(themeConfig[DEFAULT_THEME])
  })

  it('produces distinct palettes for light and dark', () => {
    expect(getThemeColor(THEME_LIGHT)).not.toBe(getThemeColor(THEME_DARK))
    expect(getThemeColor(THEME_LIGHT).background).not.toBe(getThemeColor(THEME_DARK).background)
  })

  it('exposes the expected nested config sections', () => {
    const light = getThemeColor(THEME_LIGHT)
    expect(light.navbar.background).toBe(light.background)
    expect(light.menu.color).toBe(light.fontColor)
    expect(light.formFooter.back.backgroundColor).toBe(customColors.statusActive)
  })
})
