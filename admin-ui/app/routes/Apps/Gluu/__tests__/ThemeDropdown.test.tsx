import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { ThemeDropdownComponent } from 'Routes/Apps/Gluu/ThemeDropdown'
import { THEME_LIGHT, THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { STORAGE_KEYS } from '@/constants'
import type { UserInfo } from 'Redux/features/types/authTypes'

const mockDispatch = jest.fn()

jest.mock('@/context/theme/themeContext', () => ({
  ...jest.requireActual('@/context/theme/themeContext'),
  useTheme: () => ({ state: { theme: 'dark' }, dispatch: mockDispatch }),
}))

const renderDropdown = (userInfo?: UserInfo) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeDropdownComponent userInfo={userInfo as UserInfo} />
    </I18nextProvider>,
  )
}

const openDropdown = () => {
  fireEvent.click(screen.getByRole('button'))
}

describe('ThemeDropdownComponent', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    window.localStorage.clear()
  })

  it('renders the theme trigger label', () => {
    renderDropdown()
    expect(screen.getByText('Theme')).toBeInTheDocument()
  })

  it('shows both light and dark theme options when opened', () => {
    renderDropdown()
    openDropdown()
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
  })

  it('dispatches the selected theme when no userInfo is provided', () => {
    renderDropdown()
    openDropdown()
    fireEvent.click(screen.getByText('Light'))
    expect(mockDispatch).toHaveBeenCalledWith({ type: THEME_LIGHT })
  })

  it('dispatches the theme without persisting config when userInfo has no inum', () => {
    renderDropdown({ user_name: 'admin' })
    openDropdown()
    fireEvent.click(screen.getByText('Light'))
    expect(mockDispatch).toHaveBeenCalledWith({ type: THEME_LIGHT })
    expect(window.localStorage.getItem(STORAGE_KEYS.USER_CONFIG)).toBeNull()
  })

  it('persists the theme to userConfig keyed by inum and dispatches', () => {
    renderDropdown({ inum: 'user-123' })
    openDropdown()
    fireEvent.click(screen.getByText('Light'))

    expect(mockDispatch).toHaveBeenCalledWith({ type: THEME_LIGHT })
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.USER_CONFIG) ?? '{}')
    expect(stored.theme['user-123']).toBe(THEME_LIGHT)
    expect(stored.lang).toEqual({})
  })

  it('merges into existing userConfig theme map for other users', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.USER_CONFIG,
      JSON.stringify({ lang: { 'user-999': 'en' }, theme: { 'user-999': THEME_DARK } }),
    )
    renderDropdown({ inum: 'user-123' })
    openDropdown()
    fireEvent.click(screen.getByText('Light'))

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.USER_CONFIG) ?? '{}')
    expect(stored.theme['user-123']).toBe(THEME_LIGHT)
    expect(stored.theme['user-999']).toBe(THEME_DARK)
    expect(stored.lang).toEqual({ 'user-999': 'en' })
  })

  it('reflects the current theme as the selected dropdown value', () => {
    renderDropdown({ inum: 'user-123' })
    openDropdown()
    const darkOption = screen.getByText('Dark').closest('[role="option"]')
    expect(darkOption).toHaveAttribute('aria-selected', 'true')
    expect(DEFAULT_THEME).toBe(THEME_DARK)
  })
})
