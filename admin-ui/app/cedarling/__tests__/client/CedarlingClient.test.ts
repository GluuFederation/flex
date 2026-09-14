import type { TokenAuthorizationRequest } from '@/cedarling'

const testBytes = new Uint8Array([1, 2, 3])

describe('cedarlingClient', () => {
  let cedarlingClient: Awaited<
    typeof import('@/cedarling/client/CedarlingClient')
  >['cedarlingClient']
  let initWasm: jest.Mock
  let initFromArchiveBytes: jest.Mock

  beforeEach(async () => {
    jest.resetModules()
    const wasmMock = await import('@janssenproject/cedarling_wasm')
    initWasm = wasmMock.default as jest.Mock
    initFromArchiveBytes = wasmMock.initFromArchiveBytes as jest.Mock
    initWasm.mockClear()
    initFromArchiveBytes.mockClear()

    const mod = await import('@/cedarling/client/CedarlingClient')
    cedarlingClient = mod.cedarlingClient
  })

  it('exports initialize and token_authorize methods', () => {
    expect(typeof cedarlingClient.initialize).toBe('function')
    expect(typeof cedarlingClient.token_authorize).toBe('function')
  })

  describe('initialize', () => {
    it('initializes without error and forwards bytes correctly', async () => {
      const testConfig = {}
      await expect(cedarlingClient.initialize(testConfig, testBytes)).resolves.toBeUndefined()
      expect(initWasm).toHaveBeenCalledTimes(1)
      expect(initFromArchiveBytes).toHaveBeenCalledTimes(1)
      expect(initFromArchiveBytes).toHaveBeenCalledWith(testConfig, testBytes)
    })

    it('does not re-initialize when already initialized', async () => {
      await cedarlingClient.initialize({}, testBytes)

      expect(initWasm).toHaveBeenCalledTimes(1)
      expect(initFromArchiveBytes).toHaveBeenCalledTimes(1)

      await expect(cedarlingClient.initialize({}, testBytes)).resolves.toBeUndefined()

      expect(initWasm).toHaveBeenCalledTimes(1)
      expect(initFromArchiveBytes).toHaveBeenCalledTimes(1)
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
      expect(response.decision).toBe(true)
      expect(response.request_id).toBe('test-request-id')
    })

    it('forwards request to authorizeMultiIssuer', async () => {
      await cedarlingClient.initialize({}, testBytes)

      const mockCedarling = await initFromArchiveBytes.mock.results[0].value
      await cedarlingClient.token_authorize(request)

      expect(mockCedarling.authorizeMultiIssuer).toHaveBeenCalledTimes(1)
      expect(mockCedarling.authorizeMultiIssuer).toHaveBeenCalledWith(JSON.stringify(request))
    })

    it('releases the wasm-owned result after reading it', async () => {
      await cedarlingClient.initialize({}, testBytes)

      const mockCedarling = await initFromArchiveBytes.mock.results[0].value
      await cedarlingClient.token_authorize(request)

      const result = await mockCedarling.authorizeMultiIssuer.mock.results[0].value
      expect(result.free).toHaveBeenCalledTimes(1)
    })

    it('throws when not initialized', async () => {
      await expect(cedarlingClient.token_authorize(request)).rejects.toThrow(
        'Cedarling not initialized',
      )
    })
  })
})
