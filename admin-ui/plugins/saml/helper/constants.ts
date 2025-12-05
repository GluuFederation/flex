export interface NameIdPolicyFormatOption {
  label: string
  value: string
}

export const nameIDPolicyFormat: NameIdPolicyFormatOption[] = [
  {
    label: 'Unspecified',
    value: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
  },
  {
    label: 'EmailAddress',
    value: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
  },
  {
    label: 'Entity',
    value: 'urn:oasis:names:tc:SAML:2.0:nameid-format:entity',
  },
  {
    label: 'Persistent',
    value: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
  },
  {
    label: 'Transient',
    value: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
  },
] as const

