import { getErrorMessage, getQueryErrorMessage } from '@/utils/errorHandler'
import type { ApiError } from '@/utils/types'

const t = (key: string): string => `t:${key}`

describe('getErrorMessage', () => {
  it('prefers responseMessage from an API error response', () => {
    const error: ApiError = {
      response: { data: { responseMessage: 'rm', message: 'm' } },
      message: 'top',
    }
    expect(getErrorMessage(error, 'fallback.key', t)).toBe('rm')
  })

  it('falls back to data.message when responseMessage is absent', () => {
    const error: ApiError = { response: { data: { message: 'm' } }, message: 'top' }
    expect(getErrorMessage(error, 'fallback.key', t)).toBe('m')
  })

  it('falls back to the top-level message when response data is empty', () => {
    const error: ApiError = { response: { data: {} }, message: 'top' }
    expect(getErrorMessage(error, 'fallback.key', t)).toBe('top')
  })

  it('uses the translated fallback when an API error carries no message', () => {
    const error: ApiError = { response: { data: {} } }
    expect(getErrorMessage(error, 'fallback.key', t)).toBe('t:fallback.key')
  })

  it('uses the message from a plain Error', () => {
    expect(getErrorMessage(new Error('boom'), 'fallback.key', t)).toBe('boom')
  })

  it('uses the translated fallback for an Error with an empty message', () => {
    expect(getErrorMessage(new Error(''), 'fallback.key', t)).toBe('t:fallback.key')
  })

  it('uses the translated fallback for null', () => {
    expect(getErrorMessage(null, 'fallback.key', t)).toBe('t:fallback.key')
  })
})

describe('getQueryErrorMessage', () => {
  it('returns a trimmed non-empty string error', () => {
    expect(getQueryErrorMessage('  oops  ', 'fb')).toBe('oops')
  })

  it('returns the fallback for a blank string', () => {
    expect(getQueryErrorMessage('   ', 'fb')).toBe('fb')
  })

  it('returns the fallback for null and undefined', () => {
    expect(getQueryErrorMessage(null, 'fb')).toBe('fb')
    expect(getQueryErrorMessage(undefined, 'fb')).toBe('fb')
  })

  it('extracts responseMessage from an API error object', () => {
    const error: ApiError = { response: { data: { responseMessage: 'rm' } } }
    expect(getQueryErrorMessage(error, 'fb')).toBe('rm')
  })

  it('extracts data.message when responseMessage is missing', () => {
    const error: ApiError = { response: { data: { message: 'm' } } }
    expect(getQueryErrorMessage(error, 'fb')).toBe('m')
  })

  it('falls back when an API error response carries no usable message', () => {
    const error: ApiError = { response: { data: {} } }
    expect(getQueryErrorMessage(error, 'fb')).toBe('fb')
  })

  it('extracts a trimmed message from a plain object with a string message', () => {
    expect(getQueryErrorMessage({ message: '  hi  ' }, 'fb')).toBe('hi')
  })

  it('returns the fallback for an object whose message is blank', () => {
    expect(getQueryErrorMessage({ message: '   ' }, 'fb')).toBe('fb')
  })

  it('returns the fallback for an object without a usable message', () => {
    expect(getQueryErrorMessage({ other: 'x' }, 'fb')).toBe('fb')
  })
})
