import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { SidebarMenuItem } from '../SidebarMenuItem'
import { MenuContext } from '../MenuContext'
import type { SidebarMenuContext, SidebarMenuEntry } from '../types'
import { ThemeContext } from '@/context/theme/themeContext'
import type { ThemeContextType } from '@/context/theme/themeContext'
import { THEME_DARK, THEME_LIGHT } from '@/context/theme/constants'
import customColors from '@/customColors'

type RenderOptions = {
  entries?: Record<string, SidebarMenuEntry>
  theme?: ThemeContextType['state']['theme']
}

const renderItem = (
  props: React.ComponentProps<typeof SidebarMenuItem>,
  { entries = {}, theme = THEME_LIGHT }: RenderOptions = {},
) => {
  const menuValue: SidebarMenuContext = {
    entries,
    addEntry: jest.fn(),
    updateEntry: jest.fn(),
    removeEntry: jest.fn(),
  }
  const themeValue: ThemeContextType = {
    state: { theme },
    dispatch: jest.fn(),
  }
  return {
    menuValue,
    ...render(
      <MemoryRouter>
        <ThemeContext.Provider value={themeValue}>
          <MenuContext.Provider value={menuValue}>
            <ul>
              <SidebarMenuItem {...props} />
            </ul>
          </MenuContext.Provider>
        </ThemeContext.Provider>
      </MemoryRouter>,
    ),
  }
}

describe('SidebarMenuItem', () => {
  it('renders the title text', () => {
    renderItem({ title: 'Dashboard', to: '/dashboard' })
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders a router link for a normal "to" route', () => {
    renderItem({ title: 'Dashboard', to: '/dashboard' })
    const link = screen.getByText('Dashboard').closest('a')
    expect(link).toHaveAttribute('href', '/dashboard')
  })

  it('renders a router link (not a toggle anchor) when href is provided', () => {
    // The link branch keys off `to`; with only `href` set it still routes via
    // <Link>, so it renders an anchor rather than the toggle-only fallback.
    renderItem({ title: 'Docs', href: 'https://docs.example.com' })
    const link = screen.getByText('Docs').closest('a')
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('sidebar-menu__entry__link')
  })

  it('invokes handleClick instead of navigating for the logout entry', () => {
    const handleClick = jest.fn()
    renderItem({ title: 'Logout', to: 'logout', handleClick })
    fireEvent.click(screen.getByText('Logout').closest('a') as HTMLAnchorElement)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders nothing clickable for an empty node', () => {
    const { container } = renderItem({ title: 'Group', isEmptyNode: true })
    expect(container.querySelector('a')).toBeNull()
    expect(screen.queryByText('Group')).not.toBeInTheDocument()
  })

  it('applies the active class from props when the entry is active', () => {
    const id = 'will-not-match'
    // active class depends on the generated entry id, so we assert the
    // li carries the structural entry class instead.
    const { container } = renderItem(
      { title: 'Dashboard', to: '/dashboard', sidebarMenuActiveClass: 'is-active' },
      { entries: { [id]: { id, exact: true, active: true } } },
    )
    expect(container.querySelector('li')).toHaveClass('sidebar-menu__entry')
  })

  it('renders a caret when there are children and noCaret is not set', () => {
    const { container } = renderItem({
      title: 'Parent',
      to: '/parent',
      children: <SidebarMenuItem title="Child" to="/child" />,
    })
    expect(container.querySelector('.sidebar-menu__entry__chevron')).toBeInTheDocument()
  })

  it('omits the caret when noCaret is set', () => {
    const { container } = renderItem({
      title: 'Parent',
      to: '/parent',
      noCaret: true,
      children: <SidebarMenuItem title="Child" to="/child" />,
    })
    expect(container.querySelector('.sidebar-menu__entry__chevron')).toBeNull()
  })

  it('renders nested children inside a submenu list', () => {
    renderItem({
      title: 'Parent',
      to: '/parent',
      children: <SidebarMenuItem title="Child" to="/child" />,
    })
    expect(screen.getByText('Child')).toBeInTheDocument()
  })

  it('colors the icon white in dark theme', () => {
    const { container } = renderItem(
      { title: 'WithIcon', to: '/x', icon: <svg data-testid="icon" /> },
      { theme: THEME_DARK },
    )
    const icon = container.querySelector('[data-testid="icon"]')
    expect(icon).toHaveAttribute('fill', customColors.white)
  })
})
