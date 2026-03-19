import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'
import { filter, forOwn, isUndefined, compact, differenceBy, pick } from 'lodash'

import { LayoutContent } from './LayoutContent'
import { LayoutNavbar } from './LayoutNavbar'
import { LayoutSidebar } from './LayoutSidebar'
import { PageConfigContext } from './PageConfigContext'
import { ThemeClass } from './../Theme'
import type {
  LayoutPartComponentType,
  LayoutProps,
  LayoutState,
  ResponsiveBreakpoints,
  ScreenSize,
} from './types'

import config from './../../../config.js'

function getLayoutPartName(type: React.ReactElement['type']): string | undefined {
  if (typeof type === 'string' || type == null) return undefined
  const part = type as LayoutPartComponentType & React.ReactElement['type']
  return typeof part.layoutPartName === 'string' ? part.layoutPartName : undefined
}

const findChildByType = (
  children: React.ReactNode,
  targetType: LayoutPartComponentType,
): React.ReactElement | undefined => {
  let result: React.ReactElement | undefined

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      getLayoutPartName(child.type) === targetType.layoutPartName
    ) {
      result = child
    }
  })

  return result
}

const findChildrenByType = (
  children: React.ReactNode,
  targetType: LayoutPartComponentType,
): React.ReactElement[] => {
  return filter(
    React.Children.toArray(children),
    (child) =>
      React.isValidElement(child) && getLayoutPartName(child.type) === targetType.layoutPartName,
  ) as React.ReactElement[]
}

const responsiveBreakpoints: ResponsiveBreakpoints = {
  xs: { max: 575.8 },
  sm: { min: 576, max: 767.8 },
  md: { min: 768, max: 991.8 },
  lg: { min: 992, max: 1199.8 },
  xl: { min: 1200 },
}

function getScreenSize(): ScreenSize {
  let currentScreenSize: ScreenSize | undefined
  forOwn(responsiveBreakpoints, (value, key) => {
    const queryParts = [
      `${isUndefined(value.min) ? '' : `(min-width: ${value.min}px)`}`,
      `${isUndefined(value.max) ? '' : `(max-width: ${value.max}px)`}`,
    ]
    const query = compact(queryParts).join(' and ')
    if (typeof window !== 'undefined' && window.matchMedia(query).matches) {
      currentScreenSize = key as ScreenSize
    }
  })
  return currentScreenSize ?? ''
}

const initialLayoutState: LayoutState = {
  sidebarHidden: false,
  navbarHidden: false,
  footerHidden: false,
  sidebarCollapsed: false,
  screenSize: '' as ScreenSize,
  animationsDisabled: true,
  pageTitle: null,
  pageDescription: config.siteDescription,
  pageKeywords: config.siteKeywords,
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { children } = props
  const location = useLocation()

  const [state, setState] = useState<LayoutState>(initialLayoutState)
  const containerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLElement | null>(null)
  const documentRef = useRef<HTMLElement | null>(null)

  const updateNavbarsPositions = useCallback(() => {
    const containerElement = containerRef.current
    if (containerElement) {
      const navbarElements = containerElement.querySelectorAll(':scope .layout__navbar')
      let totalNavbarsHeight = 0
      navbarElements.forEach((navbarElement: Element) => {
        const navbarBox = navbarElement.getBoundingClientRect()
        if (navbarElement instanceof HTMLElement) {
          navbarElement.style.top = `${totalNavbarsHeight}px`
          totalNavbarsHeight += navbarBox.height
        }
      })
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    bodyRef.current = document.body
    documentRef.current = document.documentElement
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const layoutAdjuster = () => {
      const nextScreenSize = getScreenSize()
      setState((prev) =>
        prev.screenSize !== nextScreenSize ? { ...prev, screenSize: nextScreenSize } : prev,
      )
    }

    const onResize = () => setTimeout(layoutAdjuster, 0)
    window.addEventListener('resize', onResize)
    layoutAdjuster()

    const raf = window.requestAnimationFrame(() => {
      setState((prev) => ({ ...prev, animationsDisabled: false }))
    })

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  useLayoutEffect(() => {
    if (bodyRef.current && documentRef.current) {
      documentRef.current.scrollTop = bodyRef.current.scrollTop = 0
    }
  }, [location.pathname])

  useLayoutEffect(() => {
    updateNavbarsPositions()
  }, [
    state.sidebarHidden,
    state.navbarHidden,
    state.footerHidden,
    children,
    updateNavbarsPositions,
  ])

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }))
  }, [])

  const setElementsVisibility = useCallback((elements: Partial<LayoutState>) => {
    setState((prev) => ({
      ...prev,
      ...pick(elements, ['sidebarHidden', 'navbarHidden', 'footerHidden']),
    }))
  }, [])

  const changeMeta = useCallback((metaData: Partial<LayoutState>) => {
    setState((prev) => ({ ...prev, ...metaData }))
  }, [])

  const sidebar = findChildByType(children, LayoutSidebar)
  const navbars = findChildrenByType(children, LayoutNavbar)
  const content = findChildByType(children, LayoutContent)
  const otherChildren = differenceBy(
    React.Children.toArray(children),
    [sidebar, ...navbars, content],
    'type',
  )
  const layoutClass = classNames('layout', 'layout--animations-enabled')

  return (
    <PageConfigContext.Provider
      value={{
        ...state,
        sidebarSlim: false,
        toggleSidebar,
        setElementsVisibility,
        changeMeta,
      }}
    >
      <ThemeClass>
        {(themeClass) => (
          <div className={classNames(layoutClass, themeClass)} ref={containerRef}>
            {!state.sidebarHidden &&
              sidebar &&
              React.cloneElement(sidebar, {
                sidebarSlim: false,
                sidebarCollapsed: false,
              })}

            <div className="layout__wrap">
              {!state.navbarHidden && navbars}

              {content}
            </div>

            {otherChildren}
          </div>
        )}
      </ThemeClass>
    </PageConfigContext.Provider>
  )
}

export { Layout }
