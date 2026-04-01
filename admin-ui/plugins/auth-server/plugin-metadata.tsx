import React, { Suspense, lazy } from 'react'
import ScopeListPage from './components/Scopes/ScopeListPage'
import ScopeAddPage from './components/Scopes/ScopeAddPage'
import ScopeEditPage from './components/Scopes/ScopeEditPage'

import ClientListPage from './components/Clients/ClientListPage'
import ClientAddPage from './components/Clients/ClientAddPage'
import ClientEditPage from './components/Clients/ClientEditPage'

import SessionListPage from './components/Sessions/SessionListPage'

import PropertiesPage from './components/AuthServerProperties'
import KeysPage from './components/Keys'
import LoggingPage from './components/Logging'

import ConfigApiPage from './components/ConfigApiProperties'

import { reducer as oidcReducer } from './redux/features/oidcSlice'
import { reducer as scopeReducer } from './redux/features/scopeSlice'
import { reducer as umaResourceReducer } from './redux/features/umaResourceSlice'
import messageReducer from './redux/features/MessageSlice'

import scopesSaga from './redux/sagas/OAuthScopeSaga'
import oidcSaga from './redux/sagas/OIDCSaga'
import umaResourceSaga from './redux/sagas/UMAResourceSaga'
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
  API_CONFIG_READ,
} from 'Utils/PermChecker'
import AuthNEditPage from './components/AuthN/AuthNEditPage'
import SsaListPage from './components/Ssa/SsaListPage'
import SsaAddPage from './components/Ssa/SsaAddPage'
import AuthNPage from './components/AuthN'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'

const AgamaListPage = lazy(() => import('./components/Agama/AgamaListPage'))
const AgamaListPageWrapper = () => {
  return (
    <Suspense fallback={<GluuLoader blocking />}>
      <AgamaListPage />
    </Suspense>
  )
}

const pluginMetadata = {
  menus: [
    {
      title: 'menus.oauthserver',
      icon: 'oauthserver',
      children: [
        {
          title: 'menus.clients',
          path: ROUTES.AUTH_SERVER_CLIENTS_LIST,
          permission: CLIENT_READ,
          resourceKey: ADMIN_UI_RESOURCES.Clients,
        },
        {
          title: 'menus.scopes',
          path: ROUTES.AUTH_SERVER_SCOPES_LIST,
          permission: SCOPE_READ,
          resourceKey: ADMIN_UI_RESOURCES.Scopes,
        },
        {
          title: 'menus.keys',
          path: ROUTES.AUTH_SERVER_CONFIG_KEYS,
          permission: JWKS_READ,
          resourceKey: ADMIN_UI_RESOURCES.Keys,
        },
        {
          title: 'menus.properties',
          path: ROUTES.AUTH_SERVER_CONFIG_PROPERTIES,
          permission: PROPERTIES_READ,
          resourceKey: ADMIN_UI_RESOURCES.AuthenticationServerConfiguration,
        },
        {
          title: 'menus.logging',
          path: ROUTES.AUTH_SERVER_CONFIG_LOGGING,
          permission: LOGGING_READ,
          resourceKey: ADMIN_UI_RESOURCES.Logging,
        },
        {
          title: 'menus.ssa',
          path: ROUTES.AUTH_SERVER_SSA_LIST,
          permission: SSA_PORTAL,
          resourceKey: ADMIN_UI_RESOURCES.SSA,
        },
        {
          title: 'menus.authentication',
          path: ROUTES.AUTH_SERVER_AUTHN,
          permission: SCOPE_READ,
          resourceKey: ADMIN_UI_RESOURCES.Authentication,
        },
        {
          title: 'menus.api_config',
          path: ROUTES.AUTH_SERVER_CONFIG_API,
          permission: API_CONFIG_READ,
          resourceKey: ADMIN_UI_RESOURCES.ConfigApiConfiguration,
        },
        {
          title: 'menus.sessions',
          path: ROUTES.AUTH_SERVER_SESSIONS,
          permission: SESSION_READ,
          resourceKey: ADMIN_UI_RESOURCES.Session,
        },
      ],
    },
  ],
  routes: [
    {
      component: SessionListPage,
      path: ROUTES.AUTH_SERVER_SESSIONS,
      permission: SESSION_READ,
      resourceKey: ADMIN_UI_RESOURCES.Session,
    },
    {
      component: ClientListPage,
      path: ROUTES.AUTH_SERVER_CLIENTS_LIST,
      permission: CLIENT_READ,
      resourceKey: ADMIN_UI_RESOURCES.Clients,
    },
    {
      component: ClientAddPage,
      path: ROUTES.AUTH_SERVER_CLIENT_ADD,
      permission: CLIENT_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Clients,
    },
    {
      component: ClientEditPage,
      path: ROUTES.AUTH_SERVER_CLIENT_EDIT_TEMPLATE,
      permission: CLIENT_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Clients,
    },
    {
      component: ScopeListPage,
      path: ROUTES.AUTH_SERVER_SCOPES_LIST,
      permission: SCOPE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Scopes,
    },
    {
      component: AuthNEditPage,
      path: ROUTES.AUTH_SERVER_AUTHN_EDIT_TEMPLATE,
      permission: SCOPE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Authentication,
    },
    {
      component: AuthNPage,
      path: ROUTES.AUTH_SERVER_AUTHN,
      permission: SCOPE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Authentication,
    },
    {
      component: ScopeAddPage,
      path: ROUTES.AUTH_SERVER_SCOPE_ADD,
      permission: SCOPE_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Scopes,
    },
    {
      component: ScopeEditPage,
      path: ROUTES.AUTH_SERVER_SCOPE_EDIT_TEMPLATE,
      permission: SCOPE_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Scopes,
    },
    {
      component: PropertiesPage,
      path: ROUTES.AUTH_SERVER_CONFIG_PROPERTIES,
      permission: ACR_READ,
      resourceKey: ADMIN_UI_RESOURCES.AuthenticationServerConfiguration,
    },
    {
      component: KeysPage,
      path: ROUTES.AUTH_SERVER_CONFIG_KEYS,
      permission: JWKS_READ,
      resourceKey: ADMIN_UI_RESOURCES.Keys,
    },
    {
      component: LoggingPage,
      path: ROUTES.AUTH_SERVER_CONFIG_LOGGING,
      permission: ACR_READ,
      resourceKey: ADMIN_UI_RESOURCES.Logging,
    },
    {
      component: AgamaListPageWrapper,
      path: ROUTES.AUTH_SERVER_AGAMA,
      permission: AGAMA_READ,
      resourceKey: ADMIN_UI_RESOURCES.Authentication,
    },
    {
      component: SsaListPage,
      path: ROUTES.AUTH_SERVER_SSA_LIST,
      permission: SSA_PORTAL,
      resourceKey: ADMIN_UI_RESOURCES.SSA,
    },
    {
      component: SsaAddPage,
      path: ROUTES.AUTH_SERVER_SSA_ADD,
      permission: SSA_PORTAL,
      resourceKey: ADMIN_UI_RESOURCES.SSA,
    },
    {
      component: ConfigApiPage,
      path: ROUTES.AUTH_SERVER_CONFIG_API,
      permission: API_CONFIG_READ,
      resourceKey: ADMIN_UI_RESOURCES.ConfigApiConfiguration,
    },
  ],
  reducers: [
    { name: 'scopeReducer', reducer: scopeReducer },
    { name: 'oidcReducer', reducer: oidcReducer },
    { name: 'umaResourceReducer', reducer: umaResourceReducer },
    { name: 'messageReducer', reducer: messageReducer },
  ],
  sagas: [scopesSaga(), oidcSaga(), umaResourceSaga(), messageSaga()],
}

export default pluginMetadata
