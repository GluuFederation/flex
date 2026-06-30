import { render, screen } from '@testing-library/react'
import { Card } from '@/components/Card/Card'

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <span>card body</span>
      </Card>,
    )
    expect(screen.getByText('card body')).toBeInTheDocument()
  })

  it('applies the base card class', () => {
    const { container } = render(<Card>x</Card>)
    expect(container.querySelector('.card')).toBeInTheDocument()
  })

  it('merges a custom className', () => {
    const { container } = render(<Card className="my-card">x</Card>)
    expect(container.querySelector('.card.my-card')).toBeInTheDocument()
  })

  it('forwards arbitrary div props', () => {
    render(<Card data-testid="the-card">x</Card>)
    expect(screen.getByTestId('the-card')).toBeInTheDocument()
  })

  it('renders without a color modifier by default', () => {
    const { container } = render(<Card>x</Card>)
    const el = container.querySelector('.card') as HTMLElement
    expect(el.className).not.toMatch(/color-/)
  })
})
