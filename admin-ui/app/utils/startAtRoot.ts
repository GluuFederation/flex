import { ROUTES } from '@/helpers/navigation'

const withTrailingSlash = (value: string): string => (value.endsWith('/') ? value : `${value}/`)

export const resolveStartPath = (
  basePath: string,
  pathname: string,
  search: string,
  hash: string,
): string | null => {
  const base = withTrailingSlash(basePath)
  if (pathname === base || pathname === base.slice(0, -1)) return null
  if (pathname === ROUTES.LOGOUT) return null
  return `${base}${search}${hash}`
}

export const startAtRoot = (basePath: string): void => {
  const { pathname, search, hash } = window.location
  const target = resolveStartPath(basePath, pathname, search, hash)
  if (target) {
    window.history.replaceState(null, '', target)
  }
}
