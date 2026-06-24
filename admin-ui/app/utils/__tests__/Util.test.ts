import {
  uuidv4,
  getClientScopeByInum,
  getYearMonth,
  formatDate,
  trimObjectStrings,
  filterEmptyObjects,
} from '@/utils/Util'

describe('uuidv4', () => {
  it('returns a v4-shaped uuid string', () => {
    expect(uuidv4()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  })

  it('returns distinct values across calls', () => {
    expect(uuidv4()).not.toBe(uuidv4())
  })
})

describe('getClientScopeByInum', () => {
  it('extracts the value after the first equals in the first comma segment', () => {
    expect(getClientScopeByInum('inum=abc123,ou=scopes,o=jans')).toBe('abc123')
  })

  it('reads only the first comma-delimited segment', () => {
    expect(getClientScopeByInum('id=first,id=second')).toBe('first')
  })
})

describe('getYearMonth', () => {
  it('zero-pads single-digit months', () => {
    expect(getYearMonth(new Date('2026-01-15T00:00:00'))).toBe('202601')
  })

  it('does not pad double-digit months', () => {
    expect(getYearMonth(new Date('2026-12-15T00:00:00'))).toBe('202612')
  })
})

describe('formatDate', () => {
  it('returns a dash when no date is supplied', () => {
    expect(formatDate()).toBe('-')
    expect(formatDate('')).toBe('-')
  })

  it('truncates a long datetime string to the first ten characters', () => {
    expect(formatDate('2026-01-15T10:30:00Z')).toBe('2026-01-15')
  })

  it('returns a ten-character date unchanged', () => {
    expect(formatDate('2026-01-15')).toBe('2026-01-15')
  })

  it('returns a dash for a string shorter than ten characters', () => {
    expect(formatDate('2026-01')).toBe('-')
  })
})

describe('trimObjectStrings', () => {
  it('trims top-level string values', () => {
    expect(trimObjectStrings({ name: '  Alice  ', age: 30 })).toEqual({ name: 'Alice', age: 30 })
  })

  it('recurses into nested plain objects', () => {
    expect(trimObjectStrings({ user: { name: '  Bob  ' } })).toEqual({ user: { name: 'Bob' } })
  })

  it('leaves arrays and non-string primitives untouched', () => {
    const input = { tags: ['  a  '], active: true, count: 5 }
    expect(trimObjectStrings(input)).toEqual({ tags: ['  a  '], active: true, count: 5 })
  })

  it('preserves null values', () => {
    expect(trimObjectStrings({ value: null })).toEqual({ value: null })
  })
})

describe('filterEmptyObjects', () => {
  it('returns an empty array when given no items', () => {
    expect(filterEmptyObjects()).toEqual([])
  })

  it('removes empty objects', () => {
    expect(filterEmptyObjects([{ a: 1 }, {}, { b: 2 }])).toEqual([{ a: 1 }, { b: 2 }])
  })

  it('keeps all non-empty objects', () => {
    const items = [{ a: 1 }, { b: 2 }]
    expect(filterEmptyObjects(items)).toHaveLength(2)
  })
})
