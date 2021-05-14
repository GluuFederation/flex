import ScopeListPage from './components/Scopes/ScopeListPage'
import ScopeAddPage from './components/Scopes/ScopeAddPage'
import ScopeEditPage from './components/Scopes/ScopeEditPage'

import ClientListPage from './components/Clients/ClientListPage'
import ClientAddPage from './components/Clients/ClientAddPage'
import ClientEditPage from './components/Clients/ClientEditPage'

import ScriptListPage from './components/CustomScripts/ScriptListPage'
import CustomScriptAddPage from './components/CustomScripts/CustomScriptAddPage'
import CustomScriptEditPage from './components/CustomScripts/CustomScriptEditPage'

import scriptReducer from './redux/reducers/CustomScriptReducer'
import oidcReducer from './redux/reducers/OIDCReducer'
import scopeReducer from './redux/reducers/ScopeReducer'

import scriptSaga from './redux/sagas/CustomScriptSaga'
import scopesSaga from './redux/sagas/OAuthScopeSaga'
import oidcSaga from './redux/sagas/OIDCSaga'

const PLUGIN_BASE_APTH = '/auth-server'

const pluginMetadata = {
  menus: [
    {
      title: 'Auth Server',
      icon: 'fa-server',
      children: [
        {
          title: 'Health',
          path: PLUGIN_BASE_APTH + '/health',
          permission: '/config/acrs.readonly',
        },
        {
          title: 'Reports',
          path: PLUGIN_BASE_APTH + '/reports',
          permission: '/config/cache.readonly',
        },
        {
          title: 'Configuration',
          children: [
            {
              title: 'Keys',
              path: PLUGIN_BASE_APTH + '/keys',
              permission: '/config/database/ldap.readonly',
            },
            {
              title: 'Defaults',
              path: PLUGIN_BASE_APTH + '/defaults',
              permission: '/config/database/couchbase.readonly',
            },
            {
              title: 'Properties',
              path: PLUGIN_BASE_APTH + '/properties',
              permission: '/config/database/couchbase.readonly',
            },
            {
              title: 'Logging',
              path: PLUGIN_BASE_APTH + '/logging',
              permission: '/config/database/couchbase.readonly',
            },
          ],
        },
        {
          title: 'Clients',
          path: PLUGIN_BASE_APTH + '/clients',
          permission: '/config/openid/clients.readonly',
        },
        {
          title: 'Scopes',
          path: PLUGIN_BASE_APTH + '/scopes',
          permission: '/config/scopes.readonly',
        },
        {
          title: 'Scripts',
          path: PLUGIN_BASE_APTH + '/scripts',
          permission: '/config/scripts.readonly',
        },
        {
          title: 'UMA',
          path: PLUGIN_BASE_APTH + '/uma',
          permission: '/config/jwks.readonly',
        },
        {
          title: 'PW Authn',
          path: PLUGIN_BASE_APTH + '/pwauthn',
          permission: '/config/jwks.readonly',
        },
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
      component: ScriptListPage,
      path: PLUGIN_BASE_APTH + '/scripts',
      permission: '/config/scripts.readonly',
    },
    {
      component: CustomScriptAddPage,
      path: PLUGIN_BASE_APTH + '/scripts/new',
      permission: '/config/scripts.write',
    },
    {
      component: CustomScriptEditPage,
      path: PLUGIN_BASE_APTH + '/scripts/edit:id',
      permission: '/config/scripts.write',
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
  ],
  reducers: [
    { name: 'scopeReducer', reducer: scopeReducer },
    { name: 'oidcReducer', reducer: oidcReducer },
    { name: 'scriptReducer', reducer: scriptReducer },
  ],
  sagas: [scopesSaga(), scriptSaga(), oidcSaga()],
}

export default pluginMetadata
