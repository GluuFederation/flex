import webhookSaga from './redux/sagas/WebhookSaga'
import assetSaga from './redux/sagas/AssetSaga'

import webhookReducer from 'Plugins/admin/redux/features/WebhookSlice'
import { reducer as assetReducer } from 'Plugins/admin/redux/features/AssetSlice'

import {
  ACR_READ,
  MAPPING_READ,
  WEBHOOK_READ,
  WEBHOOK_WRITE,
  ASSETS_READ,
  ASSETS_WRITE,
  LICENSE_DETAILS_READ,
  LOGGING_READ,
  PROPERTIES_READ,
  STAT_READ,
  FIDO_ADMIN,
} from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES, CEDARLING_BYPASS } from '@/cedarling/utility'
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
const MetricsPage = createLazyRoute(() => import('./components/Metrics/MetricsPage'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.home',
      icon: 'home',
      children: [
        {
          title: 'menus.dashboard',
          path: ROUTES.ADMIN_DASHBOARD,
          permission: STAT_READ,
          resourceKey: ADMIN_UI_RESOURCES.Dashboard,
        },
        {
          title: 'menus.health',
          path: ROUTES.ADMIN_HEALTH,
          permission: PROPERTIES_READ,
          resourceKey: CEDARLING_BYPASS,
        },
        {
          title: 'menus.licenseDetails',
          path: ROUTES.ADMIN_LICENSE_DETAILS,
          permission: LICENSE_DETAILS_READ,
          resourceKey: ADMIN_UI_RESOURCES.License,
        },
        {
          title: 'menus.metrics',
          path: ROUTES.ADMIN_METRICS,
          permission: FIDO_ADMIN,
          resourceKey: ADMIN_UI_RESOURCES.Metrics,
        },
        {
          title: 'menus.maugraph',
          path: ROUTES.ADMIN_MAU_GRAPH,
          permission: ACR_READ,
          resourceKey: ADMIN_UI_RESOURCES.MAU,
        },
        {
          title: 'menus.settings',
          path: ROUTES.ADMIN_SETTINGS,
          permission: ACR_READ,
          resourceKey: ADMIN_UI_RESOURCES.Settings,
        },
        {
          title: 'menus.security',
          children: [
            {
              title: 'menus.securityDropdown.mapping',
              path: ROUTES.ADMIN_MAPPING,
              permission: MAPPING_READ,
              resourceKey: ADMIN_UI_RESOURCES.Security,
            },
            {
              title: 'menus.securityDropdown.cedarlingConfig',
              path: ROUTES.ADMIN_CEDARLING_CONFIG,
              permission: MAPPING_READ,
              resourceKey: ADMIN_UI_RESOURCES.Security,
            },
          ],
        },

        {
          title: 'menus.webhooks',
          path: ROUTES.WEBHOOK_LIST,
          permission: WEBHOOK_READ,
          resourceKey: ADMIN_UI_RESOURCES.Webhooks,
        },
        {
          title: 'menus.assets',
          path: ROUTES.ASSETS_LIST,
          permission: ASSETS_READ,
          resourceKey: ADMIN_UI_RESOURCES.Assets,
        },
        {
          title: 'menus.audit_logs',
          path: ROUTES.ADMIN_AUDIT_LOGS,
          permission: LOGGING_READ,
          resourceKey: ADMIN_UI_RESOURCES.AuditLogs,
        },
      ],
    },
  ],
  routes: [
    {
      component: HealthPage,
      path: ROUTES.ADMIN_HEALTH,
      permission: PROPERTIES_READ,
      resourceKey: CEDARLING_BYPASS,
    },
    {
      component: LicenseDetailsPage,
      path: ROUTES.ADMIN_LICENSE_DETAILS,
      permission: LICENSE_DETAILS_READ,
      resourceKey: ADMIN_UI_RESOURCES.License,
    },
    {
      component: MauPage,
      path: ROUTES.ADMIN_MAU_GRAPH,
      permission: ACR_READ,
      resourceKey: ADMIN_UI_RESOURCES.MAU,
    },
    {
      component: MetricsPage,
      path: ROUTES.ADMIN_METRICS,
      permission: FIDO_ADMIN,
      resourceKey: ADMIN_UI_RESOURCES.Metrics,
    },
    {
      component: SettingsPage,
      path: ROUTES.ADMIN_SETTINGS,
      permission: ACR_READ,
      resourceKey: ADMIN_UI_RESOURCES.Settings,
    },

    {
      component: RolePermissionMappingPage,
      path: ROUTES.ADMIN_MAPPING,
      permission: MAPPING_READ,
    },
    {
      component: CedarlingConfigPage,
      path: ROUTES.ADMIN_CEDARLING_CONFIG,
      permission: PROPERTIES_READ,
    },

    {
      component: WebhookListPage,
      path: ROUTES.WEBHOOK_LIST,
      permission: WEBHOOK_READ,
      resourceKey: ADMIN_UI_RESOURCES.Webhooks,
    },
    {
      component: WebhookAddPage,
      path: ROUTES.WEBHOOK_ADD,
      permission: WEBHOOK_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Webhooks,
    },
    {
      component: WebhookEditPage,
      path: ROUTES.WEBHOOK_EDIT_TEMPLATE,
      permission: WEBHOOK_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Webhooks,
    },
    {
      component: JansAssetListPageLazy,
      path: ROUTES.ASSETS_LIST,
      permission: ASSETS_READ,
      resourceKey: ADMIN_UI_RESOURCES.Assets,
    },
    {
      component: JansAssetAddPageLazy,
      path: ROUTES.ASSET_ADD,
      permission: ASSETS_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Assets,
    },
    {
      component: JansAssetEditPageLazy,
      path: ROUTES.ASSET_EDIT_TEMPLATE,
      permission: ASSETS_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Assets,
    },
    {
      component: AuditListPage,
      path: ROUTES.ADMIN_AUDIT_LOGS,
      permission: LOGGING_READ,
      resourceKey: ADMIN_UI_RESOURCES.AuditLogs,
    },
  ],
  reducers: [
    { name: 'webhookReducer', reducer: webhookReducer },
    { name: 'assetReducer', reducer: assetReducer },
  ],
  sagas: [webhookSaga(), assetSaga()],
}

export default pluginMetadata
