import { useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetConfigScripts } from 'JansConfigApi'
import type { CustomScript } from 'JansConfigApi'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { getQueryErrorMessage } from '@/utils/errorHandler'
import { FETCH_LIMITS } from '../constants'

export const useClientScripts = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const query = useGetConfigScripts({ limit: FETCH_LIMITS.SCRIPTS })

  useEffect(() => {
    if (!query.isError) return
    const errorMsg = getQueryErrorMessage(query.error, t('messages.error_loading_scripts'))
    dispatch(updateToast(true, 'error', errorMsg))
  }, [query.isError, query.error, dispatch, t])

  const scripts = useMemo<CustomScript[]>(() => query.data?.entries ?? [], [query.data])
  return { scripts, isLoading: query.isLoading, isError: query.isError }
}
