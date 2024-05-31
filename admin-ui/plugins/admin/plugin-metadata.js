import HealthPage from './components/Health/HealthPage'
import ReportPage from './components/Reports/ReportPage'
import UiRoleListPage from './components/Roles/UiRoleListPage'
import UiPermListPage from './components/Permissions/UiPermListPage'
import MappingPage from './components/Mapping/MappingPage'
import ScriptListPage from './components/CustomScripts/ScriptListPage'
import CustomScriptAddPage from './components/CustomScripts/CustomScriptAddPage'
import CustomScriptEditPage from './components/CustomScripts/CustomScriptEditPage'
import SettingsPage from './components/Settings/SettingsPage'
import MauGraph from './components/MAU/MauGraph'
import WebhookListPage from './components/Webhook/WebhookListPage'

import scriptSaga from './redux/sagas/CustomScriptSaga'
import apiRoleSaga from './redux/sagas/ApiRoleSaga'
import apiPermissionSaga from './redux/sagas/ApiPermissionSaga'
import mappingSaga from './redux/sagas/MappingSaga'
import webhookSaga from './redux/sagas/WebhookSaga'
import configApiSaga from './redux/sagas/configApiSaga'

import { reducer as scriptReducer } from 'Plugins/admin/redux/features/customScriptSlice'
import { reducer as apiRoleReducer } from 'Plugins/admin/redux/features/apiRoleSlice'
import { reducer as apiPermissionReducer } from 'Plugins/admin/redux/features/apiPermissionSlice'
import { reducer as mappingReducer } from 'Plugins/admin/redux/features/mappingSlice'
import webhookReducer from 'Plugins/admin/redux/features/WebhookSlice'
import configApiReducer from 'Plugins/admin/redux/features/configApiSlice'
import {
  ACR_READ,
  ROLE_READ,
  PERMISSION_READ,
  SCRIPT_READ,
  SCRIPT_WRITE,
  MAPPING_READ,
  WEBHOOK_READ,
  WEBHOOK_WRITE,
  API_CONFIG_READ
} from 'Utils/PermChecker'
import WebhookAddPage from './components/Webhook/WebhookAddPage'
import WebhookEditPage from './components/Webhook/WebhookEditPage'
import ConfigApiPage from './components/Configuration/ConfigApiPage'

const PLUGIN_BASE_APTH = '/adm'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.adminui',
      icon: 'admin',
      children: [
        {
          title: 'menus.config-api',
          children: [
            {
              title: 'menus.api.roles',
              path: PLUGIN_BASE_APTH + '/roles',
              permission: ROLE_READ,
            },
            {
              title: 'menus.api.permissions',
              path: PLUGIN_BASE_APTH + '/permissions',
              permission: PERMISSION_READ,
            },
            {
              title: 'menus.api.mapping',
              path: PLUGIN_BASE_APTH + '/mapping',
              permission: MAPPING_READ,
            },
            {
              title: 'menus.api.api_config',
              path: PLUGIN_BASE_APTH + '/config-api-configuration',
              permission: API_CONFIG_READ,
            },
          ],
        },
        {
          title: 'menus.scripts',
          path: PLUGIN_BASE_APTH + '/scripts',
          permission: SCRIPT_READ,
        },
        {
          title: 'menus.maugraph',
          path: PLUGIN_BASE_APTH + '/maugraph',
          permission: ACR_READ,
        },
        {
          title: 'menus.settings',
          path: PLUGIN_BASE_APTH + '/settings',
          permission: ACR_READ,
        },
        {
          title: 'menus.webhooks',
          path: PLUGIN_BASE_APTH + '/webhook',
          permission: WEBHOOK_READ,
        },
      ],
    },
  ],
  routes: [
    {
      component: MauGraph,
      path: PLUGIN_BASE_APTH + '/maugraph',
      permission: ACR_READ,
    },
    {
      component: HealthPage,
      path: PLUGIN_BASE_APTH + '/health',
      permission: ACR_READ,
    },
    {
      component: ReportPage,
      path: PLUGIN_BASE_APTH + '/reports',
      permission: ACR_READ,
    },
    {
      component: UiRoleListPage,
      path: PLUGIN_BASE_APTH + '/roles',
      permission: ROLE_READ,
    },
    {
      component: UiPermListPage,
      path: PLUGIN_BASE_APTH + '/permissions',
      permission: PERMISSION_READ,
    },
    {
      component: MappingPage,
      path: PLUGIN_BASE_APTH + '/mapping',
      permission: MAPPING_READ,
    },
    {
      component: ScriptListPage,
      path: PLUGIN_BASE_APTH + '/scripts',
      permission: SCRIPT_READ,
    },
    {
      component: CustomScriptAddPage,
      path: PLUGIN_BASE_APTH + '/script/new',
      permission: SCRIPT_WRITE,
    },
    {
      component: CustomScriptEditPage,
      path: PLUGIN_BASE_APTH + '/script/edit/:id',
      permission: SCRIPT_READ,
    },
    {
      component: SettingsPage,
      path: PLUGIN_BASE_APTH + '/settings',
      permission: ACR_READ,
    },
    {
      component: WebhookListPage,
      path: PLUGIN_BASE_APTH + '/webhook',
      permission: WEBHOOK_READ,
    },
    {
      component: WebhookAddPage,
      path: PLUGIN_BASE_APTH + '/webhook/add',
      permission: WEBHOOK_WRITE,
    },
    {
      component: WebhookEditPage,
      path: PLUGIN_BASE_APTH + '/webhook/edit/:id',
      permission: WEBHOOK_WRITE,
    },
    {
      component: ConfigApiPage,
      path: PLUGIN_BASE_APTH + '/config-api-configuration',
      permission: API_CONFIG_READ,
    },
  ],
  reducers: [
    { name: 'scriptReducer', reducer: scriptReducer },
    { name: 'apiRoleReducer', reducer: apiRoleReducer },
    { name: 'apiPermissionReducer', reducer: apiPermissionReducer },
    { name: 'mappingReducer', reducer: mappingReducer },
    { name: 'webhookReducer', reducer: webhookReducer },
    { name: 'configApiReducer', reducer: configApiReducer },
  ],
  sagas: [scriptSaga(), apiRoleSaga(), apiPermissionSaga(), mappingSaga(), webhookSaga(), configApiSaga()],
}

export default pluginMetadata
