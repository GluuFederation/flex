import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { SidebarMenu, SidebarMenuItem } from '@/components/SidebarMenu'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

// The jsdom test URL (jest.config testEnvironmentOptions.url) resolves to pathname "/".
const ACTIVE_PATH = '/'

// SidebarMenu computes active state inside a setTimeout(0) scheduled from an effect,
// so flush both timers and pending React work before asserting active styling.
const flushActiveState = async (): Promise<void> => {
  await act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
  })
}

describe('SidebarMenu', () => {
  it('renders leaf menu items with their titles', () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem title="Dashboard" to="/dashboard" />
        <SidebarMenuItem title="Settings" to="/settings" />
      </SidebarMenu>,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders a leaf item as a navigable link pointing at its "to" target', () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem title="Dashboard" to="/dashboard" />
      </SidebarMenu>,
      { wrapper: Wrapper },
    )
    const link = screen.getByRole('link', { name: /Dashboard/i })
    expect(link).toHaveAttribute('href', '/dashboard')
  })

  it('renders an item as a router link, preferring "to" over "href"', () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem title="Docs" to="/docs" href="https://example.com/docs" />
      </SidebarMenu>,
      { wrapper: Wrapper },
    )
    // When `to` is set it wins: the item renders a react-router Link to that path,
    // not an external anchor.
    const link = screen.getByRole('link', { name: /Docs/i })
    expect(link).toHaveAttribute('href', '/docs')
    expect(link).not.toHaveAttribute('target')
  })

  it('fires handleClick for a logout item and prevents navigation', () => {
    const handleClick = jest.fn()
    render(
      <SidebarMenu>
        <SidebarMenuItem title="Logout" to="logout" handleClick={handleClick} />
      </SidebarMenu>,
      { wrapper: Wrapper },
    )
    fireEvent.click(screen.getByRole('link', { name: /Logout/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders nested children and applies the nested entry modifier class', () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem title="Parent">
          <SidebarMenuItem title="Child A" to="/child-a" />
          <SidebarMenuItem title="Child B" to="/child-b" />
        </SidebarMenuItem>
      </SidebarMenu>,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('Parent')).toBeInTheDocument()
    expect(screen.getByText('Child A')).toBeInTheDocument()
    expect(screen.getByText('Child B')).toBeInTheDocument()

    const parentLi = screen.getByText('Parent').closest('li')
    expect(parentLi).not.toBeNull()
    expect(parentLi?.className).toContain('sidebar-menu__entry--nested')
  })

  it('toggles the open state of a parent node when its toggle link is clicked', () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem title="Parent">
          <SidebarMenuItem title="Child A" to="/child-a" />
        </SidebarMenuItem>
      </SidebarMenu>,
      { wrapper: Wrapper },
    )
    const parentLi = screen.getByText('Parent').closest('li')
    expect(parentLi).not.toBeNull()
    if (!parentLi) {
      return
    }
    expect(parentLi.className).not.toContain('open')

    // The parent's toggle is an <a> without href (so it has no link role); target it directly.
    const toggle = (): HTMLElement => {
      const anchor = screen.getByText('Parent').closest('a')
      expect(anchor).not.toBeNull()
      return anchor as HTMLElement
    }
    fireEvent.click(toggle())
    expect(parentLi.className).toContain('open')

    fireEvent.click(toggle())
    expect(parentLi.className).not.toContain('open')
  })

  it('marks the entry matching the current location as active', async () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem title="Home" to={ACTIVE_PATH} exact />
        <SidebarMenuItem title="Other" to="/elsewhere" exact />
      </SidebarMenu>,
      { wrapper: Wrapper },
    )
    await flushActiveState()

    const homeLi = screen.getByText('Home').closest('li')
    const otherLi = screen.getByText('Other').closest('li')
    expect(homeLi?.className).toContain('active')
    expect(otherLi?.className).not.toContain('active')
  })

  it('applies the configured active class to the active parent toggle link', async () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem title="Parent" sidebarMenuActiveClass="is-active">
          <SidebarMenuItem title="Home" to={ACTIVE_PATH} exact />
        </SidebarMenuItem>
      </SidebarMenu>,
      { wrapper: Wrapper },
    )
    await flushActiveState()

    // Active state propagates up: the parent li is active and its toggle link gets the class.
    const parentLi = screen.getByText('Parent').closest('li')
    expect(parentLi?.className).toContain('active')
    const toggle = screen.getByText('Parent').closest('a')
    expect(toggle?.className).toContain('is-active')
  })

  it('renders an empty node without a link', () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem title="Hidden" isEmptyNode>
          <SidebarMenuItem title="Visible Child" to="/visible" />
        </SidebarMenuItem>
      </SidebarMenu>,
      { wrapper: Wrapper },
    )
    // The empty node renders no link/title of its own, but its child still renders.
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
    expect(screen.getByText('Visible Child')).toBeInTheDocument()
  })

  it('does not render a caret toggle when noCaret is set on a parent', () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem title="Parent" noCaret>
          <SidebarMenuItem title="Child" to="/child" />
        </SidebarMenuItem>
      </SidebarMenu>,
      { wrapper: Wrapper },
    )
    const parentLi = screen.getByText('Parent').closest('li')
    expect(parentLi?.className).toContain('sidebar-menu__entry--no-caret')
  })

  it('applies the disabled modifier class to the menu container', () => {
    const { container } = render(
      <SidebarMenu disabled>
        <SidebarMenuItem title="Dashboard" to="/dashboard" />
      </SidebarMenu>,
      { wrapper: Wrapper },
    )
    const menu = container.querySelector('ul.sidebar-menu')
    expect(menu).not.toBeNull()
    expect(menu?.className).toContain('sidebar-menu--disabled')
  })
})
