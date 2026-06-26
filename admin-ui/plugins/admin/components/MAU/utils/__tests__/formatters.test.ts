import { formatMonth, formatNumber, calculatePercentChange } from '../formatters'

describe('MAU formatters', () => {
  describe('formatMonth', () => {
    it('formats a YYYYMM number into "Mon YYYY"', () => {
      expect(formatMonth(202601)).toBe('Jan 2026')
    })

    it('formats December correctly', () => {
      expect(formatMonth(202512)).toBe('Dec 2025')
    })

    it('returns the raw string when the length is not 6', () => {
      expect(formatMonth(20261)).toBe('20261')
    })

    it('returns the raw string when month is below 1', () => {
      expect(formatMonth(202600)).toBe('202600')
    })

    it('returns the raw string when month is above 12', () => {
      expect(formatMonth(202613)).toBe('202613')
    })
  })

  describe('formatNumber', () => {
    it('formats millions with an M suffix', () => {
      expect(formatNumber(2500000)).toBe('2.5M')
    })

    it('formats exactly one million', () => {
      expect(formatNumber(1000000)).toBe('1.0M')
    })

    it('formats thousands with a K suffix', () => {
      expect(formatNumber(1500)).toBe('1.5K')
    })

    it('formats exactly one thousand', () => {
      expect(formatNumber(1000)).toBe('1.0K')
    })

    it('uses locale formatting below one thousand', () => {
      expect(formatNumber(999)).toBe('999')
    })

    it('formats zero', () => {
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('calculatePercentChange', () => {
    it('computes a positive percent change', () => {
      expect(calculatePercentChange(150, 100)).toBe(50)
    })

    it('computes a negative percent change', () => {
      expect(calculatePercentChange(50, 100)).toBe(-50)
    })

    it('returns 100 when previous is zero and current is positive', () => {
      expect(calculatePercentChange(10, 0)).toBe(100)
    })

    it('returns 0 when previous is zero and current is zero', () => {
      expect(calculatePercentChange(0, 0)).toBe(0)
    })

    it('returns 0 when current equals previous', () => {
      expect(calculatePercentChange(100, 100)).toBe(0)
    })
  })
})
