import { useGetAssetServices, useGetAssetTypes } from 'JansConfigApi'
import { queryDefaults } from '@/utils/queryUtils'

export const useAssetServices = (options?: { enabled?: boolean }) => {
  return useGetAssetServices({
    query: {
      ...queryDefaults.queryOptions,
      enabled: options?.enabled ?? true,
    },
  })
}

export const useAssetTypes = (options?: { enabled?: boolean }) => {
  return useGetAssetTypes({
    query: {
      ...queryDefaults.queryOptions,
      enabled: options?.enabled ?? true,
    },
  })
}
