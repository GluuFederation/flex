import { useGetProperties } from 'JansConfigApi'
import type { AppConfiguration } from 'JansConfigApi'

export const useOidcProperties = () => {
  const query = useGetProperties()
  return {
    oidcConfiguration: query.data as AppConfiguration | undefined,
    isLoading: query.isLoading,
  }
}
