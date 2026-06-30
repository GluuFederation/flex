import { isValid } from '../WebhookURLChecker'

describe('WebhookURLChecker.isValid', () => {
  it('accepts a normal https URL on a public host', () => {
    expect(isValid('https://example.com/hook')).toBe(true)
    expect(isValid('https://api.service.io:8443/webhook')).toBe(true)
  })

  it('rejects null or undefined input', () => {
    expect(isValid(null)).toBe(false)
    expect(isValid(undefined)).toBe(false)
  })

  it('rejects blocked schemes', () => {
    expect(isValid('http://example.com')).toBe(false)
    expect(isValid('ftp://example.com')).toBe(false)
    expect(isValid('file:///etc/passwd')).toBe(false)
    expect(isValid('ssh://example.com')).toBe(false)
  })

  it('rejects localhost and loopback hosts', () => {
    expect(isValid('https://localhost/hook')).toBe(false)
    expect(isValid('https://127.0.0.1/hook')).toBe(false)
    expect(isValid('https://0.0.0.0/hook')).toBe(false)
  })

  it('rejects private IPv4 ranges', () => {
    expect(isValid('https://10.0.0.5/hook')).toBe(false)
    expect(isValid('https://192.168.1.10/hook')).toBe(false)
    expect(isValid('https://169.254.1.1/hook')).toBe(false)
    expect(isValid('https://172.16.0.1/hook')).toBe(false)
    expect(isValid('https://172.31.255.255/hook')).toBe(false)
  })

  it('accepts public IPv4 addresses outside the private 172.16-31 range', () => {
    expect(isValid('https://172.15.0.1/hook')).toBe(true)
    expect(isValid('https://172.32.0.1/hook')).toBe(true)
  })

  it('rejects CGNAT (100.64.0.0/10) addresses', () => {
    expect(isValid('https://100.64.0.1/hook')).toBe(false)
    expect(isValid('https://100.127.255.255/hook')).toBe(false)
  })

  it('accepts public addresses just outside the CGNAT range', () => {
    expect(isValid('https://100.63.0.1/hook')).toBe(true)
    expect(isValid('https://100.128.0.1/hook')).toBe(true)
  })

  it('rejects the exact IPv6 unspecified/loopback hostnames it recognizes', () => {
    // The checker matches bare IPv6 forms ('::', '::1'); note that URL-bracketed
    // forms (https://[::1]) are not caught because URL.hostname keeps the brackets.
    expect(isValid('https://::1/hook')).toBe(false)
    expect(isValid('https://::/hook')).toBe(false)
  })

  it('rejects a malformed URL', () => {
    expect(isValid('not a url')).toBe(false)
    expect(isValid('https://')).toBe(false)
  })
})
