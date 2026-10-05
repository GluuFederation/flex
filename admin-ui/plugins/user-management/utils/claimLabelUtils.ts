import type { TFunction } from 'i18next'
import i18n from '@/i18n'
import { countries } from '../common/countries'

const countryNameByCode = new Map(countries.map((country) => [country.cca2, country.name]))

export const getCountryName = (code: string): string => countryNameByCode.get(code) ?? code

export const getClaimLabelKey = (name: string, displayName?: string): string => {
  const key = `claims.${name}`
  return i18n.exists(key) ? key : displayName || name
}

export const getClaimLabel = (t: TFunction, name: string, displayName?: string): string => {
  const key = `claims.${name}`
  return i18n.exists(key) ? t(key) : displayName || name
}
