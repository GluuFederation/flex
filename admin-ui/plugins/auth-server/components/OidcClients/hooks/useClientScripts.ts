import { useMemo } from 'react'
import { useGetConfigScripts } from 'JansConfigApi'
import type { CustomScript } from 'JansConfigApi'
import { FETCH_LIMITS } from '../constants'

export const useClientScripts = () => {
  const query = useGetConfigScripts({ limit: FETCH_LIMITS.SCRIPTS })
  const scripts = useMemo<CustomScript[]>(() => query.data?.entries ?? [], [query.data])
  return { scripts, isLoading: query.isLoading }
}
