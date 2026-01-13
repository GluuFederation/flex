import { useSelector } from 'react-redux'
import { useGetAdminuiLicense, type LicenseResponse } from 'JansConfigApi'
import type { RootState } from 'Redux/sagas/types/audit'
import { DASHBOARD_CACHE_CONFIG } from '../constants'

// Clean up quotes from string fields (matching existing Redux slice behavior)
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

export function useDashboardLicense() {
  const hasSession = useSelector((state: RootState) => state.authReducer?.hasSession)

  return useGetAdminuiLicense({
    query: {
      enabled: hasSession === true,
      staleTime: DASHBOARD_CACHE_CONFIG.STALE_TIME,
      gcTime: DASHBOARD_CACHE_CONFIG.GC_TIME,
      select: transformLicenseResponse,
    },
  })
}
