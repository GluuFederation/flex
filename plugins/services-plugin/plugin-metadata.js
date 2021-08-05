import CachePage from './Components/Configuration/CachePage'
import CouchbasePage from './Components/Configuration/CouchbasePage'
import LdapListPage from './Components/Configuration/LdapListPage'
import LdapAddPage from './Components/Configuration/LdapAddPage'
import LdapEditPage from './Components/Configuration/LdapEditPage'
import SqlListPage from './Components/Configuration/SqlListPage'
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

const pluginMetadata = {
  menus: [
    {
      title: 'menus.services',
      icon: 'fa-gears',
      children: [
        {
          title: 'menus.cache',
          path: '/config/cache',
          permission: '/config/cache.readonly',
        },
        {
          title: 'menus.persistence',
          children: [
            {
              title: 'menus.ldap',
              path: '/config/ldap',
              permission: '/config/database/ldap.readonly',
            },
            {
              title: 'menus.couchbase',
              path: '/config/couchbase',
              permission: '/config/database/couchbase.readonly',
            },
            {
              title: 'menus.sql',
              path: '/config/sql',
              permission: '/config/database/sql.readonly',
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
      permission: '/config/cache.readonly',
    },
    {
      component: LdapEditPage,
      path: '/config/ldap/edit:configId',
      permission: '/config/database/ldap.readonly',
    },
    {
      component: LdapAddPage,
      path: '/config/ldap/new',
      permission: '/config/database/ldap.readonly',
    },
    {
      component: LdapListPage,
      path: '/config/ldap',
      permission: '/config/database/ldap.readonly',
    },
    {
      component: SqlListPage,
      path: '/config/sql',
      permission: '/config/database/sql.readonly',
    },
    {
      component: CouchbasePage,
      path: '/config/couchbase',
      permission: '/config/database/couchbase.readonly',
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
  sagas: [cacheSaga(), couchbaseSaga(), ldapSaga(), smtpSaga(), sqlSaga(), persistenceTypeSaga(),],
}

export default pluginMetadata
