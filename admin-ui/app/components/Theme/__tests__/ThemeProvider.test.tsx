import React, { use } from 'react'
import { render, screen, act } from '@testing-library/react'
import { ThemeProvider } from '../ThemeProvider'
import { ThemeContext } from '../ThemeContext'
import { THEME_LIGHT } from '@/context/theme/constants'

// Reads the provided theme context and exposes a control to flip the color.
const Probe = () => {
  const theme = use(ThemeContext)
  if (!theme) return null
  return (
    <div>
      <span data-testid="style">{theme.style}</span>
      <span data-testid="color">{theme.color}</span>
      <button type="button" onClick={() => theme.onChangeTheme?.({ color: 'accent' })}>
        change
      </button>
    </div>
  )
}

describe('ThemeProvider', () => {
  it('defaults to the light style and primary color', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('style')).toHaveTextContent(THEME_LIGHT)
    expect(screen.getByTestId('color')).toHaveTextContent('primary')
  })

  it('applies the initial style and color on mount', () => {
    render(
      <ThemeProvider initialStyle="dark" initialColor="accent">
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('style')).toHaveTextContent('dark')
    expect(screen.getByTestId('color')).toHaveTextContent('accent')
  })

  it('updates the color via onChangeTheme', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    act(() => {
      screen.getByRole('button', { name: 'change' }).click()
    })
    expect(screen.getByTestId('color')).toHaveTextContent('accent')
  })

  it('renders its children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">content</div>
      </ThemeProvider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
