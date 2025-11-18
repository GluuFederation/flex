import type { JsonPatch } from 'JansConfigApi'

export interface SchemaProperty {
  type?: string
  items?: {
    type?: string
    enum?: string[]
  }
}

export interface JsonPropertyBuilderConfigApiProps {
  propKey: string
  propValue: unknown
  lSize: number
  path?: string
  handler: (patch: JsonPatch) => void
  parentIsArray?: boolean
  schema?: SchemaProperty
  doc_category?: string
  tooltipPropKey?: string
  parent?: string
}
