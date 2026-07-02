import { render, screen, fireEvent } from '@testing-library/react'
import { AccordionContext } from '../context'
import { AccordionIndicator } from '../AccordionIndicator'
import { AccordionHeader } from '../AccordionHeader'
import { AccordionBody } from '../AccordionBody'
import type { AccordionContextType } from '../types'

const withContext = (ctx: Partial<AccordionContextType>, ui: React.ReactNode) =>
  render(
    <AccordionContext.Provider value={{ isOpen: false, onToggle: () => {}, ...ctx }}>
      {ui}
    </AccordionContext.Provider>,
  )

describe('AccordionIndicator', () => {
  it('renders the closed indicator (add icon) when collapsed', () => {
    const { container } = withContext(
      { isOpen: false },
      <AccordionIndicator
        open={<span data-testid="open-icon">open</span>}
        closed={<span data-testid="closed-icon">closed</span>}
      />,
    )
    expect(screen.getByTestId('closed-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('open-icon')).not.toBeInTheDocument()
    expect(container).toBeInTheDocument()
  })

  it('renders the open indicator (remove icon) when expanded', () => {
    withContext(
      { isOpen: true },
      <AccordionIndicator
        open={<span data-testid="open-icon">open</span>}
        closed={<span data-testid="closed-icon">closed</span>}
      />,
    )
    expect(screen.getByTestId('open-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('closed-icon')).not.toBeInTheDocument()
  })

  it('merges the passed className with the indicator element className', () => {
    withContext(
      { isOpen: true },
      <AccordionIndicator className="extra" open={<span className="own">x</span>} />,
    )
    const el = screen.getByText('x')
    expect(el).toHaveClass('extra')
    expect(el).toHaveClass('own')
  })
})

describe('AccordionBody', () => {
  it('renders children inside a card-body wrapper when open', () => {
    withContext({ isOpen: true }, <AccordionBody className="mine">body content</AccordionBody>)
    const content = screen.getByText('body content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('card-body', 'mine', 'pt-0')
  })
})

describe('AccordionHeader', () => {
  it('invokes onToggle from context when the header is clicked', () => {
    const onToggle = jest.fn()
    withContext({ onToggle }, <AccordionHeader>header</AccordionHeader>)
    fireEvent.click(screen.getByText('header'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
