/**
 * OpenAPI specification re-export with helper functions.
 * Provides stable import path using @/ alias instead of brittle relative paths.
 */
import spec from '../../configApiSpecs.yaml'

export { spec }

export interface SchemaProperty {
  type?: string
  format?: string
  description?: string
  items?: SchemaProperty
  $ref?: string
  enum?: string[]
  default?: unknown
}

interface SchemaDefinition {
  properties?: Record<string, SchemaProperty>
}

export interface SpecSchema {
  components?: {
    schemas?: Record<string, SchemaDefinition | undefined>
  }
}

/** Get schema properties for a given schema name. Returns empty object if not found. */
export function getSchemaProperties(schemaName: string): Record<string, SchemaProperty> {
  const typedSpec = spec as unknown as SpecSchema
  return (typedSpec?.components?.schemas?.[schemaName]?.properties ?? {}) as Record<
    string,
    SchemaProperty
  >
}

/** Get AppConfiguration schema properties. Convenience function for common use case. */
export function getAppConfigurationProperties(): Record<string, SchemaProperty> {
  return getSchemaProperties('AppConfiguration')
}

export default spec
