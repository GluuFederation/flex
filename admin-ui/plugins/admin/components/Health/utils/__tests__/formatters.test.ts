import { formatServiceName } from '../formatters'

describe('Health formatters', () => {
  describe('formatServiceName', () => {
    it('title-cases a single lowercase word', () => {
      expect(formatServiceName('health')).toBe('Health')
    })

    it('splits on underscores and hyphens and title-cases each word', () => {
      expect(formatServiceName('user_service-down')).toBe('User Service Down')
    })

    it('lowercases the remainder of each word', () => {
      expect(formatServiceName('CONFIG_API')).toBe('Config Api')
    })

    it('collapses consecutive separators and ignores empty segments', () => {
      expect(formatServiceName('a__b--c')).toBe('A B C')
    })

    it('returns an empty string for an empty input', () => {
      expect(formatServiceName('')).toBe('')
    })

    it('returns an empty string when input is only separators', () => {
      expect(formatServiceName('___')).toBe('')
    })

    it('handles a single character word', () => {
      expect(formatServiceName('x')).toBe('X')
    })
  })
})
