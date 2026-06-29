import React from 'react'
import { render, screen } from '@testing-library/react'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { PageConfigContext } from '@/components/Layout/PageConfigContext'
import type { PageConfig } from '@/components/Layout/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const makePageConfig = (overrides: Partial<PageConfig> = {}): PageConfig => ({
  sidebarCollapsed: false,
  screenSize: '',
  toggleSidebar: jest.fn(),
  sidebarSlim: false,
  animationsDisabled: false,
  ...overrides,
})

type ProvidersProps = {
  children: React.ReactNode
  pageConfig: PageConfig
}

const Providers = ({ children, pageConfig }: ProvidersProps) => (
  <AppTestWrapper>
    <PageConfigContext.Provider value={pageConfig}>{children}</PageConfigContext.Provider>
  </AppTestWrapper>
)

const renderSidebar = (
  children: React.ReactNode,
  pageConfig: PageConfig = makePageConfig({ animationsDisabled: true }),
) =>
  render(
    <Providers pageConfig={pageConfig}>
      <Sidebar>{children}</Sidebar>
    </Providers>,
  )

const getSidebar = (): HTMLElement => {
  const el = document.querySelector<HTMLElement>('.sidebar.custom-sidebar-container')
  if (!el) throw new Error('sidebar container not found')
  return el
}

describe('Sidebar', () => {
  it('renders its children inside the sidebar container', () => {
    renderSidebar(<span>menu content</span>)

    expect(screen.getByText('menu content')).toBeInTheDocument()
    const sidebar = getSidebar()
    expect(sidebar).toContainElement(screen.getByText('menu content'))
  })

  it('applies the base sidebar classes', () => {
    renderSidebar(<span>child</span>)

    const sidebar = getSidebar()
    expect(sidebar).toHaveClass('sidebar')
    expect(sidebar).toHaveClass('custom-sidebar-container')
  })

  it('does not add the slim class by default', () => {
    renderSidebar(<span>child</span>)
    expect(getSidebar()).not.toHaveClass('sidebar--slim')
  })

  it('adds the slim class from the slim prop', () => {
    render(
      <Providers pageConfig={makePageConfig({ animationsDisabled: true })}>
        <Sidebar slim>
          <span>slim</span>
        </Sidebar>
      </Providers>,
    )
    expect(getSidebar()).toHaveClass('sidebar--slim')
  })

  it('adds the slim class from pageConfig.sidebarSlim', () => {
    render(
      <Providers pageConfig={makePageConfig({ animationsDisabled: true, sidebarSlim: true })}>
        <Sidebar>
          <span>slim-cfg</span>
        </Sidebar>
      </Providers>,
    )
    expect(getSidebar()).toHaveClass('sidebar--slim')
  })

  it('adds the collapsed class from pageConfig.sidebarCollapsed', () => {
    render(
      <Providers pageConfig={makePageConfig({ animationsDisabled: true, sidebarCollapsed: true })}>
        <Sidebar>
          <span>collapsed</span>
        </Sidebar>
      </Providers>,
    )
    expect(getSidebar()).toHaveClass('sidebar--collapsed')
  })

  it('marks animations disabled when animationsDisabled prop is true', () => {
    render(
      <Providers pageConfig={makePageConfig()}>
        <Sidebar animationsDisabled>
          <span>no-anim</span>
        </Sidebar>
      </Providers>,
    )

    const sidebar = getSidebar()
    expect(sidebar).toHaveClass('sidebar--animations-disabled')
    expect(sidebar).not.toHaveClass('sidebar--animations-enabled')
  })

  it('marks animations disabled when pageConfig.animationsDisabled is true', () => {
    render(
      <Providers pageConfig={makePageConfig({ animationsDisabled: true })}>
        <Sidebar>
          <span>cfg-no-anim</span>
        </Sidebar>
      </Providers>,
    )

    const sidebar = getSidebar()
    expect(sidebar).toHaveClass('sidebar--animations-disabled')
    expect(sidebar).not.toHaveClass('sidebar--animations-enabled')
  })

  it('marks the entry animation complete immediately when animations are disabled', () => {
    render(
      <Providers pageConfig={makePageConfig({ animationsDisabled: true })}>
        <Sidebar>
          <span>done</span>
        </Sidebar>
      </Providers>,
    )
    expect(getSidebar()).toHaveClass('sidebar--animate-entry-complete')
  })

  it('enables animations when neither prop nor pageConfig disables them', () => {
    render(
      <Providers pageConfig={makePageConfig({ animationsDisabled: false })}>
        <Sidebar>
          <div className="sidebar__section">
            <div className="sidebar-menu">
              <div className="sidebar-menu__entry">entry</div>
            </div>
          </div>
        </Sidebar>
      </Providers>,
    )

    const sidebar = getSidebar()
    expect(sidebar).toHaveClass('sidebar--animations-enabled')
    expect(sidebar).not.toHaveClass('sidebar--animations-disabled')
  })
})
