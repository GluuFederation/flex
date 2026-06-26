import type { TFunction } from 'i18next'
import { getAssetValidationSchema } from '../assetValidation'

const t = ((key: string) => key) as TFunction

describe('getAssetValidationSchema', () => {
  it('accepts a valid asset on create (document must be a File)', async () => {
    const schema = getAssetValidationSchema(t)
    const value = {
      fileName: 'logo.png',
      service: ['jans-auth'],
      document: new File(['x'], 'logo.png'),
    }
    await expect(schema.validate(value)).resolves.toBeTruthy()
  })

  it('rejects a missing fileName', async () => {
    const schema = getAssetValidationSchema(t)
    await expect(
      schema.validateAt('fileName', {
        fileName: '',
        service: ['s'],
        document: new File([''], 'f'),
      }),
    ).rejects.toBeTruthy()
  })

  it('rejects a fileName containing spaces', async () => {
    const schema = getAssetValidationSchema(t)
    await expect(schema.validateAt('fileName', { fileName: 'has space' })).rejects.toBeTruthy()
  })

  it('rejects an empty service array', async () => {
    const schema = getAssetValidationSchema(t)
    await expect(schema.validateAt('service', { service: [] })).rejects.toBeTruthy()
  })

  it('rejects a non-File document on create', async () => {
    const schema = getAssetValidationSchema(t)
    await expect(schema.validateAt('document', { document: 'not-a-file' })).rejects.toBeTruthy()
  })

  it('accepts a string document on edit', async () => {
    const schema = getAssetValidationSchema(t, true)
    await expect(schema.validateAt('document', { document: 'existing-file-ref' })).resolves.toBe(
      'existing-file-ref',
    )
  })

  it('rejects a missing document', async () => {
    const schema = getAssetValidationSchema(t)
    await expect(schema.validateAt('document', { document: null })).rejects.toBeTruthy()
  })
})
