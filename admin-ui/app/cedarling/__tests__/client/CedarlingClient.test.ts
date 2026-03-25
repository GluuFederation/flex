import { cedarlingClient } from '@/cedarling/client/CedarlingClient'
import type { TokenAuthorizationRequest } from '@/cedarling'
import initWasm, { init_from_archive_bytes } from '@janssenproject/cedarling_wasm'

// The WASM module is mocked via __mocks__/@janssenproject/cedarling_wasm.ts

const testBytes = new Uint8Array([1, 2, 3])

describe('cedarlingClient', () => {
  it('exports initialize and token_authorize methods', () => {
    expect(typeof cedarlingClient.initialize).toBe('function')
    expect(typeof cedarlingClient.token_authorize).toBe('function')
  })

  describe('initialize', () => {
    it('initializes without error', async () => {
      await expect(cedarlingClient.initialize({}, testBytes)).resolves.toBeUndefined()
    })

    it('does not re-initialize when already initialized', async () => {
      await cedarlingClient.initialize({}, testBytes)
      const initWasmCallCount = (initWasm as jest.Mock).mock.calls.length
      const initCallCount = (init_from_archive_bytes as jest.Mock).mock.calls.length

      await expect(cedarlingClient.initialize({}, testBytes)).resolves.toBeUndefined()

      expect((initWasm as jest.Mock).mock.calls).toHaveLength(initWasmCallCount)
      expect((init_from_archive_bytes as jest.Mock).mock.calls).toHaveLength(initCallCount)
    })
  })

  describe('token_authorize', () => {
    const request: TokenAuthorizationRequest = {
      tokens: [
        { mapping: 'GluuFlexAdminUI::Access_token', payload: 'test-access-token' },
        { mapping: 'GluuFlexAdminUI::id_token', payload: 'test-id-token' },
        { mapping: 'GluuFlexAdminUI::Userinfo_token', payload: 'test-userinfo-token' },
      ],
      action: 'GluuFlexAdminUI::Action::"read"',
      resource: {
        cedar_entity_mapping: {
          entity_type: 'GluuFlexAdminUIResources::Features',
          id: 'Dashboard',
        },
      },
      context: {},
    }

    it('returns authorization response after initialization', async () => {
      await cedarlingClient.initialize({}, testBytes)
      const response = await cedarlingClient.token_authorize(request)
      expect(response).toHaveProperty('decision')
    })
  })
})
