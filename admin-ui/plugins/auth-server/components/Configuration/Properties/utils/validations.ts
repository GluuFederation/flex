import * as Yup from 'yup'
import type { AppConfiguration } from '../types'

// Create a dynamic validation schema for AppConfiguration
// Since AppConfiguration is a flexible object, we'll validate based on field patterns
export const appConfigurationSchema = Yup.object().test(
  'validate-fields',
  'Invalid field values',
  function (value: AppConfiguration) {
    if (!value || typeof value !== 'object') {
      return true
    }

    // Validate URL fields (fields ending with Endpoint, Uri, Url, or containing 'url')
    for (const key of Object.keys(value)) {
      const fieldValue = value[key]

      // Skip null/undefined/empty values
      if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
        continue
      }

      const lowerName = key.toLowerCase()

      // Validate URL fields
      if (
        lowerName.endsWith('endpoint') ||
        lowerName.endsWith('uri') ||
        (lowerName.endsWith('url') && !lowerName.includes('curl')) ||
        (lowerName.includes('url') && !lowerName.includes('curl')) ||
        lowerName === 'issuer'
      ) {
        if (typeof fieldValue === 'string' && fieldValue.trim() !== '') {
          try {
            new URL(fieldValue)
          } catch {
            return this.createError({
              path: key,
              message: 'Invalid URL format',
            })
          }
        }
      }

      // Validate number fields (fields containing 'lifetime', 'interval', 'time', 'size', 'count', 'limit')
      if (
        lowerName.includes('lifetime') ||
        lowerName.includes('interval') ||
        (lowerName.includes('time') &&
          !lowerName.includes('endpoint') &&
          !lowerName.includes('url')) ||
        lowerName.includes('size') ||
        lowerName.includes('count') ||
        lowerName.includes('limit') ||
        lowerName.includes('delay') ||
        lowerName.includes('duration')
      ) {
        if (typeof fieldValue === 'string') {
          const trimmed = fieldValue.trim()
          if (trimmed !== '') {
            const num = Number(trimmed)
            if (isNaN(num) || !isFinite(num)) {
              return this.createError({
                path: key,
                message: 'Must be a valid number',
              })
            }
            if (num < 0) {
              return this.createError({
                path: key,
                message: 'Must be non-negative',
              })
            }
          }
        } else if (typeof fieldValue === 'number') {
          if (fieldValue < 0) {
            return this.createError({
              path: key,
              message: 'Must be non-negative',
            })
          }
        }
      }
    }

    return true
  },
)
