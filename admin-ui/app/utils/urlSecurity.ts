const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])
const ABSOLUTE_URL_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i

export const buildSafeNavigationUrl = (
  rawUrl: string | null | undefined,
  options?: { baseUrl?: string },
): string | null => {
  if (!rawUrl) return null

  const trimmedUrl = rawUrl.trim()
  if (!trimmedUrl) return null

  try {
    const parsedUrl = options?.baseUrl
      ? new URL(trimmedUrl, options.baseUrl)
      : new URL(trimmedUrl, window.location.origin)

    if (!ALLOWED_PROTOCOLS.has(parsedUrl.protocol)) {
      return null
    }

    return parsedUrl.toString()
  } catch {
    return null
  }
}

export const buildSafeLogoutUrl = (
  endSessionEndpoint: string | null | undefined,
  postLogoutRedirectUri: string | null | undefined,
  state: string,
): string | null => {
  const safeEndSessionEndpoint = buildSafeNavigationUrl(endSessionEndpoint)
  if (!safeEndSessionEndpoint) {
    return null
  }

  const logoutUrl = new URL(safeEndSessionEndpoint)
  logoutUrl.searchParams.set('state', state)

  const configuredPostLogoutRedirectUri = postLogoutRedirectUri?.trim()
  if (
    configuredPostLogoutRedirectUri &&
    ABSOLUTE_URL_PATTERN.test(configuredPostLogoutRedirectUri) &&
    buildSafeNavigationUrl(configuredPostLogoutRedirectUri)
  ) {
    logoutUrl.searchParams.set('post_logout_redirect_uri', configuredPostLogoutRedirectUri)
  }

  return logoutUrl.toString()
}
