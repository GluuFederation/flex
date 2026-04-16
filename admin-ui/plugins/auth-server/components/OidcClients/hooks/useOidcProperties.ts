import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetProperties } from 'JansConfigApi'
import type { AppConfiguration } from 'JansConfigApi'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { getQueryErrorMessage } from '@/utils/errorHandler'

export const useOidcProperties = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const query = useGetProperties()

  useEffect(() => {
    if (!query.isError) return
    const errorMsg = getQueryErrorMessage(query.error, t('messages.error_in_loading'))
    dispatch(updateToast(true, 'error', errorMsg))
  }, [query.isError, query.error, dispatch, t])

  return {
    oidcConfiguration: query.data as AppConfiguration | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
