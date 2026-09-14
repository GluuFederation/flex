import initWasm, {
  initFromArchiveBytes,
  Cedarling,
  MultiIssuerAuthorizeResult,
} from '@janssenproject/cedarling_wasm'
import type {
  ICedarlingClient,
  BootStrapConfig,
  AuthorizationResponse,
  TokenAuthorizationRequest,
} from '@/cedarling/types'
import { logger } from '@/utils/logger'

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
      cedarling = await initFromArchiveBytes(config, policyStoreBytes)
      cedarlingInitialized = true
    } catch (err) {
      logger.error(
        'Cedarling WASM initialization failed:',
        err instanceof Error ? err : String(err),
      )
      initializationPromise = null
      throw err
    }
  })()

  return initializationPromise
}

const token_authorize = async (
  request: TokenAuthorizationRequest,
): Promise<AuthorizationResponse> => {
  if (!cedarlingInitialized || !cedarling) {
    logger.debug('Cedarling token_authorize called before initialization completed.')
    throw new Error('Cedarling not initialized')
  }

  const result: MultiIssuerAuthorizeResult = await cedarling.authorizeMultiIssuer(
    JSON.stringify(request),
  )
  try {
    const response: AuthorizationResponse = {
      decision: result.decision,
      request_id: result.request_id,
    }
    return response
  } finally {
    result.free()
  }
}

export const cedarlingClient: ICedarlingClient = {
  initialize,
  token_authorize,
}
