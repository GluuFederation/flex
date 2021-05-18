import AcrsPage from './Components/Configuration/AcrsPage'
import CachePage from './Components/Configuration/CachePage'
import CouchbasePage from './Components/Configuration/CouchbasePage'
import LdapListPage from './Components/Configuration/LdapListPage'
import LdapAddPage from './Components/Configuration/LdapAddPage'
import LdapEditPage from './Components/Configuration/LdapEditPage'
import acrReducer from './redux/reducers/AcrReducer'
import cacheReducer from './redux/reducers/CacheReducer'
import couchbaseReducer from './redux/reducers/CouchbaseReducer'
import ldapReducer from './redux/reducers/LdapReducer'
import smtpReducer from './redux/reducers/SmtpReducer'
import acrsSaga from './redux/sagas/AcrsSaga'
import cacheSaga from './redux/sagas/CacheSaga'
import couchbaseSaga from './redux/sagas/CouchbaseSaga'
import ldapSaga from './redux/sagas/LdapSaga'
import smtpSaga from './redux/sagas/SmtpSaga'

const pluginMetadata = {
  menus: [
    {
      title: 'Services',
      icon: 'fa-gears',
      children: [
        {
          title: 'ACRs',
          path: '/config/acrs',
          permission: '/config/acrs.readonly',
        },
        {
          title: 'Cache',
          path: '/config/cache',
          permission: '/config/cache.readonly',
        },
        {
          icon: 'fa-database',
          title: 'Persistence',
          children: [
            {
              title: 'Ldap',
              path: '/config/ldap',
              permission: '/config/database/ldap.readonly',
            },
            {
              title: 'Couchbase',
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
      component: AcrsPage,
      path: '/config/acrs',
      permission: '/config/acrs.readonly',
    },
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
    { name: 'acrReducer', reducer: acrReducer },
    { name: 'cacheReducer', reducer: cacheReducer },
    { name: 'couchbaseReducer', reducer: couchbaseReducer },
    { name: 'ldapReducer', reducer: ldapReducer },
    { name: 'smtpReducer', reducer: smtpReducer },
  ],
  sagas: [
    acrsSaga(),
    cacheSaga(),
    couchbaseSaga(),
    ldapSaga(),
    smtpSaga(),
  ],
}

export default pluginMetadata
