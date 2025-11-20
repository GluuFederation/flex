import { SCRIPT_READ, SCRIPT_WRITE } from '../../app/utils/PermChecker'
import { ScriptListPage, ScriptAddPage, ScriptEditPage } from '../admin/components/CustomScripts'

const BASE_PLUGIN_PATH = '/adm'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.scripts',
      icon: 'scripts',
      path: `${BASE_PLUGIN_PATH}/scripts`,
      permission: SCRIPT_READ,
    },
  ],
  routes: [
    {
      component: ScriptListPage,
      path: BASE_PLUGIN_PATH + '/scripts',
      permission: SCRIPT_READ,
    },
    {
      component: ScriptAddPage,
      path: BASE_PLUGIN_PATH + '/script/new',
      permission: SCRIPT_WRITE,
    },
    {
      component: ScriptEditPage,
      path: BASE_PLUGIN_PATH + '/script/edit/:id',
      permission: SCRIPT_WRITE,
    },
    {
      component: ScriptEditPage,
      path: BASE_PLUGIN_PATH + '/script/view/:id',
      permission: SCRIPT_READ,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
