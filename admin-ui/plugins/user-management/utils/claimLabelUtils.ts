import type { TFunction } from 'i18next'

export const getClaimLabelKey = (t: TFunction, name: string, displayName?: string): string => {
  const key = `claims.${name}`
  const translated = t(key)
  return translated !== key ? key : displayName || name
}

export const getClaimLabel = (t: TFunction, name: string, displayName?: string): string => {
  const key = `claims.${name}`
  const translated = t(key)
  return translated !== key ? translated : displayName || name
}
