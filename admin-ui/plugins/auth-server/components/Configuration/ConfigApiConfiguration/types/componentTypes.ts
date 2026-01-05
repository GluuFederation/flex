import type { JsonPatch } from './configApiTypes'
import { Accordion } from 'Components'

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
  disabled?: boolean
}

export type AccordionWithSubComponents = typeof Accordion & {
  Header: React.ComponentType<React.PropsWithChildren<{ style?: React.CSSProperties }>>
  Body: React.ComponentType<React.PropsWithChildren>
}
