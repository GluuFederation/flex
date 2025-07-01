import initWasm, { init, Cedarling, AuthorizeResult } from '@janssenproject/cedarling_wasm'
import type {
  ICedarlingClient,
  BootStrapConfig,
  AuthorizationResponse,
  TokenAuthorizationRequest,
} from '../types'

let cedarling: Cedarling | null = null
let cedarlingInitialized: boolean = false

const initialize = async (bootStrapConfig: BootStrapConfig): Promise<void> => {
  if (!cedarlingInitialized) {
    try {
      await initWasm()

      cedarling = await init(bootStrapConfig)

      cedarlingInitialized = true
    } catch (err) {
      console.error('Error during Cedarling init:', err)
      throw err // rethrow so .catch gets it
    }
  }
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
