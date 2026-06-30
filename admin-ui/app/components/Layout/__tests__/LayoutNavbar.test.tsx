import { render } from '@testing-library/react'
import { LayoutNavbar } from '../LayoutNavbar'

describe('LayoutNavbar', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('exposes the navbar layout part name', () => {
    expect(LayoutNavbar.layoutPartName).toBe('navbar')
  })

  it('wraps its child in the navbar layout container', () => {
    const { container } = render(
      <LayoutNavbar>
        <div data-testid="bar">content</div>
      </LayoutNavbar>,
    )
    const wrapper = container.querySelector('.layout__navbar')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper?.querySelector('[data-testid="bar"]')).toBeInTheDocument()
  })

  it('clones the child with a null fixed prop', () => {
    const Child = (props: { fixed?: boolean | null }) => (
      <div data-testid="bar">{String(props.fixed)}</div>
    )
    const { getByTestId } = render(
      <LayoutNavbar>
        <Child fixed />
      </LayoutNavbar>,
    )
    expect(getByTestId('bar')).toHaveTextContent('null')
  })

  it('throws when given more than one child', () => {
    // Restored via afterEach so the spy is cleaned up even if the assertion throws.
    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        <LayoutNavbar>
          <div>a</div>
          <div>b</div>
        </LayoutNavbar>,
      ),
    ).toThrow()
  })
})
