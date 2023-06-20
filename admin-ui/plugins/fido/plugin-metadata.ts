import { reducer as fidoReducer } from './domain/redux/features/fidoSlice'
import fidoSaga from './domain/redux/sagas/FidoSaga'
import { FIDO_READ, FIDO_WRITE } from '../../app/utils/PermChecker'
import Fido from './presentation/pages/Fido'

const PLUGIN_BASE_PATH = '/fido'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.fido',
      icon: 'fidomanagement',
      path: PLUGIN_BASE_PATH + '/fidomanagement',
      permission: FIDO_READ,
    },
  ],
  routes: [
    {
      component: Fido,
      path: PLUGIN_BASE_PATH + '/fidomanagement',
      permission: FIDO_WRITE,
    }
  ],
  reducers: [{ name: 'fidoReducer', reducer: fidoReducer }],
  sagas: [fidoSaga()],
}

export default pluginMetadata
