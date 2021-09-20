import HealthPage from './components/Health/HealthPage'
import ReportPage from './components/Reports/ReportPage'
import LicenseDetailsPage from './components/Configuration/LicenseDetailsPage'
import AdminUiRole from './components/Roles/AdminUiRole'
import MaximumActiveUsersPage from './components/MaximumActiveUsersPage'
import SettingsPage from './components/Settings/SettingsPage'
import scriptSaga from './redux/sagas/CustomScriptSaga'
import licenseDetailsSaga from './redux/sagas/LicenseDetailsSaga'

import ScriptListPage from './components/CustomScripts/ScriptListPage'
import CustomScriptAddPage from './components/CustomScripts/CustomScriptAddPage'
import CustomScriptEditPage from './components/CustomScripts/CustomScriptEditPage'

import mauReducer from './redux/reducers/MauReducer'
import mauSaga from './redux/sagas/MauSaga'
import scriptReducer from './redux/reducers/CustomScriptReducer'
import licenseDetailsReducer from './redux/reducers/LicenseDetailsReducer'

const PLUGIN_BASE_APTH = '/adm'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.adminui',
      icon: 'fa-cubes',
      children: [
        {
          title: 'menus.roles',
          path: PLUGIN_BASE_APTH + '/roles',
          permission: '/config/acrs.readonly',
        },
        {
          title: 'menus.mau',
          path: PLUGIN_BASE_APTH + '/mau',
          permission: '/config/acrs.readonly',
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
        {
          title: 'menus.configuration',
          children: [
            /** {
              title: 'menus.license',
              path: PLUGIN_BASE_APTH + '/config/liense',
              permission: '/config/jwks.readonly',
            },
            */
            {
              title: 'menus.licenseDetails',
              path: PLUGIN_BASE_APTH + '/licenseDetails',
              permission: '/config/acrs.readonly',
            },
            {
              title: 'menus.logging',
              path: PLUGIN_BASE_APTH + '/config/logging',
              permission: '/config/properties.readonly',
            },
          ],
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
      component: MaximumActiveUsersPage,
      path: PLUGIN_BASE_APTH + '/mau',
      permission: '/config/acrs.readonly',
    },
    {
      component: AdminUiRole,
      path: PLUGIN_BASE_APTH + '/roles',
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
    { name: 'licenseDetailsReducer', reducer: licenseDetailsReducer },
  ],
  sagas: [
    mauSaga(),
    scriptSaga(),
    licenseDetailsSaga(),
  ],
}

export default pluginMetadata
