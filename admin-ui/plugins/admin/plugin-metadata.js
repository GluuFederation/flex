import HealthPage from './components/Health/HealthPage'
import ReportPage from './components/Reports/ReportPage'
import LicenseDetailsPage from './components/Configuration/LicenseDetailsPage'
import UserList from './components/UserManagement/UserList'
import UiRoleListPage from './components/Roles/UiRoleListPage'
import UiPermListPage from './components/Permissions/UiPermListPage'
import MappingPage from './components/Mapping/MappingPage'
import ScriptListPage from './components/CustomScripts/ScriptListPage'
import CustomScriptAddPage from './components/CustomScripts/CustomScriptAddPage'
import CustomScriptEditPage from './components/CustomScripts/CustomScriptEditPage'
import SettingsPage from './components/Settings/SettingsPage'
import MauGraph from './components/MAU/MauGraph'

import scriptSaga from './redux/sagas/CustomScriptSaga'
import licenseDetailsSaga from './redux/sagas/LicenseDetailsSaga'
import apiRoleSaga from './redux/sagas/ApiRoleSaga'
import apiPermissionSaga from './redux/sagas/ApiPermissionSaga'
import mappingSaga from './redux/sagas/MappingSaga'
import userSaga from './redux/sagas/UserSaga'

import scriptReducer from './redux/reducers/CustomScriptReducer'
import apiRoleReducer from './redux/reducers/ApiRoleReducer'
import apiPermissionReducer from './redux/reducers/ApiPermissionReducer'
import licenseDetailsReducer from './redux/reducers/LicenseDetailsReducer'
import mappingReducer from './redux/reducers/MappingReducer'
import userReducer from './redux/reducers/UserReducer'
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
          title: 'menus.licenseDetails',
          path: PLUGIN_BASE_APTH + '/licenseDetails',
          permission: ACR_READ,
        },
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
        {
          title: 'menus.user_management',
          path: PLUGIN_BASE_APTH + '/usermanagement',
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
    {
      component: LicenseDetailsPage,
      path: PLUGIN_BASE_APTH + '/licenseDetails',
      permission: ACR_READ,
    },
    {
      component: UserList,
      path: PLUGIN_BASE_APTH + '/usermanagement',
      permission: ACR_READ,
    },
  ],
  reducers: [
    { name: 'scriptReducer', reducer: scriptReducer },
    { name: 'apiRoleReducer', reducer: apiRoleReducer },
    { name: 'apiPermissionReducer', reducer: apiPermissionReducer },
    { name: 'licenseDetailsReducer', reducer: licenseDetailsReducer },
    { name: 'mappingReducer', reducer: mappingReducer },
    { name: 'userReducer', reducer: userReducer },
  ],
  sagas: [
    scriptSaga(),
    licenseDetailsSaga(),
    apiRoleSaga(),
    apiPermissionSaga(),
    mappingSaga(),
    userSaga(),
  ],
}

export default pluginMetadata
