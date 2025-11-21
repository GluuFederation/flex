import type { ScopeFormValues, ExtendedScope, ExtendedScopeAttributes } from '../types'

export interface ScopePanelVisibility {
  showClaimsPanel: boolean
  showDynamicPanel: boolean
  showSpontaneousPanel: boolean
  showUmaPanel: boolean
}

const cloneScopeAttributes = (
  attributes?: ExtendedScopeAttributes,
): ExtendedScopeAttributes | undefined => {
  if (!attributes) {
    return undefined
  }

  return {
    ...attributes,
    spontaneousClientScopes: Array.isArray(attributes.spontaneousClientScopes)
      ? [...attributes.spontaneousClientScopes]
      : [],
  }
}

export const buildScopeInitialValues = (scope: ExtendedScope): ScopeFormValues => {
  return {
    id: scope.id ?? '',
    displayName: scope.displayName ?? '',
    description: scope.description ?? '',
    scopeType: scope.scopeType ?? '',
    defaultScope: scope.defaultScope ?? false,
    claims: scope.claims ? [...scope.claims] : [],
    dynamicScopeScripts: scope.dynamicScopeScripts ? [...scope.dynamicScopeScripts] : [],
    attributes: cloneScopeAttributes(scope.attributes),
    umaAuthorizationPolicies: scope.umaAuthorizationPolicies
      ? [...scope.umaAuthorizationPolicies]
      : [],
    iconUrl: scope.iconUrl ?? '',
    action_message: '',
  }
}

export const derivePanelVisibility = (scopeType?: string): ScopePanelVisibility => {
  const normalizedType = scopeType ?? ''

  return {
    showClaimsPanel: normalizedType === 'openid',
    showDynamicPanel: normalizedType === 'dynamic',
    showSpontaneousPanel: normalizedType === 'spontaneous',
    showUmaPanel: normalizedType === 'uma',
  }
}

export const applyScopeTypeDefaults = (
  values: ScopeFormValues,
  scopeType: string,
): ScopeFormValues => {
  const clonedAttributes = cloneScopeAttributes(values.attributes)

  if (clonedAttributes) {
    clonedAttributes.spontaneousClientId = undefined
    clonedAttributes.spontaneousClientScopes = []
  }

  return {
    ...values,
    scopeType,
    dynamicScopeScripts: [],
    claims: [],
    attributes: clonedAttributes,
  }
}
