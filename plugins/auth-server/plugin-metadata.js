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
          icon: 'fa-wrench',
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
          permission: '/config/jwks.readonly',
        },
        {
          title: 'Scopes',
          path: '/scopes',
          permission: '/config/jwks.readonly',
        },
        {
          title: 'Scripts',
          path: '/scripts',
          permission: '/config/jwks.readonly',
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
      permission: '/config/acrs.readonly',
    },
    {
      component: ClientAddPage,
      path: '/client/new',
      permission: '/config/cache.readonly',
    },
    {
      component: ClientEditPage,
      path: '/client/edit:id',
      permission: '/config/jwks.readonly',
    },
    {
      component: ScriptListPage,
      path: '/config/ldap/edit:configId',
      permission: '/config/database/ldap.readonly',
    },
    {
      component: CustomScriptAddPage,
      path: '/config/ldap/new',
      permission: '/config/database/ldap.readonly',
    },
    {
      component: CustomScriptEditPage,
      path: '/config/ldap/new',
      permission: '/config/database/ldap.readonly',
    },
    {
      component: ScopeListPage,
      path: '/scopes',
      permission: '/config/acrs.readonly',
    },
    {
      component: ScopeAddPage,
      path: '/scope/new',
      permission: '/config/cache.readonly',
    },
    {
      component: ScopeEditPage,
      path: '/scope/edit:id',
      permission: '/config/jwks.readonly',
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
