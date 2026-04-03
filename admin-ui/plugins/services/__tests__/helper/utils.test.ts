import { extractActionMessage } from 'Plugins/services/helper/utils'

describe('extractActionMessage', () => {
  it('extracts action_message and returns clean data', () => {
    const data = { action_message: 'Updated cache', host: 'localhost', port: 6379 }
    const { cleanData, message } = extractActionMessage(data, 'default msg')
    expect(message).toBe('Updated cache')
    expect(cleanData).toEqual({ host: 'localhost', port: 6379 })
    expect(cleanData).not.toHaveProperty('action_message')
  })

  it('returns default message when action_message is not provided', () => {
    const data = { action_message: undefined, host: 'localhost' }
    const { cleanData, message } = extractActionMessage(data, 'default msg')
    expect(message).toBe('default msg')
    expect(cleanData).toEqual({ host: 'localhost' })
  })

  it('returns default message when action_message is empty string', () => {
    const data = { action_message: '', host: 'localhost' }
    const { cleanData, message } = extractActionMessage(data, 'fallback')
    expect(message).toBe('fallback')
    expect(cleanData).toEqual({ host: 'localhost' })
  })

  it('handles data with only action_message', () => {
    const data = { action_message: 'some action' }
    const { cleanData, message } = extractActionMessage(data, 'default')
    expect(message).toBe('some action')
    expect(cleanData).toEqual({})
  })
})
