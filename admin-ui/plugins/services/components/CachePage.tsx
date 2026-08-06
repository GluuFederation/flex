import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { Form } from 'Components'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { GluuPageContent } from 'Components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import CacheInMemory from './CacheInMemory'
import CacheRedis from './CacheRedis'
import CacheNative from './CacheNative'
import CacheMemcached from './CacheMemcached'
import { useFormik } from 'formik'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTranslation } from 'react-i18next'
import { MOBILE_MEDIA_QUERY } from '@/constants'
import { CACHE } from 'Utils/ApiResources'
import SetTitle from 'Utils/SetTitle'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { logger } from '@/utils/logger'
import {
  useGetConfigCache,
  useGetConfigCacheInMemory,
  useGetConfigCacheMemcached,
  useGetConfigCacheNativePersistence,
  useGetConfigCacheRedis,
  usePatchConfigCache,
  usePutConfigCacheInMemory,
  usePutConfigCacheMemcached,
  usePutConfigCacheNativePersistence,
  usePutConfigCacheRedis,
  getGetConfigCacheQueryKey,
  getGetConfigCacheInMemoryQueryKey,
  getGetConfigCacheMemcachedQueryKey,
  getGetConfigCacheNativePersistenceQueryKey,
  getGetConfigCacheRedisQueryKey,
  type CacheConfiguration,
  type InMemoryConfiguration,
  type MemcachedConfiguration,
  type NativePersistenceConfiguration,
  type RedisConfiguration,
  CacheConfigurationCacheProviderType,
} from 'JansConfigApi'
import { useCacheAudit } from './hooks'
import type {
  CacheFormValues,
  CacheProviderType,
  CacheSubComponentBaseProps,
  RedisConfigurationPayload,
} from './types'
import {
  isInMemoryCache,
  isMemcachedCache,
  isRedisCache,
  isNativePersistenceCache,
  buildCacheChangedFieldOperations,
  getCacheProviderOptions,
} from '../helper'
import { useStyles } from './styles/CachePage.style'
import { queryDefaults } from '@/utils/queryUtils'

const PROVIDER_SECTIONS: Record<
  CacheProviderType,
  { titleKey: string; Fields: React.FC<CacheSubComponentBaseProps> }
> = {
  IN_MEMORY: { titleKey: 'fields.in_memory_configuration', Fields: CacheInMemory },
  MEMCACHED: { titleKey: 'fields.memcached_configuration', Fields: CacheMemcached },
  REDIS: { titleKey: 'fields.redis_configuration', Fields: CacheRedis },
  NATIVE_PERSISTENCE: {
    titleKey: 'fields.native_persistence_configuration',
    Fields: CacheNative,
  },
}

const CachePage: React.FC = () => {
  const { t } = useTranslation()

  const cacheProviderOptions = useMemo(() => getCacheProviderOptions(), [])
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logCacheUpdate } = useCacheAudit()
  const { state: themeState } = useTheme()
  const isDark = (themeState?.theme ?? DEFAULT_THEME) === THEME_DARK
  const themeColors = useMemo(
    () => getThemeColor(themeState?.theme ?? DEFAULT_THEME),
    [themeState?.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const [modal, setModal] = useState(false)

  const { canRead: canReadCache, canWrite: canWriteCache } = usePermission(ADMIN_UI_RESOURCES.Cache)

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)
  // Mobile is a view-only layout, so treat it as read-only for every control
  // and submission path, not just for action visibility.
  const isReadOnly = !canWriteCache || isMobile

  // Entering read-only (e.g. resizing to mobile) discards any in-flight commit.
  useEffect(() => {
    if (isReadOnly) {
      setModal(false)
    }
  }, [isReadOnly])

  const pageTitle = t('fields.cache_configuration')
  SetTitle(pageTitle)

  const {
    data: cacheData = {} as CacheConfiguration,
    isLoading: cacheLoading,
    isError: isCacheError,
    error: cacheError,
  } = useGetConfigCache({
    query: { staleTime: queryDefaults.queryOptions.staleTime, enabled: canReadCache },
  })
  const {
    data: cacheMemoryData = {} as InMemoryConfiguration,
    isLoading: memoryLoading,
    isError: isMemoryError,
    error: memoryError,
  } = useGetConfigCacheInMemory({
    query: { staleTime: queryDefaults.queryOptions.staleTime, enabled: canReadCache },
  })
  const {
    data: cacheMemData = {} as MemcachedConfiguration,
    isLoading: memcachedLoading,
    isError: isMemcachedError,
    error: memcachedError,
  } = useGetConfigCacheMemcached({
    query: { staleTime: queryDefaults.queryOptions.staleTime, enabled: canReadCache },
  })
  const {
    data: cacheNativeData = {} as NativePersistenceConfiguration,
    isLoading: nativeLoading,
    isError: isNativeError,
    error: nativeError,
  } = useGetConfigCacheNativePersistence({
    query: { staleTime: queryDefaults.queryOptions.staleTime, enabled: canReadCache },
  })
  const {
    data: redisQueryData,
    isLoading: redisLoading,
    isError: isRedisError,
    error: redisError,
  } = useGetConfigCacheRedis({
    query: { staleTime: queryDefaults.queryOptions.staleTime, enabled: canReadCache },
  })
  // See `RedisConfigurationPayload`: the generated type omits `username`.
  const cacheRedisData = (redisQueryData ?? {}) as RedisConfigurationPayload

  const loading = cacheLoading || memoryLoading || memcachedLoading || nativeLoading || redisLoading

  useEffect(() => {
    const firstError = [
      isCacheError && cacheError,
      isMemoryError && memoryError,
      isMemcachedError && memcachedError,
      isNativeError && nativeError,
      isRedisError && redisError,
    ].find(Boolean)
    if (!firstError) return
    const err = firstError as { response?: { data?: { message?: string } } }
    const errorMsg =
      err?.response?.data?.message ||
      t('fields.cache_configuration') + ': ' + t('messages.error_in_loading')
    dispatch(updateToast(true, 'error', errorMsg))
  }, [
    isCacheError,
    cacheError,
    isMemoryError,
    memoryError,
    isMemcachedError,
    memcachedError,
    isNativeError,
    nativeError,
    isRedisError,
    redisError,
    dispatch,
    t,
  ])

  const patchCacheMutation = usePatchConfigCache({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetConfigCacheQueryKey() })
      },
    },
  })
  const invalidateOnSuccess = useCallback(
    (queryKey: QueryKey) => ({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey })
        },
      },
    }),
    [queryClient],
  )

  const putMemoryMutation = usePutConfigCacheInMemory(
    invalidateOnSuccess(getGetConfigCacheInMemoryQueryKey()),
  )
  const putMemcachedMutation = usePutConfigCacheMemcached(
    invalidateOnSuccess(getGetConfigCacheMemcachedQueryKey()),
  )
  const putNativeMutation = usePutConfigCacheNativePersistence(
    invalidateOnSuccess(getGetConfigCacheNativePersistenceQueryKey()),
  )
  const putRedisMutation = usePutConfigCacheRedis(
    invalidateOnSuccess(getGetConfigCacheRedisQueryKey()),
  )

  const isMutating =
    patchCacheMutation.isPending ||
    putMemoryMutation.isPending ||
    putMemcachedMutation.isPending ||
    putNativeMutation.isPending ||
    putRedisMutation.isPending

  const initialValues = useMemo<CacheFormValues>(
    () => ({
      cacheProviderType: (cacheData.cacheProviderType ||
        CacheConfigurationCacheProviderType.IN_MEMORY) as CacheProviderType,
      memCacheServers: cacheMemData.servers,
      maxOperationQueueLength: cacheMemData.maxOperationQueueLength,
      bufferSize: cacheMemData.bufferSize,
      memDefaultPutExpiration: cacheMemData.defaultPutExpiration,
      connectionFactoryType: cacheMemData.connectionFactoryType,
      memoryDefaultPutExpiration: cacheMemoryData.defaultPutExpiration,
      redisProviderType: cacheRedisData.redisProviderType,
      servers: cacheRedisData.servers,
      username: cacheRedisData.username || '',
      password: cacheRedisData.password || '',
      sentinelMasterGroupName: cacheRedisData.sentinelMasterGroupName || '',
      sslTrustStoreFilePath: cacheRedisData.sslTrustStoreFilePath || '',
      sslTrustStorePassword: cacheRedisData.sslTrustStorePassword || '',
      sslKeyStoreFilePath: cacheRedisData.sslKeyStoreFilePath || '',
      sslKeyStorePassword: cacheRedisData.sslKeyStorePassword || '',
      redisDefaultPutExpiration: cacheRedisData.defaultPutExpiration,
      useSSL: cacheRedisData.useSSL,
      maxIdleConnections: cacheRedisData.maxIdleConnections,
      maxTotalConnections: cacheRedisData.maxTotalConnections,
      connectionTimeout: cacheRedisData.connectionTimeout,
      soTimeout: cacheRedisData.soTimeout,
      maxRetryAttempts: cacheRedisData.maxRetryAttempts,
      nativeDefaultPutExpiration: cacheNativeData.defaultPutExpiration ?? 0,
      defaultCleanupBatchSize: cacheNativeData.defaultCleanupBatchSize ?? 0,
      deleteExpiredOnGetRequest: cacheNativeData.deleteExpiredOnGetRequest,
    }),
    [cacheData, cacheMemData, cacheMemoryData, cacheRedisData, cacheNativeData],
  )

  const formik = useFormik<CacheFormValues>({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (isReadOnly) return

      try {
        if (isNativePersistenceCache(values)) {
          const nativeCache: NativePersistenceConfiguration = {
            defaultPutExpiration: values.nativeDefaultPutExpiration,
            defaultCleanupBatchSize: values.defaultCleanupBatchSize,
            deleteExpiredOnGetRequest: values.deleteExpiredOnGetRequest,
          }
          await putNativeMutation.mutateAsync({ data: nativeCache })
        }

        if (isInMemoryCache(values)) {
          const memoryCache: InMemoryConfiguration = {
            defaultPutExpiration: values.memoryDefaultPutExpiration,
          }
          await putMemoryMutation.mutateAsync({ data: memoryCache })
        }

        if (isRedisCache(values)) {
          const redisCache: RedisConfigurationPayload = {
            redisProviderType: values.redisProviderType as RedisConfiguration['redisProviderType'],
            servers: values.servers,
            username: values.username,
            password: values.password,
            sentinelMasterGroupName: values.sentinelMasterGroupName,
            sslTrustStoreFilePath: values.sslTrustStoreFilePath,
            sslTrustStorePassword: values.sslTrustStorePassword,
            sslKeyStoreFilePath: values.sslKeyStoreFilePath,
            sslKeyStorePassword: values.sslKeyStorePassword,
            defaultPutExpiration: values.redisDefaultPutExpiration,
            useSSL: values.useSSL,
            maxIdleConnections: values.maxIdleConnections,
            maxTotalConnections: values.maxTotalConnections,
            connectionTimeout: values.connectionTimeout,
            soTimeout: values.soTimeout,
            maxRetryAttempts: values.maxRetryAttempts,
          }
          await putRedisMutation.mutateAsync({ data: redisCache })
        }

        if (isMemcachedCache(values)) {
          const memCache: MemcachedConfiguration = {
            servers: values.memCacheServers,
            maxOperationQueueLength: values.maxOperationQueueLength,
            bufferSize: values.bufferSize,
            defaultPutExpiration: values.memDefaultPutExpiration,
            connectionFactoryType:
              values.connectionFactoryType as MemcachedConfiguration['connectionFactoryType'],
          }
          await putMemcachedMutation.mutateAsync({ data: memCache })
        }

        if (cacheData.cacheProviderType !== values.cacheProviderType) {
          const cache = [
            {
              op: 'replace' as const,
              path: '/cacheProviderType',
              value: values.cacheProviderType,
            },
          ]
          await patchCacheMutation.mutateAsync({ data: cache })
        }

        dispatch(updateToast(true, 'success'))
        resetForm({ values })
        try {
          await logCacheUpdate(
            {
              cacheProviderType:
                values.cacheProviderType as CacheConfiguration['cacheProviderType'],
            },
            'Cache configuration updated',
          )
        } catch (logError) {
          logger.error(
            'Failed to log cache update:',
            logError instanceof Error ? logError : String(logError),
          )
        }
      } catch (error) {
        dispatch(updateToast(true, 'error'))
        logger.error(
          'Failed to update cache config:',
          error instanceof Error ? error : String(error),
        )
      }
    },
  })

  const toggle = useCallback(() => {
    if (isReadOnly) return
    setModal((prev) => !prev)
  }, [isReadOnly])

  const handleCancel = useCallback(() => {
    formik.resetForm()
  }, [formik])

  const commitOperations = useMemo(
    () => buildCacheChangedFieldOperations(initialValues, formik.values, t),
    [initialValues, formik.values, t],
  )

  const submitForm = useCallback(
    (_userMessage: string) => {
      if (isReadOnly) return
      formik.handleSubmit()
    },
    [formik, isReadOnly],
  )

  const providerSection = PROVIDER_SECTIONS[formik.values.cacheProviderType]

  const renderSectionTitle = (title: string) => (
    <div className={classes.sectionHeader}>
      <GluuText variant="h5" disableThemeColor>
        <span className={classes.sectionTitle}>{title}</span>
      </GluuText>
    </div>
  )

  return (
    <GluuLoader blocking={loading || isMutating}>
      <GluuViewWrapper canShow={canReadCache}>
        <GluuPageContent>
          <GluuText variant="h1" className={classes.mobilePageTitle}>
            {pageTitle}
          </GluuText>
          <div className={classes.cacheCard}>
            <div className={`${classes.content} ${classes.formLabels}`}>
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  toggle()
                }}
                className={classes.formSection}
              >
                <div
                  className={`${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`}
                >
                  <div className={`${classes.fieldItem} ${classes.fieldItemFullWidth}`}>
                    <GluuSelectRow
                      label="fields.cache_provider_type"
                      name="cacheProviderType"
                      value={formik.values.cacheProviderType}
                      formik={formik}
                      values={cacheProviderOptions}
                      lsize={12}
                      rsize={12}
                      doc_category={CACHE}
                      doc_entry="cacheProviderType"
                      disabled={!canWriteCache}
                      isDark={isDark}
                    />
                  </div>
                </div>

                {providerSection && (
                  <div
                    className={`${classes.sectionBox} ${classes.formWithInputs} ${classes.formLabels}`}
                  >
                    {renderSectionTitle(`${t(providerSection.titleKey)}:`)}
                    <providerSection.Fields
                      formik={formik}
                      classes={classes}
                      isDark={isDark}
                      disabled={isReadOnly}
                    />
                  </div>
                )}

                <GluuThemeFormFooter
                  showBack
                  showCancel={!isReadOnly}
                  onCancel={handleCancel}
                  disableCancel={!formik.dirty}
                  showApply={!isReadOnly}
                  onApply={toggle}
                  disableApply={!formik.isValid || !formik.dirty}
                  applyButtonType="button"
                />
              </Form>

              <GluuCommitDialog
                handler={toggle}
                modal={modal}
                onAccept={submitForm}
                formik={formik}
                operations={commitOperations}
              />
            </div>
          </div>
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default CachePage
