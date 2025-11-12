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

const pluginMetadata = {
  menus: [
    {
      title: 'menus.services',
      icon: 'services',
      children: [
        {
          title: 'menus.cache',
          path: '/config/cache',
          permission: CACHE_READ,
          resourceKey: ADMIN_UI_RESOURCES.Cache,
        },
        {
          title: 'menus.persistence',
          path: '/config/persistence',
          permission: PERSISTENCE_DETAIL,
          resourceKey: ADMIN_UI_RESOURCES.Persistance,
        },
      ],
    },
  ],
  routes: [
    {
      component: CachePage,
      path: '/config/cache',
      permission: CACHE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Cache,
    },
    {
      component: PersistenceDetail,
      path: '/config/persistence',
      permission: PERSISTENCE_DETAIL,
      resourceKey: ADMIN_UI_RESOURCES.Persistance,
    },
    {
      component: LdapEditPage,
      path: '/config/ldap/edit/:configId',
      permission: CACHE_WRITE,
    },
    {
      component: LdapAddPage,
      path: '/config/ldap/new',
      permission: LDAP_WRITE,
    },
    {
      component: LdapListPage,
      path: '/config/ldap',
      permission: LDAP_READ,
    },
    {
      component: SqlEditPage,
      path: '/config/sql/edit/:configId',
      permission: SQL_WRITE,
    },
    {
      component: SqlAddPage,
      path: '/config/sql/new',
      permission: SQL_WRITE,
    },
    {
      component: SqlListPage,
      path: '/config/sql',
      permission: SQL_READ,
    },
    {
      component: CouchbasePage,
      path: '/config/couchbase',
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
