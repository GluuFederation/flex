import { useEffect } from 'react'
import { useCedarling } from './useCedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/utility'
import type { AdminUiFeatureResource, ResourcePermission } from '@/cedarling/types'

export const usePermission = (resource: AdminUiFeatureResource): ResourcePermission => {
  const {
    authorizeHelper,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
  } = useCedarling()
  const scopes = CEDAR_RESOURCE_SCOPES[resource]

  useEffect(() => {
    if (scopes && scopes.length > 0) {
      authorizeHelper(scopes)
    }
  }, [authorizeHelper, scopes])

  return {
    canRead: hasCedarReadPermission(resource) ?? false,
    canWrite: hasCedarWritePermission(resource) ?? false,
    canDelete: hasCedarDeletePermission(resource) ?? false,
  }
}
