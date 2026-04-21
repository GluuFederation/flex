import { useCallback, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { useAuditContext as useSharedAuditContext, CREATE, UPDATE, DELETION } from '@/audit'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { AXIOS_INSTANCE } from '../../../../api-client'
import { updateToast } from 'Redux/features/toastSlice'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { AUDIT_RESOURCE_NAMES } from '../../helper/constants'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { devLogger } from '@/utils/devLogger'
import type {
  SamlAppConfiguration,
  IdentityProvider,
  TrustRelationship,
  BrokerIdentityProviderForm,
  TrustRelationshipForm,
  GetSamlIdentityProviderParams,
  IdentityProviderPagedResult,
  SamlAuditContext,
  UpdateSamlConfigurationParams,
  CreateIdentityProviderParams,
  UpdateIdentityProviderParams,
  DeleteIdentityProviderParams,
  CreateTrustRelationshipParams,
  UpdateTrustRelationshipParams,
  DeleteTrustRelationshipParams,
} from '../../types'

export { TrustRelationshipSpMetaDataSourceType } from '../../types'
export type {
  SamlAppConfiguration,
  OrvalIdentityProvider,
  OrvalTrustRelationship,
  IdentityProvider,
  TrustRelationship,
  BrokerIdentityProviderForm,
  TrustRelationshipForm,
  GetSamlIdentityProviderParams,
  IdentityProviderPagedResult,
} from '../../types'

const getGetSamlPropertiesQueryKey = () => ['kc', 'saml', 'properties'] as const

const getGetSamlIdentityProviderQueryKey = (params?: GetSamlIdentityProviderParams) =>
  ['kc', 'saml', 'idp', params ?? {}] as const

const getGetTrustRelationshipsQueryKey = () => ['kc', 'saml', 'trust-relationships'] as const

const SAML_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
}

export const SAML_QUERY_KEYS = {
  configuration: getGetSamlPropertiesQueryKey,
  identityProviders: getGetSamlIdentityProviderQueryKey,
  trustRelationships: getGetTrustRelationshipsQueryKey,
} as const

const createIdentityProviderFormData = (data: BrokerIdentityProviderForm): FormData => {
  const formData = new FormData()

  if (data.metaDataFile instanceof File && data.metaDataFile.size > 0) {
    formData.append('metaDataFile', data.metaDataFile)
  }

  const identityProviderBlob = new Blob([JSON.stringify(data.identityProvider)], {
    type: 'application/json',
  })
  formData.append('identityProvider', identityProviderBlob)

  return formData
}

const createTrustRelationshipFormData = (data: TrustRelationshipForm): FormData => {
  const formData = new FormData()

  if (data.metaDataFile instanceof File && data.metaDataFile.size > 0) {
    formData.append('metaDataFile', data.metaDataFile)
  }

  const trustRelationshipBlob = new Blob([JSON.stringify(data.trustRelationship)], {
    type: 'application/json',
  })
  formData.append('trustRelationship', trustRelationshipBlob)

  return formData
}

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

const useSamlAuditContext = (): SamlAuditContext => {
  const { userinfo, client_id, ip_address } = useSharedAuditContext()

  return { userinfo, clientId: client_id, ipAddress: ip_address }
}

type AuditAction = typeof CREATE | typeof UPDATE | typeof DELETION

const createAuditLogger =
  <T>(
    auditContext: SamlAuditContext,
    action: AuditAction,
    resource: string,
    payloadMapper: (data: T) => Record<string, T[keyof T] | T>,
  ) =>
  async (userMessage: string, data: T): Promise<void> => {
    try {
      await logAuditUserAction({
        userinfo: auditContext.userinfo,
        action,
        resource,
        message: userMessage,
        extra: auditContext.ipAddress ? { ip_address: auditContext.ipAddress } : {},
        client_id: auditContext.clientId,
        payload: payloadMapper(data) as JsonValue,
      })
    } catch (error) {
      devLogger.error(`Failed to log ${resource} audit action:`, error)
    }
  }

export const useSamlConfiguration = () => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  return useQuery({
    queryKey: getGetSamlPropertiesQueryKey(),
    queryFn: async (): Promise<SamlAppConfiguration> => {
      const { data } = await AXIOS_INSTANCE.get<SamlAppConfiguration>('/kc/saml/properties')
      return data ?? {}
    },
    enabled: hasSession === true,
    staleTime: SAML_CACHE_CONFIG.STALE_TIME,
    gcTime: SAML_CACHE_CONFIG.GC_TIME,
  })
}

export const useUpdateSamlConfiguration = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const auditContext = useSamlAuditContext()
  const baseMutation = useMutation({
    mutationFn: async ({ data }: { data: SamlAppConfiguration }): Promise<SamlAppConfiguration> => {
      const { data: result } = await AXIOS_INSTANCE.put<SamlAppConfiguration>(
        '/kc/saml/properties',
        data,
      )
      return result ?? {}
    },
  })

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

export const useIdentityProviders = (params?: GetSamlIdentityProviderParams) => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  return useQuery({
    queryKey: getGetSamlIdentityProviderQueryKey(params),
    queryFn: async (): Promise<IdentityProviderPagedResult> => {
      const { data } = await AXIOS_INSTANCE.get<IdentityProviderPagedResult>('/kc/saml/idp', {
        params: params ?? {},
      })
      return data ?? { entries: [], totalEntriesCount: 0 }
    },
    enabled: hasSession === true,
    staleTime: SAML_CACHE_CONFIG.STALE_TIME,
    gcTime: SAML_CACHE_CONFIG.GC_TIME,
  })
}

export const useCreateIdentityProvider = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const auditContext = useSamlAuditContext()
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

export const useUpdateIdentityProvider = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const auditContext = useSamlAuditContext()
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

export const useDeleteIdentityProvider = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const auditContext = useSamlAuditContext()
  const baseMutation = useMutation({
    mutationFn: async ({ inum }: { inum: string }): Promise<void> => {
      await AXIOS_INSTANCE.delete(`/kc/saml/idp/${encodeURIComponent(inum)}`)
    },
  })

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

export const useTrustRelationships = () => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  return useQuery({
    queryKey: getGetTrustRelationshipsQueryKey(),
    queryFn: async (): Promise<TrustRelationship[]> => {
      const { data } = await AXIOS_INSTANCE.get<TrustRelationship[]>('/kc/saml/trust-relationships')
      return data ?? []
    },
    enabled: hasSession === true,
    staleTime: SAML_CACHE_CONFIG.STALE_TIME,
    gcTime: SAML_CACHE_CONFIG.GC_TIME,
  })
}

export const useCreateTrustRelationship = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const auditContext = useSamlAuditContext()
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

export const useUpdateTrustRelationship = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const auditContext = useSamlAuditContext()
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

export const useDeleteTrustRelationshipMutation = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const auditContext = useSamlAuditContext()
  const baseMutation = useMutation({
    mutationFn: async ({ id }: { id: string }): Promise<void> => {
      await AXIOS_INSTANCE.delete(`/kc/saml/trust-relationship/${encodeURIComponent(id)}`)
    },
  })

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
