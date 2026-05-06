import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteOutline } from '@/components/icons'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { GluuTable } from '@/components/GluuTable'
import ClientActiveTokenDetailPage from './ClientActiveTokenDetailPage'
import { useClientTokens } from '../hooks'
import { convertTokensToCSV, downloadClientTokensCSV } from '../helper/utils'
import { TOKEN_DEFAULT_PAGE_SIZE, TOKEN_FILTER_EXPIRATION_DATE } from '../constants'
import { useStyles } from './styles/ClientActiveTokens.style'
import type { ClientActiveTokensProps, ClientTokenRow, TokenSearchPattern } from '../types'
import type { ColumnDef, ActionDef } from '@/components/GluuTable'

const DEFAULT_PATTERN: TokenSearchPattern = {
  dateAfter: null,
  dateBefore: null,
}

const ClientActiveTokens = ({
  client,
  onExportReady,
  onHasDataChange,
  activePattern,
  filterField,
}: ClientActiveTokensProps): JSX.Element => {
  const { t } = useTranslation()
  const { classes } = useStyles()

  const [pageNumber, setPageNumber] = useState(0)
  const [limit, setLimit] = useState(TOKEN_DEFAULT_PAGE_SIZE)

  const { rows, totalItems, isLoading, revokeToken, refetch } = useClientTokens({
    clientInum: client?.inum,
    pattern: activePattern ?? DEFAULT_PATTERN,
    filterField: filterField ?? TOKEN_FILTER_EXPIRATION_DATE,
    pageNumber,
    limit,
  })

  const onPageChangeClick = useCallback((page: number) => {
    setPageNumber(page)
  }, [])

  const onRowCountChangeClick = useCallback((count: number) => {
    setPageNumber(0)
    setLimit(count)
  }, [])

  const handleRevokeToken = useCallback(
    async (row: ClientTokenRow): Promise<void> => {
      await revokeToken(row.tokenCode)
      await refetch()
    },
    [revokeToken, refetch],
  )

  const handleDownloadCSV = useCallback(() => {
    if (!rows || rows.length === 0) return
    const csv = convertTokensToCSV(rows)
    downloadClientTokensCSV(csv)
  }, [rows])

  useEffect(() => {
    setPageNumber(0)
  }, [client?.inum])

  useEffect(() => {
    setPageNumber(0)
  }, [activePattern, filterField])

  useEffect(() => {
    onExportReady?.(handleDownloadCSV)
  }, [onExportReady, handleDownloadCSV])

  useEffect(() => {
    onHasDataChange?.(rows.length > 0)
  }, [onHasDataChange, rows])

  const columns = useMemo<ColumnDef<ClientTokenRow>[]>(
    () => [
      { key: 'creationDate', label: t('fields.creationDate') },
      { key: 'tokenType', label: t('fields.token_type') },
      { key: 'grantType', label: t('fields.grant_type') },
      { key: 'expirationDate', label: t('fields.expiration_date') },
    ],
    [t],
  )

  const actions = useMemo<ActionDef<ClientTokenRow>[]>(
    () => [
      {
        icon: <DeleteOutline fontSize="small" />,
        tooltip: t('actions.revoke'),
        show: (row) => row.deletable !== false,
        onClick: (row) => {
          void handleRevokeToken(row)
        },
      },
    ],
    [t, handleRevokeToken],
  )

  const renderExpandedRow = useCallback(
    (row: ClientTokenRow) => <ClientActiveTokenDetailPage row={{ rowData: row }} />,
    [],
  )

  return (
    <GluuLoader blocking={isLoading}>
      <GluuViewWrapper canShow={true}>
        <div className={classes.tableContainer}>
          <GluuTable<ClientTokenRow>
            columns={columns}
            data={rows}
            expandable
            stickyHeader
            renderExpandedRow={renderExpandedRow}
            actions={actions}
            getRowKey={(row) => row.id}
            pagination={{
              page: pageNumber,
              rowsPerPage: limit,
              totalItems,
              onPageChange: onPageChangeClick,
              onRowsPerPageChange: onRowCountChangeClick,
            }}
            onPagingSizeSync={onRowCountChangeClick}
          />
        </div>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default ClientActiveTokens
