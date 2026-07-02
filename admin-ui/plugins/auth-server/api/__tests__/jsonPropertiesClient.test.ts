import type { JsonPatch } from 'JansConfigApi'

// The generated JansConfigApi client has its own coverage; stub the two calls
// this thin client delegates to and assert it forwards args and returns results.
const mockGetProperties = jest.fn()
const mockPatchProperties = jest.fn()
jest.mock('JansConfigApi', () => ({
  getProperties: () => mockGetProperties(),
  patchProperties: (patches: JsonPatch[]) => mockPatchProperties(patches),
}))

import { callFetchJsonProperties, callPatchJsonProperties } from '../jsonPropertiesClient'

beforeEach(() => {
  mockGetProperties.mockReset()
  mockPatchProperties.mockReset()
})

describe('callFetchJsonProperties', () => {
  it('returns the fetched properties from getProperties', async () => {
    mockGetProperties.mockResolvedValue({ issuer: 'https://issuer' })
    await expect(callFetchJsonProperties()).resolves.toEqual({ issuer: 'https://issuer' })
    expect(mockGetProperties).toHaveBeenCalledTimes(1)
  })

  it('propagates a fetch error', async () => {
    mockGetProperties.mockRejectedValue(new Error('fetch failed'))
    await expect(callFetchJsonProperties()).rejects.toThrow('fetch failed')
  })
})

describe('callPatchJsonProperties', () => {
  it('forwards the patch payload to patchProperties and returns the result', async () => {
    const patches: JsonPatch[] = [{ op: 'replace', path: '/issuer', value: 'x' }]
    mockPatchProperties.mockResolvedValue({ issuer: 'x' })
    await expect(callPatchJsonProperties(patches)).resolves.toEqual({ issuer: 'x' })
    expect(mockPatchProperties).toHaveBeenCalledWith(patches)
  })

  it('propagates a patch error', async () => {
    mockPatchProperties.mockRejectedValue(new Error('patch failed'))
    await expect(callPatchJsonProperties([])).rejects.toThrow('patch failed')
  })
})
