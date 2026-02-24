const mockCedarling = {
  authorize: jest.fn().mockResolvedValue({ decision: 'Allow' }),
}

const init = jest.fn().mockResolvedValue(mockCedarling)
const initWasm = jest.fn().mockResolvedValue(undefined)

class Cedarling {}
class AuthorizeResult {}

export { init, Cedarling, AuthorizeResult }
export default initWasm
