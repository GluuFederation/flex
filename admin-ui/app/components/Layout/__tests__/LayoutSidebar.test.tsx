import { render } from '@testing-library/react'
import { LayoutSidebar } from '../LayoutSidebar'

describe('LayoutSidebar', () => {
  it('exposes the sidebar layout part name', () => {
    expect(LayoutSidebar.layoutPartName).toBe('sidebar')
  })

  it('wraps its child in the sidebar layout container', () => {
    const { container } = render(
      <LayoutSidebar>
        <div data-testid="content">nav</div>
      </LayoutSidebar>,
    )
    const wrapper = container.querySelector('.layout__sidebar')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper?.querySelector('[data-testid="content"]')).toBeInTheDocument()
  })

  it('adds the slim modifier when sidebarSlim is set', () => {
    const { container } = render(<LayoutSidebar sidebarSlim>x</LayoutSidebar>)
    expect(container.querySelector('.layout__sidebar')).toHaveClass('layout__sidebar--slim')
  })

  it('adds the collapsed modifier when sidebarCollapsed is set', () => {
    const { container } = render(<LayoutSidebar sidebarCollapsed>x</LayoutSidebar>)
    expect(container.querySelector('.layout__sidebar')).toHaveClass('layout__sidebar--collapsed')
  })

  it('omits both modifiers by default', () => {
    const { container } = render(<LayoutSidebar>x</LayoutSidebar>)
    const wrapper = container.querySelector('.layout__sidebar')
    expect(wrapper).not.toHaveClass('layout__sidebar--slim')
    expect(wrapper).not.toHaveClass('layout__sidebar--collapsed')
  })
})
