import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useSearchToken, useRevokeToken, getSearchTokenQueryKey } from 'JansConfigApi'
import type { TokenEntity } from 'JansConfigApi'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { invalidateQueriesByKey } from '@/utils/queryUtils'
import { devLogger } from '@/utils/devLogger'
import { formatDate } from '@/utils/dayjsUtils'
import { TOKEN_DATE_DISPLAY_FORMAT } from '../constants'
import { buildClientTokenFieldValuePair } from '../helper/utils'
import type { ClientTokenRow, UseClientTokensParams } from '../types'

const formatTokenDate = (value: string | undefined): string =>
  value ? formatDate(value, TOKEN_DATE_DISPLAY_FORMAT) : ''

const mapTokenEntityToRow = (entity: TokenEntity): ClientTokenRow => ({
  id: entity.tokenCode ?? '',
  tokenCode: entity.tokenCode ?? '',
  tokenType: entity.tokenType,
  scope: entity.scope,
  deletable: entity.deletable,
  attributes: entity.attributes,
  grantType: entity.grantType,
  expirationDate: formatTokenDate(entity.expirationDate),
  creationDate: formatTokenDate(entity.creationDate),
})

export const useClientTokens = ({
  clientInum,
  pattern,
  filterField,
  pageNumber,
  limit,
}: UseClientTokensParams) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const fieldValuePair = useMemo(() => {
    if (!clientInum) return undefined
    return buildClientTokenFieldValuePair(clientInum, pattern, filterField)
  }, [clientInum, pattern, filterField])

  const searchParams = useMemo(
    () => ({
      startIndex: pageNumber * limit,
      limit,
      fieldValuePair,
    }),
    [pageNumber, limit, fieldValuePair],
  )

  const tokensQuery = useSearchToken(searchParams, {
    query: { enabled: !!clientInum },
  })

  const rows = useMemo<ClientTokenRow[]>(
    () => (tokensQuery.data?.entries ?? []).map(mapTokenEntityToRow),
    [tokensQuery.data],
  )

  const totalItems = tokensQuery.data?.totalEntriesCount ?? 0

  const revokeMutation = useRevokeToken()

  const revokeToken = useCallback(
    async (tokenCode: string): Promise<void> => {
      try {
        await revokeMutation.mutateAsync({ tknCde: tokenCode })
        dispatch(updateToast(true, 'success'))
        await invalidateQueriesByKey(queryClient, getSearchTokenQueryKey(searchParams))
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : t('messages.error_in_deleting')
        dispatch(updateToast(true, 'error', errorMsg))
        devLogger.error('Failed to revoke client token:', error)
        throw error
      }
    },
    [revokeMutation, dispatch, queryClient, searchParams, t],
  )

  return {
    rows,
    totalItems,
    isLoading: tokensQuery.isLoading || revokeMutation.isPending,
    refetch: tokensQuery.refetch,
    revokeToken,
  }
}
