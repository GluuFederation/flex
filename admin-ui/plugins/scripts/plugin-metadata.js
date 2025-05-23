import { SCRIPT_READ, SCRIPT_WRITE } from '../../app/utils/PermChecker'
import { reducer as scriptReducer } from 'Plugins/admin/redux/features/customScriptSlice'
import ScriptListPage from '../admin/components/CustomScripts/ScriptListPage'
import CustomScriptAddPage from '../admin/components/CustomScripts/CustomScriptAddPage'
import CustomScriptEditPage from '../admin/components/CustomScripts/CustomScriptEditPage'
import scriptSaga from '../admin/redux/sagas/CustomScriptSaga'

const PLUGIN_PATH = '/adm/scripts'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.scripts',
      icon: 'scripts',
      path: PLUGIN_PATH,
      permission: SCRIPT_READ
    }
  ],
  routes: [
    {
      component: ScriptListPage,
      path: PLUGIN_PATH,
      permission: SCRIPT_READ
    },
    {
      component: CustomScriptAddPage,
      path: `${PLUGIN_PATH}/new`,
      permission: SCRIPT_WRITE
    },
    {
      component: CustomScriptEditPage,
      path: `${PLUGIN_PATH}/edit/:id`,
      permission: SCRIPT_READ
    }
  ],
  reducers: [{ name: 'scriptReducer', reducer: scriptReducer }],
  sagas: [scriptSaga()]
}

export default pluginMetadata
