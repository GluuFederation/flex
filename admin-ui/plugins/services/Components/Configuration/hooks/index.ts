import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { CREATE, UPDATE, DELETION, PATCH } from '@/audit/UserActionType'
import type {
  GluuLdapConfiguration,
  SqlConfiguration,
  CacheConfiguration,
  CouchbaseConfiguration,
} from 'JansConfigApi'

const API_LDAP = 'api-ldap'
const API_SQL = 'api-sql'
const API_CACHE = 'api-cache'
const API_COUCHBASE = 'api-couchbase'

interface AuthState {
  token?: {
    access_token: string
  }
  config?: {
    clientId: string
  }
  userinfo?: {
    inum: string
    name: string
  } | null
}

interface RootState {
  authReducer: AuthState
}

export function useLdapAudit() {
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logLdapCreate = useCallback(
    async (
      ldap: GluuLdapConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: CREATE,
        resource: API_LDAP,
        message,
        modifiedFields,
        performedOn: ldap.configId,
        client_id,
        payload: ldap,
      })
    },
    [token, userinfo, client_id],
  )

  const logLdapUpdate = useCallback(
    async (
      ldap: GluuLdapConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: UPDATE,
        resource: API_LDAP,
        message,
        modifiedFields,
        performedOn: ldap.configId,
        client_id,
        payload: ldap,
      })
    },
    [token, userinfo, client_id],
  )

  const logLdapDelete = useCallback(
    async (configId: string, message: string) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: DELETION,
        resource: API_LDAP,
        message,
        performedOn: configId,
        client_id,
      })
    },
    [token, userinfo, client_id],
  )

  return { logLdapCreate, logLdapUpdate, logLdapDelete }
}

export function useSqlAudit() {
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logSqlCreate = useCallback(
    async (
      sql: SqlConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: CREATE,
        resource: API_SQL,
        message,
        modifiedFields,
        performedOn: sql.configId,
        client_id,
        payload: sql,
      })
    },
    [token, userinfo, client_id],
  )

  const logSqlUpdate = useCallback(
    async (
      sql: SqlConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: UPDATE,
        resource: API_SQL,
        message,
        modifiedFields,
        performedOn: sql.configId,
        client_id,
        payload: sql,
      })
    },
    [token, userinfo, client_id],
  )

  const logSqlDelete = useCallback(
    async (configId: string, message: string) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: DELETION,
        resource: API_SQL,
        message,
        performedOn: configId,
        client_id,
      })
    },
    [token, userinfo, client_id],
  )

  return { logSqlCreate, logSqlUpdate, logSqlDelete }
}

export function useCacheAudit() {
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logCacheUpdate = useCallback(
    async (
      cache: CacheConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: PATCH,
        resource: API_CACHE,
        message,
        modifiedFields,
        performedOn: cache.cacheProviderType,
        client_id,
        payload: cache,
      })
    },
    [token, userinfo, client_id],
  )

  return { logCacheUpdate }
}

export function useCouchbaseAudit() {
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logCouchbaseCreate = useCallback(
    async (
      couchbase: CouchbaseConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: CREATE,
        resource: API_COUCHBASE,
        message,
        modifiedFields,
        performedOn: couchbase.configId,
        client_id,
        payload: couchbase,
      })
    },
    [token, userinfo, client_id],
  )

  const logCouchbaseUpdate = useCallback(
    async (
      couchbase: CouchbaseConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: UPDATE,
        resource: API_COUCHBASE,
        message,
        modifiedFields,
        performedOn: couchbase.configId,
        client_id,
        payload: couchbase,
      })
    },
    [token, userinfo, client_id],
  )

  return { logCouchbaseCreate, logCouchbaseUpdate }
}
