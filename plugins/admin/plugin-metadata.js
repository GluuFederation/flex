import HealthPage from './components/Health/HealthPage'
import ReportPage from './components/Reports/ReportPage'
import AdminUiRole from './components/Roles/AdminUiRole'
import MaximumActiveUsersPage from './components/MaximumActiveUsersPage'

import mauReducer from './redux/reducers/MauReducer'
import mauSaga from './redux/sagas/MauSaga'

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
          title: 'menus.configuration',
          children: [
            /** {
              title: 'menus.license',
              path: PLUGIN_BASE_APTH + '/config/liense',
              permission: '/config/jwks.readonly',
            },
            */

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
  ],
  reducers: [{ name: 'mauReducer', reducer: mauReducer }],
  sagas: [mauSaga()],
}

export default pluginMetadata
