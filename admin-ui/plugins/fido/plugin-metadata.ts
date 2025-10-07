import { FIDO_READ, FIDO_WRITE } from 'Utils/PermChecker'
import Fido from './components/Fido'

const PLUGIN_BASE_PATH = '/fido'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.fido',
      icon: 'fidomanagement',
      path: PLUGIN_BASE_PATH + '/fidomanagement',
      permission: FIDO_READ,
    },
  ],
  routes: [
    {
      component: Fido,
      path: PLUGIN_BASE_PATH + '/fidomanagement',
      permission: FIDO_WRITE,
    },
    {
      component: Fido,
      path: PLUGIN_BASE_PATH + '/fidomanagement' + '/static-configuration',
      permission: FIDO_WRITE,
    },
    {
      component: Fido,
      path: PLUGIN_BASE_PATH + '/fidomanagement' + '/dynamic-configuration',
      permission: FIDO_WRITE,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
