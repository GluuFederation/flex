import * as Yup from 'yup'
import type { AppConfiguration } from '../../types'
import { getAppConfigurationProperties, type SchemaProperty } from '@/config/openApiSpec'

const schemaProperties = getAppConfigurationProperties()

export const appConfigurationSchema = Yup.object()
  .nullable()
  .test('validate-fields', 'Invalid field values', function (value: AppConfiguration | null) {
    if (!value || typeof value !== 'object') {
      return true
    }

    const errors: Yup.ValidationError[] = []

    for (const key of Object.keys(value)) {
      const fieldValue = value[key]
      const fieldSchema: SchemaProperty | undefined = schemaProperties[key]

      if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
        continue
      }

      if (fieldSchema) {
        const fieldType = fieldSchema.type
        const format = fieldSchema.format

        if (fieldType === 'string' && (format === 'uri' || format === 'url')) {
          if (typeof fieldValue !== 'string') {
            errors.push(
              this.createError({
                path: key,
                message: 'URL must be a string',
              }),
            )
          } else if (fieldValue.trim() !== '') {
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

        if (fieldType === 'number' || fieldType === 'integer') {
          if (typeof fieldValue === 'string') {
            const trimmed = fieldValue.trim()
            if (trimmed !== '') {
              const num = Number(trimmed)
              if (!Number.isFinite(num)) {
                errors.push(
                  this.createError({
                    path: key,
                    message: 'Must be a valid number',
                  }),
                )
              } else if (fieldType === 'integer' && !Number.isInteger(num)) {
                errors.push(
                  this.createError({
                    path: key,
                    message: 'Must be an integer',
                  }),
                )
              } else if (num < 0) {
                errors.push(
                  this.createError({
                    path: key,
                    message: 'Must be non-negative',
                  }),
                )
              }
            }
          } else if (typeof fieldValue === 'number') {
            if (!Number.isFinite(fieldValue)) {
              errors.push(
                this.createError({
                  path: key,
                  message: 'Must be a valid number',
                }),
              )
            } else if (fieldType === 'integer' && !Number.isInteger(fieldValue)) {
              errors.push(
                this.createError({
                  path: key,
                  message: 'Must be an integer',
                }),
              )
            } else if (fieldValue < 0) {
              errors.push(
                this.createError({
                  path: key,
                  message: 'Must be non-negative',
                }),
              )
            }
          } else {
            errors.push(
              this.createError({
                path: key,
                message: 'Must be a valid number',
              }),
            )
          }
        }
      }
    }

    if (errors.length > 0) {
      return new Yup.ValidationError(errors)
    }

    return true
  })
