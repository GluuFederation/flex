import { reducer as scimReducer } from './redux/features/ScimSlice'
import scimSaga from './redux/sagas/ScimSaga'
import { SCIM_CONFIG_READ, SCIM_CONFIG_WRITE } from 'Utils/PermChecker'
import ScimPage from './components/ScimPage'

const PLUGIN_BASE_PATH = '/scim'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.scim',
      icon: 'scim',
      path: PLUGIN_BASE_PATH,
      permission: SCIM_CONFIG_READ,
    },
  ],
  routes: [
    {
      component: ScimPage,
      path: PLUGIN_BASE_PATH,
      permission: SCIM_CONFIG_WRITE,
    },
  ],
  reducers: [{ name: 'scimReducer', reducer: scimReducer }],
  sagas: [scimSaga()],
}

export default pluginMetadata
