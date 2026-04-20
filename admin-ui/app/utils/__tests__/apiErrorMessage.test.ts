import { resolveApiErrorMessage } from '../apiErrorMessage'

describe('resolveApiErrorMessage', () => {
  it('prefers description for 4xx API errors', () => {
    expect(
      resolveApiErrorMessage({
        response: {
          status: 400,
          data: {
            message: 'Generic message',
            description: 'Specific client error',
          },
        },
      }),
    ).toBe('Specific client error')
  })

  it('returns the message for non-4xx API errors', () => {
    expect(
      resolveApiErrorMessage({
        response: {
          status: 500,
          data: {
            message: 'Server exploded',
            description: 'Internal details',
          },
        },
      }),
    ).toBe('Server exploded')
  })

  it('uses the fallback for blank strings by default', () => {
    expect(resolveApiErrorMessage('   ', { fallback: 'Fallback message' })).toBe('Fallback message')
  })

  it('can preserve raw string errors when requested', () => {
    expect(
      resolveApiErrorMessage('  kept as-is  ', {
        trimString: false,
        emptyStringFallback: false,
      }),
    ).toBe('  kept as-is  ')
  })

  it('falls back to response text and error message', () => {
    expect(
      resolveApiErrorMessage({
        message: 'Top-level message',
        response: {
          text: 'Response text',
        },
      }),
    ).toBe('Response text')
  })
})
