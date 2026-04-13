import * as Yup from 'yup'
import i18n from '@/i18n'
import { formatDate, isValidDate } from '@/utils/dayjsUtils'
import { CustomUser, PersonAttribute } from '../types/UserApiTypes'
import { UserEditFormValues } from '../types/ComponentTypes'
import { CustomObjectAttribute } from 'JansConfigApi'
import { validatePassword } from '../utils'

export const getUserValidationSchema = (userDetails: CustomUser | null) => {
  const isEdit = Boolean(userDetails)

  const passwordSchemaBase = isEdit
    ? Yup.string()
        .nullable()
        .transform((value) => (typeof value === 'string' && value.trim() === '' ? null : value))
        .test(
          'password-validation',
          () => i18n.t('validation_messages.password_format'),
          (value) => {
            if (!value) return true
            return validatePassword(value)
          },
        )
    : Yup.string()
        .required(() => i18n.t('validation_messages.password_required'))
        .test(
          'password-validation',
          () => i18n.t('validation_messages.password_format'),
          (value) => {
            if (!value) return false
            return validatePassword(value)
          },
        )

  const confirmPasswordSchema = isEdit
    ? Yup.string()
        .nullable()
        .transform((value) => (typeof value === 'string' && value.trim() === '' ? null : value))
        .when('userPassword', {
          is: (val: string | null | undefined) => {
            if (val === null || val === undefined) return false
            if (typeof val === 'string') {
              return val.trim() !== ''
            }
            return true
          },
          then: (schema) =>
            schema
              .required(() => i18n.t('validation_messages.confirm_password_required_when_set'))
              .oneOf([Yup.ref('userPassword')], () =>
                i18n.t('validation_messages.passwords_must_match'),
              ),
          otherwise: (schema) =>
            schema.oneOf([Yup.ref('userPassword'), null], () =>
              i18n.t('validation_messages.passwords_must_match'),
            ),
        })
    : Yup.string()
        .oneOf([Yup.ref('userPassword')], () => i18n.t('validation_messages.passwords_must_match'))
        .required(() => i18n.t('validation_messages.confirm_password_required'))

  return Yup.object({
    displayName: Yup.string().required(() => i18n.t('validation_messages.display_name_required')),
    givenName: Yup.string().required(() => i18n.t('validation_messages.first_name_required')),
    sn: Yup.string().required(() => i18n.t('validation_messages.last_name_required')),
    userId: Yup.string().required(() => i18n.t('validation_messages.username_required')),
    mail: Yup.string()
      .email(() => i18n.t('validation_messages.invalid_email'))
      .required(() => i18n.t('validation_messages.email_required')),
    userPassword: passwordSchemaBase,
    userConfirmPassword: confirmPasswordSchema,
  })
}

export const getPasswordChangeValidationSchema = () =>
  Yup.object({
    userPassword: Yup.string()
      .test(
        'password-validation',
        () => i18n.t('validation_messages.password_format'),
        (value) => {
          if (!value) return false
          return validatePassword(value)
        },
      )
      .required(() => i18n.t('validation_messages.password_required')),
    userConfirmPassword: Yup.string()
      .oneOf([Yup.ref('userPassword')], () => i18n.t('validation_messages.passwords_must_match'))
      .required(() => i18n.t('validation_messages.confirm_password_required')),
  })

const getUserProperty = (
  userDetails: CustomUser | null,
  propertyName: string,
): string | undefined => {
  if (!userDetails) return undefined

  // Check if property exists directly on userDetails
  const directValue = (userDetails as Record<string, string | string[] | boolean | object>)[
    propertyName
  ]
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
  if (!customAttr.name) return

  const toDateLike = (v: object): string | number | Date | null => {
    if (typeof v === 'string' || typeof v === 'number' || v instanceof Date) return v
    if (v && typeof v === 'object' && 'value' in v)
      return toDateLike((v as { value: object }).value)
    return null
  }
  const rawDate =
    attrValues.length > 0
      ? toDateLike(attrValues[0] as object)
      : attrSingleValue
        ? toDateLike(attrSingleValue as object)
        : null

  if (rawDate !== undefined && rawDate !== null) {
    if (isValidDate(rawDate)) {
      initialValues[customAttr.name] = formatDate(rawDate, 'YYYY-MM-DD')
      return
    }
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
    if (typeof value === 'boolean') {
      initialValues[customAttr.name] = value
    } else if (typeof value === 'string') {
      initialValues[customAttr.name] = value
    } else {
      initialValues[customAttr.name] = JSON.stringify(value)
    }
  } else if (attrSingleValue !== undefined && attrSingleValue !== null) {
    if (typeof attrSingleValue === 'boolean') {
      initialValues[customAttr.name] = attrSingleValue
    } else if (typeof attrSingleValue === 'string') {
      initialValues[customAttr.name] = attrSingleValue
    } else {
      initialValues[customAttr.name] = JSON.stringify(attrSingleValue)
    }
  }
}

/**
 * Builds initial form values for a user using custom attribute definitions, honoring
 * backwards-compatible fallbacks (e.g. `sn`: `familyName` → `sn`, `status`: `jansStatus` → `status`).
 * @param userDetails Existing user data or null when creating a new user.
 * @param personAttributes Attribute metadata describing multi-valued behaviour.
 * @returns The normalized form values ready for the user management UI.
 */
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
