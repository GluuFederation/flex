import { cedarlingClient } from '@/cedarling/client/CedarlingClient'
import type { TokenAuthorizationRequest } from '@/cedarling'
import initWasm, { init } from '@janssenproject/cedarling_wasm'

// The WASM module is mocked via __mocks__/@janssenproject/cedarling_wasm.ts

describe('cedarlingClient', () => {
  it('exports initialize and token_authorize methods', () => {
    expect(typeof cedarlingClient.initialize).toBe('function')
    expect(typeof cedarlingClient.token_authorize).toBe('function')
  })

  describe('initialize', () => {
    it('initializes without error', async () => {
      await expect(cedarlingClient.initialize({})).resolves.toBeUndefined()
    })

    it('does not re-initialize when already initialized', async () => {
      await cedarlingClient.initialize({})
      const initWasmCallCount = (initWasm as jest.Mock).mock.calls.length
      const initCallCount = (init as jest.Mock).mock.calls.length

      await expect(cedarlingClient.initialize({})).resolves.toBeUndefined()

      expect((initWasm as jest.Mock).mock.calls).toHaveLength(initWasmCallCount)
      expect((init as jest.Mock).mock.calls).toHaveLength(initCallCount)
    })
  })

  describe('token_authorize', () => {
    const request: TokenAuthorizationRequest = {
      tokens: {
        access_token: 'test-access-token',
        id_token: 'test-id-token',
        userinfo_token: 'test-userinfo-token',
      },
      action: 'Gluu::Flex::AdminUI::Action::"read"',
      resource: {
        cedar_entity_mapping: {
          entity_type: 'Gluu::Flex::AdminUI::Resources::Features',
          id: 'Dashboard',
        },
      },
      context: {},
    }

    it('returns authorization response after initialization', async () => {
      await cedarlingClient.initialize({})
      const response = await cedarlingClient.token_authorize(request)
      expect(response).toHaveProperty('decision')
    })
  })
})
