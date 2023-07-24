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

import { reducer as oidcReducer } from './redux/features/oidcSlice'
import { reducer as scopeReducer } from './redux/features/scopeSlice'
import { reducer as jsonReducer } from './redux/features/jsonConfigSlice'
import { reducer as jwksReducer } from './redux/features/jwksSlice'
import { reducer as acrReducer } from './redux/features/acrSlice'
import { reducer as loggingReducer } from './redux/features/loggingSlice'
import { reducer as umaResourceReducer } from './redux/features/umaResourceSlice'
import { reducer as sessionReducer } from './redux/features/sessionSlice'
import ssaReducer from './redux/features/SsaSlice'

import scopesSaga from './redux/sagas/OAuthScopeSaga'
import oidcSaga from './redux/sagas/OIDCSaga'
import jsonSaga from './redux/sagas/JsonConfigSaga'
import jwksSaga from './redux/sagas/JwksSaga'
import acrSaga from './redux/sagas/AcrsSaga'
import loggingSaga from './redux/sagas/LoggingSaga'
import umaResourceSaga from './redux/sagas/UMAResourceSaga'
import sessionSaga from './redux/sagas/SessionSaga'
import agamaSaga from './redux/sagas/AgamaSaga'
import authnSaga from './redux/sagas/AuthnSaga'
import ssaSaga from './redux/sagas/SsaSaga' 

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
  AGAMA_READ,
  SSA_PORTAL
} from 'Utils/PermChecker'
import AgamaListPage from './components/Agama/AgamaListPage'
import { reducer as agamaReducer } from './redux/features/agamaSlice'
import AuthNListPage from './components/AuthN/AuthNListPage'
import { reducer as authNReducer } from './redux/features/authNSlice'
import AuthNEditPage from './components/AuthN/AuthNEditPage'
import SsaListPage from './components/Ssa/SsaListPage' 
import SsaAddPage from './components/Ssa/SsaAddPage'

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
            {
              title: 'menus.ssa',
              path: PLUGIN_BASE_APTH + '/config/ssa',
              permission: SSA_PORTAL,
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
          title: 'menus.authn',
          path: PLUGIN_BASE_APTH + '/authn',
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
      component: AuthNEditPage,
      path: PLUGIN_BASE_APTH + '/authn/edit/:id',
      permission: SCOPE_READ,
    },
    {
      component: AuthNListPage,
      path: PLUGIN_BASE_APTH + '/authn',
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
    {
      component: SsaListPage,
      path: PLUGIN_BASE_APTH + '/config/ssa',
      permission: SSA_PORTAL,
    },
    {
      component: SsaAddPage,
      path: PLUGIN_BASE_APTH + '/config/ssa/new',
      permission: SSA_PORTAL,
    }
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
    { name: 'authNReducer', reducer: authNReducer },
    { name: 'SsaReducer', reducer: ssaReducer },
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
    agamaSaga(),
    authnSaga(),
    ssaSaga()
  ],
}

export default pluginMetadata
