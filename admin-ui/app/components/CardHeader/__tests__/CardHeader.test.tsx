import { render, screen } from '@testing-library/react'
import { CardHeader } from '@/components/CardHeader/CardHeader'

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>header text</CardHeader>)
    expect(screen.getByText('header text')).toBeInTheDocument()
  })

  it('applies the base card-header class', () => {
    const { container } = render(<CardHeader>x</CardHeader>)
    expect(container.querySelector('.card-header')).toBeInTheDocument()
  })

  it('merges a custom className', () => {
    const { container } = render(<CardHeader className="my-header">x</CardHeader>)
    expect(container.querySelector('.card-header.my-header')).toBeInTheDocument()
  })

  it('applies a custom style', () => {
    const { container } = render(<CardHeader style={{ marginTop: '10px' }}>x</CardHeader>)
    const el = container.querySelector('.card-header') as HTMLElement
    expect(el.style.marginTop).toBe('10px')
  })

  it('forwards arbitrary div props', () => {
    render(<CardHeader data-testid="hdr">x</CardHeader>)
    expect(screen.getByTestId('hdr')).toBeInTheDocument()
  })
})
