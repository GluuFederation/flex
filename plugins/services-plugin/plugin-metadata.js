import CachePage from './Components/Configuration/CachePage'
import CouchbasePage from './Components/Configuration/CouchbasePage'
import LdapListPage from './Components/Configuration/LdapListPage'
import LdapAddPage from './Components/Configuration/LdapAddPage'
import LdapEditPage from './Components/Configuration/LdapEditPage'
import cacheReducer from './redux/reducers/CacheReducer'
import couchbaseReducer from './redux/reducers/CouchbaseReducer'
import ldapReducer from './redux/reducers/LdapReducer'
import smtpReducer from './redux/reducers/SmtpReducer'
import cacheSaga from './redux/sagas/CacheSaga'
import couchbaseSaga from './redux/sagas/CouchbaseSaga'
import ldapSaga from './redux/sagas/LdapSaga'
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
          icon: 'fa-database',
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
      component: CouchbasePage,
      path: '/config/couchbase',
      permission: '/config/database/couchbase.readonly',
    },
  ],
  reducers: [
    { name: 'cacheReducer', reducer: cacheReducer },
    { name: 'couchbaseReducer', reducer: couchbaseReducer },
    { name: 'ldapReducer', reducer: ldapReducer },
    { name: 'smtpReducer', reducer: smtpReducer },
  ],
  sagas: [
    cacheSaga(),
    couchbaseSaga(),
    ldapSaga(),
    smtpSaga(),
  ],
}

export default pluginMetadata
