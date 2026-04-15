import type { TFunction } from 'i18next'
import type { GluuDynamicListItem, GluuDynamicListMode } from '@/components/GluuDynamicList'

export type ClientFieldSection<FieldKey extends string = string> = {
  titleKey: string
  fieldKeys: readonly FieldKey[]
}

export type DynamicListValidationOptions = {
  items: GluuDynamicListItem[]
  t: TFunction
  mode?: GluuDynamicListMode
  validateItem?: (item: GluuDynamicListItem, mode: GluuDynamicListMode) => boolean
  invalidMessage?: string
  requiredMessage?: string
}
