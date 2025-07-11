export interface PolicyEntry {
  description: string
  creation_date: string
  policy_content: string
}

export interface TrustedIssuerTokenMetadata {
  trusted: boolean
  entity_type_name: string
  user_id: string
  token_id: string
  workload_id?: string
  claim_mapping: Record<string, unknown>
  required_claims: string[]
  principal_mapping: string[]
}

export interface TrustedIssuer {
  name: string
  description: string
  openid_configuration_endpoint: string
  token_metadata: {
    access_token: TrustedIssuerTokenMetadata
    id_token: TrustedIssuerTokenMetadata
    userinfo_token: TrustedIssuerTokenMetadata
  }
}

export interface PolicyStore {
  name: string
  description: string
  policies: Record<string, PolicyEntry>
  trusted_issuers: Record<string, TrustedIssuer>
}

export interface PolicyStoreConfig {
  cedar_version: string
  policy_stores: Record<string, PolicyStore>
}
