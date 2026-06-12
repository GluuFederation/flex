import { useEffect } from 'react'
import { useCedarling } from './useCedarling'
import { useAppSelector } from '@/redux/hooks'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/utility'
import type { AdminUiFeatureResource, ResourcePermission } from '@/cedarling/types'

export const usePermission = (resource: AdminUiFeatureResource): ResourcePermission => {
  const {
    authorizeHelper,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
  } = useCedarling()
  const cedarInitialized = useAppSelector((state) => state.cedarPermissions.initialized)
  const scopes = CEDAR_RESOURCE_SCOPES[resource]

  useEffect(() => {
    if (cedarInitialized && scopes && scopes.length > 0) {
      authorizeHelper(scopes)
    }
  }, [cedarInitialized, authorizeHelper, scopes])

  return {
    canRead: hasCedarReadPermission(resource) ?? false,
    canWrite: hasCedarWritePermission(resource) ?? false,
    canDelete: hasCedarDeletePermission(resource) ?? false,
  }
}
