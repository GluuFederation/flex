import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import customColors from '@/customColors'
import { ThemeContext } from '@/context/theme/themeContext'
import { THEME_DARK, THEME_LIGHT } from '@/context/theme/constants'
import type { ThemeValue } from '@/context/theme/constants'
import SignedOut from '@/components/SignedOut/SignedOut'

const hexToRgbString = (hex: string): string => {
  const value = parseInt(hex.slice(1), 16)
  return `rgb(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255})`
}

const renderSignedOut = (theme: ThemeValue, onSignIn = jest.fn()) =>
  render(
    <I18nextProvider i18n={i18n}>
      <ThemeContext.Provider value={{ state: { theme }, dispatch: jest.fn() }}>
        <SignedOut onSignIn={onSignIn} />
      </ThemeContext.Provider>
    </I18nextProvider>,
  )

describe('SignedOut', () => {
  it('shows the Gluu logo, the title, the message and the Sign in again button', () => {
    renderSignedOut(THEME_DARK)

    expect(screen.getByRole('main', { name: i18n.t('sessionEndedMessage') })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Gluu' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('sessionEndedMessage') }),
    ).toBeInTheDocument()
    expect(screen.getByText(i18n.t('sessionEndedDescription'))).toBeInTheDocument()
    expect(screen.getByRole('button', { name: i18n.t('signInAgain') })).toBeInTheDocument()
  })

  it('starts the sign-in when the user clicks Sign in again', () => {
    const onSignIn = jest.fn()
    renderSignedOut(THEME_DARK, onSignIn)

    fireEvent.click(screen.getByRole('button', { name: i18n.t('signInAgain') }))

    expect(onSignIn).toHaveBeenCalledTimes(1)
  })

  it.each<[ThemeValue, string, string, string]>([
    [
      THEME_DARK,
      customColors.white,
      customColors.cedarTextSecondaryDark,
      customColors.cedarCardBgDark,
    ],
    [THEME_LIGHT, customColors.primaryDark, customColors.textSecondary, customColors.white],
  ])('uses the %s theme colors', (theme, titleColor, descriptionColor, cardColor) => {
    renderSignedOut(theme)

    const title = screen.getByRole('heading', { level: 1 })
    expect(getComputedStyle(title).color).toBe(hexToRgbString(titleColor))
    expect(getComputedStyle(screen.getByText(i18n.t('sessionEndedDescription'))).color).toBe(
      hexToRgbString(descriptionColor),
    )
    expect(getComputedStyle(title.parentElement as HTMLElement).backgroundColor).toBe(
      hexToRgbString(cardColor),
    )
  })

  it('shows the Gluu green button with dark text', () => {
    renderSignedOut(THEME_LIGHT)

    const button = screen.getByRole('button', { name: i18n.t('signInAgain') })
    expect(getComputedStyle(button).backgroundColor).toBe(hexToRgbString(customColors.logo))
    expect(getComputedStyle(button).color).toBe(hexToRgbString(customColors.primaryDark))
  })
})
