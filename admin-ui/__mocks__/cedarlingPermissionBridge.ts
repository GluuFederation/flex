import { useCedarling } from '@/cedarling/hooks/useCedarling'
import type {
  AdminUiFeatureResource,
  ResourcePermission,
  UseCedarlingReturn,
} from '@/cedarling/types'

export const usePermission = (resource: AdminUiFeatureResource): ResourcePermission => {
  const cedar: Partial<UseCedarlingReturn> = useCedarling()
  return {
    canRead: cedar.hasCedarReadPermission?.(resource) ?? false,
    canWrite: cedar.hasCedarWritePermission?.(resource) ?? false,
    canDelete: cedar.hasCedarDeletePermission?.(resource) ?? false,
  }
}
