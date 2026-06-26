import {
  DATE_FORMATS,
  isSameOrBeforeDate,
  isAfterDate,
  isBeforeDate,
  isSameDate,
  isValidDate,
  createDate,
  parseDateStrict,
  formatDate,
  addDate,
  subtractDate,
  toApiDatetime,
} from '@/utils/dayjsUtils'

const A = '2026-01-10 08:30:00'
const B = '2026-01-15 12:00:00'

describe('DATE_FORMATS', () => {
  it('exposes the API datetime format without a Z suffix', () => {
    expect(DATE_FORMATS.API_DATETIME).toBe('YYYY-MM-DDTHH:mm:ss')
  })

  it('exposes the date-only format', () => {
    expect(DATE_FORMATS.DATE_ONLY).toBe('YYYY-MM-DD')
  })
})

describe('comparison helpers', () => {
  it('isSameOrBeforeDate is true for equal dates', () => {
    expect(isSameOrBeforeDate(A, A)).toBe(true)
  })

  it('isSameOrBeforeDate is true when first is earlier', () => {
    expect(isSameOrBeforeDate(A, B)).toBe(true)
  })

  it('isSameOrBeforeDate is false when first is later', () => {
    expect(isSameOrBeforeDate(B, A)).toBe(false)
  })

  it('isAfterDate compares correctly', () => {
    expect(isAfterDate(B, A)).toBe(true)
    expect(isAfterDate(A, B)).toBe(false)
  })

  it('isBeforeDate compares correctly', () => {
    expect(isBeforeDate(A, B)).toBe(true)
    expect(isBeforeDate(B, A)).toBe(false)
  })

  it('isSameDate respects a coarse unit', () => {
    expect(isSameDate(A, B, 'month')).toBe(true)
    expect(isSameDate(A, B, 'day')).toBe(false)
  })
})

describe('isValidDate', () => {
  it('returns false for null and undefined', () => {
    expect(isValidDate(null)).toBe(false)
    expect(isValidDate(undefined)).toBe(false)
  })

  it('returns false for an unparseable string', () => {
    expect(isValidDate('not-a-date')).toBe(false)
  })

  it('returns true for a valid date string', () => {
    expect(isValidDate(A)).toBe(true)
  })
})

describe('createDate', () => {
  it('returns a valid dayjs for the current time when no argument is given', () => {
    expect(createDate().isValid()).toBe(true)
  })

  it('parses a string against the supplied format', () => {
    const d = createDate('15-01-2026', DATE_FORMATS.DATE_PICKER_DISPLAY)
    expect(d.format(DATE_FORMATS.DATE_ONLY)).toBe('2026-01-15')
  })

  it('parses a plain date string without a format', () => {
    expect(createDate('2026-01-15').format(DATE_FORMATS.DATE_ONLY)).toBe('2026-01-15')
  })
})

describe('parseDateStrict', () => {
  it('returns a dayjs when the string matches the format exactly', () => {
    const parsed = parseDateStrict('2026-01-15', DATE_FORMATS.DATE_ONLY)
    expect(parsed).not.toBeNull()
    expect(parsed?.format(DATE_FORMATS.DATE_ONLY)).toBe('2026-01-15')
  })

  it('returns null when the string does not match the format', () => {
    expect(parseDateStrict('15/01/2026', DATE_FORMATS.DATE_ONLY)).toBeNull()
  })
})

describe('formatDate', () => {
  it('returns an empty string for null or undefined', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
  })

  it('returns an empty string for an invalid date', () => {
    expect(formatDate('garbage')).toBe('')
  })

  it('formats using the default date-only format', () => {
    expect(formatDate('2026-01-15 09:00:00')).toBe('2026-01-15')
  })

  it('formats using a supplied format', () => {
    expect(formatDate('2026-01-15', DATE_FORMATS.DATE_PICKER_DISPLAY)).toBe('15-01-2026')
  })
})

describe('addDate / subtractDate', () => {
  it('adds a duration', () => {
    expect(addDate('2026-01-15', 5, 'day').format(DATE_FORMATS.DATE_ONLY)).toBe('2026-01-20')
  })

  it('subtracts a duration', () => {
    expect(subtractDate('2026-01-15', 5, 'day').format(DATE_FORMATS.DATE_ONLY)).toBe('2026-01-10')
  })
})

describe('toApiDatetime', () => {
  it('truncates to the start of the minute and formats without a Z suffix', () => {
    expect(toApiDatetime(createDate('2026-01-15 09:30:45'))).toBe('2026-01-15T09:30:00')
  })
})
