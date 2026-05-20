import {
  REGEX_HAS_UPPERCASE,
  REGEX_HAS_LOWERCASE,
  REGEX_HAS_DIGIT,
  REGEX_HAS_SPECIAL_CHAR,
} from '@/utils/regex'
import { JansAttribute, PagedResultEntriesItem } from 'JansConfigApi'

import { USER_PASSWORD_ATTR } from '../common'
import { PersonAttribute, ExtendedCustomUser } from '../types'

export const validatePassword = (password: string): boolean => {
  if (!password || password.length < 8) return false
  if (!REGEX_HAS_UPPERCASE.test(password)) return false
  if (!REGEX_HAS_LOWERCASE.test(password)) return false
  if (!REGEX_HAS_DIGIT.test(password)) return false
  if (!REGEX_HAS_SPECIAL_CHAR.test(password)) return false
  return true
}

export const getStringValue = (value: string | string[] | boolean | null | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  if (typeof value === 'string') return value
  if (typeof value === 'boolean') return ''
  return ''
}

export const setupCustomAttributes = (
  userDetails: ExtendedCustomUser | null,
  personAttributes: PersonAttribute[],
  selectedClaims: PersonAttribute[],
  setSelectedClaims: (claims: PersonAttribute[]) => void,
) => {
  if (!userDetails?.customAttributes) return

  const usedClaims = new Set([
    'userId',
    'displayName',
    'mail',
    'status',
    USER_PASSWORD_ATTR,
    'givenName',
    'middleName',
    'sn',
  ])

  const attributeMap = new Map(personAttributes.map((attr) => [attr.name, attr]))

  const tempList = [...selectedClaims]
  for (const customAttr of userDetails.customAttributes) {
    if (customAttr.values && customAttr.values.length > 0 && customAttr.name) {
      const attributeData = attributeMap.get(customAttr.name)
      if (attributeData && !usedClaims.has(customAttr.name)) {
        const isBoolean = attributeData.dataType?.toLowerCase() === 'boolean'
        const firstValue = customAttr.values[0] as string | boolean | object

        if (isBoolean && firstValue !== undefined && firstValue !== null) {
          let boolValue: boolean
          if (typeof firstValue === 'boolean') {
            boolValue = firstValue
          } else if (typeof firstValue === 'string') {
            boolValue = firstValue.toLowerCase() === 'true'
          } else if (typeof firstValue === 'object') {
            const obj = firstValue as Record<string, string | number | boolean>
            boolValue =
              'value' in obj && typeof obj.value === 'boolean'
                ? obj.value
                : 'val' in obj && typeof obj.val === 'boolean'
                  ? obj.val
                  : Boolean(firstValue)
          } else {
            boolValue = Boolean(firstValue)
          }
          if (customAttr.name === 'emailVerified' && boolValue === false) {
            continue
          }
        }

        const data = { ...attributeData, options: customAttr.values } as PersonAttribute
        tempList.push(data)
      }
    }
  }
  setSelectedClaims(tempList)
}

const hasRequiredName = (entry: PagedResultEntriesItem | JansAttribute): boolean => {
  if (!entry || typeof entry !== 'object') return false
  const candidate = entry as Record<string, string>
  return typeof candidate.name === 'string' && candidate.name.trim().length > 0
}

export const mapToPersonAttributes = (entries?: JansAttribute[]): PersonAttribute[] => {
  if (!entries || entries.length === 0) return []
  return entries.filter((e): e is PersonAttribute => hasRequiredName(e))
}
