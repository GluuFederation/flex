import dayjs from 'dayjs'
import {
  formatExpirationDate,
  toEpochSecondsFromDayjs,
} from 'Plugins/auth-server/components/Ssa/utils/dateFormatters'

describe('formatExpirationDate', () => {
  it('formats an epoch-seconds timestamp using the provided locale', () => {
    // 2021-01-15T00:00:00Z => 1610668800 seconds
    const result = formatExpirationDate(1610668800, 'en-US')
    expect(result).toMatch(/2021/)
    expect(result).toMatch(/01/)
  })

  it('uses the en-GB locale ordering when requested', () => {
    const result = formatExpirationDate(1610668800, 'en-GB')
    expect(result).toMatch(/2021/)
  })

  it('formats the unix epoch (0) rather than treating it as nullish', () => {
    const result = formatExpirationDate(0, 'en-US')
    expect(result).toMatch(/1970/)
  })
})

describe('toEpochSecondsFromDayjs', () => {
  it('converts a valid dayjs value to epoch seconds', () => {
    const d = dayjs('2021-01-15T00:00:00.000Z')
    expect(toEpochSecondsFromDayjs(d)).toBe(1610668800)
  })

  it('returns null for a null input', () => {
    expect(toEpochSecondsFromDayjs(null)).toBeNull()
  })

  it('returns null for an invalid dayjs value', () => {
    const invalid = dayjs('not-a-date')
    expect(toEpochSecondsFromDayjs(invalid)).toBeNull()
  })
})
