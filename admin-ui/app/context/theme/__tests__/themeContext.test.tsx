import { act } from 'react'
import { render, renderHook, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ThemeProvider, useTheme } from '@/context/theme/themeContext'
import { THEME_LIGHT, THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { STORAGE_KEYS } from '@/constants'

const wrapper = ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>

describe('ThemeProvider / useTheme', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.className = ''
  })

  it('throws when useTheme is used outside of a ThemeProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider',
    )
    consoleSpy.mockRestore()
  })

  it('provides the default theme when no preference is stored', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.state.theme).toBe(DEFAULT_THEME)
  })

  it('updates the theme state when a theme change is dispatched', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => {
      result.current.dispatch({ type: THEME_LIGHT })
    })
    expect(result.current.state.theme).toBe(THEME_LIGHT)

    act(() => {
      result.current.dispatch({ type: THEME_DARK })
    })
    expect(result.current.state.theme).toBe(THEME_DARK)
  })

  it('persists the dispatched theme to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => {
      result.current.dispatch({ type: THEME_LIGHT })
    })
    expect(window.localStorage.getItem(STORAGE_KEYS.INIT_THEME)).toBe(THEME_LIGHT)
  })

  it('applies the theme class to the document root', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => {
      result.current.dispatch({ type: THEME_LIGHT })
    })
    expect(document.documentElement.classList.contains('theme-light')).toBe(true)
    expect(document.documentElement.classList.contains('theme-dark')).toBe(false)

    act(() => {
      result.current.dispatch({ type: THEME_DARK })
    })
    expect(document.documentElement.classList.contains('theme-dark')).toBe(true)
    expect(document.documentElement.classList.contains('theme-light')).toBe(false)
  })

  it('exposes the current theme to a consumer component', () => {
    const Consumer = () => {
      const { state } = useTheme()
      return <span data-testid="current-theme">{state.theme}</span>
    }

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent(DEFAULT_THEME)
  })
})
