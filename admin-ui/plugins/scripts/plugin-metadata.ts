import { SCRIPT_READ, SCRIPT_WRITE } from '../../app/utils/PermChecker'
import { reducer as scriptReducer } from 'Plugins/admin/redux/features/customScriptSlice'
import ScriptListPage from '../admin/components/CustomScripts/ScriptListPage'
import CustomScriptAddPage from '../admin/components/CustomScripts/CustomScriptAddPage'
import CustomScriptEditPage from '../admin/components/CustomScripts/CustomScriptEditPage'
import scriptSaga from '../admin/redux/sagas/CustomScriptSaga'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'

const BASE_PLUGIN_PATH = '/adm'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.scripts',
      icon: 'scripts',
      path: `${BASE_PLUGIN_PATH}/scripts`,
      permission: SCRIPT_READ,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
  ],
  routes: [
    {
      component: ScriptListPage,
      path: BASE_PLUGIN_PATH + '/scripts',
      permission: SCRIPT_READ,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
    {
      component: CustomScriptAddPage,
      path: BASE_PLUGIN_PATH + '/script/new',
      permission: SCRIPT_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
    {
      component: CustomScriptEditPage,
      path: BASE_PLUGIN_PATH + '/script/edit/:id',
      permission: SCRIPT_READ,
      resourceKey: ADMIN_UI_RESOURCES.Scripts,
    },
  ],
  reducers: [{ name: 'scriptReducer', reducer: scriptReducer }],
  sagas: [scriptSaga()],
}

export default pluginMetadata
