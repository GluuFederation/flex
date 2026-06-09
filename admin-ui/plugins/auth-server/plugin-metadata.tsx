import { reducer as scopeReducer } from './redux/features/scopeSlice'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const SessionListPage = createLazyRoute(() =>
  import('./components/Sessions').then((m) => ({ default: m.SessionListPage })),
)
const ClientListPage = createLazyRoute(() =>
  import('./components/OidcClients').then((m) => ({ default: m.ClientListPage })),
)
const ClientAddPage = createLazyRoute(() =>
  import('./components/OidcClients').then((m) => ({ default: m.ClientAddPage })),
)
const ClientEditPage = createLazyRoute(() =>
  import('./components/OidcClients').then((m) => ({ default: m.ClientEditPage })),
)
const ScopeListPage = createLazyRoute(() =>
  import('./components/Scopes').then((m) => ({ default: m.ScopeListPage })),
)
const ScopeAddPage = createLazyRoute(() =>
  import('./components/Scopes').then((m) => ({ default: m.ScopeAddPage })),
)
const ScopeEditPage = createLazyRoute(() =>
  import('./components/Scopes').then((m) => ({ default: m.ScopeEditPage })),
)
const AcrsEditPage = createLazyRoute(() => import('./components/Authentication/Acrs/AcrsEditPage'))
const AuthNPage = createLazyRoute(() => import('./components/Authentication'))
const PropertiesPage = createLazyRoute(() => import('./components/AuthServerProperties'))
const KeysPage = createLazyRoute(() => import('./components/Keys'))
const LoggingPage = createLazyRoute(() => import('./components/Logging'))
const SsaListPage = createLazyRoute(() => import('./components/Ssa/components/SsaListPage'))
const SsaAddPage = createLazyRoute(() => import('./components/Ssa/components/SsaAddPage'))
const ConfigApiPage = createLazyRoute(() => import('./components/ConfigApiProperties'))

const AgamaListPageWrapper = createLazyRoute(
  () => import('./components/Authentication/AgamaFlows/AgamaFlows'),
)

const pluginMetadata = {
  menus: [
    {
      title: 'menus.oauthserver',
      icon: 'oauthserver',
      children: [
        {
          title: 'menus.clients',
          path: ROUTES.AUTH_SERVER_CLIENTS_LIST,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Clients,
        },
        {
          title: 'menus.scopes',
          path: ROUTES.AUTH_SERVER_SCOPES_LIST,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Scopes,
        },
        {
          title: 'menus.keys',
          path: ROUTES.AUTH_SERVER_CONFIG_KEYS,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Keys,
        },
        {
          title: 'menus.properties',
          path: ROUTES.AUTH_SERVER_CONFIG_PROPERTIES,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.AuthenticationServerConfiguration,
        },
        {
          title: 'menus.logging',
          path: ROUTES.AUTH_SERVER_CONFIG_LOGGING,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Logging,
        },
        {
          title: 'menus.ssa',
          path: ROUTES.AUTH_SERVER_SSA_LIST,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.SSA,
        },
        {
          title: 'menus.authentication',
          path: ROUTES.AUTH_SERVER_AUTHN,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Authentication,
        },
        {
          title: 'menus.api_config',
          path: ROUTES.AUTH_SERVER_CONFIG_API,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.ConfigApiConfiguration,
        },
        {
          title: 'menus.sessions',
          path: ROUTES.AUTH_SERVER_SESSIONS,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Session,
        },
      ],
    },
  ],
  routes: [
    {
      component: SessionListPage,
      path: ROUTES.AUTH_SERVER_SESSIONS,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Session,
    },
    {
      component: ClientListPage,
      path: ROUTES.AUTH_SERVER_CLIENTS_LIST,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Clients,
    },
    {
      component: ClientAddPage,
      path: ROUTES.AUTH_SERVER_CLIENT_ADD,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Clients,
    },
    {
      component: ClientEditPage,
      path: ROUTES.AUTH_SERVER_CLIENT_EDIT_TEMPLATE,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Clients,
    },
    {
      component: ScopeListPage,
      path: ROUTES.AUTH_SERVER_SCOPES_LIST,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Scopes,
    },
    {
      component: AcrsEditPage,
      path: ROUTES.AUTH_SERVER_AUTHN_EDIT_TEMPLATE,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Authentication,
    },
    {
      component: AuthNPage,
      path: ROUTES.AUTH_SERVER_AUTHN,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Authentication,
    },
    {
      component: ScopeAddPage,
      path: ROUTES.AUTH_SERVER_SCOPE_ADD,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Scopes,
    },
    {
      component: ScopeEditPage,
      path: ROUTES.AUTH_SERVER_SCOPE_EDIT_TEMPLATE,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Scopes,
    },
    {
      component: PropertiesPage,
      path: ROUTES.AUTH_SERVER_CONFIG_PROPERTIES,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.AuthenticationServerConfiguration,
    },
    {
      component: KeysPage,
      path: ROUTES.AUTH_SERVER_CONFIG_KEYS,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Keys,
    },
    {
      component: LoggingPage,
      path: ROUTES.AUTH_SERVER_CONFIG_LOGGING,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Logging,
    },
    {
      component: AgamaListPageWrapper,
      path: ROUTES.AUTH_SERVER_AGAMA,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Authentication,
    },
    {
      component: SsaListPage,
      path: ROUTES.AUTH_SERVER_SSA_LIST,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.SSA,
    },
    {
      component: SsaAddPage,
      path: ROUTES.AUTH_SERVER_SSA_ADD,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.SSA,
    },
    {
      component: ConfigApiPage,
      path: ROUTES.AUTH_SERVER_CONFIG_API,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.ConfigApiConfiguration,
    },
  ],
  reducers: [{ name: 'scopeReducer', reducer: scopeReducer }],
}

export default pluginMetadata
