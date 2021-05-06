import AcrsPage from './Components/Configuration/AcrsPage'
import CachePage from './Components/Configuration/CachePage'
import CouchbasePage from './Components/Configuration/CouchbasePage'
import JwksPage from './Components/Configuration/JwksPage'
import LdapListPage from './Components/Configuration/LdapListPage'

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
        { name: "Acrs", component: AcrsPage, path: "/config/acrs" },
        { name: "Cache", component: CachePage, path: "/config/cache" },
        { name: "Couchbase", component: CouchbasePage, path: "/config/couchbase" },
        { name: "Jwks", component: JwksPage, path: "/config/jwks" },
        { name: "Ldap", component: LdapListPage, path: "/config/ldap" },
    ],
    reducers: [
        { name: "acrReducer", reducer: acrReducer },
        { name: "cacheReducer", reducer: cacheReducer },
        { name: "couchbaseReducer", reducer: couchbaseReducer },
        { name: "jwksReducer", reducer: jwksReducer },
        { name: "ldapReducer", reducer: ldapReducer },
        { name: "smtpReducer", reducer: smtpReducer },
    ],
    sagas: [acrsSaga(), cacheSaga(), couchbaseSaga(), jwksSaga(), ldapSaga(), smtpSaga()]
}

export default pluginMetadata;