import {
  toWebhookEntries,
  HTTP_METHODS,
  hasHttpBody,
  isLastHeaderComplete,
  buildWebhookInitialValues,
} from '../webhook'
import type { PagedResultEntriesItem } from 'JansConfigApi'
import type { WebhookData } from '../types'

describe('webhook helper', () => {
  describe('toWebhookEntries', () => {
    it('returns an empty array when entries are undefined', () => {
      expect(toWebhookEntries(undefined)).toEqual([])
    })

    it('maps entry fields and applies fallbacks for missing values', () => {
      const entries: PagedResultEntriesItem[] = [
        { inum: 'w1', url: 'https://x.test', httpMethod: 'POST' },
      ]
      const result = toWebhookEntries(entries)
      expect(result).toHaveLength(1)
      expect(result[0].inum).toBe('w1')
      expect(result[0].url).toBe('https://x.test')
      expect(result[0].httpMethod).toBe('POST')
      expect(result[0].displayName).toBe('')
      expect(result[0].description).toBeUndefined()
    })

    it('uses fallbacks when fields are null', () => {
      const entries: PagedResultEntriesItem[] = [{ displayName: null, url: null }]
      const result = toWebhookEntries(entries)
      expect(result[0].displayName).toBe('')
      expect(result[0].url).toBe('')
    })
  })

  describe('HTTP_METHODS', () => {
    it('exposes the five supported methods', () => {
      expect(HTTP_METHODS.map((m) => m.value)).toEqual(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
    })
  })

  describe('hasHttpBody', () => {
    it.each(['POST', 'PUT', 'PATCH'])('returns true for %s', (method) => {
      expect(hasHttpBody(method)).toBe(true)
    })

    it.each(['GET', 'DELETE', '', 'post'])('returns false for %s', (method) => {
      expect(hasHttpBody(method)).toBe(false)
    })
  })

  describe('isLastHeaderComplete', () => {
    it('returns true for an empty list', () => {
      expect(isLastHeaderComplete([])).toBe(true)
    })

    it('returns true when the last header has both key and value', () => {
      expect(isLastHeaderComplete([{ key: 'a', value: 'b' }])).toBe(true)
    })

    it('returns false when the last header is missing a value', () => {
      expect(isLastHeaderComplete([{ key: 'a', value: '' }])).toBe(false)
    })

    it('returns false when the last header has whitespace-only values', () => {
      expect(isLastHeaderComplete([{ key: '  ', value: '  ' }])).toBe(false)
    })

    it('returns false when key/value are null', () => {
      expect(isLastHeaderComplete([{ key: null, value: null }])).toBe(false)
    })
  })

  describe('buildWebhookInitialValues', () => {
    it('returns empty defaults when given no webhook', () => {
      const result = buildWebhookInitialValues()
      expect(result).toEqual({
        httpRequestBody: '',
        httpMethod: '',
        url: '',
        displayName: '',
        httpHeaders: [],
        jansEnabled: false,
        description: '',
      })
    })

    it('keeps a string request body as-is', () => {
      const result = buildWebhookInitialValues({ httpRequestBody: '{"a":1}' })
      expect(result.httpRequestBody).toBe('{"a":1}')
    })

    it('stringifies an object request body', () => {
      const result = buildWebhookInitialValues({ httpRequestBody: { a: 1 } })
      expect(result.httpRequestBody).toBe(JSON.stringify({ a: 1 }, null, 2))
    })

    it('maps populated webhook fields', () => {
      const webhook: WebhookData = {
        httpMethod: 'POST',
        url: 'https://x.test',
        displayName: 'My Hook',
        jansEnabled: true,
        description: 'desc',
      }
      const result = buildWebhookInitialValues(webhook)
      expect(result.httpMethod).toBe('POST')
      expect(result.url).toBe('https://x.test')
      expect(result.displayName).toBe('My Hook')
      expect(result.jansEnabled).toBe(true)
      expect(result.description).toBe('desc')
    })

    it('normalizes headers, falling back to source/destination', () => {
      const webhook: WebhookData = {
        httpHeaders: [
          { key: 'k1', value: 'v1' },
          { source: 's1', destination: 'd1' },
        ],
      }
      const result = buildWebhookInitialValues(webhook)
      expect(result.httpHeaders).toEqual([
        { key: 'k1', value: 'v1' },
        { key: 's1', value: 'd1' },
      ])
    })
  })
})
