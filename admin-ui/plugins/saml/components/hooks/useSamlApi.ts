import { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetSamlProperties,
  usePutSamlProperties,
  useGetSamlIdentityProvider,
  usePostSamlIdentityProvider,
  usePutSamlIdentityProvider,
  useDeleteSamlIdentityProvider,
  useGetTrustRelationships,
  usePostTrustRelationshipMetadataFile,
  usePutTrustRelationship,
  useDeleteTrustRelationship,
  getGetSamlPropertiesQueryKey,
  getGetSamlIdentityProviderQueryKey,
  getGetTrustRelationshipsQueryKey,
  TrustRelationshipSpMetaDataSourceType,
  type SamlAppConfiguration,
  type IdentityProvider as OrvalIdentityProvider,
  type TrustRelationship as OrvalTrustRelationship,
  type BrokerIdentityProviderForm,
  type TrustRelationshipForm,
  type GetSamlIdentityProviderParams,
  type IdentityProviderPagedResult,
} from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { logAuditUserAction, type BasicUserInfo } from 'Utils/AuditLogger'
import { CREATE, UPDATE, DELETION } from '@/audit/UserActionType'
import { AUDIT_RESOURCE_NAMES } from '../../helper/constants'
import type { RootState } from '@/redux/sagas/types/audit'

export interface IdentityProvider extends OrvalIdentityProvider {
  idpMetaDataFN?: string
  config?: {
    singleSignOnServiceUrl?: string
    nameIDPolicyFormat?: string
    idpEntityId?: string
    singleLogoutServiceUrl?: string
    signingCertificate?: string
    encryptionPublicKey?: string
    principalAttribute?: string
    principalType?: string
    validateSignature?: string
    [key: string]: unknown
  }
}

export interface TrustRelationship extends OrvalTrustRelationship {
  spMetaDataFN?: string
}

const SAML_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
}

export const SAML_QUERY_KEYS = {
  configuration: getGetSamlPropertiesQueryKey,
  identityProviders: getGetSamlIdentityProviderQueryKey,
  trustRelationships: getGetTrustRelationshipsQueryKey,
} as const

export type {
  SamlAppConfiguration,
  BrokerIdentityProviderForm,
  TrustRelationshipForm,
  GetSamlIdentityProviderParams,
  IdentityProviderPagedResult,
}

export { TrustRelationshipSpMetaDataSourceType }

interface AuditContext {
  userinfo: BasicUserInfo | null | undefined
  clientId: string | undefined
  ipAddress: string | undefined
}

function useAuditContext(): AuditContext {
  const userinfo = useSelector((state: RootState) => state.authReducer?.userinfo)
  const clientId = useSelector((state: RootState) => state.authReducer?.config?.clientId)
  const ipAddress = useSelector((state: RootState) => state.authReducer?.location?.IPv4)

  return { userinfo, clientId, ipAddress }
}

type AuditAction = typeof CREATE | typeof UPDATE | typeof DELETION

function createAuditLogger<T>(
  auditContext: AuditContext,
  action: AuditAction,
  resource: string,
  payloadMapper: (data: T) => unknown,
) {
  return async (userMessage: string, data: T): Promise<void> => {
    try {
      await logAuditUserAction({
        userinfo: auditContext.userinfo,
        action,
        resource,
        message: userMessage,
        extra: auditContext.ipAddress ? { ip_address: auditContext.ipAddress } : {},
        client_id: auditContext.clientId,
        payload: payloadMapper(data),
      })
    } catch (error) {
      console.error(`Failed to log ${resource} audit action:`, error)
    }
  }
}

interface UpdateSamlConfigurationParams {
  data: SamlAppConfiguration
  userMessage: string
}

interface CreateIdentityProviderParams {
  data: BrokerIdentityProviderForm
  userMessage: string
}

interface UpdateIdentityProviderParams {
  data: BrokerIdentityProviderForm
  userMessage: string
}

interface DeleteIdentityProviderParams {
  inum: string
  userMessage: string
}

interface CreateTrustRelationshipParams {
  data: TrustRelationshipForm
  userMessage: string
}

interface UpdateTrustRelationshipParams {
  data: TrustRelationshipForm
  userMessage: string
}

interface DeleteTrustRelationshipParams {
  id: string
  userMessage: string
}

export function useSamlConfiguration() {
  const hasSession = useSelector((state: RootState) => state.authReducer?.hasSession)

  return useGetSamlProperties({
    query: {
      enabled: hasSession === true,
      staleTime: SAML_CACHE_CONFIG.STALE_TIME,
      gcTime: SAML_CACHE_CONFIG.GC_TIME,
    },
  })
}

export function useUpdateSamlConfiguration() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const auditContext = useAuditContext()
  const baseMutation = usePutSamlProperties()

  const logAudit = useCallback(
    createAuditLogger<SamlAppConfiguration>(
      auditContext,
      UPDATE,
      AUDIT_RESOURCE_NAMES.SAML,
      (data) => ({ data }),
    ),
    [auditContext.userinfo, auditContext.clientId, auditContext.ipAddress],
  )

  const mutateAsync = useCallback(
    async (params: UpdateSamlConfigurationParams): Promise<SamlAppConfiguration> => {
      const { data, userMessage } = params
      const result = await baseMutation.mutateAsync({ data })
      await queryClient.invalidateQueries({ queryKey: getGetSamlPropertiesQueryKey() })
      dispatch(updateToast(true, 'success'))
      logAudit(userMessage, data)
      return result
    },
    [baseMutation.mutateAsync, queryClient, dispatch, logAudit],
  )

  return {
    ...baseMutation,
    mutateAsync,
  }
}

export function useIdentityProviders(params?: GetSamlIdentityProviderParams) {
  const hasSession = useSelector((state: RootState) => state.authReducer?.hasSession)

  return useGetSamlIdentityProvider(params, {
    query: {
      enabled: hasSession === true,
      staleTime: SAML_CACHE_CONFIG.STALE_TIME,
      gcTime: SAML_CACHE_CONFIG.GC_TIME,
    },
  })
}

export function useCreateIdentityProvider() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const auditContext = useAuditContext()
  const baseMutation = usePostSamlIdentityProvider()
  const [savedForm, setSavedForm] = useState(false)

  const logAudit = useCallback(
    createAuditLogger<BrokerIdentityProviderForm>(
      auditContext,
      CREATE,
      AUDIT_RESOURCE_NAMES.IDENTITY_BROKERING,
      (data) => ({ identityProvider: data.identityProvider }),
    ),
    [auditContext.userinfo, auditContext.clientId, auditContext.ipAddress],
  )

  const mutateAsync = useCallback(
    async (params: CreateIdentityProviderParams): Promise<IdentityProvider> => {
      const { data, userMessage } = params
      try {
        const result = await baseMutation.mutateAsync({ data })
        await queryClient.invalidateQueries({ queryKey: getGetSamlIdentityProviderQueryKey() })
        dispatch(updateToast(true, 'success'))
        setSavedForm(true)
        logAudit(userMessage, data)
        return result
      } catch (error) {
        setSavedForm(false)
        throw error
      }
    },
    [baseMutation.mutateAsync, queryClient, dispatch, logAudit],
  )

  const resetSavedForm = useCallback(() => {
    setSavedForm(false)
  }, [])

  return {
    ...baseMutation,
    mutateAsync,
    savedForm,
    resetSavedForm,
  }
}

export function useUpdateIdentityProvider() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const auditContext = useAuditContext()
  const baseMutation = usePutSamlIdentityProvider()
  const [savedForm, setSavedForm] = useState(false)

  const logAudit = useCallback(
    createAuditLogger<BrokerIdentityProviderForm>(
      auditContext,
      UPDATE,
      AUDIT_RESOURCE_NAMES.IDENTITY_BROKERING,
      (data) => ({ identityProvider: data.identityProvider }),
    ),
    [auditContext.userinfo, auditContext.clientId, auditContext.ipAddress],
  )

  const mutateAsync = useCallback(
    async (params: UpdateIdentityProviderParams): Promise<IdentityProvider> => {
      const { data, userMessage } = params
      try {
        const result = await baseMutation.mutateAsync({ data })
        await queryClient.invalidateQueries({ queryKey: getGetSamlIdentityProviderQueryKey() })
        dispatch(updateToast(true, 'success'))
        setSavedForm(true)
        logAudit(userMessage, data)
        return result
      } catch (error) {
        setSavedForm(false)
        throw error
      }
    },
    [baseMutation.mutateAsync, queryClient, dispatch, logAudit],
  )

  const resetSavedForm = useCallback(() => {
    setSavedForm(false)
  }, [])

  return {
    ...baseMutation,
    mutateAsync,
    savedForm,
    resetSavedForm,
  }
}

export function useDeleteIdentityProvider() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const auditContext = useAuditContext()
  const baseMutation = useDeleteSamlIdentityProvider()

  const logAudit = useCallback(
    createAuditLogger<string>(
      auditContext,
      DELETION,
      AUDIT_RESOURCE_NAMES.IDENTITY_BROKERING,
      (inum) => ({ inum }),
    ),
    [auditContext.userinfo, auditContext.clientId, auditContext.ipAddress],
  )

  const mutateAsync = useCallback(
    async (params: DeleteIdentityProviderParams): Promise<void> => {
      const { inum, userMessage } = params
      try {
        await baseMutation.mutateAsync({ inum })
        await queryClient.invalidateQueries({ queryKey: getGetSamlIdentityProviderQueryKey() })
        dispatch(updateToast(true, 'success'))
        logAudit(userMessage, inum)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete identity provider'
        dispatch(updateToast(true, 'error', errorMessage))
        throw error
      }
    },
    [baseMutation.mutateAsync, queryClient, dispatch, logAudit],
  )

  return {
    ...baseMutation,
    mutateAsync,
  }
}

export function useTrustRelationships() {
  const hasSession = useSelector((state: RootState) => state.authReducer?.hasSession)

  return useGetTrustRelationships({
    query: {
      enabled: hasSession === true,
      staleTime: SAML_CACHE_CONFIG.STALE_TIME,
      gcTime: SAML_CACHE_CONFIG.GC_TIME,
    },
  })
}

export function useCreateTrustRelationship() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const auditContext = useAuditContext()
  const baseMutation = usePostTrustRelationshipMetadataFile()
  const [savedForm, setSavedForm] = useState(false)

  const logAudit = useCallback(
    createAuditLogger<TrustRelationshipForm>(
      auditContext,
      CREATE,
      AUDIT_RESOURCE_NAMES.TRUST_RELATIONSHIP,
      (data) => ({ trustRelationship: data.trustRelationship }),
    ),
    [auditContext.userinfo, auditContext.clientId, auditContext.ipAddress],
  )

  const mutateAsync = useCallback(
    async (params: CreateTrustRelationshipParams): Promise<TrustRelationship> => {
      const { data, userMessage } = params
      try {
        const result = await baseMutation.mutateAsync({ data })
        await queryClient.invalidateQueries({ queryKey: getGetTrustRelationshipsQueryKey() })
        dispatch(updateToast(true, 'success'))
        setSavedForm(true)
        logAudit(userMessage, data)
        return result
      } catch (error) {
        setSavedForm(false)
        throw error
      }
    },
    [baseMutation.mutateAsync, queryClient, dispatch, logAudit],
  )

  const resetSavedForm = useCallback(() => {
    setSavedForm(false)
  }, [])

  return {
    ...baseMutation,
    mutateAsync,
    savedForm,
    resetSavedForm,
  }
}

export function useUpdateTrustRelationship() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const auditContext = useAuditContext()
  const baseMutation = usePutTrustRelationship()
  const [savedForm, setSavedForm] = useState(false)

  const logAudit = useCallback(
    createAuditLogger<TrustRelationshipForm>(
      auditContext,
      UPDATE,
      AUDIT_RESOURCE_NAMES.TRUST_RELATIONSHIP,
      (data) => ({ trustRelationship: data.trustRelationship }),
    ),
    [auditContext.userinfo, auditContext.clientId, auditContext.ipAddress],
  )

  const mutateAsync = useCallback(
    async (params: UpdateTrustRelationshipParams): Promise<TrustRelationship> => {
      const { data, userMessage } = params
      try {
        const result = await baseMutation.mutateAsync({ data })
        await queryClient.invalidateQueries({ queryKey: getGetTrustRelationshipsQueryKey() })
        dispatch(updateToast(true, 'success'))
        setSavedForm(true)
        logAudit(userMessage, data)
        return result
      } catch (error) {
        setSavedForm(false)
        throw error
      }
    },
    [baseMutation.mutateAsync, queryClient, dispatch, logAudit],
  )

  const resetSavedForm = useCallback(() => {
    setSavedForm(false)
  }, [])

  return {
    ...baseMutation,
    mutateAsync,
    savedForm,
    resetSavedForm,
  }
}

export function useDeleteTrustRelationshipMutation() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const auditContext = useAuditContext()
  const baseMutation = useDeleteTrustRelationship()

  const logAudit = useCallback(
    createAuditLogger<string>(
      auditContext,
      DELETION,
      AUDIT_RESOURCE_NAMES.TRUST_RELATIONSHIP,
      (id) => ({ id }),
    ),
    [auditContext.userinfo, auditContext.clientId, auditContext.ipAddress],
  )

  const mutateAsync = useCallback(
    async (params: DeleteTrustRelationshipParams): Promise<void> => {
      const { id, userMessage } = params
      try {
        await baseMutation.mutateAsync({ id })
        await queryClient.invalidateQueries({ queryKey: getGetTrustRelationshipsQueryKey() })
        dispatch(updateToast(true, 'success'))
        logAudit(userMessage, id)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete trust relationship'
        dispatch(updateToast(true, 'error', errorMessage))
        throw error
      }
    },
    [baseMutation.mutateAsync, queryClient, dispatch, logAudit],
  )

  return {
    ...baseMutation,
    mutateAsync,
  }
}
