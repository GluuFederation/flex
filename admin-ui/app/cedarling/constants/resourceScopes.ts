import type { ResourceScopeEntry } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import {
  ASSETS_DELETE,
  ASSETS_READ,
  ASSETS_WRITE,
  CACHE_DELETE,
  CACHE_READ,
  CACHE_WRITE,
  FIDO_DELETE,
  FIDO_READ,
  FIDO_WRITE,
  JANS_LOCK_READ,
  JANS_LOCK_WRITE,
  LICENSE_DETAILS_READ,
  LICENSE_DETAILS_WRITE,
  PERSISTENCE_DETAIL,
  SCIM_CONFIG_READ,
  SCIM_CONFIG_WRITE,
  SCRIPT_DELETE,
  SCRIPT_READ,
  SCRIPT_WRITE,
  SMTP_DELETE,
  SMTP_READ,
  SMTP_WRITE,
  STAT_JANS_READ,
  STAT_READ,
  SAML_READ,
  SAML_WRITE,
  SAML_DELETE,
  SAML_TR_READ,
  SAML_TR_WRITE,
  SAML_CONFIG_READ,
  SAML_CONFIG_WRITE,
  ATTRIBUTE_READ,
  ATTRIBUTE_WRITE,
  ATTRIBUTE_DELETE,
  USER_READ,
  USER_WRITE,
  USER_DELETE,
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
  [ADMIN_UI_RESOURCES.Assets]: [
    { permission: ASSETS_READ, resourceId: ADMIN_UI_RESOURCES.Assets },
    { permission: ASSETS_WRITE, resourceId: ADMIN_UI_RESOURCES.Assets },
    { permission: ASSETS_DELETE, resourceId: ADMIN_UI_RESOURCES.Assets },
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
  [ADMIN_UI_RESOURCES.Cache]: [
    { permission: CACHE_READ, resourceId: ADMIN_UI_RESOURCES.Cache },
    { permission: CACHE_WRITE, resourceId: ADMIN_UI_RESOURCES.Cache },
    { permission: CACHE_DELETE, resourceId: ADMIN_UI_RESOURCES.Cache },
  ],
  [ADMIN_UI_RESOURCES.Persistence]: [
    { permission: PERSISTENCE_DETAIL, resourceId: ADMIN_UI_RESOURCES.Persistence },
  ],
  [ADMIN_UI_RESOURCES.Lock]: [
    { permission: JANS_LOCK_READ, resourceId: ADMIN_UI_RESOURCES.Lock },
    { permission: JANS_LOCK_WRITE, resourceId: ADMIN_UI_RESOURCES.Lock },
  ],
  [ADMIN_UI_RESOURCES.FIDO]: [
    { permission: FIDO_READ, resourceId: ADMIN_UI_RESOURCES.FIDO },
    { permission: FIDO_WRITE, resourceId: ADMIN_UI_RESOURCES.FIDO },
    { permission: FIDO_DELETE, resourceId: ADMIN_UI_RESOURCES.FIDO },
  ],
  [ADMIN_UI_RESOURCES.SMTP]: [
    { permission: SMTP_READ, resourceId: ADMIN_UI_RESOURCES.SMTP },
    { permission: SMTP_WRITE, resourceId: ADMIN_UI_RESOURCES.SMTP },
    { permission: SMTP_DELETE, resourceId: ADMIN_UI_RESOURCES.SMTP },
  ],
  [ADMIN_UI_RESOURCES.SCIM]: [
    { permission: SCIM_CONFIG_READ, resourceId: ADMIN_UI_RESOURCES.SCIM },
    { permission: SCIM_CONFIG_WRITE, resourceId: ADMIN_UI_RESOURCES.SCIM },
  ],
  [ADMIN_UI_RESOURCES.Users]: [
    { permission: USER_READ, resourceId: ADMIN_UI_RESOURCES.Users },
    { permission: USER_WRITE, resourceId: ADMIN_UI_RESOURCES.Users },
    { permission: USER_DELETE, resourceId: ADMIN_UI_RESOURCES.Users },
  ],
  [ADMIN_UI_RESOURCES.SAML]: [
    { permission: SAML_READ, resourceId: ADMIN_UI_RESOURCES.SAML },
    { permission: SAML_WRITE, resourceId: ADMIN_UI_RESOURCES.SAML },
    { permission: SAML_DELETE, resourceId: ADMIN_UI_RESOURCES.SAML },
    { permission: SAML_TR_READ, resourceId: ADMIN_UI_RESOURCES.SAML },
    { permission: SAML_TR_WRITE, resourceId: ADMIN_UI_RESOURCES.SAML },
    { permission: SAML_CONFIG_READ, resourceId: ADMIN_UI_RESOURCES.SAML },
    { permission: SAML_CONFIG_WRITE, resourceId: ADMIN_UI_RESOURCES.SAML },
  ],
  [ADMIN_UI_RESOURCES.UserClaims]: [
    { permission: ATTRIBUTE_READ, resourceId: ADMIN_UI_RESOURCES.UserClaims },
    { permission: ATTRIBUTE_WRITE, resourceId: ADMIN_UI_RESOURCES.UserClaims },
    { permission: ATTRIBUTE_DELETE, resourceId: ADMIN_UI_RESOURCES.UserClaims },
  ],
} as const

export const CEDARLING_CONSTANTS = {
  ACTION_TYPE: 'Gluu::Flex::AdminUI::Action::',
  RESOURCE_TYPE: 'Gluu::Flex::AdminUI::Resources::Features',
} as const
