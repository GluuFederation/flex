import { render, screen } from '@testing-library/react'
import type { TFunction } from 'i18next'
import { StatusIndicator } from '../StatusIndicator'
import { ThemeContext } from '@/context/theme/themeContext'
import type { ThemeContextType } from '@/context/theme/themeContext'
import { THEME_DARK, THEME_LIGHT } from '@/context/theme/constants'
import type { ServiceStatusValue } from '@/constants'

const classes = {
  statusIndicator: 'status-indicator',
  statusDot: 'status-dot',
  statusDotActive: 'status-dot--active',
  statusDotInactive: 'status-dot--inactive',
  statusTitle: 'status-title',
}

const t = ((key: string) => key) as TFunction

const renderIndicator = (
  status: ServiceStatusValue,
  theme: ThemeContextType['state']['theme'] = THEME_LIGHT,
) => {
  const value: ThemeContextType = { state: { theme }, dispatch: jest.fn() }
  return render(
    <ThemeContext.Provider value={value}>
      <StatusIndicator label="menus.oauthserver" status={status} classes={classes} t={t} />
    </ThemeContext.Provider>,
  )
}

describe('StatusIndicator', () => {
  it('renders the translated server name', () => {
    renderIndicator('up')
    expect(screen.getByText('menus.oauthserver')).toBeInTheDocument()
  })

  it('applies the active dot class when the status is up', () => {
    const { container } = renderIndicator('up')
    expect(container.querySelector('.status-dot--active')).toBeInTheDocument()
    expect(container.querySelector('.status-dot--inactive')).not.toBeInTheDocument()
  })

  it('applies the inactive dot class when the status is not up', () => {
    const { container } = renderIndicator('down')
    expect(container.querySelector('.status-dot--inactive')).toBeInTheDocument()
    expect(container.querySelector('.status-dot--active')).not.toBeInTheDocument()
  })

  it('renders in dark theme without error', () => {
    renderIndicator('up', THEME_DARK)
    expect(screen.getByText('menus.oauthserver')).toBeInTheDocument()
  })
})
