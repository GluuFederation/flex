import { REGEX_PYTHON_PLACEHOLDER } from '@/utils/regex'

declare global {
  interface Window {
    configApiBaseUrl?: string
  }
}

/**
 * Resolves the Config API base URL from `window.configApiBaseUrl` (injected at runtime by
 * `env-config.js`), then `CONFIG_API_BASE_URL` (baked in at build time), then `fallback`.
 * A runtime value that is still an un-substituted `%(...)s` placeholder is ignored, because
 * environments that never templated `env-config.js` serve the placeholder verbatim.
 */
export const resolveConfigApiBaseUrl = (fallback: string): string => {
  const runtimeUrl =
    typeof window !== 'undefined' &&
    window.configApiBaseUrl &&
    !REGEX_PYTHON_PLACEHOLDER.test(window.configApiBaseUrl)
      ? window.configApiBaseUrl
      : undefined

  return runtimeUrl || process.env.CONFIG_API_BASE_URL || fallback
}
