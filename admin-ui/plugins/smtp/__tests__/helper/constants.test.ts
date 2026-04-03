import { smtpConstants } from 'Plugins/smtp/helper/constants'

describe('smtpConstants', () => {
  it('has the correct DOC_CATEGORY', () => {
    expect(smtpConstants.DOC_CATEGORY).toBe('smtp')
  })

  it('has all CONNECT_PROTECTION values', () => {
    expect(smtpConstants.CONNECT_PROTECTION.NONE).toBe('None')
    expect(smtpConstants.CONNECT_PROTECTION.START_TLS).toBe('StartTls')
    expect(smtpConstants.CONNECT_PROTECTION.SSL_TLS).toBe('SslTls')
  })

  it('has exactly 3 protection options', () => {
    expect(Object.keys(smtpConstants.CONNECT_PROTECTION)).toHaveLength(3)
  })
})
