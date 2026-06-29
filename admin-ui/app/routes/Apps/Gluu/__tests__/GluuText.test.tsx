import { render } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuText from 'Routes/Apps/Gluu/GluuText'

describe('GluuText', () => {
  it('renders children inside a span by default', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuText>hello</GluuText>
      </AppTestWrapper>,
    )
    const span = container.querySelector('span')
    expect(span).toBeInTheDocument()
    expect(span).toHaveTextContent('hello')
  })

  it('renders the requested variant element', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuText variant="h2">title</GluuText>
      </AppTestWrapper>,
    )
    expect(container.querySelector('h2')).toHaveTextContent('title')
  })

  it('applies a custom className and id', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuText variant="div" className="my-text" id="txt-1">
          x
        </GluuText>
      </AppTestWrapper>,
    )
    const el = container.querySelector('#txt-1') as HTMLElement
    expect(el).toHaveClass('my-text')
  })

  it('applies a theme color by default', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuText variant="div">x</GluuText>
      </AppTestWrapper>,
    )
    const el = container.querySelector('div') as HTMLElement
    expect(el.style.color).not.toBe('')
  })

  it('does not set a color when disableThemeColor is true', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuText variant="div" disableThemeColor>
          x
        </GluuText>
      </AppTestWrapper>,
    )
    const el = container.querySelector('div') as HTMLElement
    expect(el.style.color).toBe('')
  })

  it('merges a custom style', () => {
    const { container } = render(
      <AppTestWrapper>
        <GluuText variant="div" style={{ fontWeight: 'bold' }}>
          x
        </GluuText>
      </AppTestWrapper>,
    )
    const el = container.querySelector('div') as HTMLElement
    expect(el.style.fontWeight).toBe('bold')
  })
})
