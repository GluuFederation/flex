import HealthPage from './components/Health/HealthPage'
import ReportPage from './components/Reports/ReportPage'
import LicenseDetailsPage from './components/Configuration/LicenseDetailsPage'
import UiRoleListPage from './components/Roles/UiRoleListPage'
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

import mauReducer from './redux/reducers/MauReducer'
import scriptReducer from './redux/reducers/CustomScriptReducer'
import apiRoleReducer from './redux/reducers/ApiRoleReducer'
import apiPermissionReducer from './redux/reducers/ApiPermissionReducer'
import licenseDetailsReducer from './redux/reducers/LicenseDetailsReducer'

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
          permission: '/config/acrs.readonly',
        },
        {
          title: 'menus.mau',
          path: PLUGIN_BASE_APTH + '/mau',
          permission: '/config/acrs.readonly',
        },
        {
          title: 'menus.config-api',
          children: [
            {
              title: 'menus.api.roles',
              path: PLUGIN_BASE_APTH + '/roles',
              permission: '/config/acrs.readonly',
            },
            {
              title: 'menus.api.permissions',
              path: PLUGIN_BASE_APTH + '/permissions',
              permission: '/config/acrs.readonly',
            },
            {
              title: 'menus.api.mapping',
              path: PLUGIN_BASE_APTH + '/mapping',
              permission: '/config/acrs.readonly',
            },
          ],
        },
        {
          title: 'menus.scripts',
          path: PLUGIN_BASE_APTH + '/scripts',
          permission: '/config/scripts.readonly',
        },
        {
          title: 'menus.settings',
          path: PLUGIN_BASE_APTH + '/settings',
          permission: '/config/acrs.readonly',
        },
      ],
    },
  ],
  routes: [
    {
      component: HealthPage,
      path: PLUGIN_BASE_APTH + '/health',
      permission: '/config/acrs.readonly',
    },
    {
      component: ReportPage,
      path: PLUGIN_BASE_APTH + '/reports',
      permission: '/config/acrs.readonly',
    },
    {
      component: MonthlyActiveUsersPage,
      path: PLUGIN_BASE_APTH + '/mau',
      permission: '/config/acrs.readonly',
    },
    {
      component: UiRoleListPage,
      path: PLUGIN_BASE_APTH + '/roles',
      permission: '/config/acrs.readonly',
    },
    {
      component: UiRoleListPage,
      path: PLUGIN_BASE_APTH + '/permissions',
      permission: '/config/acrs.readonly',
    },
    {
      component: UiRoleListPage,
      path: PLUGIN_BASE_APTH + '/mapping',
      permission: '/config/acrs.readonly',
    },
    {
      component: ScriptListPage,
      path: PLUGIN_BASE_APTH + '/scripts',
      permission: '/config/scripts.readonly',
    },
    {
      component: CustomScriptAddPage,
      path: PLUGIN_BASE_APTH + '/script/new',
      permission: '/config/scripts.write',
    },
    {
      component: CustomScriptEditPage,
      path: PLUGIN_BASE_APTH + '/script/edit:id',
      permission: '/config/scripts.write',
    },
    {
      component: SettingsPage,
      path: PLUGIN_BASE_APTH + '/settings',
      permission: '/config/acrs.readonly',
    },
    {
      component: LicenseDetailsPage,
      path: PLUGIN_BASE_APTH + '/licenseDetails',
      permission: '/config/acrs.readonly',
    },
  ],
  reducers: [
    { name: 'mauReducer', reducer: mauReducer },
    { name: 'scriptReducer', reducer: scriptReducer },
    { name: 'apiRoleReducer', reducer: apiRoleReducer },
    { name: 'apiPermissionReducer', reducer: apiPermissionReducer },
    { name: 'licenseDetailsReducer', reducer: licenseDetailsReducer },
  ],
  sagas: [
    mauSaga(),
    scriptSaga(),
    licenseDetailsSaga(),
    apiRoleSaga(),
    apiPermissionSaga(),
  ],
}

export default pluginMetadata
