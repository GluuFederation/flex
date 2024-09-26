import { JANS_LOCK_READ } from 'Utils/PermChecker'
import JansLock from './components/JansLock'
const PLUGIN_BASE_PATH = '/jans-lock'
import jansLockReducer from './redux/features/JansLockSlice'
import jansLockSaga from './redux/sagas/JansLockSaga'

const pluginMetadata = {
  menus: [],
  routes: [
    {
      component: JansLock,
      path: PLUGIN_BASE_PATH,
      permission: JANS_LOCK_READ,
    },
  ],
  reducers: [{ name: 'jansLockReducer', reducer: jansLockReducer }],
  sagas: [jansLockSaga()],
}

export default pluginMetadata
