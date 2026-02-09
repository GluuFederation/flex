import { useAppSelector } from '@/redux/hooks'
import { useGetAdminuiLicense, type LicenseResponse } from 'JansConfigApi'
import { DASHBOARD_CACHE_CONFIG } from '../constants'

function transformLicenseResponse(data: LicenseResponse | undefined): LicenseResponse | undefined {
  if (!data) return undefined

  return {
    ...data,
    companyName: data.companyName?.replace(/"/g, '') ?? '',
    customerFirstName: data.customerFirstName?.replace(/"/g, '') ?? '',
    customerLastName: data.customerLastName?.replace(/"/g, '') ?? '',
    customerEmail: data.customerEmail?.replace(/"/g, '') ?? '',
  }
}

export const useDashboardLicense = () => {
  const hasSession = useAppSelector((state) => state.authReducer?.hasSession)

  return useGetAdminuiLicense({
    query: {
      enabled: hasSession === true,
      staleTime: DASHBOARD_CACHE_CONFIG.STALE_TIME,
      gcTime: DASHBOARD_CACHE_CONFIG.GC_TIME,
      select: transformLicenseResponse,
    },
  })
}
