import { setupWebhookListener } from './redux/listeners/webhookListener'

import { reducer as webhookReducer } from 'Plugins/admin/redux/features/WebhookSlice'

import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_ACTIONS, CEDARLING_BYPASS } from '@/cedarling/constants'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const HealthPage = createLazyRoute(() => import('./components/Health/HealthPage'))
const LicenseDetailsPage = createLazyRoute(
  () => import('../../app/routes/License/LicenseDetailsPage'),
)
const MauPage = createLazyRoute(() => import('./components/MAU/MauPage'))
const SettingsPage = createLazyRoute(() => import('./components/Settings/SettingsPage'))
const RolePermissionMappingPage = createLazyRoute(
  () => import('./components/Mapping/RolePermissionMappingPage'),
)
const CedarlingConfigPage = createLazyRoute(
  () => import('./components/Cedarling/CedarlingConfigPage'),
)
const WebhookListPage = createLazyRoute(() => import('./components/Webhook/WebhookListPage'))
const WebhookAddPage = createLazyRoute(() => import('./components/Webhook/WebhookAddPage'))
const WebhookEditPage = createLazyRoute(() => import('./components/Webhook/WebhookEditPage'))
const AuditListPage = createLazyRoute(() => import('../admin/components/Audit/AuditListPage'))
const JansAssetListPageLazy = createLazyRoute(() => import('./components/Assets/JansAssetListPage'))
const JansAssetAddPageLazy = createLazyRoute(() => import('./components/Assets/JansAssetAddPage'))
const JansAssetEditPageLazy = createLazyRoute(() => import('./components/Assets/JansAssetEditPage'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.home',
      icon: 'home',
      children: [
        {
          title: 'menus.dashboard',
          path: ROUTES.ADMIN_DASHBOARD,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Dashboard,
        },
        {
          title: 'menus.health',
          path: ROUTES.ADMIN_HEALTH,
          action: CEDAR_ACTIONS.READ,
          resourceKey: CEDARLING_BYPASS,
        },
        {
          title: 'menus.licenseDetails',
          path: ROUTES.ADMIN_LICENSE_DETAILS,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.License,
        },
        {
          title: 'menus.maugraph',
          path: ROUTES.ADMIN_MAU_GRAPH,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.MAU,
        },
        {
          title: 'menus.settings',
          path: ROUTES.ADMIN_SETTINGS,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Settings,
        },
        {
          title: 'menus.security',
          children: [
            {
              title: 'menus.securityDropdown.mapping',
              path: ROUTES.ADMIN_MAPPING,
              action: CEDAR_ACTIONS.READ,
              resourceKey: ADMIN_UI_RESOURCES.Security,
            },
            {
              title: 'menus.securityDropdown.cedarlingConfig',
              path: ROUTES.ADMIN_CEDARLING_CONFIG,
              action: CEDAR_ACTIONS.READ,
              resourceKey: ADMIN_UI_RESOURCES.Security,
            },
          ],
        },

        {
          title: 'menus.webhooks',
          path: ROUTES.WEBHOOK_LIST,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Webhooks,
        },
        {
          title: 'menus.assets',
          path: ROUTES.ASSETS_LIST,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Assets,
        },
        {
          title: 'menus.audit_logs',
          path: ROUTES.ADMIN_AUDIT_LOGS,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.AuditLogs,
        },
      ],
    },
  ],
  routes: [
    {
      component: HealthPage,
      path: ROUTES.ADMIN_HEALTH,
      action: CEDAR_ACTIONS.READ,
      resourceKey: CEDARLING_BYPASS,
    },
    {
      component: LicenseDetailsPage,
      path: ROUTES.ADMIN_LICENSE_DETAILS,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.License,
    },
    {
      component: MauPage,
      path: ROUTES.ADMIN_MAU_GRAPH,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.MAU,
    },
    {
      component: SettingsPage,
      path: ROUTES.ADMIN_SETTINGS,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Settings,
    },

    {
      component: RolePermissionMappingPage,
      path: ROUTES.ADMIN_MAPPING,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Security,
    },
    {
      component: CedarlingConfigPage,
      path: ROUTES.ADMIN_CEDARLING_CONFIG,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Security,
    },

    {
      component: WebhookListPage,
      path: ROUTES.WEBHOOK_LIST,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Webhooks,
    },
    {
      component: WebhookAddPage,
      path: ROUTES.WEBHOOK_ADD,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Webhooks,
    },
    {
      component: WebhookEditPage,
      path: ROUTES.WEBHOOK_EDIT_TEMPLATE,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Webhooks,
    },
    {
      component: JansAssetListPageLazy,
      path: ROUTES.ASSETS_LIST,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Assets,
    },
    {
      component: JansAssetAddPageLazy,
      path: ROUTES.ASSET_ADD,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Assets,
    },
    {
      component: JansAssetEditPageLazy,
      path: ROUTES.ASSET_EDIT_TEMPLATE,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Assets,
    },
    {
      component: AuditListPage,
      path: ROUTES.ADMIN_AUDIT_LOGS,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.AuditLogs,
    },
  ],
  reducers: [{ name: 'webhookReducer', reducer: webhookReducer }],
  listeners: [setupWebhookListener],
}

export default pluginMetadata
