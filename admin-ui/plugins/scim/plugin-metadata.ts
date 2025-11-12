import { SCIM_CONFIG_READ, SCIM_CONFIG_WRITE } from 'Utils/PermChecker'
import ScimPage from './components/ScimPage'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'

const PLUGIN_BASE_PATH = '/scim'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.scim',
      icon: 'scim',
      path: PLUGIN_BASE_PATH,
      permission: SCIM_CONFIG_READ,
      resourceKey: ADMIN_UI_RESOURCES.SCIM,
    },
  ],
  routes: [
    {
      component: ScimPage,
      path: PLUGIN_BASE_PATH,
      permission: SCIM_CONFIG_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SCIM,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
