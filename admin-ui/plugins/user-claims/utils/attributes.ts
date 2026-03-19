export const scopes = [
  {
    name: 'givenName',
    inum: 'B4B0',
    displayName: 'givenName',
    description: 'First Name',
    status: 'ACTIVE',
    dataType: 'STRING',
    editType: 'ADMIN',
    viewType: 'ADMIN',
    usageType: 'OPENID',
    jansHideOnDiscovery: false,
    oxMultiValuedAttribute: false,
    attributeValidation: { maxLength: null, regexp: null, minLength: null },
    scimCustomAttr: false,
  },
  {
    name: 'emailVerified',
    inum: 'B4B1',
    displayName: 'emailVerified',
    description: 'Email Verified',
    status: 'ACTIVE',
    dataType: 'STRING',
    editType: 'ADMIN',
    viewType: 'ADMIN',
    usageType: 'OPENID',
    jansHideOnDiscovery: false,
    oxMultiValuedAttribute: false,
    attributeValidation: { maxLength: null, regexp: null, minLength: null },
    scimCustomAttr: false,
  },
]

export default scopes
