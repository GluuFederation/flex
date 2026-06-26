import type { TFunction } from 'i18next'
import {
  getCommitMessageValidationError,
  COMMIT_MESSAGE_MIN_LENGTH,
  COMMIT_MESSAGE_MAX_LENGTH,
} from '@/utils/validation/commitMessage'

const t = ((key: string, opts?: { count?: number; min?: number }): string => {
  if (key === 'placeholders.charRequiredMin') return `need ${opts?.count} more (min ${opts?.min})`
  if (key === 'placeholders.charMoreThan512') return 'characters over limit'
  return key
}) as TFunction

describe('commit message length constants', () => {
  it('exposes the min and max lengths', () => {
    expect(COMMIT_MESSAGE_MIN_LENGTH).toBe(10)
    expect(COMMIT_MESSAGE_MAX_LENGTH).toBe(512)
  })
})

describe('getCommitMessageValidationError', () => {
  it('reports how many characters are still required below the minimum', () => {
    expect(getCommitMessageValidationError(4, t)).toBe('need 6 more (min 10)')
  })

  it('reports a single remaining character just below the minimum', () => {
    expect(getCommitMessageValidationError(9, t)).toBe('need 1 more (min 10)')
  })

  it('returns no error exactly at the minimum boundary', () => {
    expect(getCommitMessageValidationError(10, t)).toBe('')
  })

  it('returns no error for a length within range', () => {
    expect(getCommitMessageValidationError(100, t)).toBe('')
  })

  it('returns no error exactly at the maximum boundary', () => {
    expect(getCommitMessageValidationError(512, t)).toBe('')
  })

  it('reports the excess characters above the maximum', () => {
    expect(getCommitMessageValidationError(515, t)).toBe('3 characters over limit')
  })
})
