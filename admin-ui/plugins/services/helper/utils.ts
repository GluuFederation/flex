import type { TFunction } from 'i18next'
import type { JsonValue, GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/index'
import { CACHE_FIELD_LABELS_BY_PROVIDER } from './constants'
import type {
  CacheFormValues,
  CacheFormValuesUnion,
  InMemoryCacheFormValues,
  MemcachedCacheFormValues,
  RedisCacheFormValues,
  NativePersistenceCacheFormValues,
  PersistenceInfo,
} from '../Components/types'

export const isInMemoryCache = (
  values: CacheFormValues | CacheFormValuesUnion,
): values is InMemoryCacheFormValues => {
  return values.cacheProviderType === 'IN_MEMORY'
}

export const isMemcachedCache = (
  values: CacheFormValues | CacheFormValuesUnion,
): values is MemcachedCacheFormValues => {
  return values.cacheProviderType === 'MEMCACHED'
}

export const isRedisCache = (
  values: CacheFormValues | CacheFormValuesUnion,
): values is RedisCacheFormValues => {
  return values.cacheProviderType === 'REDIS'
}

export const isNativePersistenceCache = (
  values: CacheFormValues | CacheFormValuesUnion,
): values is NativePersistenceCacheFormValues => {
  return values.cacheProviderType === 'NATIVE_PERSISTENCE'
}

export const isPersistenceInfo = (
  data: Partial<PersistenceInfo> | null | undefined,
): data is PersistenceInfo => {
  if (data === null || data === undefined || Array.isArray(data)) {
    return false
  }
  return typeof data.persistenceType === 'string'
}

export const buildCacheChangedFieldOperations = (
  initial: CacheFormValues,
  current: CacheFormValues,
  t: TFunction,
): GluuCommitDialogOperation[] => {
  const operations: GluuCommitDialogOperation[] = []
  const providerChanged = initial.cacheProviderType !== current.cacheProviderType

  if (providerChanged) {
    operations.push({
      path: t('fields.cache_provider_type'),
      value: current.cacheProviderType as JsonValue,
    })
  }

  const currentFields = CACHE_FIELD_LABELS_BY_PROVIDER[current.cacheProviderType] ?? []

  for (const { key, label } of currentFields) {
    if (key === 'cacheProviderType') continue
    if (key === 'password') continue
    const oldVal = initial[key]
    const newVal = current[key]

    if (providerChanged) {
      if (newVal !== undefined && newVal !== null && newVal !== '') {
        operations.push({ path: t(label), value: (newVal as JsonValue) ?? null })
      }
    } else if (String(oldVal ?? '') !== String(newVal ?? '')) {
      operations.push({ path: t(label), value: (newVal as JsonValue) ?? null })
    }
  }

  return operations
}

export const extractActionMessage = <T extends { action_message?: string }>(
  data: T,
  defaultMessage: string,
): { cleanData: Omit<T, 'action_message'>; message: string } => {
  const { action_message, ...cleanData } = data
  return {
    cleanData: cleanData as Omit<T, 'action_message'>,
    message: action_message || defaultMessage,
  }
}
