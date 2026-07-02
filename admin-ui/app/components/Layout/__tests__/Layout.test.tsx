import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Layout } from '../Layout'
import { LayoutSidebar } from '../LayoutSidebar'
import { LayoutNavbar } from '../LayoutNavbar'
import { LayoutContent } from '../LayoutContent'

// ThemeClass just yields a class string; stub it so Layout renders without a
// full theme context and we can assert the composition directly.
jest.mock('../../Theme', () => ({
  ThemeClass: ({ children }: { children: (cls: string) => React.ReactNode }) =>
    children('layout--theme--light--primary'),
}))

// SetTitle touches document.title; stub it to a no-op hook.
jest.mock('Utils/SetTitle', () => ({ __esModule: true, default: () => {} }))

// The real content subtree needs theme wiring of its own; replace it with a
// marker that still carries the content layoutPartName.
jest.mock('../LayoutContent', () => {
  const Content = ({ children }: PropsWithChildren) => <div data-testid="content">{children}</div>
  Content.layoutPartName = 'content'
  return { LayoutContent: Content }
})

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    ((query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as object as MediaQueryList)
})

const renderLayout = (children: React.ReactNode) =>
  render(<MemoryRouter>{<Layout>{children}</Layout>}</MemoryRouter>)

describe('Layout', () => {
  it('renders the outer layout container', () => {
    const { container } = renderLayout(
      <LayoutContent>
        <div>page</div>
      </LayoutContent>,
    )
    expect(container.querySelector('.layout')).toBeInTheDocument()
  })

  it('places sidebar, navbar and content into the layout', () => {
    renderLayout(
      <>
        <LayoutSidebar>
          <div data-testid="side">nav</div>
        </LayoutSidebar>
        <LayoutNavbar>
          <div data-testid="bar">top</div>
        </LayoutNavbar>
        <LayoutContent>
          <div data-testid="page">body</div>
        </LayoutContent>
      </>,
    )
    expect(screen.getByTestId('side')).toBeInTheDocument()
    expect(screen.getByTestId('bar')).toBeInTheDocument()
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('renders content even when no sidebar is provided', () => {
    renderLayout(
      <LayoutContent>
        <div data-testid="page">body</div>
      </LayoutContent>,
    )
    expect(screen.getByTestId('content')).toBeInTheDocument()
    expect(screen.queryByTestId('side')).not.toBeInTheDocument()
  })

  it('passes through children that are not recognised layout parts', () => {
    renderLayout(
      <>
        <LayoutContent>
          <div>body</div>
        </LayoutContent>
        <div data-testid="extra">floating</div>
      </>,
    )
    expect(screen.getByTestId('extra')).toBeInTheDocument()
  })
})
