import { render, screen } from '@testing-library/react'
import { LogoThemed } from '../LogoThemed'
import { ThemeContext } from '@/context/theme/themeContext'
import type { ThemeContextType } from '@/context/theme/themeContext'
import { THEME_DARK, THEME_LIGHT, DEFAULT_THEME } from '@/context/theme/constants'

const renderLogo = (
  props: React.ComponentProps<typeof LogoThemed> = {},
  theme: ThemeContextType['state']['theme'] = THEME_LIGHT,
) => {
  const value: ThemeContextType = { state: { theme }, dispatch: jest.fn() }
  return render(
    <ThemeContext.Provider value={value}>
      <LogoThemed {...props} />
    </ThemeContext.Provider>,
  )
}

describe('LogoThemed', () => {
  it('renders the logo image with alt text', () => {
    renderLogo()
    expect(screen.getByAltText('Jans Admin UI Logo')).toBeInTheDocument()
  })

  it('applies the light-theme filter', () => {
    renderLogo({}, THEME_LIGHT)
    const img = screen.getByAltText('Jans Admin UI Logo') as HTMLImageElement
    expect(img.style.filter).toContain('hue-rotate(130deg)')
  })

  it('applies the dark-theme filter', () => {
    renderLogo({}, THEME_DARK)
    const img = screen.getByAltText('Jans Admin UI Logo') as HTMLImageElement
    expect(img.style.filter).toBe('brightness(0) invert(1)')
  })

  it('falls back to the default theme filter without a provider', () => {
    render(<LogoThemed />)
    const img = screen.getByAltText('Jans Admin UI Logo') as HTMLImageElement
    const expected = DEFAULT_THEME === THEME_DARK ? 'brightness(0) invert(1)' : ''
    expect(img.style.filter).toBe(expected)
  })

  it('uses default width and height when none are given', () => {
    renderLogo()
    const img = screen.getByAltText('Jans Admin UI Logo') as HTMLImageElement
    expect(img.style.width).toBe('130px')
    expect(img.style.height).toBe('51px')
  })

  it('coerces numeric width and height to px', () => {
    renderLogo({ width: 80, height: 40 })
    const img = screen.getByAltText('Jans Admin UI Logo') as HTMLImageElement
    expect(img.style.width).toBe('80px')
    expect(img.style.height).toBe('40px')
  })

  it('passes string width and height through unchanged', () => {
    renderLogo({ width: '5rem', height: '2rem' })
    const img = screen.getByAltText('Jans Admin UI Logo') as HTMLImageElement
    expect(img.style.width).toBe('5rem')
    expect(img.style.height).toBe('2rem')
  })

  it('merges a custom className with the base class', () => {
    renderLogo({ className: 'my-logo' })
    const img = screen.getByAltText('Jans Admin UI Logo')
    expect(img).toHaveClass('d-block')
    expect(img).toHaveClass('my-logo')
  })
})
