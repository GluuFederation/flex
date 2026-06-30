import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeContext } from '@/context/theme/themeContext'
import type { ThemeContextType } from '@/context/theme/themeContext'
import { THEME_LIGHT } from '@/context/theme/constants'
import { HeaderAuth } from '../HeaderAuth'
import { ROUTES } from '@/helpers/navigation'

const renderHeader = (props: React.ComponentProps<typeof HeaderAuth> = {}) => {
  const theme: ThemeContextType = { state: { theme: THEME_LIGHT }, dispatch: jest.fn() }
  return render(
    <MemoryRouter>
      <ThemeContext.Provider value={theme}>
        <HeaderAuth {...props} />
      </ThemeContext.Provider>
    </MemoryRouter>,
  )
}

describe('HeaderAuth', () => {
  it('renders the default title and helper text', () => {
    renderHeader()
    expect(screen.getByText('Waiting for Data...')).toBeInTheDocument()
  })

  it('renders a custom title and text', () => {
    renderHeader({ title: 'Sign In', text: 'Enter your details' })
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Enter your details')).toBeInTheDocument()
  })

  it('links the logo wrapper to the root route', () => {
    renderHeader()
    expect(screen.getByRole('link')).toHaveAttribute('href', ROUTES.ROOT)
  })

  it('falls back to the themed logo when no icon is given', () => {
    renderHeader()
    expect(screen.getByAltText('Jans Admin UI Logo')).toBeInTheDocument()
  })

  it('renders a provided icon with its className instead of the logo', () => {
    renderHeader({ icon: <span data-testid="icon">i</span>, iconClassName: 'custom-icon' })
    const icon = screen.getByTestId('icon')
    expect(icon.parentElement).toHaveClass('custom-icon')
    expect(screen.queryByAltText('Jans Admin UI Logo')).not.toBeInTheDocument()
  })
})
