jest.mock('Utils/ApiUtils', () => ({
  handleResponse: <T>(
    error: Error | null,
    reject: (e: Error) => void,
    resolve: (d: T) => void,
    data: T,
  ) => {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  },
}))

import JsonConfigApi from 'Plugins/auth-server/redux/api/JsonConfigApi'
import type { JsonPatch } from 'JansConfigApi'
import type { AppConfiguration } from 'Plugins/auth-server/components/AuthServerProperties/types'

describe('JsonConfigApi', () => {
  it('delegates to ConfigurationPropertiesApi-style callbacks', async () => {
    const getProperties = jest.fn((cb: (e: Error | null, d: AppConfiguration) => void) =>
      cb(null, { ok: true } as AppConfiguration),
    )
    const patchProperties = jest.fn(
      (opts: { requestBody: JsonPatch[] }, cb: (e: Error | null, d: AppConfiguration) => void) => {
        const result: AppConfiguration = { patched: JSON.stringify(opts) }
        cb(null, result)
      },
    )
    const client = new JsonConfigApi({ getProperties, patchProperties })

    await expect(client.fetchJsonConfig()).resolves.toEqual({ ok: true })
    expect(getProperties).toHaveBeenCalled()

    const patches: JsonPatch[] = [{ op: 'replace', path: '/test', value: 'x' }]
    await expect(client.patchJsonConfig(patches)).resolves.toEqual({
      patched: JSON.stringify({ requestBody: patches }),
    })
    expect(patchProperties).toHaveBeenCalledWith({ requestBody: patches }, expect.any(Function))
  })
})
