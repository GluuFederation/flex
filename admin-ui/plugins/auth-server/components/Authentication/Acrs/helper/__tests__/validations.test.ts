import { getAuthNValidationSchema } from 'Plugins/auth-server/components/Authentication/Acrs/helper/validations'
import { AUTH_METHOD_NAMES } from 'Plugins/auth-server/components/Authentication/constants'
import type { AuthNItem } from 'Plugins/auth-server/components/Authentication/types'

const baseValid = {
  acr: 'my-acr',
  level: 1,
  defaultAuthNMethod: false,
}

import type { TFunction } from 'i18next'

const t = ((key: string) => key) as TFunction

describe('getAuthNValidationSchema', () => {
  describe('base schema (no item)', () => {
    const schema = getAuthNValidationSchema(null, t)

    it('accepts a valid acr/level/defaultAuthNMethod set', async () => {
      await expect(schema.isValid(baseValid)).resolves.toBe(true)
    })

    it('requires the acr name', async () => {
      await expect(schema.validate({ ...baseValid, acr: undefined })).rejects.toThrow(
        'validation_messages.field_required',
      )
    })

    it('rejects a non-numeric level', async () => {
      await expect(schema.validate({ ...baseValid, level: 'abc' })).rejects.toThrow(
        'validation_messages.field_must_be_number',
      )
    })

    it('rejects a non-integer level', async () => {
      await expect(schema.validate({ ...baseValid, level: 1.5 })).rejects.toThrow(
        'validation_messages.field_must_be_integer',
      )
    })

    it('allows -1 as the minimum level for the base schema', async () => {
      await expect(schema.isValid({ ...baseValid, level: -1 })).resolves.toBe(true)
    })

    it('rejects a level below -1', async () => {
      await expect(schema.validate({ ...baseValid, level: -2 })).rejects.toThrow(
        'validation_messages.field_min_value',
      )
    })

    it('requires the default AuthN method', async () => {
      await expect(schema.validate({ acr: 'x', level: 1 })).rejects.toThrow(
        'validation_messages.field_required',
      )
    })
  })

  describe('script schema', () => {
    const item = { isCustomScript: true } as AuthNItem
    const schema = getAuthNValidationSchema(item, t)

    it('raises the minimum level to 0', async () => {
      await expect(schema.validate({ ...baseValid, level: -1 })).rejects.toThrow(
        'validation_messages.field_min_value',
      )
      await expect(schema.isValid({ ...baseValid, level: 0 })).resolves.toBe(true)
    })

    it('permits optional nullable samlACR and description', async () => {
      await expect(
        schema.isValid({ ...baseValid, samlACR: null, description: null }),
      ).resolves.toBe(true)
    })
  })

  describe('ldap schema', () => {
    const item = { name: AUTH_METHOD_NAMES.DEFAULT_LDAP } as AuthNItem
    const schema = getAuthNValidationSchema(item, t)

    const ldapValid = {
      ...baseValid,
      bindDN: 'cn=admin',
      maxConnections: 2,
      servers: ['ldap://host'],
      baseDNs: ['o=jans'],
    }

    it('accepts a valid ldap config', async () => {
      await expect(schema.isValid(ldapValid)).resolves.toBe(true)
    })

    it('requires bindDN', async () => {
      await expect(schema.validate({ ...ldapValid, bindDN: undefined })).rejects.toThrow(
        'validation_messages.field_required',
      )
    })

    it('requires at least one server', async () => {
      await expect(schema.validate({ ...ldapValid, servers: [] })).rejects.toThrow(
        'validation_messages.field_min_items',
      )
    })

    it('requires at least one base DN', async () => {
      await expect(schema.validate({ ...ldapValid, baseDNs: [] })).rejects.toThrow(
        'validation_messages.field_min_items',
      )
    })

    it('requires maxConnections to be at least 1', async () => {
      await expect(schema.validate({ ...ldapValid, maxConnections: 0 })).rejects.toThrow(
        'validation_messages.field_min_value',
      )
    })
  })

  describe('built-in schema', () => {
    const item = { name: AUTH_METHOD_NAMES.SIMPLE_PASSWORD } as AuthNItem
    const schema = getAuthNValidationSchema(item, t)

    it('permits optional nullable built-in fields', async () => {
      await expect(
        schema.isValid({
          ...baseValid,
          samlACR: null,
          description: null,
          primaryKey: null,
          passwordAttribute: null,
          hashAlgorithm: null,
        }),
      ).resolves.toBe(true)
    })
  })
})
