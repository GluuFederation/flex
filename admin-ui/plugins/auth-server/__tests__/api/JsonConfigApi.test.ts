jest.mock('Utils/ApiUtils', () => ({
  handleResponse: (
    error: Error | null,
    reject: (e: Error) => void,
    resolve: (d: unknown) => void,
    data: unknown,
  ) => {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  },
}))

import JsonConfigApi from 'Plugins/auth-server/redux/api/JsonConfigApi'

describe('JsonConfigApi', () => {
  it('delegates to ConfigurationPropertiesApi-style callbacks', async () => {
    const getProperties = jest.fn((cb: (e: Error | null, d: unknown) => void) =>
      cb(null, { ok: true }),
    )
    const patchProperties = jest.fn((opts: unknown, cb: (e: Error | null, d: unknown) => void) =>
      cb(null, { patched: opts }),
    )
    const client = new JsonConfigApi({ getProperties, patchProperties })

    await expect(client.fetchJsonConfig()).resolves.toEqual({ ok: true })
    expect(getProperties).toHaveBeenCalled()

    await expect(client.patchJsonConfig({ op: 'replace' })).resolves.toEqual({
      patched: { op: 'replace' },
    })
    expect(patchProperties).toHaveBeenCalledWith({ op: 'replace' }, expect.any(Function))
  })
})
