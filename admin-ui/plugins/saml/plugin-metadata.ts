import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
import { createLazyRoute } from '@/utils/RouteLoader'

const PLUGIN_BASE_APTH = '/saml'
const SamlPage = createLazyRoute(() => import('./components/SamlPage'))
const WebsiteSsoIdentityProviderForm = createLazyRoute(
  () => import('./components/WebsiteSsoIdentityProviderForm'),
)
const WebsiteSsoServiceProviderForm = createLazyRoute(
  () => import('./components/WebsiteSsoServiceProviderForm'),
)

const pluginMetadata = {
  menus: [
    {
      title: 'menus.saml',
      icon: 'saml',
      path: PLUGIN_BASE_APTH,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
  ],
  routes: [
    {
      component: SamlPage,
      path: PLUGIN_BASE_APTH,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: SamlPage,
      path: `${PLUGIN_BASE_APTH}/config`,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: SamlPage,
      path: `${PLUGIN_BASE_APTH}/service-providers`,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: SamlPage,
      path: `${PLUGIN_BASE_APTH}/identity-providers`,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoIdentityProviderForm,
      path: `${PLUGIN_BASE_APTH}/identity-providers/edit`,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoIdentityProviderForm,
      path: `${PLUGIN_BASE_APTH}/identity-providers/add`,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoServiceProviderForm,
      path: `${PLUGIN_BASE_APTH}/service-providers/edit`,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoServiceProviderForm,
      path: `${PLUGIN_BASE_APTH}/service-providers/add`,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
  ],
  reducers: [],
}

export default pluginMetadata
