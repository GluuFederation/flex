import { FIDO_READ, FIDO_WRITE } from 'Utils/PermChecker'
import Fido from './components/Fido'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'

const PLUGIN_BASE_PATH = '/fido'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.fido',
      icon: 'fidomanagement',
      path: PLUGIN_BASE_PATH + '/fidomanagement',
      permission: FIDO_READ,
      resourceKey: ADMIN_UI_RESOURCES.FIDO,
    },
  ],
  routes: [
    {
      component: Fido,
      path: PLUGIN_BASE_PATH + '/fidomanagement',
      permission: FIDO_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.FIDO,
    },
    {
      component: Fido,
      path: PLUGIN_BASE_PATH + '/fidomanagement' + '/static-configuration',
      permission: FIDO_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.FIDO,
    },
    {
      component: Fido,
      path: PLUGIN_BASE_PATH + '/fidomanagement' + '/dynamic-configuration',
      permission: FIDO_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.FIDO,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
