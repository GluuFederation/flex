import { SAML_READ, SAML_WRITE, SAML_CONFIG_READ, SAML_TR_READ } from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
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
      permission: SAML_READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
  ],
  routes: [
    {
      component: SamlPage,
      path: PLUGIN_BASE_APTH,
      permission: SAML_READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: SamlPage,
      path: `${PLUGIN_BASE_APTH}/config`,
      permission: SAML_CONFIG_READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: SamlPage,
      path: `${PLUGIN_BASE_APTH}/service-providers`,
      permission: SAML_TR_READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: SamlPage,
      path: `${PLUGIN_BASE_APTH}/identity-providers`,
      permission: SAML_READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoIdentityProviderForm,
      path: `${PLUGIN_BASE_APTH}/identity-providers/edit`,
      permission: SAML_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoIdentityProviderForm,
      path: `${PLUGIN_BASE_APTH}/identity-providers/add`,
      permission: SAML_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoServiceProviderForm,
      path: `${PLUGIN_BASE_APTH}/service-providers/edit`,
      permission: SAML_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoServiceProviderForm,
      path: `${PLUGIN_BASE_APTH}/service-providers/add`,
      permission: SAML_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
