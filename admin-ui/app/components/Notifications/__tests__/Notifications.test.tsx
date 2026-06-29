import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import Notifications from '../index'
import { ThemeContext } from '@/context/theme/themeContext'
import type { ThemeContextType } from '@/context/theme/themeContext'
import { THEME_DARK, THEME_LIGHT } from '@/context/theme/constants'

const renderNotifications = (theme: ThemeContextType['state']['theme'] = THEME_LIGHT) => {
  const value: ThemeContextType = { state: { theme }, dispatch: jest.fn() }
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeContext.Provider value={value}>
        <Notifications />
      </ThemeContext.Provider>
    </I18nextProvider>,
  )
}

describe('Notifications', () => {
  it('renders the notification trigger icon', () => {
    renderNotifications()
    expect(screen.getByAltText('Notifications')).toBeInTheDocument()
  })

  it('applies the light-theme filter to the icon', () => {
    renderNotifications(THEME_LIGHT)
    const icon = screen.getByAltText('Notifications') as HTMLImageElement
    expect(icon.style.filter).toContain('invert(26%)')
  })

  it('applies the dark-theme filter to the icon', () => {
    renderNotifications(THEME_DARK)
    const icon = screen.getByAltText('Notifications') as HTMLImageElement
    expect(icon.style.filter).toBe('brightness(0) invert(1)')
  })

  it('shows the no-notifications fallback option when opened', () => {
    renderNotifications()
    fireEvent.click(screen.getByRole('button', { expanded: false }))
    expect(screen.getByText(/no.*notification/i)).toBeInTheDocument()
  })
})
