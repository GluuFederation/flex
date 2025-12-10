import CachePage from './Components/Configuration/CachePage'
import CouchbasePage from './Components/Configuration/CouchbasePage'
import LdapListPage from './Components/Configuration/LdapListPage'
import LdapAddPage from './Components/Configuration/LdapAddPage'
import LdapEditPage from './Components/Configuration/LdapEditPage'
import SqlListPage from './Components/Configuration/SqlListPage'
import SqlAddPage from './Components/Configuration/SqlAddPage'
import SqlEditPage from './Components/Configuration/SqlEditPage'
import PersistenceDetail from './Components/Configuration/PersistenceDetail'
import { reducer as cacheReducer } from './redux/features/cacheSlice'
import { reducer as couchbaseReducer } from './redux/features/couchbaseSlice'
import { reducer as ldapReducer } from './redux/features/ldapSlice'
import { reducer as sqlReducer } from './redux/features/sqlSlice'
import { reducer as persistenceTypeReducer } from './redux/features/persistenceTypeSlice'
import cacheSaga from './redux/sagas/CacheSaga'
import couchbaseSaga from './redux/sagas/CouchbaseSaga'
import ldapSaga from './redux/sagas/LdapSaga'
import sqlSaga from './redux/sagas/SqlSaga'
import persistenceTypeSaga from './redux/sagas/PersistenceTypeSaga'

import {
  CACHE_READ,
  CACHE_WRITE,
  COUCHBASE_READ,
  LDAP_READ,
  LDAP_WRITE,
  SQL_READ,
  SQL_WRITE,
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
    {
      component: SqlEditPage,
      path: ROUTES.SQL_EDIT_TEMPLATE,
      permission: SQL_WRITE,
    },
    {
      component: SqlAddPage,
      path: ROUTES.SQL_ADD,
      permission: SQL_WRITE,
    },
    {
      component: SqlListPage,
      path: ROUTES.SQL_LIST,
      permission: SQL_READ,
    },
    {
      component: CouchbasePage,
      path: ROUTES.SERVICES_COUCHBASE,
      permission: COUCHBASE_READ,
    },
  ],
  reducers: [
    { name: 'cacheReducer', reducer: cacheReducer },
    { name: 'couchbaseReducer', reducer: couchbaseReducer },
    { name: 'ldapReducer', reducer: ldapReducer },
    { name: 'sqlReducer', reducer: sqlReducer },
    { name: 'persistenceTypeReducer', reducer: persistenceTypeReducer },
  ],
  sagas: [cacheSaga(), couchbaseSaga(), ldapSaga(), sqlSaga(), persistenceTypeSaga()],
}

export default pluginMetadata
