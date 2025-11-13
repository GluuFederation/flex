import HealthPage from './components/Health/HealthPage'
import UiRoleListPage from './components/Roles/UiRoleListPage'
import UiPermListPage from './components/Permissions/UiPermListPage'
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
import auditSaga from '../admin/redux/sagas/AuditSaga'

import { reducer as apiRoleReducer } from 'Plugins/admin/redux/features/apiRoleSlice'
import { reducer as apiPermissionReducer } from 'Plugins/admin/redux/features/apiPermissionSlice'
import { reducer as mappingReducer } from 'Plugins/admin/redux/features/mappingSlice'
import webhookReducer from 'Plugins/admin/redux/features/WebhookSlice'
import { reducer as assetReducer } from 'Plugins/admin/redux/features/AssetSlice'
import auditReducer from '../admin/redux/features/auditSlice'

import {
  ACR_READ,
  ROLE_READ,
  PERMISSION_READ,
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
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import WebhookAddPage from './components/Webhook/WebhookAddPage'
import WebhookEditPage from './components/Webhook/WebhookEditPage'
import JansAssetListPage from './components/Assets/JansAssetListPage'
import JansAssetEditPage from './components/Assets/JansAssetEditPage'
import JansAssetAddPage from './components/Assets/JansAssetAddPage'
import DashboardPage from '../../app/routes/Dashboards/DashboardPage'
import LicenseDetailsPage from '../../app/routes/License/LicenseDetailsPage'

const PLUGIN_BASE_PATH = '/adm'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.home',
      icon: 'home',
      children: [
        {
          title: 'menus.dashboard',
          path: PLUGIN_BASE_PATH + '/dashboard',
          permission: STAT_READ,
          resourceKey: ADMIN_UI_RESOURCES.Dashboard,
        },
        {
          title: 'menus.health',
          path: PLUGIN_BASE_PATH + '/health',
          permission: PROPERTIES_READ,
          resourceKey: ADMIN_UI_RESOURCES.Health,
        },
        {
          title: 'menus.licenseDetails',
          path: PLUGIN_BASE_PATH + '/licenseDetails',
          permission: LICENSE_DETAILS_READ,
          resourceKey: ADMIN_UI_RESOURCES.License,
        },
        {
          title: 'menus.maugraph',
          path: PLUGIN_BASE_PATH + '/maugraph',
          permission: ACR_READ,
          resourceKey: ADMIN_UI_RESOURCES.MAU,
        },
        {
          title: 'menus.settings',
          path: PLUGIN_BASE_PATH + '/settings',
          permission: ACR_READ,
          resourceKey: ADMIN_UI_RESOURCES.Settings,
        },
        {
          title: 'menus.security',
          children: [
            {
              title: 'menus.securityDropdown.adminUiRoles',
              path: PLUGIN_BASE_PATH + '/roles',
              permission: ROLE_READ,
              resourceKey: ADMIN_UI_RESOURCES.Security,
            },
            {
              title: 'menus.securityDropdown.capabilities',
              path: PLUGIN_BASE_PATH + '/capabilities',
              permission: PERMISSION_READ,
              resourceKey: ADMIN_UI_RESOURCES.Security,
            },
            {
              title: 'menus.securityDropdown.mapping',
              path: PLUGIN_BASE_PATH + '/mapping',
              permission: MAPPING_READ,
              resourceKey: ADMIN_UI_RESOURCES.Security,
            },
          ],
        },

        {
          title: 'menus.webhooks',
          path: PLUGIN_BASE_PATH + '/webhook',
          permission: WEBHOOK_READ,
          resourceKey: ADMIN_UI_RESOURCES.Webhooks,
        },
        {
          title: 'menus.assets',
          path: PLUGIN_BASE_PATH + '/assets',
          permission: ASSETS_READ,
          resourceKey: ADMIN_UI_RESOURCES.Assets,
        },
        {
          title: 'menus.audit_logs',
          path: PLUGIN_BASE_PATH + '/audit-logs',
          permission: LOGGING_READ,
          resourceKey: ADMIN_UI_RESOURCES.AuditLogs,
        },
      ],
    },
  ],
  routes: [
    {
      component: DashboardPage,
      path: PLUGIN_BASE_PATH + '/dashboard',
      permission: STAT_READ,
      resourceKey: ADMIN_UI_RESOURCES.Dashboard,
    },
    {
      component: HealthPage,
      path: PLUGIN_BASE_PATH + '/health',
      permission: PROPERTIES_READ,
      resourceKey: ADMIN_UI_RESOURCES.Health,
    },
    {
      component: LicenseDetailsPage,
      path: PLUGIN_BASE_PATH + '/licenseDetails',
      permission: LICENSE_DETAILS_READ,
      resourceKey: ADMIN_UI_RESOURCES.License,
    },
    {
      component: MauGraph,
      path: PLUGIN_BASE_PATH + '/maugraph',
      permission: ACR_READ,
      resourceKey: ADMIN_UI_RESOURCES.MAU,
    },
    {
      component: SettingsPage,
      path: PLUGIN_BASE_PATH + '/settings',
      permission: ACR_READ,
      resourceKey: ADMIN_UI_RESOURCES.Settings,
    },

    {
      component: UiRoleListPage,
      path: PLUGIN_BASE_PATH + '/roles',
      permission: ROLE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Security,
    },
    {
      component: UiPermListPage,
      path: PLUGIN_BASE_PATH + '/capabilities',
      permission: PERMISSION_READ,
      resourceKey: ADMIN_UI_RESOURCES.Security,
    },
    {
      component: MappingPage,
      path: PLUGIN_BASE_PATH + '/mapping',
      permission: MAPPING_READ,
      resourceKey: ADMIN_UI_RESOURCES.Security,
    },

    {
      component: WebhookListPage,
      path: PLUGIN_BASE_PATH + '/webhook',
      permission: WEBHOOK_READ,
      resourceKey: ADMIN_UI_RESOURCES.Webhooks,
    },
    {
      component: WebhookAddPage,
      path: PLUGIN_BASE_PATH + '/webhook/add',
      permission: WEBHOOK_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Webhooks,
    },
    {
      component: WebhookEditPage,
      path: PLUGIN_BASE_PATH + '/webhook/edit/:id',
      permission: WEBHOOK_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Webhooks,
    },
    {
      component: JansAssetListPage,
      path: PLUGIN_BASE_PATH + '/assets',
      permission: ASSETS_READ,
      resourceKey: ADMIN_UI_RESOURCES.Assets,
    },
    {
      component: JansAssetAddPage,
      path: PLUGIN_BASE_PATH + '/asset/add',
      permission: ASSETS_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Assets,
    },
    {
      component: JansAssetEditPage,
      path: PLUGIN_BASE_PATH + '/asset/edit/:id',
      permission: ASSETS_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Assets,
    },
    {
      component: AuditListPage,
      path: PLUGIN_BASE_PATH + '/audit-logs',
      permission: LOGGING_READ,
      resourceKey: ADMIN_UI_RESOURCES.AuditLogs,
    },
  ],
  reducers: [
    { name: 'apiRoleReducer', reducer: apiRoleReducer },
    { name: 'apiPermissionReducer', reducer: apiPermissionReducer },
    { name: 'mappingReducer', reducer: mappingReducer },
    { name: 'auditReducer', reducer: auditReducer },
    { name: 'webhookReducer', reducer: webhookReducer },
    { name: 'assetReducer', reducer: assetReducer },
  ],
  sagas: [
    apiRoleSaga(),
    auditSaga(),
    apiPermissionSaga(),
    mappingSaga(),
    webhookSaga(),
    assetSaga(),
  ],
}

export default pluginMetadata
