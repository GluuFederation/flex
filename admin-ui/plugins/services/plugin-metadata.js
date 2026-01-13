import CachePage from './Components/Configuration/CachePage'
import LdapListPage from './Components/Configuration/LdapListPage'
import LdapAddPage from './Components/Configuration/LdapAddPage'
import LdapEditPage from './Components/Configuration/LdapEditPage'
import PersistenceDetail from './Components/Configuration/PersistenceDetail'

import {
  CACHE_READ,
  CACHE_WRITE,
  LDAP_READ,
  LDAP_WRITE,
  PERSISTENCE_DETAIL,
} from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.services',
      icon: 'services',
      children: [
        {
          title: 'menus.cache',
          path: ROUTES.SERVICES_CACHE,
          permission: CACHE_READ,
          resourceKey: ADMIN_UI_RESOURCES.Cache,
        },
        {
          title: 'menus.persistence',
          path: ROUTES.SERVICES_PERSISTENCE,
          permission: PERSISTENCE_DETAIL,
          resourceKey: ADMIN_UI_RESOURCES.Persistence,
        },
      ],
    },
  ],
  routes: [
    {
      component: CachePage,
      path: ROUTES.SERVICES_CACHE,
      permission: CACHE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Cache,
    },
    {
      component: PersistenceDetail,
      path: ROUTES.SERVICES_PERSISTENCE,
      permission: PERSISTENCE_DETAIL,
      resourceKey: ADMIN_UI_RESOURCES.Persistence,
    },
    {
      component: LdapEditPage,
      path: ROUTES.LDAP_EDIT_TEMPLATE,
      permission: CACHE_WRITE,
    },
    {
      component: LdapAddPage,
      path: ROUTES.LDAP_ADD,
      permission: LDAP_WRITE,
    },
    {
      component: LdapListPage,
      path: ROUTES.LDAP_LIST,
      permission: LDAP_READ,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
