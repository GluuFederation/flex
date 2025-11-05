import * as Yup from 'yup'
import moment from 'moment/moment'
import { CustomUser, PersonAttribute } from '../types/UserApiTypes'
import { UserEditFormValues } from '../types/ComponentTypes'
import { CustomObjectAttribute } from 'JansConfigApi'

export const getUserValidationSchema = (userDetails: CustomUser | null) => {
  return Yup.object({
    displayName: Yup.string().required('Display name is required.'),
    givenName: Yup.string().required('First name is required.'),
    sn: Yup.string().required('Last name is required.'),
    userId: Yup.string().required('User name is required.'),
    mail: Yup.string().required('Email is required.'),
    userPassword: userDetails ? Yup.string() : Yup.string().required('Password is required.'),
    userConfirmPassword: userDetails
      ? Yup.string()
      : Yup.string().required('Confirm password is required.'),
  })
}

export const passwordChangeValidationSchema = Yup.object({
  userPassword: Yup.string()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required.'),
  userConfirmPassword: Yup.string()
    .oneOf([Yup.ref('userPassword')], 'Passwords must match')
    .required('Confirm password is required.'),
})

// Helper function to safely get property from CustomUser or customAttributes
const getUserProperty = (
  userDetails: CustomUser | null,
  propertyName: string,
): string | undefined => {
  if (!userDetails) return undefined

  // Check if property exists directly on userDetails
  const directValue = (userDetails as Record<string, unknown>)[propertyName]
  if (directValue && typeof directValue === 'string') {
    return directValue
  }

  // Check customAttributes
  if (userDetails.customAttributes) {
    const attr = userDetails.customAttributes.find((attr) => attr.name === propertyName)
    if (attr) {
      if (attr.value && typeof attr.value === 'string') {
        return attr.value
      }
      if (attr.values && attr.values.length > 0 && typeof attr.values[0] === 'string') {
        return attr.values[0]
      }
    }
  }

  return undefined
}

const processBirthdateAttribute = (
  customAttr: CustomObjectAttribute,
  initialValues: UserEditFormValues,
): void => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = customAttr.value
  const dateSource =
    attrValues.length > 0 ? JSON.stringify(attrValues[0]) : JSON.stringify(attrSingleValue)
  if (dateSource && customAttr.name) {
    initialValues[customAttr.name] = moment(dateSource).format('YYYY-MM-DD')
  }
}

const processMultiValuedAttribute = (
  customAttr: CustomObjectAttribute,
  initialValues: UserEditFormValues,
): void => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = customAttr.value
  if (!customAttr.name) return

  if (attrValues.length > 0) {
    initialValues[customAttr.name] = attrValues.map((v) =>
      typeof v === 'string' ? v : JSON.stringify(v),
    )
  } else if (attrSingleValue) {
    initialValues[customAttr.name] = [
      typeof attrSingleValue === 'string' ? attrSingleValue : JSON.stringify(attrSingleValue),
    ]
  }
}

const processSingleValuedAttribute = (
  customAttr: CustomObjectAttribute,
  initialValues: UserEditFormValues,
): void => {
  const attrValues = customAttr.values ?? []
  const attrSingleValue = customAttr.value
  if (!customAttr.name) return

  if (attrValues.length > 0) {
    const value = attrValues[0]
    initialValues[customAttr.name] = typeof value === 'string' ? value : JSON.stringify(value)
  } else if (attrSingleValue) {
    initialValues[customAttr.name] =
      typeof attrSingleValue === 'string' ? attrSingleValue : JSON.stringify(attrSingleValue)
  }
}

export const initializeCustomAttributes = (
  userDetails: CustomUser | null,
  personAttributes: PersonAttribute[],
): UserEditFormValues => {
  const initialValues: UserEditFormValues = {
    displayName: userDetails?.displayName || '',
    givenName: userDetails?.givenName || '',
    mail: userDetails?.mail || '',
    userId: userDetails?.userId || '',
    sn: getUserProperty(userDetails, 'familyName') || getUserProperty(userDetails, 'sn') || '',
    middleName: getUserProperty(userDetails, 'middleName') || '',
    status: getUserProperty(userDetails, 'jansStatus') || userDetails?.status || '',
    userPassword: '',
    userConfirmPassword: '',
  }

  if (userDetails?.customAttributes) {
    for (const customAttr of userDetails.customAttributes) {
      const attributeDef = personAttributes.find((e: PersonAttribute) => e.name === customAttr.name)
      if (customAttr.name === 'birthdate') {
        processBirthdateAttribute(customAttr, initialValues)
        continue
      }
      if (attributeDef?.oxMultiValuedAttribute) {
        processMultiValuedAttribute(customAttr, initialValues)
      } else {
        processSingleValuedAttribute(customAttr, initialValues)
      }
    }
  }

  return initialValues
}
