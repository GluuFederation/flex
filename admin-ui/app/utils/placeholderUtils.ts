import type { TFunction } from 'i18next'

export const getFieldPlaceholder = (t: TFunction, labelKey: string): string =>
  t('placeholders.type_value', { field: t(labelKey).toLowerCase() })
