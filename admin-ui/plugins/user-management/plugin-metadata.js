import UserList from './components/UserManagement/UserList'
import UserAddPage from './components/UserManagement/UserAddPage'
import UserEditPage from './components/UserManagement/UserEditPage'
import userSaga from './redux/sagas/UserSaga'
import userReducer from './redux/reducers/UserReducer'
import {
  ACR_READ,
  ROLE_READ,
  PERMISSION_READ,
  SCRIPT_READ,
  SCRIPT_WRITE,
  MAPPING_READ,
} from '../../app/utils/PermChecker'

const PLUGIN_BASE_APTH = '/user'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.users',
      icon: 'fa-cubes',
      children: [
        {
          title: 'menus.user-management',
          path: PLUGIN_BASE_APTH + '/usersmanagement',
          permission: SCRIPT_READ,
        },
      ],
    },
  ],
  routes: [
    {
      component: UserList,
      path: PLUGIN_BASE_APTH + '/usersmanagement',
      permission: ACR_READ,
    },
    {
      component: UserAddPage,
      path: PLUGIN_BASE_APTH + '/usermanagement/add',
      permission: ACR_READ,
    },
    {
      component: UserEditPage,
      path: PLUGIN_BASE_APTH + '/usermanagement/edit:id',
      permission: SCRIPT_WRITE,
    },
  ],
  reducers: [{ name: 'userReducer', reducer: userReducer }],
  sagas: [userSaga()],
}

export default pluginMetadata
