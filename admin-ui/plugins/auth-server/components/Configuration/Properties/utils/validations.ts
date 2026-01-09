import * as Yup from 'yup'
import type { AppConfiguration, SpecSchema, SchemaProperty } from '../types'
import spec from '../../../../../configApiSpecs.yaml'

// Get the schema properties from the OpenAPI spec
const schemaProperties = (spec as unknown as SpecSchema).components.schemas.AppConfiguration
  .properties

// Create a dynamic validation schema for AppConfiguration based on OpenAPI schema
export const appConfigurationSchema = Yup.object().test(
  'validate-fields',
  'Invalid field values',
  function (value: AppConfiguration) {
    if (!value || typeof value !== 'object') {
      return true
    }

    // Validate each field based on its schema definition
    for (const key of Object.keys(value)) {
      const fieldValue = value[key]
      const fieldSchema: SchemaProperty | undefined = schemaProperties[key]

      // Skip null/undefined/empty values
      if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
        continue
      }

      // Validate based on schema type/format
      if (fieldSchema) {
        const fieldType = fieldSchema.type

        // Validate URL fields based on format in schema
        if (fieldType === 'string') {
          // Check if schema indicates URL format (format: 'uri' or 'url')
          const format = (fieldSchema as { format?: string }).format
          if (format === 'uri' || format === 'url') {
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
        }

        // Validate number fields based on schema type
        if (fieldType === 'number' || fieldType === 'integer') {
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
    }

    return true
  },
)
