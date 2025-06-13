import React, { ReactNode, useState, useRef, useEffect, useMemo, useContext, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import find from 'lodash/find'
import includes from 'lodash/includes'
import mapValues from 'lodash/mapValues'
import classNames from 'classnames'
import { PageConfigContext } from './../Layout/PageConfigContext'
import { SideMenuAnimate } from './../../common'
import { MenuContext } from './MenuContext'

// Types for entries and context
interface SidebarMenuEntry {
  id: string
  parentId?: string
  exact: boolean
  url?: string
  open?: boolean
  active?: boolean
}

interface SidebarMenuContext {
  entries: Record<string, SidebarMenuEntry>
  addEntry: (entry: SidebarMenuEntry) => void
  updateEntry: (id: string, stateMods: Partial<SidebarMenuEntry>) => void
  removeEntry: (id: string) => void
}

// Types for injected props
interface Location {
  pathname: string
  [key: string]: any
}

interface PageConfig {
  sidebarSlim?: boolean
  sidebarCollapsed?: boolean
  screenSize?: string
  [key: string]: any
}

export interface SidebarMenuProps {
  children?: ReactNode
  currentUrl?: string
  slim?: boolean
  disabled?: boolean
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ children, slim, disabled }) => {
  const location = useLocation() as Location
  const pageConfig = useContext(PageConfigContext) as PageConfig
  const containerRef = useRef<HTMLUListElement>(null)
  const [entries, setEntries] = useState<Record<string, SidebarMenuEntry>>({})
  const entriesRef = useRef(entries)
  const sidebarAnimation = useRef<any>(null)

  // Keep entriesRef in sync with entries
  useEffect(() => {
    entriesRef.current = entries
  }, [entries])

  const addEntry = useCallback((entry: SidebarMenuEntry) => {
    setEntries(prev => ({
      ...prev,
      [entry.id]: {
        open: false,
        active: false,
        ...entry,
      },
    }))
  }, [])

  const updateEntry = useCallback((id: string, stateMods: Partial<SidebarMenuEntry>) => {
    setEntries(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...stateMods,
      },
    }))
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => {
      const { [id]: toRemove, ...rest } = prev
      return rest
    })
  }, [])

  const setActiveEntries = (openActive = false) => {
    const activeId = (
      childEntry: SidebarMenuEntry,
      entries: Record<string, SidebarMenuEntry>,
      previous: string[] = []
    ): string[] => {
      if (childEntry.parentId) {
        const parentEntry = entries[childEntry.parentId]
        const activeIds = [...previous, parentEntry.id]
        return activeId(parentEntry, entries, activeIds)
      }
      return previous
    }

    const activeChild = find(entriesRef.current, (entry: SidebarMenuEntry) => {
      const { pathname } = location
      const noTailSlashLocation =
        pathname[pathname.length - 1] === '/' && pathname.length > 1
          ? pathname.replace(/\/$/, '')
          : pathname
      return entry.exact
        ? entry.url === noTailSlashLocation
        : !!entry.url && includes(noTailSlashLocation, entry.url)
    })

    if (activeChild) {
      const activeEntries = [
        ...activeId(activeChild, entriesRef.current),
        activeChild.id,
      ]
      setEntries(prev =>
        mapValues(prev, (entry) => {
          const isActive = includes(activeEntries, entry.id)
          return {
            ...entry,
            active: isActive,
            open: openActive ? !entry.url && isActive : entry.open,
          }
        })
      )
    }
  }

  // Animation and active entry logic
  useEffect(() => {
    sidebarAnimation.current = new SideMenuAnimate()
    sidebarAnimation.current.assignParentElement(containerRef.current)
    setTimeout(() => {
      setActiveEntries(true)
    }, 0)
    return () => {
      if (sidebarAnimation.current) {
        sidebarAnimation.current.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update active entries on location change
  useEffect(() => {
    setActiveEntries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const isSlim =
    slim ||
    (pageConfig?.sidebarSlim &&
      pageConfig?.sidebarCollapsed &&
      (pageConfig?.screenSize === 'lg' ||
        pageConfig?.screenSize === 'xl'))
  const sidebarMenuClass = classNames('sidebar-menu', {
    'sidebar-menu--slim': isSlim,
    'sidebar-menu--disabled': disabled,
  })

  const contextValue = useMemo(() => ({
    entries,
    addEntry,
    updateEntry,
    removeEntry,
  }), [entries])

  return (
    <MenuContext.Provider value={contextValue}>
      <ul className={sidebarMenuClass} ref={containerRef}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Only pass currentUrl and slim to SidebarMenuItem
            const type = child.type as any
            if (
              type?.displayName === 'SidebarMenuItem' ||
              type?.name === 'SidebarMenuItem'
            ) {
              return React.cloneElement(child as React.ReactElement<any>, {
                currentUrl: location.pathname,
                slim: isSlim,
              })
            }
          }
          return child
        })}
      </ul>
    </MenuContext.Provider>
  )
}

export { SidebarMenu }
