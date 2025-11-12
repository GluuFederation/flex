import type { ResourceScopeEntry } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import {
  ASSETS_DELETE,
  ASSETS_READ,
  ASSETS_WRITE,
  LICENSE_DETAILS_READ,
  LICENSE_DETAILS_WRITE,
  SCRIPT_DELETE,
  SCRIPT_READ,
  SCRIPT_WRITE,
  STAT_JANS_READ,
  STAT_READ,
  WEBHOOK_DELETE,
  WEBHOOK_READ,
  WEBHOOK_WRITE,
} from '@/utils/PermChecker'

export const CEDAR_RESOURCE_SCOPES: Record<string, ResourceScopeEntry[]> = {
  [ADMIN_UI_RESOURCES.Dashboard]: [
    { permission: STAT_READ, resourceId: ADMIN_UI_RESOURCES.Dashboard },
    { permission: STAT_JANS_READ, resourceId: ADMIN_UI_RESOURCES.Dashboard },
  ],
  [ADMIN_UI_RESOURCES.MAU]: [
    { permission: STAT_READ, resourceId: ADMIN_UI_RESOURCES.MAU },
    { permission: STAT_JANS_READ, resourceId: ADMIN_UI_RESOURCES.MAU },
  ],
  [ADMIN_UI_RESOURCES.License]: [
    { permission: LICENSE_DETAILS_READ, resourceId: ADMIN_UI_RESOURCES.License },
    { permission: LICENSE_DETAILS_WRITE, resourceId: ADMIN_UI_RESOURCES.License },
  ],
  [ADMIN_UI_RESOURCES.Assests]: [
    { permission: ASSETS_READ, resourceId: ADMIN_UI_RESOURCES.Assests },
    { permission: ASSETS_WRITE, resourceId: ADMIN_UI_RESOURCES.Assests },
    { permission: ASSETS_DELETE, resourceId: ADMIN_UI_RESOURCES.Assests },
  ],
  [ADMIN_UI_RESOURCES.Webhooks]: [
    { permission: WEBHOOK_READ, resourceId: ADMIN_UI_RESOURCES.Webhooks },
    { permission: WEBHOOK_WRITE, resourceId: ADMIN_UI_RESOURCES.Webhooks },
    { permission: WEBHOOK_DELETE, resourceId: ADMIN_UI_RESOURCES.Webhooks },
  ],
  [ADMIN_UI_RESOURCES.Scripts]: [
    { permission: SCRIPT_READ, resourceId: ADMIN_UI_RESOURCES.Scripts },
    { permission: SCRIPT_WRITE, resourceId: ADMIN_UI_RESOURCES.Scripts },
    { permission: SCRIPT_DELETE, resourceId: ADMIN_UI_RESOURCES.Scripts },
  ],
} as const

export const CEDARLING_CONSTANTS = {
  ACTION_TYPE: 'Gluu::Flex::AdminUI::Action::',
  RESOURCE_TYPE: 'Gluu::Flex::AdminUI::Resources::Features',
} as const
