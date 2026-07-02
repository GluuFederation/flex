import { render, screen } from '@testing-library/react'
import { ThemeClass } from '../ThemeClass'
import { ThemeContext } from '../ThemeContext'
import type { ThemeContextState } from '../types'

const renderWithTheme = (state: ThemeContextState | null) =>
  render(
    <ThemeContext value={state}>
      <ThemeClass>{(themeClass) => <span data-testid="cls">{themeClass}</span>}</ThemeClass>
    </ThemeContext>,
  )

const themeState = (style: string, color: string): ThemeContextState => ({
  style,
  color,
  onChangeTheme: () => {},
})

describe('ThemeClass', () => {
  it('builds the theme class from the context style and color', () => {
    renderWithTheme(themeState('dark', 'primary'))
    expect(screen.getByTestId('cls')).toHaveTextContent('layout--theme--dark--primary')
  })

  it('reflects a different style/color pairing', () => {
    renderWithTheme(themeState('light', 'accent'))
    expect(screen.getByTestId('cls')).toHaveTextContent('layout--theme--light--accent')
  })

  it('renders nothing when there is no theme context', () => {
    const { container } = renderWithTheme(null)
    expect(container).toBeEmptyDOMElement()
  })
})
