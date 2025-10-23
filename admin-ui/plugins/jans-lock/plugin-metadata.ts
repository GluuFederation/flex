import { JANS_LOCK_READ } from 'Utils/PermChecker'
import JansLock from './components/JansLock'

const PLUGIN_BASE_PATH = '/jans-lock'

const pluginMetadata = {
  menus: [
    {
      title: 'titles.jans_lock',
      icon: 'jans_lock',
      path: PLUGIN_BASE_PATH,
      permission: JANS_LOCK_READ,
    },
  ],
  routes: [
    {
      component: JansLock,
      path: PLUGIN_BASE_PATH,
      permission: JANS_LOCK_READ,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
