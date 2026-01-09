import * as Yup from 'yup'
import type { AppConfiguration, SpecSchema, SchemaProperty } from '../../types'
// Import from root - path goes up 6 levels from utils/ to root
import spec from '../../../../../../configApiSpecs.yaml'

// Get the schema properties from the OpenAPI spec with safe fallback
const schemaProperties = ((spec as unknown as SpecSchema)?.components?.schemas?.AppConfiguration
  ?.properties ?? {}) as Record<string, SchemaProperty>

// Create a dynamic validation schema for AppConfiguration based on OpenAPI schema
export const appConfigurationSchema = Yup.object().test(
  'validate-fields',
  'Invalid field values',
  function (value: AppConfiguration) {
    if (!value || typeof value !== 'object') {
      return true
    }

    // Collect all validation errors instead of returning early
    const errors: Yup.ValidationError[] = []

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
            // Explicitly fail if value is not a string
            if (typeof fieldValue !== 'string') {
              errors.push(
                this.createError({
                  path: key,
                  message: 'URL must be a string',
                }),
              )
            } else if (fieldValue.trim() !== '') {
              // Validate URL format for non-empty strings
              try {
                new URL(fieldValue)
              } catch {
                errors.push(
                  this.createError({
                    path: key,
                    message: 'Invalid URL format',
                  }),
                )
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
              // Reject NaN and Infinity
              if (!Number.isFinite(num)) {
                errors.push(
                  this.createError({
                    path: key,
                    message: 'Must be a valid number',
                  }),
                )
              } else {
                // For integer type, require integer value
                if (fieldType === 'integer' && !Number.isInteger(num)) {
                  errors.push(
                    this.createError({
                      path: key,
                      message: 'Must be an integer',
                    }),
                  )
                } else if (num < 0) {
                  // Check non-negative after validating number is valid
                  errors.push(
                    this.createError({
                      path: key,
                      message: 'Must be non-negative',
                    }),
                  )
                }
              }
            }
          } else if (typeof fieldValue === 'number') {
            // Reject NaN and Infinity for number inputs
            if (!Number.isFinite(fieldValue)) {
              errors.push(
                this.createError({
                  path: key,
                  message: 'Must be a valid number',
                }),
              )
            } else {
              // For integer type, require integer value
              if (fieldType === 'integer' && !Number.isInteger(fieldValue)) {
                errors.push(
                  this.createError({
                    path: key,
                    message: 'Must be an integer',
                  }),
                )
              } else if (fieldValue < 0) {
                // Check non-negative after validating number is valid
                errors.push(
                  this.createError({
                    path: key,
                    message: 'Must be non-negative',
                  }),
                )
              }
            }
          }
        }
      }
    }

    // Return all errors at once if any were found
    if (errors.length > 0) {
      const validationError = new Yup.ValidationError('Multiple validation errors')
      validationError.inner = errors
      return validationError
    }

    return true
  },
)
