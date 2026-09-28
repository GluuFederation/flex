import { act } from 'react'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ThemeProvider, useTheme } from '@/context/theme/themeContext'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'
import { STORAGE_KEYS } from '@/constants'
import { useThemePersistence } from '@/hooks/useThemePersistence'
import type { UserInfo } from 'Redux/features/types/authTypes'

const wrapper = ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>

const renderThemePersistence = (userInfo: UserInfo | null) =>
  renderHook(
    () => ({ onChangeTheme: useThemePersistence(userInfo), theme: useTheme().state.theme }),
    { wrapper },
  )

describe('useThemePersistence', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("applies the signed-in user's saved theme over the device theme", () => {
    window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, THEME_DARK)
    window.localStorage.setItem(
      STORAGE_KEYS.USER_CONFIG,
      JSON.stringify({ theme: { 'user-1': THEME_LIGHT } }),
    )

    const { result } = renderThemePersistence({ inum: 'user-1' })

    expect(result.current.theme).toBe(THEME_LIGHT)
    expect(window.localStorage.getItem(STORAGE_KEYS.INIT_THEME)).toBe(THEME_LIGHT)
  })

  it('keeps the device theme when the user has not saved one', () => {
    window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, THEME_LIGHT)

    const { result } = renderThemePersistence({ inum: 'user-1' })

    expect(result.current.theme).toBe(THEME_LIGHT)
  })

  it('ignores an invalid saved theme', () => {
    window.localStorage.setItem(STORAGE_KEYS.INIT_THEME, THEME_LIGHT)
    window.localStorage.setItem(
      STORAGE_KEYS.USER_CONFIG,
      JSON.stringify({ theme: { 'user-1': 'blue' } }),
    )

    const { result } = renderThemePersistence({ inum: 'user-1' })

    expect(result.current.theme).toBe(THEME_LIGHT)
  })

  it('saves a chosen theme for the user and as the device theme', () => {
    const { result } = renderThemePersistence({ inum: 'user-1' })

    act(() => {
      result.current.onChangeTheme(THEME_LIGHT)
    })

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.USER_CONFIG) ?? '{}')
    expect(stored.theme).toEqual({ 'user-1': THEME_LIGHT })
    expect(result.current.theme).toBe(THEME_LIGHT)
    expect(window.localStorage.getItem(STORAGE_KEYS.INIT_THEME)).toBe(THEME_LIGHT)
  })
})
