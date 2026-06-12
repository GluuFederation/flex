import decodeJwt from '../jwtDecode'

const toJwt = (payload: Record<string, string | number | boolean>): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.`
}

describe('decodeJwt', () => {
  it('decodes a standard payload', () => {
    const token = toJwt({ sub: '123', name: 'Jane', admin: true })
    expect(decodeJwt(token)).toEqual({ sub: '123', name: 'Jane', admin: true })
  })

  it('decodes multibyte UTF-8 values', () => {
    const token = toJwt({ name: 'Ünîcödé 名前 😀' })
    expect(decodeJwt<{ name: string }>(token).name).toBe('Ünîcödé 名前 😀')
  })

  it('decodes base64url payloads that need padding', () => {
    const token = toJwt({ a: 1 })
    const body = token.split('.')[1]
    expect(body.length % 4).not.toBe(0)
    expect(decodeJwt(token)).toEqual({ a: 1 })
  })

  it('throws when the value has fewer than two segments', () => {
    expect(() => decodeJwt('not-a-jwt')).toThrow('not a valid JWT')
  })

  it('throws when the payload segment is not valid base64url', () => {
    expect(() => decodeJwt('aaa.@@@@.ccc')).toThrow('not valid base64url')
  })

  it('throws when the payload is not valid JSON', () => {
    const body = Buffer.from('not json').toString('base64url')
    expect(() => decodeJwt(`aaa.${body}.ccc`)).toThrow('not valid JSON')
  })
})
