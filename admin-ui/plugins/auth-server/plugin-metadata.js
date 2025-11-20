import React, { Suspense, lazy } from 'react'
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
import ConfigApiPage from './components/Configuration/ConfigApiConfiguration/ConfigApiPage'

import { reducer as oidcReducer } from './redux/features/oidcSlice'
import { reducer as scopeReducer } from './redux/features/scopeSlice'
import { reducer as jsonReducer } from './redux/features/jsonConfigSlice'
import { reducer as acrReducer } from './redux/features/acrSlice'
import { reducer as loggingReducer } from './redux/features/loggingSlice'
import { reducer as umaResourceReducer } from './redux/features/umaResourceSlice'
import { reducer as sessionReducer } from './redux/features/sessionSlice'
import ssaReducer from './redux/features/SsaSlice'
import messageReducer from './redux/features/MessageSlice'

import scopesSaga from './redux/sagas/OAuthScopeSaga'
import oidcSaga from './redux/sagas/OIDCSaga'
import jsonSaga from './redux/sagas/JsonConfigSaga'
import acrSaga from './redux/sagas/AcrsSaga'
import loggingSaga from './redux/sagas/LoggingSaga'
import umaResourceSaga from './redux/sagas/UMAResourceSaga'
import sessionSaga from './redux/sagas/SessionSaga'
import authnSaga from './redux/sagas/AuthnSaga'
import ssaSaga from './redux/sagas/SsaSaga'
import messageSaga from './redux/sagas/MessageSaga'

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
  SSA_PORTAL,
  MESSAGE_READ,
  API_CONFIG_READ,
} from 'Utils/PermChecker'
import { reducer as authNReducer } from './redux/features/authNSlice'
import AuthNEditPage from './components/AuthN/AuthNEditPage'
import SsaListPage from './components/Ssa/SsaListPage'
import SsaAddPage from './components/Ssa/SsaAddPage'
import LockPage from './components/Message/LockPage'
import AuthNPage from './components/AuthN'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'

const AgamaListPage = lazy(() => import('./components/Agama/AgamaListPage'))
function AgamaListPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgamaListPage />
    </Suspense>
  )
}

const PLUGIN_BASE_APTH = '/auth-server'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.oauthserver',
      icon: 'oauthserver',
      children: [
        {
          title: 'menus.clients',
          path: PLUGIN_BASE_APTH + '/clients',
          permission: CLIENT_READ,
          resourceKey: ADMIN_UI_RESOURCES.Clients,
        },
        {
          title: 'menus.scopes',
          path: PLUGIN_BASE_APTH + '/scopes',
          permission: SCOPE_READ,
          resourceKey: ADMIN_UI_RESOURCES.Scopes,
        },
        {
          title: 'menus.keys',
          path: PLUGIN_BASE_APTH + '/config/keys',
          permission: JWKS_READ,
          resourceKey: ADMIN_UI_RESOURCES.Keys,
        },
        {
          title: 'menus.properties',
          path: PLUGIN_BASE_APTH + '/config/properties',
          permission: PROPERTIES_READ,
          resourceKey: ADMIN_UI_RESOURCES.AuthenticationServerConfiguration,
        },
        {
          title: 'menus.logging',
          path: PLUGIN_BASE_APTH + '/config/logging',
          permission: LOGGING_READ,
          resourceKey: ADMIN_UI_RESOURCES.Logging,
        },
        {
          title: 'menus.ssa',
          path: PLUGIN_BASE_APTH + '/config/ssa',
          permission: SSA_PORTAL,
          resourceKey: ADMIN_UI_RESOURCES.SSA,
        },
        {
          title: 'menus.authentication',
          path: PLUGIN_BASE_APTH + '/authn',
          permission: SCOPE_READ,
          resourceKey: ADMIN_UI_RESOURCES.Authentication,
        },
        {
          title: 'menus.api_config',
          path: PLUGIN_BASE_APTH + '/config-api-configuration',
          permission: API_CONFIG_READ,
          resourceKey: ADMIN_UI_RESOURCES.ConfigApiConfiguration,
        },
        // {
        //   title: 'menus.configuration',
        //   children: [],
        // },
        {
          title: 'menus.sessions',
          path: PLUGIN_BASE_APTH + '/sessions',
          permission: SESSION_READ,
          resourceKey: ADMIN_UI_RESOURCES.Session,
        },
        // {
        //   title: 'menus.lock ',
        //   path: PLUGIN_BASE_APTH + '/lock',
        //   permission: MESSAGE_READ,
        // },
      ],
    },
  ],
  routes: [
    {
      component: SessionListPage,
      path: PLUGIN_BASE_APTH + '/sessions',
      permission: SESSION_READ,
      resourceKey: ADMIN_UI_RESOURCES.Session,
    },
    {
      component: ClientListPage,
      path: PLUGIN_BASE_APTH + '/clients',
      permission: CLIENT_READ,
      resourceKey: ADMIN_UI_RESOURCES.Clients,
    },
    {
      component: ClientAddPage,
      path: PLUGIN_BASE_APTH + '/client/new',
      permission: CLIENT_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Clients,
    },
    {
      component: ClientEditPage,
      path: PLUGIN_BASE_APTH + '/client/edit/:id',
      permission: CLIENT_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Clients,
    },
    {
      component: ScopeListPage,
      path: PLUGIN_BASE_APTH + '/scopes',
      permission: SCOPE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Scopes,
    },
    {
      component: AuthNEditPage,
      path: PLUGIN_BASE_APTH + '/authn/edit/:id',
      permission: SCOPE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Authentication,
    },
    {
      component: AuthNPage,
      path: PLUGIN_BASE_APTH + '/authn',
      permission: SCOPE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Authentication,
    },
    {
      component: ScopeAddPage,
      path: PLUGIN_BASE_APTH + '/scope/new',
      permission: SCOPE_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Scopes,
    },
    {
      component: ScopeEditPage,
      path: PLUGIN_BASE_APTH + '/scope/edit/:id',
      permission: SCOPE_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Scopes,
    },
    {
      component: PropertiesPage,
      path: PLUGIN_BASE_APTH + '/config/properties',
      permission: ACR_READ,
      resourceKey: ADMIN_UI_RESOURCES.AuthenticationServerConfiguration,
    },
    {
      component: KeysPage,
      path: PLUGIN_BASE_APTH + '/config/keys',
      permission: JWKS_READ,
      resourceKey: ADMIN_UI_RESOURCES.Keys,
    },
    {
      component: LoggingPage,
      path: PLUGIN_BASE_APTH + '/config/logging',
      permission: ACR_READ,
      resourceKey: ADMIN_UI_RESOURCES.Logging,
    },
    {
      component: ReportPage,
      path: PLUGIN_BASE_APTH + '/reports',
      permission: ACR_READ,
    },
    {
      component: AgamaListPageWrapper,
      path: PLUGIN_BASE_APTH + '/agama',
      permission: AGAMA_READ,
      resourceKey: ADMIN_UI_RESOURCES.Authentication,
    },
    {
      component: SsaListPage,
      path: PLUGIN_BASE_APTH + '/config/ssa',
      permission: SSA_PORTAL,
      resourceKey: ADMIN_UI_RESOURCES.SSA,
    },
    {
      component: SsaAddPage,
      path: PLUGIN_BASE_APTH + '/config/ssa/new',
      permission: SSA_PORTAL,
      resourceKey: ADMIN_UI_RESOURCES.SSA,
    },
    {
      component: LockPage,
      path: PLUGIN_BASE_APTH + '/lock',
      permission: MESSAGE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Lock,
    },
    {
      component: ConfigApiPage,
      path: PLUGIN_BASE_APTH + '/config-api-configuration',
      permission: API_CONFIG_READ,
      resourceKey: ADMIN_UI_RESOURCES.ConfigApiConfiguration,
    },
  ],
  reducers: [
    { name: 'scopeReducer', reducer: scopeReducer },
    { name: 'oidcReducer', reducer: oidcReducer },
    { name: 'authPropertiesReducer', reducer: jsonReducer },
    { name: 'acrReducer', reducer: acrReducer },
    { name: 'loggingReducer', reducer: loggingReducer },
    { name: 'umaResourceReducer', reducer: umaResourceReducer },
    { name: 'sessionReducer', reducer: sessionReducer },
    { name: 'authNReducer', reducer: authNReducer },
    { name: 'SsaReducer', reducer: ssaReducer },
    { name: 'messageReducer', reducer: messageReducer },
  ],
  sagas: [
    scopesSaga(),
    oidcSaga(),
    jsonSaga(),
    acrSaga(),
    loggingSaga(),
    umaResourceSaga(),
    sessionSaga(),
    authnSaga(),
    ssaSaga(),
    messageSaga(),
  ],
}

export default pluginMetadata
