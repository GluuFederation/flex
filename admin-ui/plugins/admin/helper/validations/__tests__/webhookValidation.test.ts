import type { TFunction } from 'i18next'
import { getWebhookValidationSchema } from '../webhookValidation'

const t = ((key: string) => key) as TFunction

describe('getWebhookValidationSchema', () => {
  it('accepts a valid GET webhook', async () => {
    const schema = getWebhookValidationSchema(t)
    const value = {
      httpMethod: 'GET',
      displayName: 'MyHook',
      url: 'https://example.com/webhook',
      httpHeaders: [],
    }
    await expect(schema.validate(value)).resolves.toBeTruthy()
  })

  it('accepts a valid POST webhook with a request body and a header', async () => {
    const schema = getWebhookValidationSchema(t)
    const value = {
      httpMethod: 'POST',
      displayName: 'MyHook',
      url: 'https://example.com/webhook',
      httpRequestBody: '{"a":1}',
      httpHeaders: [{ key: 'Content-Type', value: 'application/json' }],
    }
    await expect(schema.validate(value)).resolves.toBeTruthy()
  })

  it('rejects a missing httpMethod', async () => {
    const schema = getWebhookValidationSchema(t)
    await expect(schema.validateAt('httpMethod', { httpMethod: '' })).rejects.toBeTruthy()
  })

  it('rejects a missing displayName', async () => {
    const schema = getWebhookValidationSchema(t)
    await expect(schema.validateAt('displayName', { displayName: '' })).rejects.toBeTruthy()
  })

  it('rejects a displayName containing spaces', async () => {
    const schema = getWebhookValidationSchema(t)
    await expect(schema.validateAt('displayName', { displayName: 'my hook' })).rejects.toBeTruthy()
  })

  it('rejects a missing url', async () => {
    const schema = getWebhookValidationSchema(t)
    await expect(schema.validateAt('url', { url: '' })).rejects.toBeTruthy()
  })

  it('rejects an invalid url', async () => {
    const schema = getWebhookValidationSchema(t)
    await expect(schema.validateAt('url', { url: 'not a url' })).rejects.toBeTruthy()
  })

  it('requires a request body when the method is POST', async () => {
    const schema = getWebhookValidationSchema(t)
    await expect(
      schema.validateAt('httpRequestBody', { httpMethod: 'POST', httpRequestBody: '' }),
    ).rejects.toBeTruthy()
  })

  it('does not require a request body when the method is GET', async () => {
    const schema = getWebhookValidationSchema(t)
    await expect(
      schema.validateAt('httpRequestBody', { httpMethod: 'GET', httpRequestBody: '' }),
    ).resolves.toBe('')
  })

  it('rejects a header with a key but no value', async () => {
    const schema = getWebhookValidationSchema(t)
    await expect(
      schema.validateAt('httpHeaders', {
        httpMethod: 'GET',
        httpHeaders: [{ key: 'a', value: '' }],
      }),
    ).rejects.toBeTruthy()
  })

  it('accepts a header using source/destination keys', async () => {
    const schema = getWebhookValidationSchema(t)
    await expect(
      schema.validateAt('httpHeaders', {
        httpMethod: 'GET',
        httpHeaders: [{ source: 'a', destination: 'b' }],
      }),
    ).resolves.toBeTruthy()
  })

  it('requires at least one header when the method is POST', async () => {
    const schema = getWebhookValidationSchema(t)
    await expect(
      schema.validateAt('httpHeaders', { httpMethod: 'POST', httpHeaders: [] }),
    ).rejects.toBeTruthy()
  })
})
