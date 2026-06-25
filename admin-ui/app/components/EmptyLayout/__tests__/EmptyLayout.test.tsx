import { render, screen } from '@testing-library/react'
import { EmptyLayout } from '@/components/EmptyLayout/EmptyLayout'
import type { EmptyLayoutProps, SectionProps } from '@/components/EmptyLayout/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const renderLayout = (props: Omit<EmptyLayoutProps, 'pageConfig'>) =>
  render(
    <AppTestWrapper>
      <EmptyLayout {...props} />
    </AppTestWrapper>,
  )

const renderSection = (props: SectionProps) =>
  render(
    <AppTestWrapper>
      <EmptyLayout.Section {...props} />
    </AppTestWrapper>,
  )

describe('EmptyLayout', () => {
  it('renders its children', () => {
    renderLayout({ children: <span>hello child</span> })
    expect(screen.getByText('hello child')).toBeInTheDocument()
  })

  it('always applies the fullscreen class on the root element', () => {
    renderLayout({ children: <span data-testid="content">content</span> })
    const root = screen.getByTestId('content').parentElement
    expect(root).toHaveClass('fullscreen')
  })

  it('merges a custom className alongside fullscreen', () => {
    renderLayout({ children: <span data-testid="content">content</span>, className: 'extra' })
    const root = screen.getByTestId('content').parentElement
    expect(root).toHaveClass('fullscreen')
    expect(root).toHaveClass('extra')
  })

  it('exposes a Section sub-layout', () => {
    expect(EmptyLayout.Section).toBeDefined()
  })

  describe('EmptyLayout.Section', () => {
    it('renders children and the base section class', () => {
      renderSection({ children: <span data-testid="sec">section child</span> })
      expect(screen.getByText('section child')).toBeInTheDocument()
      const section = screen.getByTestId('sec').parentElement
      expect(section).toHaveClass('fullscreen__section')
      expect(section).not.toHaveClass('fullscreen__section--center')
    })

    it('does not wrap children in a centering child when center is not set', () => {
      renderSection({ children: <span data-testid="sec">section child</span> })
      const section = screen.getByTestId('sec').parentElement
      expect(section).toHaveClass('fullscreen__section')
    })

    it('applies the center modifier and wraps children with a max-width container when center is true', () => {
      renderSection({ center: true, children: <span data-testid="sec">centered</span> })
      const wrapper = screen.getByTestId('sec').parentElement
      expect(wrapper).toHaveClass('fullscreen__section__child')
      expect(wrapper).toHaveStyle({ maxWidth: '420px' })
      const section = wrapper?.parentElement
      expect(section).toHaveClass('fullscreen__section--center')
    })

    it('uses a string width verbatim as maxWidth', () => {
      renderSection({ center: true, width: '50%', children: <span data-testid="sec">x</span> })
      const wrapper = screen.getByTestId('sec').parentElement
      expect(wrapper).toHaveStyle({ maxWidth: '50%' })
    })

    it('appends px to a numeric width', () => {
      renderSection({ center: true, width: 600, children: <span data-testid="sec">x</span> })
      const wrapper = screen.getByTestId('sec').parentElement
      expect(wrapper).toHaveStyle({ maxWidth: '600px' })
    })

    it('merges a custom className onto the section', () => {
      renderSection({ className: 'my-section', children: <span data-testid="sec">x</span> })
      const section = screen.getByTestId('sec').parentElement
      expect(section).toHaveClass('my-section')
      expect(section).toHaveClass('fullscreen__section')
    })
  })
})
