import { SAML_READ, SAML_WRITE, SAML_CONFIG_READ } from 'Utils/PermChecker'
import SamlIdpAddPage from './components/SamlIdpAddPage'
import SamlIdpEditPage from './components/SamlIdpEditPage'
import SamlPage from './components/SamlPage'
import samlSaga from './redux/sagas/SamlSaga'
import samlReducer from './redux/features/SamlSlice'

const PLUGIN_BASE_APTH = '/saml'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.saml',
      icon: 'saml',
      path: PLUGIN_BASE_APTH,
      permission: SAML_READ,
    },
  ],
  routes: [
    {
      component: SamlPage,
      path: PLUGIN_BASE_APTH + '/config',
      permission: SAML_CONFIG_READ,
    },
    {
      component: SamlPage,
      path: PLUGIN_BASE_APTH,
      permission: SAML_READ,
    },
    {
      component: SamlIdpEditPage,
      path: PLUGIN_BASE_APTH + '/edit',
      permission: SAML_WRITE,
    },
    {
      component: SamlIdpAddPage,
      path: PLUGIN_BASE_APTH + '/add',
      permission: SAML_WRITE,
    },
  ],
  reducers: [{ name: 'idpSamlReducer', reducer: samlReducer }],
  sagas: [samlSaga()],
}

export default pluginMetadata
