const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

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

  const safePostLogoutRedirectUri = buildSafeNavigationUrl(postLogoutRedirectUri)
  if (safePostLogoutRedirectUri) {
    logoutUrl.searchParams.set('post_logout_redirect_uri', safePostLogoutRedirectUri)
  }

  return logoutUrl.toString()
}
