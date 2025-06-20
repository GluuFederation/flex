import initWasm, { init, Cedarling, AuthorizeResult } from '@janssenproject/cedarling_wasm'
import type {
  ICedarlingClient,
  PolicyStoreConfig,
  AuthorizationRequest,
  AuthorizationResponse,
} from '../types'

let cedarling: Cedarling | null = null
let initialized: boolean = false

const initialize = async (policyStoreConfig: PolicyStoreConfig): Promise<void> => {
  if (!initialized) {
    await initWasm()
    cedarling = await init(policyStoreConfig)
    initialized = true
  }
}

const authorize = async (request: AuthorizationRequest): Promise<AuthorizationResponse> => {
  if (!initialized || !cedarling) {
    throw new Error('Cedarling not initialized')
  }

  try {
    const result: AuthorizeResult = await cedarling.authorize_unsigned(request)
    // Convert AuthorizeResult to AuthorizationResponse
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
  authorize,
}
