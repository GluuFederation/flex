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
    console.log(
      '[Cedarling] init result',
      JSON.stringify({ step: 'skip', reason: 'alreadyInitialized' }),
    )
    return Promise.resolve()
  }

  if (initializationPromise) {
    console.log(
      '[Cedarling] init step',
      JSON.stringify({ step: 'skip', reason: 'initAlreadyInProgress' }),
    )
    return initializationPromise
  }

  initializationPromise = (async () => {
    let lastStep = 'start'
    try {
      console.log('[Cedarling] init step', JSON.stringify({ step: 'loadWasm' }))
      lastStep = 'loadWasm'
      await initWasm()
      console.log('[Cedarling] init step', JSON.stringify({ step: 'loadWasm', done: true }))

      console.log('[Cedarling] init step', JSON.stringify({ step: 'createInstance' }))
      lastStep = 'createInstance'
      cedarling = await init(bootStrapConfig)
      cedarlingInitialized = true
      console.log('[Cedarling] init step', JSON.stringify({ step: 'createInstance', done: true }))
      console.log('[Cedarling] init result', JSON.stringify({ ok: true, ready: true }))
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.error(
        '[Cedarling] init result',
        JSON.stringify({ ok: false, failedAt: lastStep, error: errMsg }),
      )
      console.error('[Cedarling] init error detail', errMsg)
      initializationPromise = null
      throw err
    }
  })()

  return initializationPromise
}

const sanitize = (req: TokenAuthorizationRequest) => {
  const id = req.resource?.cedar_entity_mapping?.id ?? '?'
  const t = req.tokens
  return {
    resourceId: id,
    action: req.action,
    tokens: {
      access: t?.access_token ? `${t.access_token.length}B` : 'missing',
      id: t?.id_token ? `${t.id_token.length}B` : 'missing',
      userinfo: t?.userinfo_token ? `${t.userinfo_token.length}B` : 'missing',
    },
  }
}

const token_authorize = async (
  request: TokenAuthorizationRequest,
): Promise<AuthorizationResponse> => {
  if (!cedarlingInitialized || !cedarling) {
    console.warn(
      '[Cedarling] authorize skipped',
      JSON.stringify({ reason: 'notInitialized', cedarlingInitialized, hasInstance: !!cedarling }),
    )
    throw new Error('Cedarling not initialized')
  }

  const info = sanitize(request)
  console.log('[Cedarling] WASM authorize', JSON.stringify(info))

  try {
    const result: AuthorizeResult = await cedarling.authorize(request)
    console.log(
      '[Cedarling] WASM result',
      JSON.stringify({
        resourceId: info.resourceId,
        action: info.action,
        decision: result.decision,
      }),
    )
    return {
      ...result,
      decision: result.decision,
    } as AuthorizationResponse
  } catch (error) {
    console.error(
      '[Cedarling] WASM error',
      JSON.stringify({
        resourceId: info.resourceId,
        action: info.action,
        error: error instanceof Error ? error.message : String(error),
      }),
    )
    throw error
  }
}

export const cedarlingClient: ICedarlingClient = {
  initialize,
  token_authorize,
}
