import { createElement, type ReactNode } from 'react'
import { renderHook } from '@testing-library/react'
import { ThemeContext } from '@/context/theme/themeContext'
import type { ThemeContextType } from '@/context/theme/themeContext'
import { themeConfig } from '@/context/theme/config'
import { THEME_LIGHT, THEME_DARK, DEFAULT_THEME, type ThemeValue } from '@/context/theme/constants'
import { useNavbarTheme } from '../../hooks/useNavbarTheme'

const makeWrapper = (theme: ThemeValue) => {
  const value: ThemeContextType = {
    state: { theme },
    dispatch: jest.fn(),
  }
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(ThemeContext, { value }, children)
  return Wrapper
}

describe('useNavbarTheme', () => {
  afterEach(() => {
    const styleEl = document.getElementById('navbar-theme-colors')
    styleEl?.parentNode?.removeChild(styleEl)
  })

  it('returns the light navbar colors when the theme is light', () => {
    const { result } = renderHook(() => useNavbarTheme(), {
      wrapper: makeWrapper(THEME_LIGHT),
    })

    expect(result.current.currentTheme).toBe(THEME_LIGHT)
    expect(result.current.navbarColors).toEqual(themeConfig[THEME_LIGHT].navbar)
    expect(result.current.themeColors).toEqual(themeConfig[THEME_LIGHT])
  })

  it('returns the dark navbar colors when the theme is dark', () => {
    const { result } = renderHook(() => useNavbarTheme(), {
      wrapper: makeWrapper(THEME_DARK),
    })

    expect(result.current.currentTheme).toBe(THEME_DARK)
    expect(result.current.navbarColors).toEqual(themeConfig[THEME_DARK].navbar)
  })

  it('falls back to the default theme when no theme context is provided', () => {
    const { result } = renderHook(() => useNavbarTheme())

    expect(result.current.currentTheme).toBe(DEFAULT_THEME)
    expect(result.current.navbarColors).toEqual(themeConfig[DEFAULT_THEME].navbar)
  })

  it('injects the navbar theme style element and sets the navbar text CSS variable', () => {
    renderHook(() => useNavbarTheme(), { wrapper: makeWrapper(THEME_DARK) })

    const styleEl = document.getElementById('navbar-theme-colors')
    expect(styleEl).not.toBeNull()
    expect(styleEl?.textContent).toContain('--theme-navbar-text')
    expect(document.documentElement.style.getPropertyValue('--theme-navbar-text')).toBe(
      themeConfig[THEME_DARK].navbar.text,
    )
  })

  it('removes the injected style element on unmount when the reference count reaches zero', () => {
    const { unmount } = renderHook(() => useNavbarTheme(), {
      wrapper: makeWrapper(THEME_LIGHT),
    })

    expect(document.getElementById('navbar-theme-colors')).not.toBeNull()

    unmount()

    expect(document.getElementById('navbar-theme-colors')).toBeNull()
  })
})
