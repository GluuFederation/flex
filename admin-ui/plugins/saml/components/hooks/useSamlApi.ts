import { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import {
  useGetSamlProperties,
  usePutSamlProperties,
  useGetSamlIdentityProvider,
  useDeleteSamlIdentityProvider,
  useGetTrustRelationships,
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
import { AXIOS_INSTANCE } from '../../../../api-client'
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

// ============================================================================
// Custom API functions for multipart uploads (matching main branch approach)
// These use axios directly like the old SamlApi.ts did
// ============================================================================

/**
 * Creates FormData for Identity Provider operations
 * Matches the main branch approach exactly (same order and checks)
 */
function createIdentityProviderFormData(data: BrokerIdentityProviderForm): FormData {
  const formData = new FormData()

  // 1. Append metaDataFile FIRST if valid (matching main branch order)
  if (data.metaDataFile instanceof File && data.metaDataFile.size > 0) {
    formData.append('metaDataFile', data.metaDataFile)
  }

  // 2. Create JSON Blob with proper content type and append (matching main branch)
  const identityProviderBlob = new Blob([JSON.stringify(data.identityProvider)], {
    type: 'application/json',
  })
  formData.append('identityProvider', identityProviderBlob)

  return formData
}

/**
 * Creates FormData for Trust Relationship operations
 * Matches the main branch approach exactly (same order and checks)
 */
function createTrustRelationshipFormData(data: TrustRelationshipForm): FormData {
  const formData = new FormData()

  // 1. Append metaDataFile FIRST if valid (matching main branch order)
  if (data.metaDataFile instanceof File && data.metaDataFile.size > 0) {
    formData.append('metaDataFile', data.metaDataFile)
  }

  // 2. Create JSON Blob with proper content type and append (matching main branch)
  const trustRelationshipBlob = new Blob([JSON.stringify(data.trustRelationship)], {
    type: 'application/json',
  })
  formData.append('trustRelationship', trustRelationshipBlob)

  return formData
}

// API functions using axios directly (same as main branch SamlApi.ts)
const samlApi = {
  postIdentityProvider: async (data: BrokerIdentityProviderForm): Promise<IdentityProvider> => {
    const formData = createIdentityProviderFormData(data)
    const response = await AXIOS_INSTANCE.post<IdentityProvider>('/kc/saml/idp/upload', formData)
    return response.data
  },

  putIdentityProvider: async (data: BrokerIdentityProviderForm): Promise<IdentityProvider> => {
    const formData = createIdentityProviderFormData(data)
    const response = await AXIOS_INSTANCE.put<IdentityProvider>('/kc/saml/idp/upload', formData)
    return response.data
  },

  postTrustRelationship: async (data: TrustRelationshipForm): Promise<TrustRelationship> => {
    const formData = createTrustRelationshipFormData(data)
    const response = await AXIOS_INSTANCE.post<TrustRelationship>(
      '/kc/saml/trust-relationship/upload',
      formData,
    )
    return response.data
  },

  putTrustRelationship: async (data: TrustRelationshipForm): Promise<TrustRelationship> => {
    const formData = createTrustRelationshipFormData(data)
    const response = await AXIOS_INSTANCE.put<TrustRelationship>(
      '/kc/saml/trust-relationship/upload',
      formData,
    )
    return response.data
  },
}

// ============================================================================
// Audit logging utilities
// ============================================================================

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

// ============================================================================
// Hook parameter interfaces
// ============================================================================

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

// ============================================================================
// SAML Configuration hooks (using orval)
// ============================================================================

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

// ============================================================================
// Identity Provider hooks
// ============================================================================

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

// Uses custom axios call (matching main branch approach for multipart)
export function useCreateIdentityProvider() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const auditContext = useAuditContext()
  const [savedForm, setSavedForm] = useState(false)

  const baseMutation = useMutation({
    mutationFn: (data: BrokerIdentityProviderForm) => samlApi.postIdentityProvider(data),
  })

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
        const result = await baseMutation.mutateAsync(data)
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

// Uses custom axios call (matching main branch approach for multipart)
export function useUpdateIdentityProvider() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const auditContext = useAuditContext()
  const [savedForm, setSavedForm] = useState(false)

  const baseMutation = useMutation({
    mutationFn: (data: BrokerIdentityProviderForm) => samlApi.putIdentityProvider(data),
  })

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
        const result = await baseMutation.mutateAsync(data)
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

// Uses orval hook (DELETE doesn't need special FormData handling)
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

// ============================================================================
// Trust Relationship hooks
// ============================================================================

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

// Uses custom axios call (matching main branch approach for multipart)
export function useCreateTrustRelationship() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const auditContext = useAuditContext()
  const [savedForm, setSavedForm] = useState(false)

  const baseMutation = useMutation({
    mutationFn: (data: TrustRelationshipForm) => samlApi.postTrustRelationship(data),
  })

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
        const result = await baseMutation.mutateAsync(data)
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

// Uses custom axios call (matching main branch approach for multipart)
export function useUpdateTrustRelationship() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const auditContext = useAuditContext()
  const [savedForm, setSavedForm] = useState(false)

  const baseMutation = useMutation({
    mutationFn: (data: TrustRelationshipForm) => samlApi.putTrustRelationship(data),
  })

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
        const result = await baseMutation.mutateAsync(data)
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

// Uses orval hook (DELETE doesn't need special FormData handling)
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
