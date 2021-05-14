import ScopeListPage from './components/Scopes/ScopeListPage'
import ScopeAddPage from './components/Scopes/ScopeAddPage'
import ScopeEditPage from './components/Scopes/ScopeEditPage'

import AttributeListPage from './components/Attibutes/AttributeListPage'
import AttributeEditPage from './components/Attibutes/AttributeEditPage'
import AttributeAddPage from './components/Attibutes/AttributeAddPage'

import ClientListPage from './components/Clients/ClientListPage'
import ClientAddPage from './components/Clients/ClientAddPage'
import ClientEditPage from './components/Clients/ClientEditPage'

import ScriptListPage from './components/CustomScripts/ScriptListPage'
import CustomScriptAddPage from './components/CustomScripts/CustomScriptAddPage'
import CustomScriptEditPage from './components/CustomScripts/CustomScriptEditPage'

import PropertiesPage from './components/Configuration/ConfigPage'

import scriptReducer from './redux/reducers/CustomScriptReducer'
import oidcReducer from './redux/reducers/OIDCReducer'
import scopeReducer from './redux/reducers/ScopeReducer'
import attributeReducer from './redux/reducers/AttributeReducer'
import jsonReducer from './redux/reducers/JsonConfigReducer'

import scriptSaga from './redux/sagas/CustomScriptSaga'
import scopesSaga from './redux/sagas/OAuthScopeSaga'
import oidcSaga from './redux/sagas/OIDCSaga'
import attributeSaga from './redux/sagas/AttributeSaga'
import jsonSaga from './redux/sagas/JsonConfigSaga'

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
              path: PLUGIN_BASE_APTH + '/config/keys',
              permission: '/config/database/couchbase.readonly',
            },
            {
              title: 'Defaults',
              path: PLUGIN_BASE_APTH + '/config/defaults',
              permission: '/config/database/couchbase.readonly',
            },
            {
              title: 'Properties',
              path: PLUGIN_BASE_APTH + '/config/properties',
              permission: '/config/database/couchbase.readonly',
            },
            {
              title: 'Logging',
              path: PLUGIN_BASE_APTH + '/config/logging',
              permission: '/config/database/couchbase.readonly',
            },
          ],
        },
        {
          title: 'Attributes',
          path: PLUGIN_BASE_APTH + '/attributes',
          permission: '/config/attributes.readonly',
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
      path: PLUGIN_BASE_APTH + '/script/new',
      permission: '/config/scripts.write',
    },
    {
      component: CustomScriptEditPage,
      path: PLUGIN_BASE_APTH + '/script/edit:id',
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
    {
      component: AttributeListPage,
      path: PLUGIN_BASE_APTH + '/attributes',
      permission: '/config/attributes.readonly',
    },
    {
      component: AttributeAddPage,
      path: PLUGIN_BASE_APTH + '/attribute/new',
      permission: '/config/attributes.write',
    },
    {
      component: AttributeEditPage,
      path: PLUGIN_BASE_APTH + '/attribute/edit:id',
      permission: '/config/attributes.write',
    },

    {
      component: PropertiesPage,
      path: PLUGIN_BASE_APTH + '/config/properties',
      permission: '/config/attributes.write',
    },
  ],
  reducers: [
    { name: 'scopeReducer', reducer: scopeReducer },
    { name: 'oidcReducer', reducer: oidcReducer },
    { name: 'scriptReducer', reducer: scriptReducer },
    { name: 'attributeReducer', reducer: attributeReducer },
    { name: 'authPrpertiesReducer', reducer: jsonReducer },
  ],
  sagas: [scopesSaga(), scriptSaga(), oidcSaga(), attributeSaga(), jsonSaga()],
}

export default pluginMetadata
