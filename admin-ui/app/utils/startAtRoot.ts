import { ROUTES } from '@/helpers/navigation'
import { REGEX_LEADING_SLASH } from '@/utils/regex'

const withTrailingSlash = (value: string): string => (value.endsWith('/') ? value : `${value}/`)

export const resolveStartPath = (
  basePath: string,
  pathname: string,
  search: string,
  hash: string,
): string | null => {
  const base = withTrailingSlash(basePath)
  if (pathname === base || pathname === base.slice(0, -1)) return null
  if (pathname === `${base}${ROUTES.LOGOUT.replace(REGEX_LEADING_SLASH, '')}`) return null
  return `${base}${search}${hash}`
}

export const startAtRoot = (basePath: string): void => {
  const { pathname, search, hash } = window.location
  const target = resolveStartPath(basePath, pathname, search, hash)
  if (target) {
    window.history.replaceState(null, '', target)
  }
}
