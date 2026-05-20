import { useGetAssetServices } from 'JansConfigApi'
import { queryDefaults } from '@/utils/queryUtils'

export const useAssetServices = (options?: { enabled?: boolean }) => {
  return useGetAssetServices({
    query: {
      ...queryDefaults.queryOptions,
      enabled: options?.enabled ?? true,
    },
  })
}
