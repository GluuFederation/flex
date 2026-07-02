import { formatTooltipValue } from 'Routes/Dashboards/Chart/utils'

describe('formatTooltipValue', () => {
  it('returns an empty string for null', () => {
    expect(formatTooltipValue(null)).toBe('')
  })

  it('returns an empty string for undefined', () => {
    expect(formatTooltipValue(undefined as never)).toBe('')
  })

  it('stringifies a string as-is', () => {
    expect(formatTooltipValue('hello')).toBe('hello')
  })

  it('stringifies a number', () => {
    expect(formatTooltipValue(42)).toBe('42')
  })

  it('stringifies a boolean', () => {
    expect(formatTooltipValue(true)).toBe('true')
  })

  it('JSON-stringifies an array', () => {
    expect(formatTooltipValue([1, 2])).toBe('[1,2]')
  })

  it('JSON-stringifies an object', () => {
    expect(formatTooltipValue({ a: 1 })).toBe('{"a":1}')
  })
})
