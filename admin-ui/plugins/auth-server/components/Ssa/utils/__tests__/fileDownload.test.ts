import { downloadJwtFile } from 'Plugins/auth-server/components/Ssa/utils/fileDownload'

describe('downloadJwtFile', () => {
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL

  let createObjectURL: jest.Mock
  let revokeObjectURL: jest.Mock
  let clickSpy: jest.SpyInstance

  beforeEach(() => {
    createObjectURL = jest.fn(() => 'blob:mock-url')
    revokeObjectURL = jest.fn()
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = revokeObjectURL
    clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
  })

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
    clickSpy.mockRestore()
    jest.restoreAllMocks()
  })

  it('creates a blob URL, triggers a click, and revokes the URL', () => {
    downloadJwtFile('my.jwt.token', 'software-1')

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    const blobArg = createObjectURL.mock.calls[0][0] as Blob
    expect(blobArg).toBeInstanceOf(Blob)
    expect(blobArg.type).toBe('text/plain')

    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })

  it('builds a filename with the software id and a sanitized timestamp', () => {
    const appendSpy = jest.spyOn(document.body, 'appendChild')
    downloadJwtFile('token', 'sw-42')

    const appended = appendSpy.mock.calls[0][0] as HTMLAnchorElement
    expect(appended.download).toMatch(/^ssa-sw-42-.*\.jwt$/)
    // Separators (/ : ,) replaced by '-' and whitespace by '_'
    expect(appended.download).not.toMatch(/[/:,\s]/)
    expect(appended.href).toContain('blob:mock-url')
  })

  it('removes the anchor element from the body after clicking', () => {
    const removeSpy = jest.spyOn(document.body, 'removeChild')
    downloadJwtFile('token', 'sw-1')
    expect(removeSpy).toHaveBeenCalledTimes(1)
  })
})
