import React, { useState, useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import MaterialTable from '@material-table/core'
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  TablePagination,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material'
import {
  FilterList as FilterListIcon,
  GetApp as GetAppIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { updateToast } from 'Redux/features/toastSlice'
import ActiveTokenDetailPanel from '../components/ActiveTokenDetailPanel'
import type { SectionProps } from '../types'
import {
  useGetTokenByClient,
  useRevokeToken,
  getGetTokenByClientQueryKey,
  type TokenEntity,
} from 'JansConfigApi'

const ActiveTokensSection: React.FC<Pick<SectionProps, 'formik' | 'viewOnly'>> = ({
  formik,
  viewOnly = false,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const [pageNumber, setPageNumber] = useState(0)
  const [limit, setLimit] = useState(10)
  const [showFilter, setShowFilter] = useState(false)
  const [searchFilter, setSearchFilter] = useState<'expirationDate' | 'creationDate'>(
    'expirationDate',
  )
  const [dateAfter, setDateAfter] = useState<Dayjs | null>(null)
  const [dateBefore, setDateBefore] = useState<Dayjs | null>(null)

  const clientInum = formik.values.inum

  // Fetch tokens using Orval-generated hook
  const {
    data: tokenData,
    isLoading: loading,
    refetch,
  } = useGetTokenByClient(clientInum || '', {
    query: {
      enabled: !!clientInum,
      refetchOnMount: 'always' as const,
      refetchOnWindowFocus: false,
    },
  })

  // Revoke token mutation
  const revokeTokenMutation = useRevokeToken({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success', t('messages.token_revoked')))
        queryClient.invalidateQueries({
          queryKey: getGetTokenByClientQueryKey(clientInum),
        })
      },
      onError: (error: Error) => {
        console.error('Error revoking token:', error)
        dispatch(updateToast(true, 'error', t('messages.error_revoking_token')))
      },
    },
  })

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '--'
    try {
      return dayjs(dateString).format('YYYY/MM/DD HH:mm:ss')
    } catch {
      return dateString
    }
  }

  // Filter tokens based on date criteria (client-side filtering)
  const filteredTokens = useMemo(() => {
    const entries = tokenData?.entries || []

    if (!dateAfter || !dateBefore) {
      return entries
    }

    return entries.filter((token) => {
      const dateField =
        searchFilter === 'expirationDate' ? token.expirationDate : token.creationDate
      if (!dateField) return false

      const tokenDate = dayjs(dateField)
      return tokenDate.isAfter(dateAfter) && tokenDate.isBefore(dateBefore)
    })
  }, [tokenData?.entries, dateAfter, dateBefore, searchFilter])

  // Paginate tokens client-side
  const paginatedTokens = useMemo(() => {
    const startIndex = pageNumber * limit
    return filteredTokens.slice(startIndex, startIndex + limit).map((token) => ({
      ...token,
      formattedCreationDate: formatDate(token.creationDate),
      formattedExpirationDate: formatDate(token.expirationDate),
    }))
  }, [filteredTokens, pageNumber, limit])

  const totalItems = filteredTokens.length

  const handlePageChange = useCallback((_event: unknown, page: number) => {
    setPageNumber(page)
  }, [])

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    setLimit(newLimit)
    setPageNumber(0)
  }, [])

  const handleSearch = useCallback(() => {
    setPageNumber(0)
    setShowFilter(false)
  }, [])

  const handleClear = useCallback(() => {
    setDateAfter(null)
    setDateBefore(null)
    setPageNumber(0)
  }, [])

  const handleRevokeToken = useCallback(
    async (
      oldData: TokenEntity & { formattedCreationDate?: string; formattedExpirationDate?: string },
    ): Promise<void> => {
      const tokenCode = oldData.tokenCode
      if (!tokenCode) {
        dispatch(updateToast(true, 'error', t('messages.token_code_missing')))
        return
      }

      await revokeTokenMutation.mutateAsync({ tknCde: tokenCode })
    },
    [revokeTokenMutation, dispatch, t],
  )

  const escapeCSVField = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  const convertToCSV = (data: TokenEntity[]): string => {
    if (data.length === 0) return ''

    const headers = [
      'scope',
      'deletable',
      'grantType',
      'expirationDate',
      'creationDate',
      'tokenType',
    ]
    const headerRow = headers.map((h) => h.toUpperCase()).join(',')

    const rows = data.map((row) =>
      headers
        .map((key) => {
          const value = row[key as keyof TokenEntity]
          if (value === undefined || value === null) return ''
          if (typeof value === 'boolean') return value.toString()
          return escapeCSVField(String(value))
        })
        .join(','),
    )

    return [headerRow, ...rows].join('\n')
  }

  const handleDownloadCSV = useCallback(() => {
    const csv = convertToCSV(filteredTokens)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'client-tokens.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [filteredTokens])

  const PaperContainer = useCallback(
    (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    [],
  )

  const PaginationWrapper = useCallback(
    () => (
      <td colSpan={1000}>
        <TablePagination
          component="div"
          count={totalItems}
          page={pageNumber}
          onPageChange={handlePageChange}
          rowsPerPage={limit}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </td>
    ),
    [totalItems, pageNumber, limit, handlePageChange, handleRowsPerPageChange],
  )

  const DetailPanel = useCallback(
    (rowData: { rowData: TokenEntity }) => <ActiveTokenDetailPanel rowData={rowData.rowData} />,
    [],
  )

  const tableColumns = useMemo(
    () => [
      {
        title: t('fields.creationDate'),
        field: 'formattedCreationDate',
      },
      {
        title: t('fields.token_type'),
        field: 'tokenType',
      },
      {
        title: t('fields.grant_type'),
        field: 'grantType',
      },
      {
        title: t('fields.expiration_date'),
        field: 'formattedExpirationDate',
      },
    ],
    [t],
  )

  if (!clientInum) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">{t('messages.save_client_first')}</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, position: 'relative' }}>
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilter(!showFilter)}
          sx={{ mr: 1 }}
        >
          {t('titles.filters')}
        </Button>
        <Button
          startIcon={<GetAppIcon />}
          onClick={handleDownloadCSV}
          disabled={filteredTokens.length === 0}
        >
          {t('titles.export_csv')}
        </Button>

        {showFilter && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: '100%',
              right: 0,
              zIndex: 10,
              p: 2,
              mt: 1,
              width: 500,
              maxWidth: '100%',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label={t('fields.filter_by')}
                  value={searchFilter}
                  onChange={(e) =>
                    setSearchFilter(e.target.value as 'expirationDate' | 'creationDate')
                  }
                >
                  <MenuItem value="expirationDate">{t('fields.expiration_date')}</MenuItem>
                  <MenuItem value="creationDate">{t('fields.creationDate')}</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t('dashboard.start_date')}
                    value={dateAfter}
                    onChange={(val) => setDateAfter(val)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t('dashboard.end_date')}
                    value={dateBefore}
                    onChange={(val) => setDateBefore(val)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSearch}
                  disabled={!dateAfter || !dateBefore}
                  sx={{
                    'backgroundColor': themeColors?.background,
                    '&:hover': {
                      backgroundColor: themeColors?.background,
                      opacity: 0.9,
                    },
                  }}
                >
                  {t('actions.apply')}
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setShowFilter(false)
                    handleClear()
                  }}
                  sx={{
                    'borderColor': themeColors?.background,
                    'color': themeColors?.background,
                    '&:hover': {
                      borderColor: themeColors?.background,
                      backgroundColor: `${themeColors?.background}10`,
                    },
                  }}
                >
                  {t('actions.close')}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <MaterialTable
          key={limit}
          components={{
            Container: PaperContainer,
            Pagination: PaginationWrapper,
          }}
          columns={tableColumns}
          data={paginatedTokens}
          isLoading={loading || revokeTokenMutation.isPending}
          title=""
          options={{
            search: false,
            selection: false,
            toolbar: false,
            pageSize: limit,
            headerStyle: {
              backgroundColor: themeColors?.background,
              color: '#fff',
              fontWeight: 600,
            },
            actionsColumnIndex: -1,
            emptyRowsWhenPaging: false,
          }}
          editable={
            viewOnly
              ? undefined
              : {
                  isDeletable: (rowData) => rowData.deletable !== false,
                  onRowDelete: (oldData) =>
                    new Promise<void>((resolve, reject) => {
                      handleRevokeToken(oldData)
                        .then(() => resolve())
                        .catch(() => reject())
                    }),
                }
          }
          detailPanel={DetailPanel}
          icons={{
            Delete: () => <DeleteIcon sx={{ color: 'error.main' }} />,
          }}
          localization={{
            body: {
              emptyDataSourceMessage: t('messages.no_tokens_found'),
              deleteTooltip: t('actions.revoke'),
            },
            header: {
              actions: t('titles.actions'),
            },
          }}
        />
      )}
    </Box>
  )
}

export default ActiveTokensSection
