import HealthPage from './components/Health/HealthPage'
import ReportPage from './components/Reports/ReportPage'
import LicenseDetailsPage from './components/Configuration/LicenseDetailsPage'
import UiRoleListPage from './components/Roles/UiRoleListPage'
import UiPermListPage from './components/Permissions/UiPermListPage'
import RoleMappingPage from './components/Mapping/RoleMappingPage'
import MonthlyActiveUsersPage from './components/MonthlyActiveUsersPage'
import ScriptListPage from './components/CustomScripts/ScriptListPage'
import CustomScriptAddPage from './components/CustomScripts/CustomScriptAddPage'
import CustomScriptEditPage from './components/CustomScripts/CustomScriptEditPage'
import SettingsPage from './components/Settings/SettingsPage'

import mauSaga from './redux/sagas/MauSaga'
import scriptSaga from './redux/sagas/CustomScriptSaga'
import licenseDetailsSaga from './redux/sagas/LicenseDetailsSaga'
import apiRoleSaga from './redux/sagas/ApiRoleSaga'
import apiPermissionSaga from './redux/sagas/ApiPermissionSaga'
import roleMappingSaga from './redux/sagas/RoleMappingSaga'

import mauReducer from './redux/reducers/MauReducer'
import scriptReducer from './redux/reducers/CustomScriptReducer'
import apiRoleReducer from './redux/reducers/ApiRoleReducer'
import apiPermissionReducer from './redux/reducers/ApiPermissionReducer'
import licenseDetailsReducer from './redux/reducers/LicenseDetailsReducer'
import apiMappingReducer from './redux/reducers/ApiMappingReducer'
import {
  ACR_READ,
  ROLE_READ,
  PERMISSION_READ,
  SCRIPT_READ,
  SCRIPT_WRITE,
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
          title: 'menus.mau',
          path: PLUGIN_BASE_APTH + '/mau',
          permission: ACR_READ,
        },
        {
          title: 'menus.config-api',
          children: [
            {
              title: 'menus.api.roles',
              path: PLUGIN_BASE_APTH + '/roles',
              permission: ACR_READ,
            },
            {
              title: 'menus.api.permissions',
              path: PLUGIN_BASE_APTH + '/permissions',
              permission: ACR_READ,
            },
            {
              title: 'menus.api.mapping',
              path: PLUGIN_BASE_APTH + '/mapping',
              permission: ACR_READ,
            },
          ],
        },
        {
          title: 'menus.scripts',
          path: PLUGIN_BASE_APTH + '/scripts',
          permission: SCRIPT_READ,
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
      component: MonthlyActiveUsersPage,
      path: PLUGIN_BASE_APTH + '/mau',
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
      component: RoleMappingPage,
      path: PLUGIN_BASE_APTH + '/mapping',
      permission: PERMISSION_READ,
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
  ],
  reducers: [
    { name: 'mauReducer', reducer: mauReducer },
    { name: 'scriptReducer', reducer: scriptReducer },
    { name: 'apiRoleReducer', reducer: apiRoleReducer },
    { name: 'apiPermissionReducer', reducer: apiPermissionReducer },
    { name: 'licenseDetailsReducer', reducer: licenseDetailsReducer },
    { name: 'apiMappingReducer', reducer: apiMappingReducer },
  ],
  sagas: [
    mauSaga(),
    scriptSaga(),
    licenseDetailsSaga(),
    apiRoleSaga(),
    apiPermissionSaga(),
    roleMappingSaga(),
  ],
}

export default pluginMetadata
