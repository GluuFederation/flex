import initWasm, { init, Cedarling, AuthorizeResult } from '@janssenproject/cedarling_wasm'
import type {
  ICedarlingClient,
  BootStrapConfig,
  AuthorizationResponse,
  TokenAuthorizationRequest,
} from '@/cedarling'
import { isAnyTokenExpired } from '@/cedarling/utility/tokenExpiry'

let cedarling: Cedarling | null = null
let cedarlingInitialized: boolean = false
let initializationPromise: Promise<void> | null = null

const isWasmCrashError = (error: unknown): boolean => {
  if (error instanceof RangeError) return true
  const msg = error instanceof Error ? error.message : typeof error === 'string' ? error : ''
  return (
    msg.includes('Maximum call stack') ||
    msg.includes('unreachable') ||
    (error instanceof Error && error.constructor?.name === 'RuntimeError')
  )
}

const initialize = async (bootStrapConfig: BootStrapConfig): Promise<void> => {
  if (cedarlingInitialized) {
    return Promise.resolve()
  }

  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    try {
      await initWasm()
      cedarling = await init(bootStrapConfig)
      cedarlingInitialized = true
    } catch (err) {
      console.error('Error during Cedarling init:', err)
      initializationPromise = null
      throw err
    }
  })()

  return initializationPromise
}

const reset = (): void => {
  cedarling = null
  cedarlingInitialized = false
  initializationPromise = null
}

const token_authorize = async (
  request: TokenAuthorizationRequest,
): Promise<AuthorizationResponse> => {
  if (!cedarlingInitialized || !cedarling) {
    throw new Error('Cedarling not initialized')
  }

  if (isAnyTokenExpired(request.tokens)) {
    throw new Error('Token expired — skipping WASM authorization')
  }

  try {
    const result: AuthorizeResult = await cedarling.authorize(request)
    return {
      ...result,
      decision: result.decision,
    } as AuthorizationResponse
  } catch (error) {
    if (isWasmCrashError(error)) {
      console.error(
        '[Cedarling] Call stack / WASM crash detected (e.g. Maximum call stack size exceeded). Instance reset.',
        error,
      )
      reset()
    } else {
      console.error('Error during authorization:', error)
    }
    throw error
  }
}

export const cedarlingClient: ICedarlingClient = {
  initialize,
  token_authorize,
  reset,
}
