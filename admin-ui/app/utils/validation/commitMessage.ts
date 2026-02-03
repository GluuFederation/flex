import type { TFunction } from 'i18next'

const MIN_LENGTH = 10
const MAX_LENGTH = 512

/**
 * Returns the validation error message for commit/action message input.
 * Shows "X characters required (minimum 10)" when below min, or "X characters over limit (maximum 512)" when over max.
 */
export function getCommitMessageValidationError(messageLength: number, t: TFunction): string {
  if (messageLength < MIN_LENGTH) {
    const remaining = MIN_LENGTH - messageLength
    return `${remaining} ${remaining === 1 ? 'character' : 'characters'} required (minimum ${MIN_LENGTH})`
  }
  if (messageLength > MAX_LENGTH) {
    const excess = messageLength - MAX_LENGTH
    return `${excess} ${t('placeholders.charMoreThan512')}`
  }
  return ''
}

export const COMMIT_MESSAGE_MIN_LENGTH = MIN_LENGTH
export const COMMIT_MESSAGE_MAX_LENGTH = MAX_LENGTH
