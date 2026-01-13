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
import { logAuditUserAction } from 'Utils/AuditLogger'
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
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  return useGetSamlProperties({
    query: {
      enabled: !!authToken,
      staleTime: SAML_CACHE_CONFIG.STALE_TIME,
      gcTime: SAML_CACHE_CONFIG.GC_TIME,
    },
  })
}

export function useUpdateSamlConfiguration() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const token = useSelector((state: RootState) => state.authReducer?.token?.access_token)
  const userinfo = useSelector((state: RootState) => state.authReducer?.userinfo)
  const clientId = useSelector((state: RootState) => state.authReducer?.config?.clientId)
  const ipAddress = useSelector((state: RootState) => state.authReducer?.location?.IPv4)

  const baseMutation = usePutSamlProperties()

  const logAudit = useCallback(
    async (userMessage: string, data: SamlAppConfiguration): Promise<void> => {
      try {
        await logAuditUserAction({
          token: token ?? '',
          userinfo,
          action: UPDATE,
          resource: AUDIT_RESOURCE_NAMES.SAML,
          message: userMessage,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: { data },
        })
      } catch (error) {
        console.error('Failed to log SAML configuration audit action:', error)
      }
    },
    [token, userinfo, clientId, ipAddress],
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
    [baseMutation, queryClient, logAudit, dispatch],
  )

  return {
    ...baseMutation,
    mutateAsync,
  }
}

export function useIdentityProviders(params?: GetSamlIdentityProviderParams) {
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  return useGetSamlIdentityProvider(params, {
    query: {
      enabled: !!authToken,
      staleTime: SAML_CACHE_CONFIG.STALE_TIME,
      gcTime: SAML_CACHE_CONFIG.GC_TIME,
    },
  })
}

export function useCreateIdentityProvider() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const token = useSelector((state: RootState) => state.authReducer?.token?.access_token)
  const userinfo = useSelector((state: RootState) => state.authReducer?.userinfo)
  const clientId = useSelector((state: RootState) => state.authReducer?.config?.clientId)
  const ipAddress = useSelector((state: RootState) => state.authReducer?.location?.IPv4)

  const baseMutation = usePostSamlIdentityProvider()
  const [savedForm, setSavedForm] = useState(false)

  const logAudit = useCallback(
    async (userMessage: string, data: BrokerIdentityProviderForm): Promise<void> => {
      try {
        await logAuditUserAction({
          token: token ?? '',
          userinfo,
          action: CREATE,
          resource: AUDIT_RESOURCE_NAMES.IDENTITY_BROKERING,
          message: userMessage,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: { identityProvider: data.identityProvider },
        })
      } catch (error) {
        console.error('Failed to log IDP create audit action:', error)
      }
    },
    [token, userinfo, clientId, ipAddress],
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
        dispatch(updateToast(true, 'error'))
        throw error
      }
    },
    [baseMutation, queryClient, logAudit, dispatch],
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
  const token = useSelector((state: RootState) => state.authReducer?.token?.access_token)
  const userinfo = useSelector((state: RootState) => state.authReducer?.userinfo)
  const clientId = useSelector((state: RootState) => state.authReducer?.config?.clientId)
  const ipAddress = useSelector((state: RootState) => state.authReducer?.location?.IPv4)

  const baseMutation = usePutSamlIdentityProvider()
  const [savedForm, setSavedForm] = useState(false)

  const logAudit = useCallback(
    async (userMessage: string, data: BrokerIdentityProviderForm): Promise<void> => {
      try {
        await logAuditUserAction({
          token: token ?? '',
          userinfo,
          action: UPDATE,
          resource: AUDIT_RESOURCE_NAMES.IDENTITY_BROKERING,
          message: userMessage,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: { identityProvider: data.identityProvider },
        })
      } catch (error) {
        console.error('Failed to log IDP update audit action:', error)
      }
    },
    [token, userinfo, clientId, ipAddress],
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
        dispatch(updateToast(true, 'error'))
        throw error
      }
    },
    [baseMutation, queryClient, logAudit, dispatch],
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
  const token = useSelector((state: RootState) => state.authReducer?.token?.access_token)
  const userinfo = useSelector((state: RootState) => state.authReducer?.userinfo)
  const clientId = useSelector((state: RootState) => state.authReducer?.config?.clientId)
  const ipAddress = useSelector((state: RootState) => state.authReducer?.location?.IPv4)

  const baseMutation = useDeleteSamlIdentityProvider()

  const logAudit = useCallback(
    async (userMessage: string, inum: string): Promise<void> => {
      try {
        await logAuditUserAction({
          token: token ?? '',
          userinfo,
          action: DELETION,
          resource: AUDIT_RESOURCE_NAMES.IDENTITY_BROKERING,
          message: userMessage,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: { inum },
        })
      } catch (error) {
        console.error('Failed to log IDP delete audit action:', error)
      }
    },
    [token, userinfo, clientId, ipAddress],
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
        dispatch(updateToast(true, 'error'))
        throw error
      }
    },
    [baseMutation, queryClient, logAudit, dispatch],
  )

  return {
    ...baseMutation,
    mutateAsync,
  }
}

export function useTrustRelationships() {
  const authToken = useSelector((state: RootState) => state.authReducer?.token?.access_token)

  return useGetTrustRelationships({
    query: {
      enabled: !!authToken,
      staleTime: SAML_CACHE_CONFIG.STALE_TIME,
      gcTime: SAML_CACHE_CONFIG.GC_TIME,
    },
  })
}

export function useCreateTrustRelationship() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const token = useSelector((state: RootState) => state.authReducer?.token?.access_token)
  const userinfo = useSelector((state: RootState) => state.authReducer?.userinfo)
  const clientId = useSelector((state: RootState) => state.authReducer?.config?.clientId)
  const ipAddress = useSelector((state: RootState) => state.authReducer?.location?.IPv4)

  const baseMutation = usePostTrustRelationshipMetadataFile()
  const [savedForm, setSavedForm] = useState(false)

  const logAudit = useCallback(
    async (userMessage: string, data: TrustRelationshipForm): Promise<void> => {
      try {
        await logAuditUserAction({
          token: token ?? '',
          userinfo,
          action: CREATE,
          resource: AUDIT_RESOURCE_NAMES.TRUST_RELATIONSHIP,
          message: userMessage,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: { trustRelationship: data.trustRelationship },
        })
      } catch (error) {
        console.error('Failed to log trust relationship create audit action:', error)
      }
    },
    [token, userinfo, clientId, ipAddress],
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
        dispatch(updateToast(true, 'error'))
        throw error
      }
    },
    [baseMutation, queryClient, logAudit, dispatch],
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
  const token = useSelector((state: RootState) => state.authReducer?.token?.access_token)
  const userinfo = useSelector((state: RootState) => state.authReducer?.userinfo)
  const clientId = useSelector((state: RootState) => state.authReducer?.config?.clientId)
  const ipAddress = useSelector((state: RootState) => state.authReducer?.location?.IPv4)

  const baseMutation = usePutTrustRelationship()
  const [savedForm, setSavedForm] = useState(false)

  const logAudit = useCallback(
    async (userMessage: string, data: TrustRelationshipForm): Promise<void> => {
      try {
        await logAuditUserAction({
          token: token ?? '',
          userinfo,
          action: UPDATE,
          resource: AUDIT_RESOURCE_NAMES.TRUST_RELATIONSHIP,
          message: userMessage,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: { trustRelationship: data.trustRelationship },
        })
      } catch (error) {
        console.error('Failed to log trust relationship update audit action:', error)
      }
    },
    [token, userinfo, clientId, ipAddress],
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
        dispatch(updateToast(true, 'error'))
        throw error
      }
    },
    [baseMutation, queryClient, logAudit, dispatch],
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
  const token = useSelector((state: RootState) => state.authReducer?.token?.access_token)
  const userinfo = useSelector((state: RootState) => state.authReducer?.userinfo)
  const clientId = useSelector((state: RootState) => state.authReducer?.config?.clientId)
  const ipAddress = useSelector((state: RootState) => state.authReducer?.location?.IPv4)

  const baseMutation = useDeleteTrustRelationship()

  const logAudit = useCallback(
    async (userMessage: string, id: string): Promise<void> => {
      try {
        await logAuditUserAction({
          token: token ?? '',
          userinfo,
          action: DELETION,
          resource: AUDIT_RESOURCE_NAMES.TRUST_RELATIONSHIP,
          message: userMessage,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: { id },
        })
      } catch (error) {
        console.error('Failed to log trust relationship delete audit action:', error)
      }
    },
    [token, userinfo, clientId, ipAddress],
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
        dispatch(updateToast(true, 'error'))
        throw error
      }
    },
    [baseMutation, queryClient, logAudit, dispatch],
  )

  return {
    ...baseMutation,
    mutateAsync,
  }
}
