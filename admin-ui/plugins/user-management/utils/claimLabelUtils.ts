import type { TFunction } from 'i18next'
import { countries } from '../common/countries'

const countryNameByCode = new Map(countries.map((country) => [country.cca2, country.name]))

export const getCountryName = (code: string): string => countryNameByCode.get(code) ?? code

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
