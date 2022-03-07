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
import scriptSaga from './redux/sagas/CustomScriptSaga'
import apiRoleSaga from './redux/sagas/ApiRoleSaga'
import apiPermissionSaga from './redux/sagas/ApiPermissionSaga'
import mappingSaga from './redux/sagas/MappingSaga'

import scriptReducer from './redux/reducers/CustomScriptReducer'
import apiRoleReducer from './redux/reducers/ApiRoleReducer'
import apiPermissionReducer from './redux/reducers/ApiPermissionReducer'
import mappingReducer from './redux/reducers/MappingReducer'
import {
  ACR_READ,
  ROLE_READ,
  PERMISSION_READ,
  SCRIPT_READ,
  SCRIPT_WRITE,
  MAPPING_READ,
} from '../../app/utils/PermChecker'

const PLUGIN_BASE_APTH = '/adm'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.adminui',
      icon: 'fa-cubes',
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
      path: PLUGIN_BASE_APTH + '/script/edit:id',
      permission: SCRIPT_WRITE,
    },
    {
      component: SettingsPage,
      path: PLUGIN_BASE_APTH + '/settings',
      permission: ACR_READ,
    },
  ],
  reducers: [
    { name: 'scriptReducer', reducer: scriptReducer },
    { name: 'apiRoleReducer', reducer: apiRoleReducer },
    { name: 'apiPermissionReducer', reducer: apiPermissionReducer },
    { name: 'mappingReducer', reducer: mappingReducer },
  ],
  sagas: [
    scriptSaga(),
    apiRoleSaga(),
    apiPermissionSaga(),
    mappingSaga(),
  ],
}

export default pluginMetadata
