import {
  transformToFormValues,
  toSmtpConfiguration,
  buildSmtpChangedFieldOperations,
} from 'Plugins/smtp/helper/utils'
import type { SmtpFormValues } from 'Plugins/smtp/types'
import type { SmtpConfiguration } from 'JansConfigApi'
import i18next from 'i18next'

const t = i18next.t.bind(i18next)

const defaultFormValues: SmtpFormValues = {
  host: '',
  port: '',
  connect_protection: 'None',
  from_name: '',
  from_email_address: '',
  requires_authentication: false,
  smtp_authentication_account_username: '',
  smtp_authentication_account_password: '',
  trust_host: false,
  key_store: '',
  key_store_password: '',
  key_store_alias: '',
  signing_algorithm: '',
}

describe('transformToFormValues', () => {
  it('returns defaults for undefined config', () => {
    expect(transformToFormValues(undefined)).toEqual(defaultFormValues)
  })

  it('maps config values to form values', () => {
    const config: SmtpConfiguration = {
      host: 'smtp.example.com',
      port: 587,
      connect_protection: 'StartTls',
      from_name: 'Admin',
      from_email_address: 'admin@example.com',
      requires_authentication: true,
      smtp_authentication_account_username: 'user',
      smtp_authentication_account_password: 'pass',
      trust_host: true,
      key_store: '/path/to/keystore',
      key_store_password: 'ks-pass',
      key_store_alias: 'alias',
      signing_algorithm: 'SHA256',
    }
    const result = transformToFormValues(config)
    expect(result.host).toBe('smtp.example.com')
    expect(result.port).toBe(587)
    expect(result.connect_protection).toBe('StartTls')
    expect(result.requires_authentication).toBe(true)
    expect(result.trust_host).toBe(true)
  })
})

describe('toSmtpConfiguration', () => {
  it('converts form values to smtp configuration', () => {
    const values: SmtpFormValues = {
      ...defaultFormValues,
      host: 'smtp.test.com',
      port: 465,
      connect_protection: 'SslTls',
      from_name: 'Test',
      from_email_address: 'test@test.com',
    }
    const result = toSmtpConfiguration(values)
    expect(result.host).toBe('smtp.test.com')
    expect(result.port).toBe(465)
    expect(result.connect_protection).toBe('SslTls')
  })

  it('parses string port to number', () => {
    const values: SmtpFormValues = {
      ...defaultFormValues,
      host: 'smtp.test.com',
      port: '587',
    }
    const result = toSmtpConfiguration(values)
    expect(result.port).toBe(587)
  })

  it('converts empty optional fields to undefined', () => {
    const result = toSmtpConfiguration(defaultFormValues)
    expect(result.key_store).toBeUndefined()
    expect(result.key_store_password).toBeUndefined()
    expect(result.key_store_alias).toBeUndefined()
    expect(result.signing_algorithm).toBeUndefined()
  })
})

describe('buildSmtpChangedFieldOperations', () => {
  it('returns empty array when no changes', () => {
    const ops = buildSmtpChangedFieldOperations(defaultFormValues, defaultFormValues, t)
    expect(ops).toHaveLength(0)
  })

  it('detects changed fields', () => {
    const updated: SmtpFormValues = { ...defaultFormValues, host: 'new-host.com' }
    const ops = buildSmtpChangedFieldOperations(defaultFormValues, updated, t)
    expect(ops).toHaveLength(1)
    expect(ops[0].value).toBe('new-host.com')
  })

  it('skips password fields', () => {
    const updated: SmtpFormValues = {
      ...defaultFormValues,
      smtp_authentication_account_password: 'new-pass',
      key_store_password: 'new-ks-pass',
    }
    const ops = buildSmtpChangedFieldOperations(defaultFormValues, updated, t)
    expect(ops).toHaveLength(0)
  })

  it('detects multiple changes', () => {
    const updated: SmtpFormValues = {
      ...defaultFormValues,
      host: 'new-host.com',
      from_name: 'New Name',
      trust_host: true,
    }
    const ops = buildSmtpChangedFieldOperations(defaultFormValues, updated, t)
    expect(ops).toHaveLength(3)
  })
})
