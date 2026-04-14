import React, { useState, useEffect, useCallback, useMemo } from 'react'
import MaterialTable from '@material-table/core'
import { useTranslation } from 'react-i18next'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  Box,
  Grid,
  MenuItem,
  Paper,
  TablePagination,
  TextField,
  Tooltip,
  Button as MaterialButton,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import GetAppIcon from '@mui/icons-material/GetApp'
import { Card, CardBody, Button } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import { DATE_FORMATS } from '@/utils/dayjsUtils'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import customColors from '@/customColors'
import applicationStyle from '@/routes/Apps/Gluu/styles/applicationStyle'
import ClientActiveTokenDetailPage from './ClientActiveTokenDetailPage'
import { useClientTokens } from './hooks'
import { convertTokensToCSV, downloadClientTokensCSV } from './helper/utils'
import {
  TOKEN_DEFAULT_PAGE_SIZE,
  TOKEN_FILTER_CREATION_DATE,
  TOKEN_FILTER_EXPIRATION_DATE,
} from './constants'
import { useStyles } from './components/styles/ClientActiveTokens.style'
import type {
  ClientActiveTokensProps,
  ClientTokenRow,
  TokenSearchFilterField,
  TokenSearchPattern,
} from './types'

const INITIAL_PATTERN: TokenSearchPattern = {
  dateAfter: null,
  dateBefore: null,
}

const ClientActiveTokens = ({ client }: ClientActiveTokensProps): JSX.Element => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ themeColors })
  const tableHeaderStyle = useMemo(
    () => ({ ...applicationStyle.tableHeaderStyle, background: themeColors.background }),
    [themeColors.background],
  )

  const [showFilter, setShowFilter] = useState(false)
  const [searchFilter, setSearchFilter] = useState<TokenSearchFilterField>(
    TOKEN_FILTER_EXPIRATION_DATE,
  )
  const [pageNumber, setPageNumber] = useState(0)
  const [limit, setLimit] = useState(TOKEN_DEFAULT_PAGE_SIZE)
  const [pattern, setPattern] = useState<TokenSearchPattern>(INITIAL_PATTERN)
  const [activePattern, setActivePattern] = useState<TokenSearchPattern>(INITIAL_PATTERN)

  const { rows, totalItems, isLoading, revokeToken, refetch } = useClientTokens({
    clientInum: client?.inum,
    pattern: activePattern,
    filterField: searchFilter,
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

  const PaperContainer = useCallback(
    (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    [],
  )

  const PaginationWrapper = useCallback(
    () => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(_event, page) => onPageChangeClick(page)}
        rowsPerPage={limit}
        onRowsPerPageChange={(event) => onRowCountChangeClick(Number(event.target.value))}
      />
    ),
    [totalItems, pageNumber, limit, onPageChangeClick, onRowCountChangeClick],
  )

  const DetailPanel = useCallback(
    (rowData: { rowData: ClientTokenRow }) => <ClientActiveTokenDetailPage row={rowData} />,
    [],
  )

  const handleSearch = useCallback(() => {
    setActivePattern(pattern)
    setPageNumber(0)
  }, [pattern])

  const handleClear = useCallback(() => {
    setPattern(INITIAL_PATTERN)
    setActivePattern(INITIAL_PATTERN)
    setPageNumber(0)
  }, [])

  const handleRevokeToken = useCallback(
    async (oldData: ClientTokenRow): Promise<void> => {
      await revokeToken(oldData.tokenCode)
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

  const isDataEmpty = useMemo(() => !rows || rows.length === 0, [rows])

  const columns = useMemo(
    () => [
      { title: t('fields.creationDate'), field: 'creationDate' },
      { title: t('fields.token_type'), field: 'tokenType' },
      { title: t('fields.grant_type'), field: 'grantType' },
      { title: t('fields.expiration_date'), field: 'expirationDate' },
    ],
    [t],
  )

  const noDataExportTitle = isDataEmpty ? t('messages.no_data_to_export') : ''

  return (
    <GluuLoader blocking={isLoading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={true}>
            <Box className={classes.filterToolbar}>
              <Box className={classes.actionRow}>
                <MaterialButton
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilter((prev) => !prev)}
                >
                  {t('titles.filters')}
                </MaterialButton>
                <Tooltip title={noDataExportTitle}>
                  <span>
                    <MaterialButton
                      onClick={handleDownloadCSV}
                      startIcon={<GetAppIcon />}
                      disabled={isDataEmpty}
                      className={classes.exportButton}
                    >
                      {t('titles.export_csv')}
                    </MaterialButton>
                  </span>
                </Tooltip>
              </Box>

              {showFilter && (
                <Box
                  className={classes.filterPanel}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <TextField
                        select
                        label={t('fields.search_filter')}
                        value={searchFilter}
                        onChange={(event) =>
                          setSearchFilter(event.target.value as TokenSearchFilterField)
                        }
                        variant="outlined"
                        style={{ width: 150, marginTop: -3 }}
                      >
                        <MenuItem value={TOKEN_FILTER_EXPIRATION_DATE}>
                          {t('titles.expiration_date')}
                        </MenuItem>
                        <MenuItem value={TOKEN_FILTER_CREATION_DATE}>
                          {t('titles.creation_date')}
                        </MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={4}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <GluuDatePicker
                          format={DATE_FORMATS.DATE_PICKER_DISPLAY_US}
                          label={t('dashboard.start_date')}
                          value={pattern.dateAfter}
                          onChange={(val) => setPattern((prev) => ({ ...prev, dateAfter: val }))}
                          maxDate={pattern.dateBefore ?? undefined}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={4}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <GluuDatePicker
                          format={DATE_FORMATS.DATE_PICKER_DISPLAY_US}
                          label={t('dashboard.end_date')}
                          value={pattern.dateBefore}
                          onChange={(val) => setPattern((prev) => ({ ...prev, dateBefore: val }))}
                          minDate={pattern.dateAfter ?? undefined}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={pattern.dateAfter === null || pattern.dateBefore === null}
                        onClick={handleSearch}
                      >
                        {t('actions.apply')}
                      </Button>
                    </Grid>

                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setShowFilter(false)
                          handleClear()
                        }}
                      >
                        {t('actions.close')}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>

            <MaterialTable
              key={limit}
              components={{
                Container: PaperContainer,
                Pagination: PaginationWrapper,
              }}
              columns={columns}
              data={rows}
              isLoading={isLoading}
              title=""
              actions={[]}
              options={{
                search: false,
                idSynonym: 'id',
                searchFieldAlignment: 'left',
                selection: false,
                pageSize: limit,
                rowStyle: (rowData: ClientTokenRow) => ({
                  backgroundColor: rowData.enabled ? customColors.logo : customColors.white,
                }),
                headerStyle: tableHeaderStyle,
                actionsColumnIndex: -1,
              }}
              editable={{
                isDeleteHidden: () => false,
                onRowDelete: (oldData: ClientTokenRow) =>
                  new Promise<void>((resolve, reject) => {
                    handleRevokeToken(oldData).then(resolve).catch(reject)
                  }),
              }}
              detailPanel={DetailPanel}
            />
          </GluuViewWrapper>
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ClientActiveTokens
