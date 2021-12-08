import CachePage from './Components/Configuration/CachePage'
import CouchbasePage from './Components/Configuration/CouchbasePage'
import LdapListPage from './Components/Configuration/LdapListPage'
import LdapAddPage from './Components/Configuration/LdapAddPage'
import LdapEditPage from './Components/Configuration/LdapEditPage'
import SqlListPage from './Components/Configuration/SqlListPage'
import SqlAddPage from './Components/Configuration/SqlAddPage'
import SqlEditPage from './Components/Configuration/SqlEditPage'
import cacheReducer from './redux/reducers/CacheReducer'
import couchbaseReducer from './redux/reducers/CouchbaseReducer'
import ldapReducer from './redux/reducers/LdapReducer'
import sqlReducer from './redux/reducers/SqlReducer'
import persistenceTypeReducer from './redux/reducers/PersistenceTypeReducer'
import smtpReducer from './redux/reducers/SmtpReducer'
import cacheSaga from './redux/sagas/CacheSaga'
import couchbaseSaga from './redux/sagas/CouchbaseSaga'
import ldapSaga from './redux/sagas/LdapSaga'
import sqlSaga from './redux/sagas/SqlSaga'
import persistenceTypeSaga from './redux/sagas/PersistenceTypeSaga'
import smtpSaga from './redux/sagas/SmtpSaga'
import {
  CACHE_READ,
  CACHE_WRITE,
  COUCHBASE_READ,
  LDAP_READ,
  LDAP_WRITE,
  SQL_READ,
  SQL_WRITE,
} from '../../app/utils/PermChecker'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.services',
      icon: 'fa-gears',
      children: [
        {
          title: 'menus.cache',
          path: '/config/cache',
          permission: CACHE_READ,
        },
        {
          title: 'menus.persistence',
          children: [
            {
              title: 'menus.couchbase',
              path: '/config/couchbase',
              permission: COUCHBASE_READ,
            },
            {
              title: 'menus.ldap',
              path: '/config/ldap',
              permission: LDAP_READ,
            },
            {
              title: 'menus.sql',
              path: '/config/sql',
              permission: SQL_READ,
            },
          ],
        },
      ],
    },
  ],
  routes: [
    {
      component: CachePage,
      path: '/config/cache',
      permission: CACHE_READ,
    },
    {
      component: LdapEditPage,
      path: '/config/ldap/edit:configId',
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
      path: '/config/sql/edit:configId',
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
    { name: 'smtpReducer', reducer: smtpReducer },
    { name: 'persistenceTypeReducer', reducer: persistenceTypeReducer },
  ],
  sagas: [
    cacheSaga(),
    couchbaseSaga(),
    ldapSaga(),
    smtpSaga(),
    sqlSaga(),
    persistenceTypeSaga(),
  ],
}

export default pluginMetadata
