import { render, screen } from '@testing-library/react'
import GluuSpinner from '@/components/GluuSpinner/GluuSpinner'

describe('GluuSpinner', () => {
  it('renders with the default aria-label', () => {
    render(<GluuSpinner />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('renders with a polite aria-live region', () => {
    render(<GluuSpinner />)
    expect(screen.getByLabelText('Loading')).toHaveAttribute('aria-live', 'polite')
  })

  it('accepts a custom aria-label', () => {
    render(<GluuSpinner aria-label="Fetching data" />)
    expect(screen.getByLabelText('Fetching data')).toBeInTheDocument()
  })

  it('renders an output element', () => {
    const { container } = render(<GluuSpinner />)
    expect(container.querySelector('output')).toBeInTheDocument()
  })

  it('renders without crashing for a custom size', () => {
    render(<GluuSpinner size={80} />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })
})
