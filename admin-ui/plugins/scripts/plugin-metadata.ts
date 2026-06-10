import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
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
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
  ],
  routes: [
    {
      component: CustomScriptListPage,
      path: ROUTES.CUSTOM_SCRIPT_LIST,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
    {
      component: CustomScriptAddPage,
      path: ROUTES.CUSTOM_SCRIPT_ADD,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
    {
      component: CustomScriptEditPage,
      path: ROUTES.CUSTOM_SCRIPT_VIEW_TEMPLATE,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
    {
      component: CustomScriptEditPage,
      path: ROUTES.CUSTOM_SCRIPT_EDIT_TEMPLATE,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
  ],
  reducers: [],
}

export default pluginMetadata
