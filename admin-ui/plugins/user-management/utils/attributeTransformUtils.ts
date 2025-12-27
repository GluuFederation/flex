import moment from 'moment'
import { CustomObjectAttribute } from 'JansConfigApi'
import { BIRTHDATE_ATTR, JANS_ADMIN_UI_ROLE_ATTR } from '../common/Constants'
import {
  UserEditFormValues,
  FormValueEntry,
  ModifiedFields,
  ModifiedFieldValue,
} from '../types/ComponentTypes'
import { PersonAttribute, CustomUser } from '../types/UserApiTypes'

export type AttributeValue = string | boolean

interface ValueExtractionRecord {
  role?: string
  value?: string
  label?: string
  [key: string]: string | undefined
}

export const extractValueFromEntry = (entry: FormValueEntry, attributeName: string): string => {
  if (typeof entry === 'string') {
    return entry.trim()
  }
  if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
    const record = entry as ValueExtractionRecord
    if ((attributeName === JANS_ADMIN_UI_ROLE_ATTR || attributeName === 'role') && record.role) {
      return record.role.trim()
    }
    const value = record.role ?? record.value ?? record.label ?? record[attributeName]
    return typeof value === 'string' ? value.trim() : ''
  }
  return ''
}

export const normalizeSingleValue = (value: FormValueEntry, attributeName: string): string => {
  if (typeof value === 'boolean') {
    return String(value)
  }

  const normalized =
    typeof value === 'string'
      ? value.trim()
      : Array.isArray(value)
        ? ((value[0] as string | undefined)?.trim() ?? '')
        : ''

  if (attributeName === BIRTHDATE_ATTR && normalized) {
    const m = moment(normalized, 'YYYY-MM-DD', true)
    return m.isValid() ? m.format('YYYY-MM-DD') : ''
  }
  return normalized
}

export const normalizeBooleanValue = (rawValue: FormValueEntry | boolean): boolean => {
  if (typeof rawValue === 'boolean') {
    return rawValue
  }
  if (typeof rawValue === 'string') {
    return rawValue.toLowerCase() === 'true'
  }
  return Boolean(rawValue)
}

export const normalizeFieldValue = (value: FormValueEntry): string => {
  if (Array.isArray(value)) {
    const first = value[0]
    return first != null ? String(first) : ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  if (value == null) {
    return ''
  }

  return String(value)
}

export const createCustomAttribute = (
  name: string,
  values: AttributeValue[],
  multiValued: boolean,
): CustomObjectAttribute => ({
  name,
  multiValued,
  values: values as unknown as CustomObjectAttribute['values'],
})

export const isBooleanAttribute = (attributeDef?: PersonAttribute): boolean => {
  return attributeDef?.dataType?.toLowerCase() === 'boolean'
}

export const isMultiValuedAttribute = (attributeDef?: PersonAttribute): boolean => {
  return Boolean(attributeDef?.oxMultiValuedAttribute)
}

export const hadOriginalValue = (originalAttr?: CustomObjectAttribute): boolean => {
  if (!originalAttr) return false
  return Boolean(
    (originalAttr.values && originalAttr.values.length > 0) ||
    (originalAttr.value !== undefined && originalAttr.value !== null),
  )
}

export const processMultiValuedField = (
  modifiedValue: ModifiedFieldValue,
): (string | boolean)[] => {
  if (Array.isArray(modifiedValue)) {
    return modifiedValue.map((v) => (typeof v === 'boolean' ? v : String(v)))
  }

  if (typeof modifiedValue === 'boolean') {
    return [modifiedValue]
  }

  return [String(modifiedValue)]
}

export const processSingleValuedField = (
  modifiedValue: ModifiedFieldValue,
  isBoolean: boolean,
): AttributeValue => {
  if (isBoolean) {
    return normalizeBooleanValue(modifiedValue)
  }
  return Array.isArray(modifiedValue) ? String(modifiedValue[0] || '') : String(modifiedValue || '')
}

export const createAttributeMap = (
  personAttributes: PersonAttribute[],
): Map<string, PersonAttribute> => {
  return new Map(personAttributes.map((attr) => [attr.name, attr]))
}

export const buildCustomAttributesFromValues = (
  values: UserEditFormValues,
  personAttributes: PersonAttribute[],
): CustomObjectAttribute[] => {
  if (!values) return []

  const attributeMap = createAttributeMap(personAttributes)
  const result: CustomObjectAttribute[] = []

  Object.keys(values).forEach((attributeName) => {
    const attributeDef = attributeMap.get(attributeName)
    if (!attributeDef) return

    const isMultiValued = isMultiValuedAttribute(attributeDef)
    const rawValue = values[attributeName]

    if (isMultiValued) {
      const multiValues = Array.isArray(rawValue)
        ? rawValue
            .map((entry) => extractValueFromEntry(entry, attributeName))
            .filter((v): v is string => Boolean(v.trim()))
        : []
      if (multiValues.length > 0) {
        result.push(createCustomAttribute(attributeName, multiValues, true))
      }
    } else {
      const isBoolean = isBooleanAttribute(attributeDef)
      if (isBoolean) {
        const boolValue = normalizeBooleanValue(rawValue)
        result.push(createCustomAttribute(attributeName, [boolValue], false))
      } else {
        const singleValue = normalizeSingleValue(rawValue, attributeName)
        if (singleValue) {
          result.push(createCustomAttribute(attributeName, [singleValue], false))
        }
      }
    }
  })

  return result
}

export const updateCustomAttributesWithModifiedFields = (
  customAttributes: CustomObjectAttribute[],
  modifiedFields: ModifiedFields,
  personAttributes: PersonAttribute[],
  originalUserDetails?: CustomUser | null,
): CustomObjectAttribute[] => {
  const attributeMap = createAttributeMap(personAttributes)
  const result = [...customAttributes]

  Object.keys(modifiedFields).forEach((attributeName) => {
    const attributeDef = attributeMap.get(attributeName)
    if (!attributeDef) return

    const modifiedValue = modifiedFields[attributeName]
    const isMultiValued = isMultiValuedAttribute(attributeDef)
    const isBoolean = isBooleanAttribute(attributeDef)

    if (isMultiValued) {
      const fieldValues = processMultiValuedField(modifiedValue)
      const existingAttr = result.find((attr) => attr.name === attributeName)
      if (existingAttr) {
        existingAttr.values = fieldValues as unknown as CustomObjectAttribute['values']
      } else {
        result.push(createCustomAttribute(attributeName, fieldValues, true))
      }
    } else {
      const valueToStore = processSingleValuedField(modifiedValue, isBoolean)
      const originalAttr = originalUserDetails?.customAttributes?.find(
        (attr) => attr.name === attributeName,
      )
      const hadOriginal = hadOriginalValue(originalAttr)

      const existingAttr = result.find((attr) => attr.name === attributeName)
      if (existingAttr) {
        if (isBoolean || valueToStore !== '' || hadOriginal) {
          existingAttr.values = [valueToStore] as unknown as CustomObjectAttribute['values']
        } else {
          const index = result.indexOf(existingAttr)
          if (index > -1) {
            result.splice(index, 1)
          }
        }
      } else if (isBoolean || valueToStore !== '' || hadOriginal) {
        result.push(createCustomAttribute(attributeName, [valueToStore], false))
      }
    }
  })
  alert(JSON.stringify(modifiedFields))

  return result
}

export const getStandardFieldValues = (
  values: UserEditFormValues,
  standardFields: readonly string[],
): Record<string, string> => {
  return Object.fromEntries(
    standardFields.map((field) => [field, normalizeFieldValue(values[field])]),
  )
}
