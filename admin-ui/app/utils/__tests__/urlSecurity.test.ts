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

  describe('buildSafeNavigationUrl — null/invalid inputs', () => {
    it('returns null for null', () => {
      expect(buildSafeNavigationUrl(null)).toBeNull()
    })

    it('returns null for undefined', () => {
      expect(buildSafeNavigationUrl(undefined)).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(buildSafeNavigationUrl('')).toBeNull()
    })

    it('returns null for whitespace-only string', () => {
      expect(buildSafeNavigationUrl('   ')).toBeNull()
    })

    it('returns null for malformed absolute url', () => {
      expect(buildSafeNavigationUrl('http://%zz')).toBeNull()
    })
  })

  describe('buildSafeLogoutUrl — null/invalid inputs', () => {
    it('returns null when end_session_endpoint is null', () => {
      expect(
        buildSafeLogoutUrl(null, 'https://admin.example.com/post-logout', 'state-123'),
      ).toBeNull()
    })

    it('returns null when end_session_endpoint is undefined', () => {
      expect(
        buildSafeLogoutUrl(undefined, 'https://admin.example.com/post-logout', 'state-123'),
      ).toBeNull()
    })

    it('returns null when end_session_endpoint is empty string', () => {
      expect(
        buildSafeLogoutUrl('', 'https://admin.example.com/post-logout', 'state-123'),
      ).toBeNull()
    })

    it('returns null when end_session_endpoint is whitespace', () => {
      expect(
        buildSafeLogoutUrl('   ', 'https://admin.example.com/post-logout', 'state-123'),
      ).toBeNull()
    })

    it('returns null when end_session_endpoint is malformed', () => {
      expect(
        buildSafeLogoutUrl('http://%zz', 'https://admin.example.com/post-logout', 'state-123'),
      ).toBeNull()
    })

    it('builds logout url when post_logout_redirect_uri is null', () => {
      expect(buildSafeLogoutUrl('https://auth.example.com/logout', null, 'state-123')).toBe(
        'https://auth.example.com/logout?state=state-123',
      )
    })

    it('builds logout url when post_logout_redirect_uri is undefined', () => {
      expect(buildSafeLogoutUrl('https://auth.example.com/logout', undefined, 'state-123')).toBe(
        'https://auth.example.com/logout?state=state-123',
      )
    })

    it('builds logout url when post_logout_redirect_uri is empty string', () => {
      expect(buildSafeLogoutUrl('https://auth.example.com/logout', '', 'state-123')).toBe(
        'https://auth.example.com/logout?state=state-123',
      )
    })

    it('builds logout url when post_logout_redirect_uri is whitespace', () => {
      expect(buildSafeLogoutUrl('https://auth.example.com/logout', '   ', 'state-123')).toBe(
        'https://auth.example.com/logout?state=state-123',
      )
    })

    it('builds logout url when post_logout_redirect_uri is malformed', () => {
      expect(buildSafeLogoutUrl('https://auth.example.com/logout', 'http://%zz', 'state-123')).toBe(
        'https://auth.example.com/logout?state=state-123',
      )
    })
  })
})
