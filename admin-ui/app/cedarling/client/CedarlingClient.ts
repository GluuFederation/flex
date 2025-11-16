import initWasm, { init, Cedarling, AuthorizeResult } from '@janssenproject/cedarling_wasm'
import type {
  ICedarlingClient,
  BootStrapConfig,
  AuthorizationResponse,
  TokenAuthorizationRequest,
} from '@/cedarling'

let cedarling: Cedarling | null = null
let cedarlingInitialized: boolean = false
let initializationPromise: Promise<void> | null = null

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
      initializationPromise = null // Reset on error to allow retry
      throw err
    }
  })()

  return initializationPromise
}

const token_authorize = async (
  request: TokenAuthorizationRequest,
): Promise<AuthorizationResponse> => {
  if (!cedarlingInitialized || !cedarling) {
    throw new Error('Cedarling not initialized')
  }

  try {
    const result: AuthorizeResult = await cedarling.authorize(request)
    return {
      ...result,
      decision: result.decision,
    } as AuthorizationResponse
  } catch (error) {
    console.error('Error during authorization:', error)
    throw error
  }
}

export const cedarlingClient: ICedarlingClient = {
  initialize,
  token_authorize,
}
