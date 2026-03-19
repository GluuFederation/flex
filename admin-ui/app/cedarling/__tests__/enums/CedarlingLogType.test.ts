import { CedarlingLogType } from '@/cedarling/enums/CedarlingLogType'

describe('CedarlingLogType', () => {
  it('has OFF value', () => {
    expect(CedarlingLogType.OFF).toBe('off')
  })

  it('has STD_OUT value', () => {
    expect(CedarlingLogType.STD_OUT).toBe('std_out')
  })

  it('has exactly 2 values', () => {
    const values = Object.values(CedarlingLogType)
    expect(values).toHaveLength(2)
  })
})
