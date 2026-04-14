import type { ChangeEvent, ReactNode } from 'react'
import { REGEX_EMAIL } from '@/utils/regex'
import { uuidv4 } from '../../../app/utils/Util'
import type { GluuDynamicListItem } from '@/components/GluuDynamicList'
import type { SelectOption } from 'Routes/Apps/Gluu/types/GluuSelectRow.types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type ClientFieldSection<FieldKey extends string = string> = {
  titleKey: string
  fieldKeys: readonly FieldKey[]
}

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
    .map((fieldKey) => fieldMap[fieldKey])
    .filter((field): field is ReactNode => field != null)

export const uriValidator = (_uri: string): boolean => true

export const audienceValidator = (_aud: string): boolean => true

export const emailValidator = (email: string): boolean => REGEX_EMAIL.test(email)

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
