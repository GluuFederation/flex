import { getSmtpValidationSchema } from 'Plugins/smtp/helper/validations'
import i18next from 'i18next'

const t = i18next.t.bind(i18next)

describe('getSmtpValidationSchema', () => {
  const schema = getSmtpValidationSchema(t)

  const validData = {
    host: 'smtp.example.com',
    port: 587,
    connect_protection: 'StartTls',
    from_name: 'Admin',
    from_email_address: 'admin@example.com',
    requires_authentication: false,
  }

  it('validates correct data', async () => {
    await expect(schema.validate(validData)).resolves.toBeDefined()
  })

  it('rejects empty host', async () => {
    await expect(schema.validateAt('host', { ...validData, host: '' })).rejects.toThrow()
  })

  it('rejects invalid port', async () => {
    await expect(schema.validateAt('port', { ...validData, port: 0 })).rejects.toThrow()
    await expect(schema.validateAt('port', { ...validData, port: 70000 })).rejects.toThrow()
  })

  it('rejects invalid email', async () => {
    await expect(
      schema.validateAt('from_email_address', { ...validData, from_email_address: 'not-an-email' }),
    ).rejects.toThrow()
  })

  it('rejects empty connect_protection', async () => {
    await expect(
      schema.validateAt('connect_protection', { ...validData, connect_protection: '' }),
    ).rejects.toThrow()
  })

  it('requires username when authentication is enabled', async () => {
    await expect(
      schema.validateAt('smtp_authentication_account_username', {
        ...validData,
        requires_authentication: true,
        smtp_authentication_account_username: '',
      }),
    ).rejects.toThrow()
  })

  it('allows empty username when authentication is disabled', async () => {
    await expect(
      schema.validateAt('smtp_authentication_account_username', {
        ...validData,
        requires_authentication: false,
        smtp_authentication_account_username: '',
      }),
    ).resolves.toBeDefined()
  })

  it('requires password when authentication is enabled', async () => {
    await expect(
      schema.validateAt('smtp_authentication_account_password', {
        ...validData,
        requires_authentication: true,
        smtp_authentication_account_password: '',
      }),
    ).rejects.toThrow()
  })

  it('allows empty password when authentication is disabled', async () => {
    await expect(
      schema.validateAt('smtp_authentication_account_password', {
        ...validData,
        requires_authentication: false,
        smtp_authentication_account_password: '',
      }),
    ).resolves.toBeDefined()
  })

  it('allows null password when authentication is disabled', async () => {
    await expect(
      schema.validateAt('smtp_authentication_account_password', {
        ...validData,
        requires_authentication: false,
        smtp_authentication_account_password: null,
      }),
    ).resolves.toBeDefined()
  })
})
