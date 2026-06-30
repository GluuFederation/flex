import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuPageContent from '@/components/GluuPageContent/GluuPageContent'

describe('GluuPageContent', () => {
  it('renders children', () => {
    render(
      <AppTestWrapper>
        <GluuPageContent>
          <div>page body</div>
        </GluuPageContent>
      </AppTestWrapper>,
    )
    expect(screen.getByText('page body')).toBeInTheDocument()
  })

  it('applies a custom className', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuPageContent className="my-page">x</GluuPageContent>
      </AppTestWrapper>,
    )
    expect(container.querySelector('.my-page')).toBeInTheDocument()
  })

  it('wraps children in a wrapper when maxWidth is set', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuPageContent maxWidth={600}>
          <span>wrapped</span>
        </GluuPageContent>
      </AppTestWrapper>,
    )
    // root contains an inner wrapper div around the children
    const root = container.firstElementChild as HTMLElement
    expect(root.firstElementChild?.tagName).toBe('DIV')
    expect(screen.getByText('wrapped')).toBeInTheDocument()
  })

  it('renders children directly in the root (no wrapper) when maxWidth is not set', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuPageContent>
          <span>direct child</span>
        </GluuPageContent>
      </AppTestWrapper>,
    )
    const root = container.firstElementChild as HTMLElement
    // Without maxWidth the child span is mounted directly in root, not nested
    // inside the extra wrapper div that the maxWidth branch introduces.
    expect(root.firstElementChild?.tagName).toBe('SPAN')
    expect(root.firstElementChild).toHaveTextContent('direct child')
  })
})
