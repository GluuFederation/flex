import {
  USER_ROLE_FORM_ATTR,
  COUNTRY_ATTR,
  BIRTHDATE_ATTR,
  USER_PASSWORD_ATTR,
  STATUS_ATTR,
  JANS_STATUS_ATTR,
  MIDDLE_NAME_ATTR,
  SN_ATTR,
  FAMILY_NAME_ATTR,
  EMAIL_VERIFIED_ATTR,
  CREATED_AT_ATTR,
  UPDATED_AT_ATTR,
  STANDARD_FORM_FIELDS,
  RESERVED_STANDARD_CLAIMS,
} from 'Plugins/user-management/common/Constants'

describe('user-management Constants', () => {
  it('exposes the expected attribute name values', () => {
    expect(USER_ROLE_FORM_ATTR).toBe('role')
    expect(COUNTRY_ATTR).toBe('c')
    expect(BIRTHDATE_ATTR).toBe('birthdate')
    expect(USER_PASSWORD_ATTR).toBe('userPassword')
    expect(STATUS_ATTR).toBe('status')
    expect(JANS_STATUS_ATTR).toBe('jansStatus')
    expect(MIDDLE_NAME_ATTR).toBe('middleName')
    expect(SN_ATTR).toBe('sn')
    expect(FAMILY_NAME_ATTR).toBe('familyName')
    expect(EMAIL_VERIFIED_ATTR).toBe('emailVerified')
    expect(CREATED_AT_ATTR).toBe('createdAt')
    expect(UPDATED_AT_ATTR).toBe('updatedAt')
  })

  it('lists the standard form fields', () => {
    expect(STANDARD_FORM_FIELDS).toEqual(['userId', 'mail', 'displayName', 'status', 'givenName'])
  })

  it('includes the standard form fields plus extra reserved claims', () => {
    STANDARD_FORM_FIELDS.forEach((field) => {
      expect(RESERVED_STANDARD_CLAIMS).toContain(field)
    })
    expect(RESERVED_STANDARD_CLAIMS).toContain('uid')
    expect(RESERVED_STANDARD_CLAIMS).toContain(USER_PASSWORD_ATTR)
    expect(RESERVED_STANDARD_CLAIMS).toHaveLength(STANDARD_FORM_FIELDS.length + 6)
  })
})
