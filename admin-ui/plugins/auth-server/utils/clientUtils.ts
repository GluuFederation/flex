import { cloneElement, isValidElement } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { REGEX_EMAIL } from '@/utils/regex'
import { uuidv4 } from '../../../app/utils/Util'
import type { GluuDynamicListItem } from '@/components/GluuDynamicList'
import type { SelectOption } from 'Routes/Apps/Gluu/types/GluuSelectRow.types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { ClientFieldSection, DynamicListValidationOptions } from './types'

export type { ClientFieldSection, DynamicListValidationOptions }

export const createClientFieldSection = <FieldKey extends string>(
  titleKey: string,
  fieldKeys: readonly FieldKey[],
): ClientFieldSection<FieldKey> => ({
  titleKey,
  fieldKeys,
})

export const getClientSectionFields = <FieldKey extends string>(
  fieldMap: Partial<Record<FieldKey, ReactNode>>,
  section: ClientFieldSection<FieldKey>,
): ReactNode[] =>
  section.fieldKeys
    .map((fieldKey) => {
      const field = fieldMap[fieldKey]
      if (field == null) return null
      return isValidElement(field) ? cloneElement(field, { key: fieldKey }) : field
    })
    .filter((field) => field != null)

export const uriValidator = (uri: string): boolean => {
  const value = uri.trim()
  if (!value) return false

  try {
    const parsed = new URL(value)
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && Boolean(parsed.hostname)
  } catch {
    return false
  }
}

export const audienceValidator = (aud: string): boolean => aud.trim().length > 0

export const emailValidator = (email: string): boolean => REGEX_EMAIL.test(email)

export const getDynamicListValidationMessage = ({
  items,
  t,
  mode = 'single',
  validateItem,
  invalidMessage,
  requiredMessage,
}: DynamicListValidationOptions): string | undefined => {
  if (items.length === 0) return undefined

  const hasIncompleteItem = items.some((item) => {
    const value = item.value?.trim() ?? ''
    if (mode === 'single') return value.length === 0

    const key = item.key?.trim() ?? ''
    return key.length === 0 || value.length === 0
  })

  if (hasIncompleteItem) {
    if (requiredMessage) return requiredMessage
    return mode === 'single'
      ? t('errors.fido_empty_row_value')
      : t('errors.fido_empty_row_key_value')
  }

  if (!validateItem) return undefined

  const hasInvalidItem = items.some((item) => !validateItem(item, mode))
  if (!hasInvalidItem) return undefined

  return invalidMessage ?? t('validation_messages.invalid_pattern')
}

export const toStringArray = (val: string[] | undefined): string[] =>
  Array.isArray(val) ? val : []

export const mapTranslatedOptions = <
  T extends {
    value: string
    labelKey: string
  },
>(
  options: readonly T[],
  t: (key: string) => string,
): SelectOption[] => options.map(({ value, labelKey }) => ({ value, label: t(labelKey) }))

export const createPassiveSelectFormik = (
  handleBlur: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
) => ({
  handleChange: (_event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => undefined,
  handleBlur,
})

export const toBooleanSelectValue = (value: JsonValue | null | undefined): string =>
  String(Boolean(value))

export const fromBooleanSelectValue = (value: string): boolean => value === 'true'

export const mapDynamicListValues = (values: string[]): GluuDynamicListItem[] =>
  values.map((value) => ({ id: uuidv4(), value }))

export const appendDynamicListItem = (
  current: GluuDynamicListItem[],
  value = '',
): GluuDynamicListItem[] => [...current, { id: uuidv4(), value }]

export const extractDnInum = (dn: string | null | undefined): string | null =>
  dn?.split(',')[0]?.split('=')[1] ?? null
