import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { CREATE, UPDATE, DELETION, PATCH } from '@/audit/UserActionType'
import type { AuthRootState } from 'Utils/types'
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

function useAuditAuth() {
  const authState = useSelector((state: AuthRootState) => state.authReducer)

  return useMemo(
    () => ({
      client_id: authState?.config?.clientId,
      userinfo: authState?.userinfo,
    }),
    [authState?.config?.clientId, authState?.userinfo],
  )
}

export function useLdapAudit() {
  const { client_id, userinfo } = useAuditAuth()

  const logLdapCreate = useCallback(
    async (
      ldap: GluuLdapConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      try {
        await logAuditUserAction({
          userinfo,
          action: CREATE,
          resource: API_LDAP,
          message,
          modifiedFields,
          performedOn: ldap.configId,
          client_id,
          payload: ldap,
        })
      } catch (error) {
        console.error('Failed to log LDAP create audit:', error)
      }
    },
    [userinfo, client_id],
  )

  const logLdapUpdate = useCallback(
    async (
      ldap: GluuLdapConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      try {
        await logAuditUserAction({
          userinfo,
          action: UPDATE,
          resource: API_LDAP,
          message,
          modifiedFields,
          performedOn: ldap.configId,
          client_id,
          payload: ldap,
        })
      } catch (error) {
        console.error('Failed to log LDAP update audit:', error)
      }
    },
    [userinfo, client_id],
  )

  const logLdapDelete = useCallback(
    async (ldap: GluuLdapConfiguration, message: string) => {
      try {
        await logAuditUserAction({
          userinfo,
          action: DELETION,
          resource: API_LDAP,
          message,
          performedOn: ldap.configId,
          client_id,
          payload: ldap,
        })
      } catch (error) {
        console.error('Failed to log LDAP delete audit:', error)
      }
    },
    [userinfo, client_id],
  )

  return { logLdapCreate, logLdapUpdate, logLdapDelete }
}

export function useSqlAudit() {
  const { client_id, userinfo } = useAuditAuth()

  const logSqlCreate = useCallback(
    async (sql: SqlConfiguration, message: string, modifiedFields?: Record<string, unknown>) => {
      try {
        await logAuditUserAction({
          userinfo,
          action: CREATE,
          resource: API_SQL,
          message,
          modifiedFields,
          performedOn: sql.configId,
          client_id,
          payload: sql,
        })
      } catch (error) {
        console.error('Failed to log SQL create audit:', error)
      }
    },
    [userinfo, client_id],
  )

  const logSqlUpdate = useCallback(
    async (sql: SqlConfiguration, message: string, modifiedFields?: Record<string, unknown>) => {
      try {
        await logAuditUserAction({
          userinfo,
          action: UPDATE,
          resource: API_SQL,
          message,
          modifiedFields,
          performedOn: sql.configId,
          client_id,
          payload: sql,
        })
      } catch (error) {
        console.error('Failed to log SQL update audit:', error)
      }
    },
    [userinfo, client_id],
  )

  const logSqlDelete = useCallback(
    async (sql: SqlConfiguration, message: string) => {
      try {
        await logAuditUserAction({
          userinfo,
          action: DELETION,
          resource: API_SQL,
          message,
          performedOn: sql.configId,
          client_id,
          payload: sql,
        })
      } catch (error) {
        console.error('Failed to log SQL delete audit:', error)
      }
    },
    [userinfo, client_id],
  )

  return { logSqlCreate, logSqlUpdate, logSqlDelete }
}

export function useCacheAudit() {
  const { client_id, userinfo } = useAuditAuth()

  const logCacheUpdate = useCallback(
    async (
      cache: CacheConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      try {
        await logAuditUserAction({
          userinfo,
          action: PATCH,
          resource: API_CACHE,
          message,
          modifiedFields,
          performedOn: cache.cacheProviderType,
          client_id,
          payload: cache,
        })
      } catch (error) {
        console.error('Failed to log cache update audit:', error)
      }
    },
    [userinfo, client_id],
  )

  return { logCacheUpdate }
}

export function useCouchbaseAudit() {
  const { client_id, userinfo } = useAuditAuth()

  const logCouchbaseCreate = useCallback(
    async (
      couchbase: CouchbaseConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      try {
        await logAuditUserAction({
          userinfo,
          action: CREATE,
          resource: API_COUCHBASE,
          message,
          modifiedFields,
          performedOn: couchbase.configId,
          client_id,
          payload: couchbase,
        })
      } catch (error) {
        console.error('Failed to log Couchbase create audit:', error)
      }
    },
    [userinfo, client_id],
  )

  const logCouchbaseUpdate = useCallback(
    async (
      couchbase: CouchbaseConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      try {
        await logAuditUserAction({
          userinfo,
          action: UPDATE,
          resource: API_COUCHBASE,
          message,
          modifiedFields,
          performedOn: couchbase.configId,
          client_id,
          payload: couchbase,
        })
      } catch (error) {
        console.error('Failed to log Couchbase update audit:', error)
      }
    },
    [userinfo, client_id],
  )

  return { logCouchbaseCreate, logCouchbaseUpdate }
}
