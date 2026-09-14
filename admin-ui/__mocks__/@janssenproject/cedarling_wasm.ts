const mockCedarling = {
  authorizeMultiIssuer: jest.fn().mockResolvedValue({ decision: true, free: jest.fn() }),
}

const initFromArchiveBytes = jest.fn().mockResolvedValue(mockCedarling)
const initWasm = jest.fn().mockResolvedValue(undefined)

class Cedarling {}
class MultiIssuerAuthorizeResult {}

export { initFromArchiveBytes, Cedarling, MultiIssuerAuthorizeResult }
export default initWasm
