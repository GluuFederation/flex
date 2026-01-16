import type {
  NavigateFunction as ReactRouterNavigateFunction,
  NavigateOptions,
  To,
} from 'react-router-dom'

let navigateFunction: ReactRouterNavigateFunction | null = null

export function setNavigateFunction(navigate: ReactRouterNavigateFunction | null): void {
  navigateFunction = navigate
}

export function navigate(to: To, options?: NavigateOptions): void {
  if (!navigateFunction) {
    console.error(
      'NavigationService: navigate function not initialized. NavigationProvider must be mounted.',
    )
    return
  }
  navigateFunction(to, options)
}

export function isNavigationAvailable(): boolean {
  return navigateFunction !== null
}

export const navigationService = {
  setNavigateFunction,
  navigate,
  isNavigationAvailable,
}
