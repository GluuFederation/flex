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
import { useTranslation } from 'react-i18next'
import { CACHE } from 'Utils/ApiResources'
import SetTitle from 'Utils/SetTitle'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useCedarling, ADMIN_UI_RESOURCES, CEDAR_RESOURCE_SCOPES } from '@/cedarling'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { devLogger } from '@/utils/devLogger'
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
  type CacheConfiguration,
  type InMemoryConfiguration,
  type MemcachedConfiguration,
  type NativePersistenceConfiguration,
  type RedisConfiguration,
  CacheConfigurationCacheProviderType,
} from 'JansConfigApi'
import { useCacheAudit } from './hooks'
import type { CacheFormValues, CacheProviderType } from './types'
import {
  isInMemoryCache,
  isMemcachedCache,
  isRedisCache,
  isNativePersistenceCache,
  buildCacheChangedFieldOperations,
  CACHE_PROVIDER_OPTIONS,
} from '../helper'
import { useStyles } from './styles/CachePage.style'
import { queryDefaults } from '@/utils/queryUtils'

const CachePage: React.FC = () => {
  const { t } = useTranslation()
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

  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const cacheResourceId = useMemo(() => ADMIN_UI_RESOURCES.Cache, [])
  const cacheScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[cacheResourceId] || [], [cacheResourceId])

  const canReadCache = useMemo(
    () => hasCedarReadPermission(cacheResourceId),
    [hasCedarReadPermission, cacheResourceId],
  )
  const canWriteCache = useMemo(
    () => hasCedarWritePermission(cacheResourceId),
    [hasCedarWritePermission, cacheResourceId],
  )

  const pageTitle = t('fields.cache_configuration')
  SetTitle(pageTitle)

  useEffect(() => {
    if (cacheScopes.length > 0) {
      authorizeHelper(cacheScopes)
    }
  }, [authorizeHelper, cacheScopes])

  const { data: cacheData = {} as CacheConfiguration, isLoading: cacheLoading } = useGetConfigCache(
    {
      query: { staleTime: queryDefaults.queryOptions.staleTime, enabled: canReadCache },
    },
  )
  const { data: cacheMemoryData = {} as InMemoryConfiguration, isLoading: memoryLoading } =
    useGetConfigCacheInMemory({
      query: { staleTime: queryDefaults.queryOptions.staleTime, enabled: canReadCache },
    })
  const { data: cacheMemData = {} as MemcachedConfiguration, isLoading: memcachedLoading } =
    useGetConfigCacheMemcached({
      query: { staleTime: queryDefaults.queryOptions.staleTime, enabled: canReadCache },
    })
  const { data: cacheNativeData = {} as NativePersistenceConfiguration, isLoading: nativeLoading } =
    useGetConfigCacheNativePersistence({
      query: { staleTime: queryDefaults.queryOptions.staleTime, enabled: canReadCache },
    })
  const { data: cacheRedisData = {} as RedisConfiguration, isLoading: redisLoading } =
    useGetConfigCacheRedis({
      query: { staleTime: queryDefaults.queryOptions.staleTime, enabled: canReadCache },
    })

  const loading = cacheLoading || memoryLoading || memcachedLoading || nativeLoading || redisLoading

  const patchCacheMutation = usePatchConfigCache({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetConfigCacheQueryKey() })
      },
    },
  })
  const putMemoryMutation = usePutConfigCacheInMemory()
  const putMemcachedMutation = usePutConfigCacheMemcached()
  const putNativeMutation = usePutConfigCacheNativePersistence()
  const putRedisMutation = usePutConfigCacheRedis()

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
      password: cacheRedisData.password || '',
      sentinelMasterGroupName: cacheRedisData.sentinelMasterGroupName || '',
      sslTrustStoreFilePath: cacheRedisData.sslTrustStoreFilePath || '',
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
      if (!canWriteCache) return

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
          const redisCache: RedisConfiguration = {
            redisProviderType: values.redisProviderType as RedisConfiguration['redisProviderType'],
            servers: values.servers,
            password: values.password,
            sentinelMasterGroupName: values.sentinelMasterGroupName,
            sslTrustStoreFilePath: values.sslTrustStoreFilePath,
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
          devLogger.error('Failed to log cache update:', logError)
        }
      } catch (error) {
        dispatch(updateToast(true, 'error'))
        devLogger.error('Failed to update cache config:', error)
      }
    },
  })

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const handleCancel = useCallback(() => {
    formik.resetForm()
  }, [formik])

  const handleApply = useCallback(() => {
    toggle()
  }, [toggle])

  const commitOperations = useMemo(
    () => buildCacheChangedFieldOperations(initialValues, formik.values, t),
    [initialValues, formik.values, t],
  )

  const submitForm = useCallback(
    (_userMessage: string) => {
      formik.handleSubmit()
    },
    [formik],
  )

  const cacheProviderType = formik.values.cacheProviderType

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
          <div className={classes.cacheCard}>
            <div className={`${classes.content} ${classes.formLabels}`}>
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleApply()
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
                      values={CACHE_PROVIDER_OPTIONS}
                      lsize={12}
                      rsize={12}
                      doc_category={CACHE}
                      doc_entry="cacheProviderType"
                      disabled={!canWriteCache}
                      isDark={isDark}
                    />
                  </div>
                </div>

                {cacheProviderType === 'IN_MEMORY' && (
                  <div
                    className={`${classes.sectionBox} ${classes.formWithInputs} ${classes.formLabels}`}
                  >
                    {renderSectionTitle(`${t('fields.in_memory_configuration')}:`)}
                    <CacheInMemory
                      formik={formik}
                      classes={classes}
                      isDark={isDark}
                      disabled={!canWriteCache}
                    />
                  </div>
                )}

                {cacheProviderType === 'MEMCACHED' && (
                  <div
                    className={`${classes.sectionBox} ${classes.formWithInputs} ${classes.formLabels}`}
                  >
                    {renderSectionTitle(`${t('fields.memcached_configuration')}:`)}
                    <CacheMemcached
                      formik={formik}
                      classes={classes}
                      isDark={isDark}
                      disabled={!canWriteCache}
                    />
                  </div>
                )}

                {cacheProviderType === 'REDIS' && (
                  <div
                    className={`${classes.sectionBox} ${classes.formWithInputs} ${classes.formLabels}`}
                  >
                    {renderSectionTitle(`${t('fields.redis_configuration')}:`)}
                    <CacheRedis
                      formik={formik}
                      classes={classes}
                      isDark={isDark}
                      disabled={!canWriteCache}
                    />
                  </div>
                )}

                {cacheProviderType === 'NATIVE_PERSISTENCE' && (
                  <div
                    className={`${classes.sectionBox} ${classes.formWithInputs} ${classes.formLabels}`}
                  >
                    {renderSectionTitle(`${t('fields.native_persistence_configuration')}:`)}
                    <CacheNative
                      formik={formik}
                      classes={classes}
                      isDark={isDark}
                      disabled={!canWriteCache}
                    />
                  </div>
                )}

                <GluuThemeFormFooter
                  showBack
                  showCancel={canWriteCache}
                  onCancel={handleCancel}
                  disableCancel={!formik.dirty}
                  showApply={canWriteCache}
                  onApply={handleApply}
                  disableApply={!formik.isValid || !formik.dirty || !canWriteCache}
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
