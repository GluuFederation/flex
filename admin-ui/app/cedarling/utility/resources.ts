import { RESOURCE_ACTIONS } from '@/cedarling/constants'
import type { AdminUiFeatureResource, CedarAction, ResourceScopeEntry } from '@/cedarling/types'

export const ADMIN_UI_RESOURCES = Object.freeze(
  Object.fromEntries(
    (Object.keys(RESOURCE_ACTIONS) as AdminUiFeatureResource[]).map((key) => [key, key]),
  ),
) as Readonly<Record<AdminUiFeatureResource, AdminUiFeatureResource>>

export const buildCedarPermissionKey = (
  resourceId: AdminUiFeatureResource,
  action: CedarAction,
): `${AdminUiFeatureResource}::${CedarAction}` => `${resourceId}::${action}`

export const CEDAR_RESOURCE_SCOPES = Object.fromEntries(
  (Object.keys(RESOURCE_ACTIONS) as AdminUiFeatureResource[]).map((resourceId) => [
    resourceId,
    RESOURCE_ACTIONS[resourceId].map((action) => ({ action, resourceId })),
  ]),
) as Record<AdminUiFeatureResource, ResourceScopeEntry[]>
