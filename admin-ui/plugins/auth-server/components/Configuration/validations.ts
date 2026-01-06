import * as Yup from 'yup'
import type { SchemaProperty, AppConfiguration } from './types'

const buildPropertySchema = (propKey: string, schema?: SchemaProperty): Yup.AnySchema => {
  const schemaType = schema?.type

  switch (schemaType) {
    case 'string':
      return Yup.string().nullable()
    case 'number':
      return Yup.number()
        .nullable()
        .transform((value, originalValue) => {
          if (originalValue === '' || originalValue === null || originalValue === undefined) {
            return null
          }
          return value
        })
    case 'boolean':
      return Yup.boolean().nullable()
    case 'array':
      if (schema?.items?.type === 'string') {
        return Yup.array().of(Yup.string()).nullable()
      }
      return Yup.array().nullable()
    default:
      return Yup.mixed().nullable()
  }
}

export const buildAuthServerPropertiesSchema = (
  schemaDefinitions: Record<string, SchemaProperty>,
): Yup.ObjectSchema<AppConfiguration> => {
  const shape: Record<string, Yup.AnySchema> = {}

  Object.keys(schemaDefinitions).forEach((propKey) => {
    const schema = schemaDefinitions[propKey]
    shape[propKey] = buildPropertySchema(propKey, schema)
  })

  return Yup.object().shape(shape) as unknown as Yup.ObjectSchema<AppConfiguration>
}

export const defaultAuthServerPropertiesSchema = Yup.object()
