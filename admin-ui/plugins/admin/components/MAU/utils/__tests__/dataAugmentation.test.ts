import dayjs from 'dayjs'
import { formatDateForApi, transformRawStatEntry, augmentMauData } from '../dataAugmentation'
import type { MauStatEntry, RawStatEntry } from '../../types'

describe('MAU dataAugmentation', () => {
  describe('formatDateForApi', () => {
    it('formats a Dayjs date into YYYYMM', () => {
      expect(formatDateForApi(dayjs('2026-01-15'))).toBe('202601')
    })

    it('zero-pads single-digit months', () => {
      expect(formatDateForApi(dayjs('2025-09-01'))).toBe('202509')
    })
  })

  describe('transformRawStatEntry', () => {
    it('maps a fully-populated raw entry', () => {
      const raw: RawStatEntry = {
        month: 202601,
        monthly_active_users: 42,
        token_count_per_granttype: {
          client_credentials: { access_token: 7 },
          authorization_code: { access_token: 3, id_token: 5 },
        },
      }
      expect(transformRawStatEntry(raw)).toEqual({
        month: 202601,
        mau: 42,
        client_credentials_access_token_count: 7,
        authz_code_access_token_count: 3,
        authz_code_idtoken_count: 5,
      })
    })

    it('parses a string month into a number', () => {
      const raw: RawStatEntry = { month: '202512' }
      expect(transformRawStatEntry(raw).month).toBe(202512)
    })

    it('defaults missing values to 0', () => {
      expect(transformRawStatEntry({})).toEqual({
        month: 0,
        mau: 0,
        client_credentials_access_token_count: 0,
        authz_code_access_token_count: 0,
        authz_code_idtoken_count: 0,
      })
    })

    it('defaults nested token counts to 0 when grant types are partial', () => {
      const raw: RawStatEntry = {
        month: 202603,
        token_count_per_granttype: { authorization_code: { access_token: 9 } },
      }
      const result = transformRawStatEntry(raw)
      expect(result.client_credentials_access_token_count).toBe(0)
      expect(result.authz_code_access_token_count).toBe(9)
      expect(result.authz_code_idtoken_count).toBe(0)
    })
  })

  describe('augmentMauData', () => {
    const start = dayjs('2026-01-01')
    const end = dayjs('2026-03-31')

    const makeEntry = (month: number, mau: number): MauStatEntry => ({
      month,
      mau,
      client_credentials_access_token_count: 0,
      authz_code_access_token_count: 0,
      authz_code_idtoken_count: 0,
    })

    it('returns empty entries for every month in range when data is empty', () => {
      const result = augmentMauData([], start, end)
      expect(result).toHaveLength(3)
      expect(result.map((e) => e.month)).toEqual([202601, 202602, 202603])
      expect(result.every((e) => e.mau === 0)).toBe(true)
    })

    it('fills missing months with empty entries and keeps existing ones', () => {
      const result = augmentMauData([makeEntry(202602, 25)], start, end)
      expect(result.map((e) => e.month)).toEqual([202601, 202602, 202603])
      const feb = result.find((e) => e.month === 202602)
      expect(feb?.mau).toBe(25)
    })

    it('sorts the result ascending by month', () => {
      const result = augmentMauData([makeEntry(202603, 3), makeEntry(202601, 1)], start, end)
      expect(result.map((e) => e.month)).toEqual([202601, 202602, 202603])
    })

    it('drops entries that fall outside the requested range', () => {
      const result = augmentMauData([makeEntry(202512, 99), makeEntry(202601, 1)], start, end)
      expect(result.map((e) => e.month)).toEqual([202601, 202602, 202603])
      expect(result.find((e) => e.month === 202512)).toBeUndefined()
    })

    it('handles a single-month range', () => {
      const result = augmentMauData([], start, start)
      expect(result).toHaveLength(1)
      expect(result[0].month).toBe(202601)
    })
  })
})
