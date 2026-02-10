import React from 'react'
import classNames from 'classnames'
// import { Helmet } from 'react-helmet'
import { useWithRouter as withRouter } from 'Utils/WithRouter'
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

class Layout extends React.Component<LayoutProps, LayoutState> {
  private lastLgSidebarCollapsed: boolean
  private containerRef: React.RefObject<HTMLDivElement>
  private bodyElement: HTMLElement | null
  private documentElement: HTMLElement | null

  constructor(props: LayoutProps) {
    super(props)

    this.state = {
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

    this.lastLgSidebarCollapsed = false
    this.containerRef = React.createRef()
    this.bodyElement = null
    this.documentElement = null
  }

  componentDidMount() {
    // Determine the current window size
    // and set it up in the context state
    const layoutAdjuster = () => {
      const { screenSize } = this.state
      let currentScreenSize: ScreenSize | undefined

      forOwn(responsiveBreakpoints, (value, key) => {
        const queryParts = [
          `${isUndefined(value.min) ? '' : `(min-width: ${value.min}px)`}`,
          `${isUndefined(value.max) ? '' : `(max-width: ${value.max}px)`}`,
        ]
        const query = compact(queryParts).join(' and ')

        if (window.matchMedia(query).matches) {
          currentScreenSize = key as ScreenSize
        }
      })

      const nextScreenSize: ScreenSize = currentScreenSize ?? ''
      if (screenSize !== nextScreenSize) {
        this.setState({ screenSize: nextScreenSize })
        this.updateLayoutOnScreenSize(nextScreenSize)
      }
    }

    // Add window initialization
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        setTimeout(layoutAdjuster.bind(this), 0)
      })

      layoutAdjuster()

      window.requestAnimationFrame(() => {
        this.setState({ animationsDisabled: false })
      })
    }
    // Add document initialization
    if (typeof document !== 'undefined') {
      this.bodyElement = document.body
      this.documentElement = document.documentElement
    }
  }

  componentDidUpdate(prevProps: LayoutProps, prevState: LayoutState) {
    // Prevent content scrolling in overlay mode
    if (
      this.bodyElement &&
      this.documentElement &&
      (this.state.screenSize === 'xs' ||
        this.state.screenSize === 'sm' ||
        this.state.screenSize === 'md')
    ) {
      if (prevState.sidebarCollapsed !== this.state.sidebarCollapsed) {
        // Most of the devices
        const styleUpdate = this.state.sidebarCollapsed
          ? {
              overflowY: 'auto',
              touchAction: 'auto',
            }
          : {
              overflowY: 'hidden',
              touchAction: 'none',
            }
        Object.assign(this.bodyElement.style, styleUpdate)
        Object.assign(this.documentElement.style, styleUpdate)
      }
    }

    // After location change
    if (prevProps.location.pathname !== this.props.location.pathname) {
      // Scroll to top
      if (this.bodyElement && this.documentElement) {
        this.documentElement.scrollTop = this.bodyElement.scrollTop = 0
      }

      // Hide the sidebar when in overlay mode
      if (
        !this.state.sidebarCollapsed &&
        (this.state.screenSize === 'xs' ||
          this.state.screenSize === 'sm' ||
          this.state.screenSize === 'md')
      ) {
        // Add some time to prevent jank while the dom is updating
        setTimeout(() => {
          this.setState({ sidebarCollapsed: true })
        }, 100)
      }
    }

    // Update positions of STICKY navbars
    this.updateNavbarsPositions()
  }

  updateLayoutOnScreenSize(screenSize: ScreenSize) {
    if (screenSize === 'md' || screenSize === 'sm' || screenSize === 'xs') {
      // Save for recovering to lg later
      this.lastLgSidebarCollapsed = this.state.sidebarCollapsed
      this.setState({ sidebarCollapsed: true })
    } else {
      this.setState({ sidebarCollapsed: this.lastLgSidebarCollapsed })
    }
  }

  updateNavbarsPositions() {
    const containerElement = this.containerRef.current
    if (containerElement) {
      const navbarElements = containerElement.querySelectorAll(':scope .layout__navbar')

      // Calculate and update style.top of each navbar
      let totalNavbarsHeight = 0
      navbarElements.forEach((navbarElement: Element) => {
        const navbarBox = navbarElement.getBoundingClientRect()
        if (navbarElement instanceof HTMLElement) {
          navbarElement.style.top = `${totalNavbarsHeight}px`
          totalNavbarsHeight += navbarBox.height
        }
      })
    }
  }

  toggleSidebar() {
    this.setState({
      sidebarCollapsed: !this.state.sidebarCollapsed,
    })
  }

  setElementsVisibility(elements: Partial<LayoutState>) {
    this.setState((prev) => ({
      ...prev,
      ...pick(elements, ['sidebarHidden', 'navbarHidden', 'footerHidden']),
    }))
  }

  render() {
    const { children } = this.props
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
          ...this.state,
          sidebarSlim:
            !!this.props.sidebarSlim &&
            (this.state.screenSize === 'lg' || this.state.screenSize === 'xl'),

          toggleSidebar: this.toggleSidebar.bind(this),
          setElementsVisibility: this.setElementsVisibility.bind(this),
          changeMeta: (metaData: Partial<LayoutState>) => {
            this.setState((prev) => ({ ...prev, ...metaData }))
          },
        }}
      >
        <ThemeClass>
          {(themeClass) => (
            <div className={classNames(layoutClass, themeClass)} ref={this.containerRef}>
              {!this.state.sidebarHidden &&
                sidebar &&
                React.cloneElement(sidebar, {
                  sidebarSlim: false,
                  sidebarCollapsed: this.state.sidebarCollapsed,
                })}

              <div className="layout__wrap">
                {!this.state.navbarHidden && navbars}

                {content}
              </div>

              {otherChildren}
            </div>
          )}
        </ThemeClass>
      </PageConfigContext.Provider>
    )
  }
}

const routedLayout = withRouter(Layout)

export { routedLayout as Layout }
