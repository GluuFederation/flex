import ScopeListPage from './components/Scopes/ScopeListPage'
import ScopeAddPage from './components/Scopes/ScopeAddPage'
import ScopeEditPage from './components/Scopes/ScopeEditPage'

import ClientListPage from './components/Clients/ClientListPage'
import ClientAddPage from './components/Clients/ClientAddPage'
import ClientEditPage from './components/Clients/ClientEditPage'

import PropertiesPage from './components/Configuration/ConfigPage'

import HealthPage from './components/Health/HealthPage'
import ReportPage from './components/Reports/ReportPage'
import KeysPage from './components/Configuration/Keys/KeysPage'
import DefaultPage from './components/Configuration/Defaults/DefaultConfigPage'

import oidcReducer from './redux/reducers/OIDCReducer'
import scopeReducer from './redux/reducers/ScopeReducer'
import jsonReducer from './redux/reducers/JsonConfigReducer'
import jwksReducer from './redux/reducers/JwksReducer'
import acrReducer from './redux/reducers/AcrReducer'
import loggingReducer from './redux/reducers/LoggingReducer'

import scopesSaga from './redux/sagas/OAuthScopeSaga'
import oidcSaga from './redux/sagas/OIDCSaga'
import jsonSaga from './redux/sagas/JsonConfigSaga'
import jwksSaga from './redux/sagas/JwksSaga'
import acrSaga from './redux/sagas/AcrsSaga'
import loggingSaga from './redux/sagas/LoggingSaga'

const PLUGIN_BASE_APTH = '/auth-server'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.oauthserver',
      icon: 'fa-server',
      children: [
        {
          title: 'menus.health',
          path: PLUGIN_BASE_APTH + '/health',
          //permission: '/config/properties.readonly',
          permission: '/config/acrs.readonly',
        },

        /**
        {
          title: 'menus.reports',
          path: PLUGIN_BASE_APTH + '/reports',
          permission: '/config/acrs.readonly',
        },
         */
        {
          title: 'menus.configuration',
          children: [
            {
              title: 'menus.keys',
              path: PLUGIN_BASE_APTH + '/config/keys',
              permission: '/config/jwks.readonly',
            },
            {
              title: 'menus.defaults',
              path: PLUGIN_BASE_APTH + '/config/defaults',
              permission: '/config/acrs.readonly',
            },
            {
              title: 'menus.properties',
              path: PLUGIN_BASE_APTH + '/config/properties',
              permission: '/config/acrs.readonly',
            },
            {
              title: 'menus.logging',
              path: PLUGIN_BASE_APTH + '/config/logging',
              permission: '/config/properties.readonly',
            },
            /**{
              title: 'PW Authn',
              path: PLUGIN_BASE_APTH + '/config/pwauthn',
              permission: '/config/acrs.readonly',
            },**/
          ],
        },
        {
          title: 'menus.clients',
          path: PLUGIN_BASE_APTH + '/clients',
          permission: '/config/openid/clients.readonly',
        },
        {
          title: 'menus.scopes',
          path: PLUGIN_BASE_APTH + '/scopes',
          permission: '/config/scopes.readonly',
        },
        /**{
          title: 'UMA',
          path: PLUGIN_BASE_APTH + '/uma',
          permission: '/config/jwks.readonly',
        },*/
      ],
    },
  ],
  routes: [
    {
      component: ClientListPage,
      path: PLUGIN_BASE_APTH + '/clients',
      permission: '/config/openid/clients.readonly',
    },
    {
      component: ClientAddPage,
      path: PLUGIN_BASE_APTH + '/client/new',
      permission: '/config/openid/clients.write',
    },
    {
      component: ClientEditPage,
      path: PLUGIN_BASE_APTH + '/client/edit:id',
      permission: '/config/openid/clients.write',
    },
    {
      component: ScopeListPage,
      path: PLUGIN_BASE_APTH + '/scopes',
      permission: '/config/scopes.readonly',
    },
    {
      component: ScopeAddPage,
      path: PLUGIN_BASE_APTH + '/scope/new',
      permission: '/config/scopes.write',
    },
    {
      component: ScopeEditPage,
      path: PLUGIN_BASE_APTH + '/scope/edit:id',
      permission: '/config/scopes.write',
    },
    {
      component: PropertiesPage,
      path: PLUGIN_BASE_APTH + '/config/properties',
      permission: '/config/attributes.write',
    },
    {
      component: KeysPage,
      path: PLUGIN_BASE_APTH + '/config/keys',
      permission: '/config/jwks.readonly',
    },
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
      component: DefaultPage,
      path: PLUGIN_BASE_APTH + '/config/defaults',
      permission: '/config/acrs.readonly',
    },
  ],
  reducers: [
    { name: 'scopeReducer', reducer: scopeReducer },
    { name: 'oidcReducer', reducer: oidcReducer },
    { name: 'authPropertiesReducer', reducer: jsonReducer },
    { name: 'jwksReducer', reducer: jwksReducer },
    { name: 'acrReducer', reducer: acrReducer },
    { name: 'loggingReducer', reducer: loggingReducer },
  ],
  sagas: [
    scopesSaga(),
    oidcSaga(),
    jsonSaga(),
    jwksSaga(),
    acrSaga(),
    loggingSaga(),
  ],
}

export default pluginMetadata
