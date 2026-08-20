import { REGEX_INTERNAL_ROUTE } from '@/utils/regex'

const INTENDED_ROUTE_KEY = 'intendedRoute'
const ROOT_ROUTE = '/'

const isSafeInternalRoute = (route: string): boolean =>
  route.startsWith(ROOT_ROUTE) && !route.startsWith('//') && REGEX_INTERNAL_ROUTE.test(route)

const rememberIntendedRoute = (route: string): void => {
  if (route === ROOT_ROUTE || !isSafeInternalRoute(route)) return
  try {
    window.sessionStorage.setItem(INTENDED_ROUTE_KEY, route)
  } catch {
    return
  }
}

const consumeIntendedRoute = (): string | null => {
  try {
    const stored = window.sessionStorage.getItem(INTENDED_ROUTE_KEY)
    window.sessionStorage.removeItem(INTENDED_ROUTE_KEY)
    if (!stored || !isSafeInternalRoute(stored)) return null
    return stored
  } catch {
    return null
  }
}

export { rememberIntendedRoute, consumeIntendedRoute, isSafeInternalRoute }
