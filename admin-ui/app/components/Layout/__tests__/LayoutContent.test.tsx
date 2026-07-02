import { render, screen } from '@testing-library/react'
import { LayoutContent } from '../LayoutContent'
import { ThemeContext } from '@/context/theme/themeContext'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'
import type { ThemeContextType } from '@/context/theme/themeContext'

const themeValue = (theme: typeof THEME_LIGHT | typeof THEME_DARK): ThemeContextType => ({
  state: { theme },
  dispatch: jest.fn(),
})

const renderWithTheme = (theme: typeof THEME_LIGHT | typeof THEME_DARK) =>
  render(
    <ThemeContext value={themeValue(theme)}>
      <LayoutContent>
        <div data-testid="child">page</div>
      </LayoutContent>
    </ThemeContext>,
  )

describe('LayoutContent', () => {
  it('exposes the content layout part name', () => {
    expect(LayoutContent.layoutPartName).toBe('content')
  })

  it('renders its children inside the content container', () => {
    const { container } = renderWithTheme(THEME_LIGHT)
    expect(container.querySelector('.layout__content')).toBeInTheDocument()
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies theme-derived css variables to the document element', () => {
    renderWithTheme(THEME_LIGHT)
    expect(document.documentElement.style.getPropertyValue('--theme-scrollbar-width')).not.toBe('')
  })

  it('renders for the dark theme without throwing', () => {
    expect(() => renderWithTheme(THEME_DARK)).not.toThrow()
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('throws when rendered outside a ThemeProvider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        <LayoutContent>
          <div>x</div>
        </LayoutContent>,
      ),
    ).toThrow('ThemeContext must be used within a ThemeProvider')
    jest.restoreAllMocks()
  })
})
