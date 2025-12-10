import { JANS_LOCK_READ } from 'Utils/PermChecker'
import JansLock from './components/JansLock'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'

const pluginMetadata = {
  menus: [
    {
      title: 'titles.jans_lock',
      icon: 'jans_lock',
      path: ROUTES.JANS_LOCK_BASE,
      permission: JANS_LOCK_READ,
      resourceKey: ADMIN_UI_RESOURCES.Lock,
    },
  ],
  routes: [
    {
      component: JansLock,
      path: ROUTES.JANS_LOCK_BASE,
      permission: JANS_LOCK_READ,
      resourceKey: ADMIN_UI_RESOURCES.Lock,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
