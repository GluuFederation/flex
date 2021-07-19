import HealthPage from './components/Health/HealthPage'
import ReportPage from './components/Reports/ReportPage'

import testReducer from './redux/reducers/TestReducer'

import testSaga from './redux/sagas/TestSaga'

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
          title: 'menus.health',
          path: PLUGIN_BASE_APTH + '/health',
          permission: '/config/acrs.readonly',
        },
        {
          title: 'menus.reports',
          path: PLUGIN_BASE_APTH + '/reports',
          permission: '/config/acrs.readonly',
        },
        {
          title: 'menus.configuration',
          children: [
            {
              title: 'menus.license',
              path: PLUGIN_BASE_APTH + '/config/liense',
              permission: '/config/jwks.readonly',
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
  ],
  reducers: [{ name: 'testReducer', reducer: testReducer }],
  sagas: [testSaga()],
}

export default pluginMetadata
