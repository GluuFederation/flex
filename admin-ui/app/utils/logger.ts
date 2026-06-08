import { isDevelopment } from '@/utils/env'
import type { LogArg, LogEnv } from '@/utils/types'

/**
 * Resolves whether a log call should reach the console for the given audience:
 * - `'dev'`  → development only (verbose breadcrumbs, never shipped).
 * - `'prod'` → production only.
 * - `'both'` → every environment.
 *
 * `'prod'` output is gated so it is suppressed in development; `'dev'` output is
 * gated on {@link isDevelopment} so it never ships (issue #2811).
 */
const emit = (
  method: 'log' | 'warn' | 'error' | 'debug',
  env: LogEnv,
  args: LogArg[],
): void => {
  if (env === 'dev') {
    if (isDevelopment) console[method](...args)
    return
  }

  if (env === 'prod' && isDevelopment) {
    return
  }

  // 'prod' (in production) or 'both' (any environment).
  console[method](...args)
}

/**
 * Unified logger. The first argument selects the audience (`'dev'`, `'prod'` or
 * `'both'`); the rest are the values to log. A single import covers logging in
 * every environment.
 *
 * @example
 *   logger.error('prod', 'Cedarling init failed:', message) // prod + dev console
 *   logger.warn('both', 'Retrying request')                 // every environment
 *   logger.log('dev', 'Breadcrumb', payload)                // development only
 */
export const logger = {
  log: (env: LogEnv, ...args: LogArg[]) => emit('log', env, args),
  warn: (env: LogEnv, ...args: LogArg[]) => emit('warn', env, args),
  error: (env: LogEnv, ...args: LogArg[]) => emit('error', env, args),
  debug: (env: LogEnv, ...args: LogArg[]) => emit('debug', env, args),
}
