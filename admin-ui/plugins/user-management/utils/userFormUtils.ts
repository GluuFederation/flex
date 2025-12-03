import moment from 'moment/moment'
import { CustomObjectAttribute, PagedResultEntriesItem } from 'JansConfigApi'

import { BIRTHDATE_ATTR, USER_PASSWORD_ATTR } from '../common/Constants'
import { UserEditFormValues } from '../types/ComponentTypes'
import { PersonAttribute } from '../types/UserApiTypes'
import { ExtendedCustomUser } from '../types/UserFormTypes'

export const validatePassword = (password: string): boolean => {
  if (!password || password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false
  return true
}

export const getStringValue = (value: string | string[] | boolean | null | undefined): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'boolean') return ''
  return ''
}

const processBirthdateAttribute = (
  customAttr: CustomObjectAttribute,
  initialValues: UserEditFormValues,
) => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = customAttr.value
  const dateSource =
    attrValues.length > 0 ? JSON.stringify(attrValues[0]) : JSON.stringify(attrSingleValue)
  if (dateSource) {
    initialValues[customAttr.name || ''] = moment(dateSource).format('YYYY-MM-DD')
  }
}

const processMultiValuedAttribute = (
  customAttr: CustomObjectAttribute,
  initialValues: UserEditFormValues,
) => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = customAttr.value
  if (attrValues.length > 0) {
    initialValues[customAttr.name || ''] = attrValues.map((v) =>
      typeof v === 'string' ? v : JSON.stringify(v),
    )
  } else if (attrSingleValue) {
    initialValues[customAttr.name || ''] = [
      typeof attrSingleValue === 'string' ? attrSingleValue : JSON.stringify(attrSingleValue),
    ]
  }
}

const processSingleValuedAttribute = (
  customAttr: CustomObjectAttribute,
  initialValues: UserEditFormValues,
) => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = customAttr.value
  if (attrValues.length > 0) {
    const value = attrValues[0]
    initialValues[customAttr.name || ''] = typeof value === 'string' ? value : JSON.stringify(value)
  } else if (attrSingleValue) {
    initialValues[customAttr.name || ''] =
      typeof attrSingleValue === 'string' ? attrSingleValue : JSON.stringify(attrSingleValue)
  }
}

export const initializeCustomAttributes = (
  userDetails: ExtendedCustomUser | null,
  personAttributes: PersonAttribute[],
) => {
  const initialValues: UserEditFormValues = {
    displayName: userDetails?.displayName || '',
    givenName: userDetails?.givenName || '',
    mail: userDetails?.mail || '',
    userId: userDetails?.userId || '',
    sn: userDetails?.familyName || '',
    middleName: userDetails?.middleName || '',
    status: userDetails?.jansStatus || userDetails?.status || '',
  }

  if (userDetails?.customAttributes) {
    const attributeMap = new Map(personAttributes.map((attr) => [attr.name, attr]))
    for (const customAttr of userDetails.customAttributes) {
      if (customAttr.name === BIRTHDATE_ATTR) {
        processBirthdateAttribute(customAttr, initialValues)
        continue
      }
      if (!customAttr.name) {
        continue
      }
      const attributeDef = attributeMap.get(customAttr.name)
      if (attributeDef?.oxMultiValuedAttribute) {
        processMultiValuedAttribute(customAttr, initialValues)
      } else {
        processSingleValuedAttribute(customAttr, initialValues)
      }
    }
  }

  return initialValues
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
        const firstValue = customAttr.values[0] as unknown

        if (isBoolean && firstValue !== undefined && firstValue !== null) {
          const boolValue =
            typeof firstValue === 'boolean'
              ? firstValue
              : typeof firstValue === 'string'
                ? (firstValue as string).toLowerCase() === 'true'
                : Boolean(firstValue)
          if (!boolValue) {
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

const isPersonAttribute = (entry: unknown): entry is PersonAttribute => {
  if (!entry || typeof entry !== 'object') {
    return false
  }
  const candidate = entry as Partial<PersonAttribute>
  return typeof candidate.name === 'string' && candidate.name.trim().length > 0
}

export const mapToPersonAttributes = (entries?: PagedResultEntriesItem[]): PersonAttribute[] => {
  if (!entries || entries.length === 0) {
    return []
  }
  return (entries as unknown[]).filter(isPersonAttribute) as PersonAttribute[]
}
