import { JANS_KC_LINK_READ, JANS_KC_LINK_WRITE } from 'Utils/PermChecker'
import JansKcLinkPage from './components/JansKcLinkPage'
import jansKcLinkSaga from './redux/sagas/JansKcLinkSaga'
import jansKcLinkReducer from './redux/features/JansKcLinkSlice'

const PLUGIN_BASE_PATH = '/jans-kc-link'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.jans_kc_link',
      icon: 'jans_link',
      path: PLUGIN_BASE_PATH,
      permission: JANS_KC_LINK_READ,
    },
  ],
  routes: [
    {
      component: JansKcLinkPage,
      path: PLUGIN_BASE_PATH,
      permission: JANS_KC_LINK_READ,
    },
    {
      component: JansKcLinkPage,
      path: PLUGIN_BASE_PATH + '/basic-configuration',
      permission: JANS_KC_LINK_READ,
    },
    {
      component: JansKcLinkPage,
      path: PLUGIN_BASE_PATH + '/inum-configuration',
      permission: JANS_KC_LINK_READ,
    },
    {
      component: JansKcLinkPage,
      path: PLUGIN_BASE_PATH + '/sources',
      permission: JANS_KC_LINK_READ,
    },
    {
      component: JansKcLinkPage,
      path: PLUGIN_BASE_PATH + '/target-configuration',
      permission: JANS_KC_LINK_READ,
    },
    {
      component: JansKcLinkPage,
      path: PLUGIN_BASE_PATH + '/keycloack-configuration',
      permission: JANS_KC_LINK_READ,
    },
  ],
  reducers: [{ name: 'jansKcLinkReducer', reducer: jansKcLinkReducer }],
  sagas: [jansKcLinkSaga()],
}

export default pluginMetadata