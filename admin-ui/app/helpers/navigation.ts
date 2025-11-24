import { useNavigate, NavigateOptions } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

const ROUTES = {
  HOME_DASHBOARD: '/home/dashboard',
  USER_MANAGEMENT: '/user/usersmanagement',
  USER_ADD: '/user/usermanagement/add',
  USER_EDIT: (id: string) => `/user/usermanagement/edit/${encodeURIComponent(id)}`,
  // Layout routes
  LAYOUT_NAVBAR: '/layouts/navbar',
  LAYOUT_SIDEBAR: '/layouts/sidebar',
  LAYOUT_SIDEBAR_A: '/layouts/sidebar-a',
  LAYOUT_SIDEBAR_WITH_NAVBAR: '/layouts/sidebar-with-navbar',
  // Page routes
  PROFILE: '/profile',
  LOGOUT: '/logout',
  ERROR_404: '/error-404',
  // Wildcard routes
  WILDCARD: '/*',
  ROOT: '/',
} as const

export const NAVIGATION_ROUTES = {
  HOME_DASHBOARD: 'HOME_DASHBOARD',
  USER_MANAGEMENT: 'USER_MANAGEMENT',
  USER_ADD: 'USER_ADD',
  USER_EDIT: 'USER_EDIT',
  // Layout routes
  LAYOUT_NAVBAR: 'LAYOUT_NAVBAR',
  LAYOUT_SIDEBAR: 'LAYOUT_SIDEBAR',
  LAYOUT_SIDEBAR_A: 'LAYOUT_SIDEBAR_A',
  LAYOUT_SIDEBAR_WITH_NAVBAR: 'LAYOUT_SIDEBAR_WITH_NAVBAR',
  // Page routes
  PROFILE: 'PROFILE',
  LOGOUT: 'LOGOUT',
  ERROR_404: 'ERROR_404',
  // Wildcard routes
  WILDCARD: 'WILDCARD',
  ROOT: 'ROOT',
} as const

export type RouteKey = keyof typeof ROUTES
export type RouteValue = (typeof ROUTES)[RouteKey]
export type NavigationRouteKey = keyof typeof NAVIGATION_ROUTES

export const useAppNavigation = () => {
  const navigate = useNavigate()

  /**
   * Generic navigation function that accepts a route path or route key
   * @param route - Can be a route key (e.g., 'USER_MANAGEMENT'), a route path string, or a route function result
   * @param options - Optional navigation options (state, replace, etc.)
   */
  const navigateToRoute = useCallback(
    (route: RouteKey | string | RouteValue, options?: NavigateOptions): void => {
      let path: string

      if (typeof route === 'string') {
        // If it's a route key, get the route value
        if (route in ROUTES) {
          const routeValue = ROUTES[route as RouteKey]
          // Check if route value is a function (like USER_EDIT)
          path = typeof routeValue === 'function' ? routeValue('') : routeValue
        } else {
          // It's already a path string
          path = route
        }
      } else if (typeof route === 'function') {
        // This shouldn't happen with current implementation, but handle it
        throw new Error(
          'Route function must be called with parameters before passing to navigateToRoute',
        )
      } else {
        path = route
      }

      navigate(path, options)
    },
    [navigate],
  )

  /**
   * Navigate back in history, or to a fallback route if no history
   */
  const navigateBack = useCallback(
    (fallbackRoute?: RouteKey | string): void => {
      if (window.history.length > 1) {
        window.history.back()
      } else if (fallbackRoute) {
        navigateToRoute(fallbackRoute)
      }
    },
    [navigateToRoute],
  )

  return useMemo(
    () => ({
      navigateToRoute,
      navigateBack,
      navigate,
    }),
    [navigateToRoute, navigateBack, navigate],
  )
}

export { ROUTES }
