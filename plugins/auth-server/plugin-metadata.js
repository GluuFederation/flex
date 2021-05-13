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

const pluginMetadata = {
  menus: [
    {
      title: 'Auth Server',
      icon: 'fa-server',
      children: [
        {
          title: 'Health',
          path: '/config/health',
          permission: '/config/acrs.readonly',
        },
        {
          title: 'Reports',
          path: '/config/reports',
          permission: '/config/cache.readonly',
        },
        {
          title: 'Configuration',
          children: [
            {
              title: 'Keys',
              path: '/config/keys',
              permission: '/config/database/ldap.readonly',
            },
            {
              title: 'Defaults',
              path: '/config/defaults',
              permission: '/config/database/couchbase.readonly',
            },
            {
              title: 'Properties',
              path: '/config/properties',
              permission: '/config/database/couchbase.readonly',
            },
            {
              title: 'Logging',
              path: '/config/logging',
              permission: '/config/database/couchbase.readonly',
            },
          ],
        },
        {
          title: 'Clients',
          path: '/clients',
          permission: '/config/clients.readonly',
        },
        {
          title: 'Scopes',
          path: '/scopes',
          permission: '/config/scopes.readonly',
        },
        {
          title: 'Scripts',
          path: '/scripts',
          permission: '/config/scripts.readonly',
        },
        {
          title: 'UMA',
          path: '/uma',
          permission: '/config/jwks.readonly',
        },
        {
          title: 'PW Authn',
          path: '/pwauthn',
          permission: '/config/jwks.readonly',
        },
      ],
    },
  ],
  routes: [
    {
      component: ClientListPage,
      path: '/clients',
      permission: '/config/clients.readonly',
    },
    {
      component: ClientAddPage,
      path: '/client/new',
      permission: '/config/clients.write',
    },
    {
      component: ClientEditPage,
      path: '/client/edit:id',
      permission: '/config/clients.write',
    },
    {
      component: ScriptListPage,
      path: '/config/ldap/edit:configId',
      permission: '/config/scripts.readonly',
    },
    {
      component: CustomScriptAddPage,
      path: '/config/ldap/new',
      permission: '/config/scripts.write',
    },
    {
      component: CustomScriptEditPage,
      path: '/config/ldap/new',
      permission: '/config/scripts.write',
    },
    {
      component: ScopeListPage,
      path: '/scopes',
      permission: '/config/scopes.readonly',
    },
    {
      component: ScopeAddPage,
      path: '/scope/new',
      permission: '/config/scopes.write',
    },
    {
      component: ScopeEditPage,
      path: '/scope/edit:id',
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
