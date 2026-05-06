import { SCRIPT_READ, SCRIPT_WRITE } from '../../app/utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const CustomScriptListPage = createLazyRoute(() => import('./components/CustomScriptListPage'))
const CustomScriptAddPage = createLazyRoute(() => import('./components/CustomScriptAddPage'))
const CustomScriptEditPage = createLazyRoute(() => import('./components/CustomScriptEditPage'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.scripts',
      icon: 'scripts',
      path: ROUTES.CUSTOM_SCRIPT_LIST,
      permission: SCRIPT_READ,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
  ],
  routes: [
    {
      component: CustomScriptListPage,
      path: ROUTES.CUSTOM_SCRIPT_LIST,
      permission: SCRIPT_READ,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
    {
      component: CustomScriptAddPage,
      path: ROUTES.CUSTOM_SCRIPT_ADD,
      permission: SCRIPT_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
    {
      component: CustomScriptEditPage,
      path: ROUTES.CUSTOM_SCRIPT_VIEW_TEMPLATE,
      permission: SCRIPT_READ,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
    {
      component: CustomScriptEditPage,
      path: ROUTES.CUSTOM_SCRIPT_EDIT_TEMPLATE,
      permission: SCRIPT_READ,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
