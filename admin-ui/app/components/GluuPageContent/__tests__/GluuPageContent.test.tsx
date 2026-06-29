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

  it('renders children directly when maxWidth is not set', () => {
    render(
      <AppTestWrapper>
        <GluuPageContent>
          <span>direct child</span>
        </GluuPageContent>
      </AppTestWrapper>,
    )
    expect(screen.getByText('direct child')).toBeInTheDocument()
  })
})
