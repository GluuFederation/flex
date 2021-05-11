import AcrsPage from './Components/Configuration/AcrsPage'
import CachePage from './Components/Configuration/CachePage'
import CouchbasePage from './Components/Configuration/CouchbasePage'
import JwksPage from './Components/Configuration/JwksPage'
import LdapListPage from './Components/Configuration/LdapListPage'
import LdapAddPage from './Components/Configuration/LdapAddPage'
import LdapEditPage from './Components/Configuration/LdapEditPage'

import acrReducer from './redux/reducers/AcrReducer'
import cacheReducer from './redux/reducers/CacheReducer'
import couchbaseReducer from './redux/reducers/CouchbaseReducer'
import jwksReducer from './redux/reducers/JwksReducer'
import ldapReducer from './redux/reducers/LdapReducer'
import smtpReducer from './redux/reducers/SmtpReducer'

import acrsSaga from './redux/sagas/AcrsSaga'
import cacheSaga from './redux/sagas/CacheSaga'
import couchbaseSaga from './redux/sagas/CouchbaseSaga'
import jwksSaga from './redux/sagas/JwksSaga'
import ldapSaga from './redux/sagas/LdapSaga'
import smtpSaga from './redux/sagas/SmtpSaga'

const pluginMetadata = {
  menus: [
    {
      title: 'Services',
      icon: 'fa-gears',
      children: [
        { title: 'ACRs', icon: 'fa-gears', path: '/config/acrs' },
        { title: 'Cache', icon: 'fa-gears', path: '/config/cache' },
        { title: 'JWKS', icon: 'fa-gears', path: '/config/jwks' },
        {
          icon: 'fa-database',
          title: 'Persistence',
          children: [
            { title: 'Ldap', path: '/config/ldap' },
            {
              title: 'Couchbase',
              path: '/config/couchbase',
            },
          ],
        },
      ],
    },
  ],
  routes: [
    { component: AcrsPage, path: '/config/acrs' },
    { component: CachePage, path: '/config/cache' },
    { component: JwksPage, path: '/config/jwks' },
    { component: LdapEditPage, path: '/config/ldap/edit:configId' },
    { component: LdapAddPage, path: '/config/ldap/new' },
    { component: LdapListPage, path: '/config/ldap' },
    { component: CouchbasePage, path: '/config/couchbase' },
  ],
  reducers: [
    { name: 'acrReducer', reducer: acrReducer },
    { name: 'cacheReducer', reducer: cacheReducer },
    { name: 'couchbaseReducer', reducer: couchbaseReducer },
    { name: 'jwksReducer', reducer: jwksReducer },
    { name: 'ldapReducer', reducer: ldapReducer },
    { name: 'smtpReducer', reducer: smtpReducer },
  ],
  sagas: [
    acrsSaga(),
    cacheSaga(),
    couchbaseSaga(),
    jwksSaga(),
    ldapSaga(),
    smtpSaga(),
  ],
}

export default pluginMetadata
