import { buildSafeLogoutUrl, buildSafeNavigationUrl } from '../urlSecurity'

describe('urlSecurity', () => {
  it('allows same-origin relative navigation urls', () => {
    expect(buildSafeNavigationUrl('/admin/logout')).toMatch(/\/admin\/logout$/)
  })

  it('rejects dangerous navigation protocols', () => {
    expect(buildSafeNavigationUrl('javascript:alert(1)')).toBeNull()
    expect(buildSafeNavigationUrl('data:text/html,<script>alert(1)</script>')).toBeNull()
  })

  it('rejects relative navigation urls when the provided base url is unsafe', () => {
    expect(buildSafeNavigationUrl('/admin', { baseUrl: 'javascript:alert(1)' })).toBeNull()
  })

  it('builds a logout url with safe endpoints only', () => {
    const logoutUrl = buildSafeLogoutUrl(
      'https://auth.example.com/logout',
      'https://admin.example.com/post-logout',
      'state-123',
    )

    expect(logoutUrl).toBe(
      'https://auth.example.com/logout?state=state-123&post_logout_redirect_uri=https%3A%2F%2Fadmin.example.com%2Fpost-logout',
    )
  })

  it('omits unsafe post logout redirect urls', () => {
    const logoutUrl = buildSafeLogoutUrl(
      'https://auth.example.com/logout',
      'javascript:alert(1)',
      'state-123',
    )

    expect(logoutUrl).toBe('https://auth.example.com/logout?state=state-123')
  })

  it('rejects unsafe end session endpoints', () => {
    expect(
      buildSafeLogoutUrl(
        'javascript:alert(1)',
        'https://admin.example.com/post-logout',
        'state-123',
      ),
    ).toBeNull()
  })
})
