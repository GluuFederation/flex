import initWasm, {
  init_from_archive_bytes,
  Cedarling,
  MultiIssuerAuthorizeResult,
} from '@janssenproject/cedarling_wasm'
import type {
  ICedarlingClient,
  BootStrapConfig,
  AuthorizationResponse,
  TokenAuthorizationRequest,
} from '@/cedarling'

let cedarling: Cedarling | null = null
let cedarlingInitialized: boolean = false
let initializationPromise: Promise<void> | null = null

const initialize = async (config: BootStrapConfig, policyStoreBytes: Uint8Array): Promise<void> => {
  if (cedarlingInitialized) {
    return Promise.resolve()
  }

  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    try {
      await initWasm()
      cedarling = await init_from_archive_bytes(config, policyStoreBytes)
      cedarlingInitialized = true
    } catch (err) {
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

  const result: MultiIssuerAuthorizeResult = await cedarling.authorize_multi_issuer(request)
  return {
    ...result,
    decision: result.decision,
  } as AuthorizationResponse
}

export const cedarlingClient: ICedarlingClient = {
  initialize,
  token_authorize,
}
