import type { JsonPatch } from './configApiTypes'
import type { PropertyValue, SchemaProperty } from '../../types'
import { Accordion } from 'Components'

export interface JsonPropertyBuilderConfigApiProps {
  propKey: string
  propValue: PropertyValue
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
