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
let wasmInitTime = 0
let wasmCallCount = 0
let lastSuccessfulCallTime = 0

type PendingReject = (error: Error) => void
const pendingWasmCalls = new Set<PendingReject>()
let lastWasmCrashTime = 0
const FOLLOWUP_WINDOW_MS = 5000

const isWasmCrash = (msg: string): boolean =>
  msg.includes('Maximum call stack size exceeded') || msg.includes('unreachable')

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const msg = event.message ?? ''
    if (!isWasmCrash(msg)) return

    if (pendingWasmCalls.size > 0) {
      event.preventDefault()
      lastWasmCrashTime = Date.now()
      const err = new Error(msg)
      console.error(
        '[Cedarling] global caught WASM crash',
        JSON.stringify({ error: msg, pendingCalls: pendingWasmCalls.size }),
      )
      pendingWasmCalls.forEach((reject) => reject(err))
      pendingWasmCalls.clear()
    } else if (Date.now() - lastWasmCrashTime < FOLLOWUP_WINDOW_MS) {
      event.preventDefault()
      console.warn('[Cedarling] suppressed follow-up WASM error', JSON.stringify({ error: msg }))
    }
  })
}

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
      wasmInitTime = Date.now()
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

const decodeJwtExp = (
  jwt: string,
): { exp: number | null; expired: boolean; expiresInSec: number } => {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]))
    const exp: number | null = typeof payload.exp === 'number' ? payload.exp : null
    if (exp === null) return { exp: null, expired: false, expiresInSec: 0 }
    const nowSec = Math.floor(Date.now() / 1000)
    return { exp, expired: nowSec >= exp, expiresInSec: exp - nowSec }
  } catch {
    return { exp: null, expired: false, expiresInSec: 0 }
  }
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
    tokenExpiry: {
      access: t?.access_token ? decodeJwtExp(t.access_token) : null,
      id: t?.id_token ? decodeJwtExp(t.id_token) : null,
      userinfo: t?.userinfo_token ? decodeJwtExp(t.userinfo_token) : null,
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

  wasmCallCount++
  const info = sanitize(request)
  const env = {
    callNumber: wasmCallCount,
    secSinceInit: Math.round((Date.now() - wasmInitTime) / 1000),
    secSinceLastSuccess: lastSuccessfulCallTime
      ? Math.round((Date.now() - lastSuccessfulCallTime) / 1000)
      : 'first',
    tabVisible: typeof document !== 'undefined' ? !document.hidden : 'unknown',
    visibilityState: typeof document !== 'undefined' ? document.visibilityState : 'unknown',
  }
  console.log('[Cedarling] WASM authorize', JSON.stringify({ ...info, env }))

  try {
    const result: AuthorizeResult = await new Promise<AuthorizeResult>((resolve, reject) => {
      pendingWasmCalls.add(reject)
      const cleanup = () => pendingWasmCalls.delete(reject)
      const run = () => {
        try {
          cedarling!.authorize(request).then(
            (r) => {
              cleanup()
              resolve(r)
            },
            (e) => {
              cleanup()
              reject(e)
            },
          )
        } catch (syncError) {
          cleanup()
          reject(syncError)
        }
      }
      setTimeout(run, 0)
    })
    lastSuccessfulCallTime = Date.now()
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
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    const isWasmBug =
      error instanceof RangeError ||
      (error instanceof Error && error.name === 'RuntimeError') ||
      message.includes('Maximum call stack size exceeded') ||
      message.includes('unreachable')

    console.error(
      '[Cedarling] WASM error',
      JSON.stringify({
        resourceId: info.resourceId,
        action: info.action,
        error: message,
        wasmBug: isWasmBug,
        stack: stack ?? undefined,
      }),
    )

    console.warn(
      '[Cedarling] WASM error – returning deny. Report to cedarling_wasm maintainers if wasmBug.',
    )
    return {
      decision: false,
      diagnostics: { errors: [message] },
    } as AuthorizationResponse
  }
}

export const cedarlingClient: ICedarlingClient = {
  initialize,
  token_authorize,
}
