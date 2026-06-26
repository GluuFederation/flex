import type { TFunction } from 'i18next'
import { getSettingsValidationSchema } from '../settingsValidation'

const t = ((key: string) => key) as TFunction

describe('getSettingsValidationSchema', () => {
  it('accepts a valid settings object', async () => {
    const schema = getSettingsValidationSchema(t)
    const value = {
      sessionTimeoutInMins: 30,
      additionalParameters: [{ key: 'a', value: '1' }],
    }
    await expect(schema.validate(value)).resolves.toBeTruthy()
  })

  it('accepts when additionalParameters is empty', async () => {
    const schema = getSettingsValidationSchema(t)
    await expect(
      schema.validate({ sessionTimeoutInMins: 5, additionalParameters: [] }),
    ).resolves.toBeTruthy()
  })

  it('rejects when sessionTimeoutInMins is empty', async () => {
    const schema = getSettingsValidationSchema(t)
    await expect(
      schema.validateAt('sessionTimeoutInMins', { sessionTimeoutInMins: '' }),
    ).rejects.toBeTruthy()
  })

  it('rejects when sessionTimeoutInMins is below 1', async () => {
    const schema = getSettingsValidationSchema(t)
    await expect(
      schema.validateAt('sessionTimeoutInMins', { sessionTimeoutInMins: 0 }),
    ).rejects.toBeTruthy()
  })

  it('rejects an additional parameter with a key but no value', async () => {
    const schema = getSettingsValidationSchema(t)
    await expect(
      schema.validateAt('additionalParameters', {
        additionalParameters: [{ key: 'a', value: '' }],
      }),
    ).rejects.toBeTruthy()
  })

  it('rejects an additional parameter with a value but no key', async () => {
    const schema = getSettingsValidationSchema(t)
    await expect(
      schema.validateAt('additionalParameters', {
        additionalParameters: [{ key: '   ', value: '1' }],
      }),
    ).rejects.toBeTruthy()
  })

  it('accepts an additional parameter with both key and value', async () => {
    const schema = getSettingsValidationSchema(t)
    await expect(
      schema.validateAt('additionalParameters', {
        additionalParameters: [{ key: 'a', value: '1' }],
      }),
    ).resolves.toBeTruthy()
  })
})
