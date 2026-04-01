const mockCedarling = {
  authorize_multi_issuer: jest.fn().mockResolvedValue({ decision: true }),
}

const init_from_archive_bytes = jest.fn().mockResolvedValue(mockCedarling)
const initWasm = jest.fn().mockResolvedValue(undefined)

class Cedarling {}
class MultiIssuerAuthorizeResult {}

export { init_from_archive_bytes, Cedarling, MultiIssuerAuthorizeResult }
export default initWasm
