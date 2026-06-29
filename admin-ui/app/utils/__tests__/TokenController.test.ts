import { isFourZeroThreeError, saveIssuer, getIssuer, addAdditionalData } from '../TokenController'
import { STORAGE_KEYS } from '@/constants'
import type { AuditRecord } from 'Redux/types/audit'

describe('TokenController', () => {
  describe('isFourZeroThreeError', () => {
    it('detects an axios-shaped 403 error', () => {
      expect(isFourZeroThreeError({ response: { status: 403 } } as never)).toBe(true)
    })

    it('detects a direct status 403 error', () => {
      expect(isFourZeroThreeError({ status: 403 } as never)).toBe(true)
    })

    it('returns false for other statuses and non-objects', () => {
      expect(isFourZeroThreeError({ response: { status: 500 } } as never)).toBe(false)
      expect(isFourZeroThreeError(undefined)).toBe(false)
      expect(isFourZeroThreeError('boom' as never)).toBe(false)
    })
  })

  describe('issuer storage', () => {
    beforeEach(() => window.localStorage.clear())

    it('round-trips the issuer through storage', () => {
      saveIssuer('https://issuer.example.com')
      expect(getIssuer()).toBe('https://issuer.example.com')
      expect(window.localStorage.getItem(STORAGE_KEYS.ISSUER)).toBe('https://issuer.example.com')
    })

    it('returns null when no issuer is stored', () => {
      expect(getIssuer()).toBeNull()
    })
  })

  describe('addAdditionalData', () => {
    it('sets action, resource and a date', () => {
      const audit = {} as AuditRecord
      addAdditionalData(audit, 'CREATE', '/api/v1/users')
      expect(audit.action).toBe('CREATE')
      expect(audit.resource).toBe('/api/v1/users')
      expect(audit.date).toBeInstanceOf(Date)
    })

    it('resolves the message from nested action_message first', () => {
      const audit = {} as AuditRecord
      addAdditionalData(audit, 'CREATE', '/r', {
        action: { action_message: 'nested' },
        message: 'flat',
      } as never)
      expect(audit.message).toBe('nested')
    })

    it('lifts modifiedFields and performedOn out of action_data', () => {
      const audit = {} as AuditRecord
      addAdditionalData(audit, 'CREATE', '/r', {
        action: { action_data: { modifiedFields: { a: 1 }, performedOn: 'x' } },
      } as never)
      expect(audit.modifiedFields).toEqual({ a: 1 })
      expect(audit.performedOn).toBe('x')
    })

    it('omits the payload when omitPayload is set', () => {
      const audit = {} as AuditRecord
      addAdditionalData(audit, 'CREATE', '/r', { omitPayload: true, foo: 'bar' } as never)
      expect(audit.payload).toBeUndefined()
    })

    it('assigns the sanitized payload when not omitted', () => {
      const audit = {} as AuditRecord
      addAdditionalData(audit, 'CREATE', '/r', { foo: 'bar' } as never)
      expect(audit.payload).toMatchObject({ foo: 'bar' })
    })
  })
})
