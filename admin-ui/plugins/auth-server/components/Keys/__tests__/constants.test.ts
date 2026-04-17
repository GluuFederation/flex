import { DATE_FORMAT } from '../constants'

describe('Keys constants', () => {
  it('DATE_FORMAT matches expected pattern', () => {
    expect(DATE_FORMAT).toBe('YYYY-MMM-DD')
  })
})
