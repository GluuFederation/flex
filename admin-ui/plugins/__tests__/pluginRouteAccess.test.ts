import plugins from '../../plugins.config.json'
import admin from '../admin/plugin-metadata'
import authServer from '../auth-server/plugin-metadata'
import userManagement from '../user-management/plugin-metadata'
import scripts from '../scripts/plugin-metadata'
import userClaims from '../user-claims/plugin-metadata'
import services from '../services/plugin-metadata'
import smtp from '../smtp/plugin-metadata'
import scim from '../scim/plugin-metadata'
import fido from '../fido/plugin-metadata'
import jansLock from '../jans-lock/plugin-metadata'
import { RESOURCE_ACTIONS, CEDARLING_BYPASS } from '@/cedarling/constants'
import type { PluginRoute } from '../internal'

type RouteAccess = Pick<PluginRoute, 'path' | 'resourceKey' | 'action'>

const METADATA: Record<string, { routes?: readonly RouteAccess[] }> = {
  './admin/plugin-metadata': admin,
  './auth-server/plugin-metadata': authServer,
  './user-management/plugin-metadata': userManagement,
  './scripts/plugin-metadata': scripts,
  './user-claims/plugin-metadata': userClaims,
  './services/plugin-metadata': services,
  './smtp/plugin-metadata': smtp,
  './scim/plugin-metadata': scim,
  './fido/plugin-metadata': fido,
  './jans-lock/plugin-metadata': jansLock,
}

describe('plugin route permissions', () => {
  it('covers every configured plugin', () => {
    expect(Object.keys(METADATA).sort()).toEqual(plugins.map((p) => p.metadataFile).sort())
  })

  const routes = Object.values(METADATA).flatMap((m) => m.routes ?? [])

  it.each(routes.map((r) => [r.path, r] as const))(
    '%s declares a permission Cedarling evaluates',
    (_path, route) => {
      expect(route.resourceKey).toBeDefined()
      expect(route.action).toBeDefined()
      if (route.resourceKey === undefined || route.resourceKey === CEDARLING_BYPASS) return
      expect(RESOURCE_ACTIONS[route.resourceKey]).toContain(route.action)
    },
  )
})
