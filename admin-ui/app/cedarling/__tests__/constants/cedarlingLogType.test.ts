import { CEDARLING_LOG_TYPE } from '@/cedarling/constants'

describe('CEDARLING_LOG_TYPE', () => {
  it('has OFF value', () => {
    expect(CEDARLING_LOG_TYPE.OFF).toBe('off')
  })

  it('has STD_OUT value', () => {
    expect(CEDARLING_LOG_TYPE.STD_OUT).toBe('std_out')
  })

  it('has exactly 2 values', () => {
    expect(Object.values(CEDARLING_LOG_TYPE)).toHaveLength(2)
  })
})
