export const USER_ROLE_FORM_ATTR = 'role'
export const COUNTRY_ATTR = 'c'
export const BIRTHDATE_ATTR = 'birthdate'
export const USER_PASSWORD_ATTR = 'userPassword'
const USER_ID_ATTR = 'userId'
const DISPLAY_NAME_ATTR = 'displayName'
const MAIL_ATTR = 'mail'
export const STATUS_ATTR = 'status'
export const JANS_STATUS_ATTR = 'jansStatus'
const UID_ATTR = 'uid'
const GIVEN_NAME_ATTR = 'givenName'
export const MIDDLE_NAME_ATTR = 'middleName'
export const SN_ATTR = 'sn'
export const FAMILY_NAME_ATTR = 'familyName'
export const EMAIL_VERIFIED_ATTR = 'emailVerified'
export const CREATED_AT_ATTR = 'createdAt'
export const UPDATED_AT_ATTR = 'updatedAt'

export const STANDARD_FORM_FIELDS = [
  USER_ID_ATTR,
  MAIL_ATTR,
  DISPLAY_NAME_ATTR,
  STATUS_ATTR,
  GIVEN_NAME_ATTR,
] as const

export const RESERVED_STANDARD_CLAIMS = [
  ...STANDARD_FORM_FIELDS,
  UID_ATTR,
  JANS_STATUS_ATTR,
  USER_PASSWORD_ATTR,
  MIDDLE_NAME_ATTR,
  SN_ATTR,
  FAMILY_NAME_ATTR,
]
