import initWasm, { init } from '@janssenproject/cedarling_wasm'

let cedarling = null
let initialized = false
let wasmModule = null

const initialize = async (policyStoreConfig) => {
  if (!initialized) {
    wasmModule = await initWasm()
    console.log('WASM initialized', wasmModule)
    cedarling = await init(policyStoreConfig)
    initialized = true
  }
}

const authorize = async (request) => {
  if (!initialized || !cedarling) {
    throw new Error('Cedarling not initialized')
  }

  try {
    return await cedarling.authorize(request)
  } catch (error) {
    console.error('Error during authorization:', error)
    throw error
  }
}

export const cedarlingClient = {
  initialize,
  authorize,
}
