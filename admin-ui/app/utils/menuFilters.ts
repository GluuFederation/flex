import { CEDARLING_BYPASS } from '@/cedarling/constants'
import { ROUTES } from '@/helpers/navigation'
import { JANS_SERVICES } from '@/constants'
import { logger } from '@/utils/logger'
import type { MenuItem, VisibilityConditions } from '@/components/Sidebar'
import type {
  AdminUiFeatureResource,
  ResourceScopeEntry,
  AuthorizationResult,
} from '@/cedarling/types'

export const MENU_VISIBILITY_CONDITIONS: VisibilityConditions = {
  [ROUTES.JANS_LOCK_BASE]: JANS_SERVICES.LOCK,
  [ROUTES.FIDO_BASE]: JANS_SERVICES.FIDO2,
  [ROUTES.SCIM_BASE]: JANS_SERVICES.SCIM,
  [ROUTES.SAML_BASE]: JANS_SERVICES.KEYCLOAK,
} as const

type HealthService = { name: string; status?: string }

type AuthorizeHelper = (scopes: ResourceScopeEntry[]) => Promise<AuthorizationResult[]>

export const filterMenusByHealth = (
  menus: MenuItem[],
  services: ReadonlyArray<HealthService>,
): MenuItem[] =>
  menus.filter((menu) => {
    const healthKey = menu.path
      ? MENU_VISIBILITY_CONDITIONS[menu.path as keyof VisibilityConditions]
      : undefined
    if (!healthKey) {
      return true
    }
    return services.find((service) => service.name === healthKey)?.status === 'up'
  })

export const filterMenusByAuth = async (
  menus: MenuItem[],
  authorizeHelper: AuthorizeHelper,
): Promise<MenuItem[]> => {
  const evaluations = await Promise.all(
    menus.map(async (item): Promise<MenuItem | null> => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        const children = await filterMenusByAuth(item.children, authorizeHelper)
        return children.length > 0 ? { ...item, children } : null
      }
      if (item.action) {
        if (item.resourceKey === CEDARLING_BYPASS) {
          return item
        }
        if (!item.resourceKey) {
          logger('[Menu] Missing resourceKey for menu item', item.path ?? item.title)
          return null
        }
        const [result] = await authorizeHelper([
          { action: item.action, resourceId: item.resourceKey as AdminUiFeatureResource },
        ])
        return result?.isAuthorized ? item : null
      }
      return item
    }),
  )
  return evaluations.filter((x): x is MenuItem => !!x)
}

export const findFirstLeafPath = (menus: MenuItem[]): string | null => {
  for (const item of menus) {
    if (item.children && item.children.length > 0) {
      const childPath = findFirstLeafPath(item.children)
      if (childPath) {
        return childPath
      }
    } else if (item.path) {
      return item.path
    }
  }
  return null
}
