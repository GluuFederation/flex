import ScopeListPage from './components/Scopes/ScopeListPage'
import ScopeAddPage from './components/Scopes/ScopeAddPage'
import ScopeEditPage from './components/Scopes/ScopeEditPage'

import ClientListPage from './components/Clients/ClientListPage'
import ClientAddPage from './components/Clients/ClientAddPage'
import ClientEditPage from './components/Clients/ClientEditPage'

import SessionListPage from './components/Sessions/SessionListPage'

import PropertiesPage from './components/Configuration/ConfigPage'
import KeysPage from './components/Configuration/Keys/KeysPage'
import LoggingPage from './components/Configuration/Defaults/LoggingPage'

import ReportPage from './components/Reports/ReportPage'

import oidcReducer from './redux/reducers/OIDCReducer'
import scopeReducer from './redux/reducers/ScopeReducer'
import jsonReducer from './redux/reducers/JsonConfigReducer'
import jwksReducer from './redux/reducers/JwksReducer'
import acrReducer from './redux/reducers/AcrReducer'
import loggingReducer from './redux/reducers/LoggingReducer'
import umaResourceReducer from './redux/reducers/UMAResourceReducer'
import sessionReducer from './redux/reducers/SessionReducer'

import scopesSaga from './redux/sagas/OAuthScopeSaga'
import oidcSaga from './redux/sagas/OIDCSaga'
import jsonSaga from './redux/sagas/JsonConfigSaga'
import jwksSaga from './redux/sagas/JwksSaga'
import acrSaga from './redux/sagas/AcrsSaga'
import loggingSaga from './redux/sagas/LoggingSaga'
import umaResourceSaga from './redux/sagas/UMAResourceSaga'
import sessionSaga from './redux/sagas/SessionSaga'
import agamaSaga from './redux/sagas/AgamaSaga'

import {
  ACR_READ,
  CLIENT_READ,
  SCOPE_READ,
  CLIENT_WRITE,
  SCOPE_WRITE,
  JWKS_READ,
  SESSION_READ,
  PROPERTIES_READ,
  LOGGING_READ,
  AGAMA_READ
} from 'Utils/PermChecker'
import AgamaListPage from './components/Agama/AgamaListPage'
import agamaReducer from './redux/reducers/AgamaReducer'

const PLUGIN_BASE_APTH = '/auth-server'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.oauthserver',
      icon: 'oauthserver',
      children: [
        {
          title: 'menus.sessions',
          path: PLUGIN_BASE_APTH + '/sessions',
          permission: SESSION_READ,
        },
        {
          title: 'menus.configuration',
          children: [
            {
              title: 'menus.keys',
              path: PLUGIN_BASE_APTH + '/config/keys',
              permission: JWKS_READ,
            },
            {
              title: 'menus.properties',
              path: PLUGIN_BASE_APTH + '/config/properties',
              permission: PROPERTIES_READ,
            },
            {
              title: 'menus.logging',
              path: PLUGIN_BASE_APTH + '/config/logging',
              permission: LOGGING_READ,
            },
          ],
        },
        {
          title: 'menus.clients',
          path: PLUGIN_BASE_APTH + '/clients',
          permission: CLIENT_READ,
        },
        {
          title: 'menus.scopes',
          path: PLUGIN_BASE_APTH + '/scopes',
          permission: SCOPE_READ,
        },
        {
          title: 'menus.agama',
          path: PLUGIN_BASE_APTH + '/agama',
          permission: AGAMA_READ,
        },
      ],
    },
  ],
  routes: [
    {
      component: SessionListPage,
      path: PLUGIN_BASE_APTH + '/sessions',
      permission: SESSION_READ,
    },
    {
      component: ClientListPage,
      path: PLUGIN_BASE_APTH + '/clients',
      permission: CLIENT_READ,
    },
    {
      component: ClientAddPage,
      path: PLUGIN_BASE_APTH + '/client/new',
      permission: CLIENT_WRITE,
    },
    {
      component: ClientEditPage,
      path: PLUGIN_BASE_APTH + '/client/edit/:id',
      permission: CLIENT_WRITE,
    },
    {
      component: ScopeListPage,
      path: PLUGIN_BASE_APTH + '/scopes',
      permission: SCOPE_READ,
    },
    {
      component: ScopeAddPage,
      path: PLUGIN_BASE_APTH + '/scope/new',
      permission: SCOPE_WRITE,
    },
    {
      component: ScopeEditPage,
      path: PLUGIN_BASE_APTH + '/scope/edit/:id',
      permission: SCOPE_WRITE,
    },
    {
      component: PropertiesPage,
      path: PLUGIN_BASE_APTH + '/config/properties',
      permission: ACR_READ,
    },
    {
      component: KeysPage,
      path: PLUGIN_BASE_APTH + '/config/keys',
      permission: JWKS_READ,
    },
    {
      component: LoggingPage,
      path: PLUGIN_BASE_APTH + '/config/logging',
      permission: ACR_READ,
    },
    {
      component: ReportPage,
      path: PLUGIN_BASE_APTH + '/reports',
      permission: ACR_READ,
    },
    {
      component: AgamaListPage,
      path: PLUGIN_BASE_APTH + '/agama',
      permission: AGAMA_READ,
    },
    // {
    //   component: AgamaAddPage,
    //   path: PLUGIN_BASE_APTH + '/agama/new',
    //   permission: AGAMA_WRITE,
    // },
  ],
  reducers: [
    { name: 'scopeReducer', reducer: scopeReducer },
    { name: 'oidcReducer', reducer: oidcReducer },
    { name: 'authPropertiesReducer', reducer: jsonReducer },
    { name: 'jwksReducer', reducer: jwksReducer },
    { name: 'acrReducer', reducer: acrReducer },
    { name: 'loggingReducer', reducer: loggingReducer },
    { name: 'umaResourceReducer', reducer: umaResourceReducer },
    { name: 'sessionReducer', reducer: sessionReducer },
    { name: 'agamaReducer', reducer: agamaReducer },
  ],
  sagas: [
    scopesSaga(),
    oidcSaga(),
    jsonSaga(),
    jwksSaga(),
    acrSaga(),
    loggingSaga(),
    umaResourceSaga(),
    sessionSaga(),
    agamaSaga()
  ],
}

export default pluginMetadata
