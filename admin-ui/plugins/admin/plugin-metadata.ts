import HealthPage from './components/Health/HealthPage'
import MappingPage from './components/Mapping/MappingPage'

import SettingsPage from './components/Settings/SettingsPage'
import MauGraph from './components/MAU/MauGraph'
import WebhookListPage from './components/Webhook/WebhookListPage'
import AuditListPage from '../admin/components/Audit/AuditListPage'

import apiRoleSaga from './redux/sagas/ApiRoleSaga'
import apiPermissionSaga from './redux/sagas/ApiPermissionSaga'
import mappingSaga from './redux/sagas/MappingSaga'
import webhookSaga from './redux/sagas/WebhookSaga'
import assetSaga from './redux/sagas/AssetSaga'

import { reducer as apiRoleReducer } from 'Plugins/admin/redux/features/apiRoleSlice'
import { reducer as apiConfigReducer } from 'Plugins/admin/redux/features/apiConfigSlice'
import { reducer as apiPermissionReducer } from 'Plugins/admin/redux/features/apiPermissionSlice'
import { reducer as mappingReducer } from 'Plugins/admin/redux/features/mappingSlice'
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
} from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES, CEDARLING_BYPASS } from '@/cedarling/utility'
import WebhookAddPage from './components/Webhook/WebhookAddPage'
import WebhookEditPage from './components/Webhook/WebhookEditPage'
import JansAssetListPage from './components/Assets/JansAssetListPage'
import JansAssetEditPage from './components/Assets/JansAssetEditPage'
import JansAssetAddPage from './components/Assets/JansAssetAddPage'
import DashboardPage from '../../app/routes/Dashboards/DashboardPage'
import LicenseDetailsPage from '../../app/routes/License/LicenseDetailsPage'
import CedarlingConfigPage from './components/Cedarling/CedarlingConfigPage'
import { ROUTES } from '@/helpers/navigation'

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
      component: DashboardPage,
      path: ROUTES.ADMIN_DASHBOARD,
      permission: STAT_READ,
      resourceKey: ADMIN_UI_RESOURCES.Dashboard,
    },
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
      component: MauGraph,
      path: ROUTES.ADMIN_MAU_GRAPH,
      permission: ACR_READ,
      resourceKey: ADMIN_UI_RESOURCES.MAU,
    },
    {
      component: SettingsPage,
      path: ROUTES.ADMIN_SETTINGS,
      permission: ACR_READ,
      resourceKey: ADMIN_UI_RESOURCES.Settings,
    },

    {
      component: MappingPage,
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
      component: JansAssetListPage,
      path: ROUTES.ASSETS_LIST,
      permission: ASSETS_READ,
      resourceKey: ADMIN_UI_RESOURCES.Assets,
    },
    {
      component: JansAssetAddPage,
      path: ROUTES.ASSET_ADD,
      permission: ASSETS_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Assets,
    },
    {
      component: JansAssetEditPage,
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
    { name: 'apiConfigReducer', reducer: apiConfigReducer },
    { name: 'apiRoleReducer', reducer: apiRoleReducer },
    { name: 'apiPermissionReducer', reducer: apiPermissionReducer },
    { name: 'mappingReducer', reducer: mappingReducer },
    { name: 'webhookReducer', reducer: webhookReducer },
    { name: 'assetReducer', reducer: assetReducer },
  ],
  sagas: [apiRoleSaga(), apiPermissionSaga(), mappingSaga(), webhookSaga(), assetSaga()],
}

export default pluginMetadata
