import { SAML_READ, SAML_WRITE, SAML_CONFIG_READ, SAML_TR_READ } from 'Utils/PermChecker'
import WebsiteSsoIdentityProviderForm from './components/WebsiteSsoIdentityProviderForm'
import SamlPage from './components/SamlPage'
import samlSaga from './redux/sagas/SamlSaga'
import samlReducer from './redux/features/SamlSlice'
import WebsiteSsoTrustRelationshipForm from './components/WebsiteSsoTrustRelationshipForm'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.saml',
      icon: 'saml',
      path: ROUTES.SAML_BASE,
      permission: SAML_READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
  ],
  routes: [
    {
      component: SamlPage,
      path: ROUTES.SAML_BASE,
      permission: SAML_READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: SamlPage,
      path: ROUTES.SAML_CONFIG,
      permission: SAML_CONFIG_READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: SamlPage,
      path: ROUTES.SAML_SP_LIST,
      permission: SAML_TR_READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: SamlPage,
      path: ROUTES.SAML_IDP_LIST,
      permission: SAML_READ,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoIdentityProviderForm,
      path: ROUTES.SAML_IDP_EDIT,
      permission: SAML_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoIdentityProviderForm,
      path: ROUTES.SAML_IDP_ADD,
      permission: SAML_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoTrustRelationshipForm,
      path: ROUTES.SAML_SP_EDIT,
      permission: SAML_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
    {
      component: WebsiteSsoTrustRelationshipForm,
      path: ROUTES.SAML_SP_ADD,
      permission: SAML_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SAML,
    },
  ],
  reducers: [{ name: 'idpSamlReducer', reducer: samlReducer }],
  sagas: [samlSaga()],
}

export default pluginMetadata
