import React, {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from 'react'
import { useLocation } from 'react-router-dom'
import find from 'lodash/find'
import includes from 'lodash/includes'
import mapValues from 'lodash/mapValues'
import classNames from 'classnames'
import { PageConfigContext } from './../Layout/PageConfigContext'
import { SideMenuAnimate } from './../../common'
import { MenuContext } from './MenuContext'

type SidebarMenuEntry = {
  id: string
  parentId?: string
  exact: boolean
  url?: string
  open?: boolean
  active?: boolean
}

type SidebarMenuItemInjectedProps = {
  currentUrl: string
  slim: boolean
}

type ComponentWithDisplayName = React.ComponentType<Record<string, unknown>> & {
  displayName?: string
  name?: string
}

interface SidebarMenuProps {
  children?: ReactNode
  slim?: boolean
  disabled?: boolean
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ children, slim, disabled }) => {
  const location = useLocation()
  const pageConfig = useContext(PageConfigContext)
  const containerRef = useRef<HTMLUListElement>(null)
  const [entries, setEntries] = useState<Record<string, SidebarMenuEntry>>({})
  const entriesRef = useRef(entries)
  const sidebarAnimation = useRef<InstanceType<typeof SideMenuAnimate> | null>(null)

  useEffect(() => {
    entriesRef.current = entries
  }, [entries])

  const addEntry = useCallback((entry: SidebarMenuEntry) => {
    setEntries((prev) => ({
      ...prev,
      [entry.id]: {
        open: false,
        active: false,
        ...entry,
      },
    }))
  }, [])

  const updateEntry = useCallback((id: string, stateMods: Partial<SidebarMenuEntry>) => {
    setEntries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...stateMods,
      },
    }))
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const setActiveEntries = (openActive = false) => {
    const activeId = (
      childEntry: SidebarMenuEntry,
      entries: Record<string, SidebarMenuEntry>,
      previous: string[] = [],
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
      const activeEntries = [...activeId(activeChild, entriesRef.current), activeChild.id]
      setEntries((prev) =>
        mapValues(prev, (entry) => {
          const isActive = includes(activeEntries, entry.id)
          return {
            ...entry,
            active: isActive,
            open: openActive ? !entry.url && isActive : entry.open,
          }
        }),
      )
    }
  }

  useEffect(() => {
    sidebarAnimation.current = new SideMenuAnimate()
    if (containerRef.current) {
      sidebarAnimation.current.assignParentElement(containerRef.current)
    }
    setTimeout(() => {
      setActiveEntries(true)
    }, 0)
    return () => {
      if (sidebarAnimation.current) {
        sidebarAnimation.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    setActiveEntries()
  }, [location.pathname])

  const isSlim =
    slim ||
    (pageConfig?.sidebarSlim &&
      pageConfig?.sidebarCollapsed &&
      (pageConfig?.screenSize === 'lg' || pageConfig?.screenSize === 'xl'))
  const sidebarMenuClass = classNames('sidebar-menu', {
    'sidebar-menu--slim': isSlim,
    'sidebar-menu--disabled': disabled,
  })

  const contextValue = useMemo(
    () => ({
      entries,
      addEntry,
      updateEntry,
      removeEntry,
    }),
    [entries],
  )

  return (
    <MenuContext.Provider value={contextValue}>
      <ul className={sidebarMenuClass} ref={containerRef}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const type = child.type as ComponentWithDisplayName
            if (type?.displayName === 'SidebarMenuItem') {
              return React.cloneElement(
                child as React.ReactElement<Partial<SidebarMenuItemInjectedProps>>,
                {
                  currentUrl: location.pathname,
                  slim: isSlim,
                } as SidebarMenuItemInjectedProps,
              )
            }
          }
          return child
        })}
      </ul>
    </MenuContext.Provider>
  )
}

export { SidebarMenu }
