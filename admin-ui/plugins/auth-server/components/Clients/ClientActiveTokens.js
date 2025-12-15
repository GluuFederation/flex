import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import MaterialTable from '@material-table/core'
import { Card, CardBody } from '../../../../app/components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ThemeContext } from 'Context/theme/themeContext'
import { Box, Grid, MenuItem, Paper, TablePagination, TextField, Tooltip } from '@mui/material'

import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import getThemeColor from 'Context/theme/config'
import moment from 'moment'
import { deleteClientToken, getTokenByClient } from '../../redux/features/oidcSlice'
import ClientActiveTokenDetailPage from './ClientActiveTokenDetailPage'
import { Button } from 'Components'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { Button as MaterialButton } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import GetAppIcon from '@mui/icons-material/GetApp'
import customColors from '@/customColors'
function ClientActiveTokens({ client }) {
  const myActions = useMemo(() => [], [])
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = useMemo(
    () => ({
      background: themeColors.background,
    }),
    [themeColors.background],
  )
  const [data, setData] = useState([])

  const [showFilter, setShowFilter] = useState(false)
  const [searchFilter, setSearchFilter] = useState('expirationDate')

  const [pageNumber, setPageNumber] = useState(0)
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState({
    dateAfter: null,
    dateBefore: null,
  })

  const loading = useSelector((state) => state.oidcReducer.isTokenLoading)
  const updatedToken = useSelector((state) => state.oidcReducer.tokens)

  const { totalItems } = useSelector((state) => state.oidcReducer.tokens)

  const getTokens = useCallback(
    (page, limitValue, fieldValuePair) => {
      const tokenOptions = {
        startIndex: parseInt(page, 10),
        limit: limitValue,
        fieldValuePair,
      }
      dispatch(getTokenByClient({ action: tokenOptions }))
    },
    [dispatch],
  )

  const onPageChangeClick = useCallback(
    (page) => {
      const startCount = page * limit
      setPageNumber(page)
      let conditionquery = `clnId=${client.inum}`
      if (pattern.dateAfter && pattern.dateBefore) {
        conditionquery += `,${searchFilter}>${dayjs(pattern.dateAfter).format('YYYY-MM-DD')}`
        conditionquery += `,${searchFilter}<${dayjs(pattern.dateBefore).format('YYYY-MM-DD')}`
      }

      getTokens(startCount, limit, conditionquery)
    },
    [client.inum, getTokens, limit, pattern.dateAfter, pattern.dateBefore, searchFilter],
  )

  const onRowCountChangeClick = useCallback(
    (count) => {
      setPageNumber(0)
      setLimit(count)
      getTokens(0, count, `clnId=${client.inum}`)
    },
    [client.inum, getTokens],
  )

  const PaperContainer = useCallback((props) => <Paper {...props} elevation={0} />, [])

  const PaginationWrapper = useCallback(
    () => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(prop, page) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(prop, count) => onRowCountChangeClick(count.props.value)}
      />
    ),
    [limit, onPageChangeClick, onRowCountChangeClick, pageNumber, totalItems],
  )

  const DetailPanel = useCallback((rowData) => {
    return <ClientActiveTokenDetailPage row={rowData} />
  }, [])

  const handleSearch = () => {
    const startCount = pageNumber * limit
    let conditionquery = `clnId=${client.inum}`
    if (pattern.dateAfter && pattern.dateBefore) {
      conditionquery += `,${searchFilter}>${dayjs(pattern.dateAfter).format('YYYY-MM-DD')}`
      conditionquery += `,${searchFilter}<${dayjs(pattern.dateBefore).format('YYYY-MM-DD')}`
    }
    getTokens(startCount, limit, conditionquery)
  }

  const handleClear = () => {
    setPattern({ dateAfter: null, dateBefore: null })
    const startCount = pageNumber * limit
    const conditionquery = `clnId=${client.inum}`
    getTokens(startCount, limit, conditionquery)
  }

  const handleRevokeToken = (oldData) => {
    dispatch(deleteClientToken({ tknCode: oldData.tokenCode }))
    const startCount = pageNumber * limit
    let conditionquery = `clnId=${client.inum}`
    if (pattern.dateAfter && pattern.dateBefore) {
      conditionquery += `,${searchFilter}>${dayjs(pattern.dateAfter).format('YYYY-MM-DD')}`
      conditionquery += `,${searchFilter}<${dayjs(pattern.dateBefore).format('YYYY-MM-DD')}`
    }
    getTokens(startCount, limit, conditionquery)
  }

  const convertToCSV = (data) => {
    if (
      !data ||
      !Array.isArray(data) ||
      data.length === 0 ||
      data[0] == null ||
      typeof data[0] !== 'object' ||
      Array.isArray(data[0])
    ) {
      return ''
    }

    const keys = Object.keys(data[0]).filter((item) => item !== 'attributes')
    const header = keys.map((item) => item.replace(/-/g, ' ').toUpperCase()).join(',')

    const updateData = data.map((row) => ({
      id: row?.id || '',
      tokenCode: row?.tokenCode || '',
      scope: row?.scope || '',
      deletable: row?.deletable || '',
      grantType: row?.grantType || '',
      expirationDate: row?.expirationDate || '',
      creationDate: row?.creationDate || '',
      tokenType: row?.tokenType || '',
    }))

    const rows = updateData.map((row) =>
      keys.map((key) => (row[key] != null ? String(row[key]) : '')).join(','),
    )

    return [header, ...rows].join('\n')
  }

  const downloadCSV = () => {
    if (!data || data.length === 0) {
      return
    }

    const csv = convertToCSV(data)
    if (!csv) {
      return
    }

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `client-tokens.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    getTokens(0, limit, `clnId=${client.inum}`)
  }, [getTokens, limit, client.inum])

  useEffect(() => {
    if (updatedToken && typeof updatedToken === 'object' && Object.keys(updatedToken).length > 0) {
      const result = updatedToken?.items?.length
        ? updatedToken.items
            .map((item) => {
              return {
                id: item.tokenCode,
                tokenCode: item.tokenCode,
                tokenType: item.tokenType,
                scope: item.scope,
                deletable: item.deletable,
                attributes: item.attributes,
                grantType: item.grantType,
                expirationDate: moment(item.expirationDate).format('YYYY/DD/MM HH:mm:ss'),
                creationDate: moment(item.creationDate).format('YYYY/DD/MM HH:mm:ss'),
              }
            })
            .sort((a, b) => {
              return moment(b.creationDate, 'YYYY/DD/MM HH:mm:ss').diff(
                moment(a.creationDate, 'YYYY/DD/MM HH:mm:ss'),
              )
            })
        : []
      setData(result)
    } else if (!updatedToken || (updatedToken && !updatedToken.items)) {
      setData([])
    }
  }, [updatedToken])

  const isDataEmpty = useMemo(() => !data || data.length === 0, [data])

  const columns = useMemo(
    () => [
      {
        title: `${t('fields.creationDate')}`,
        field: 'creationDate',
      },
      { title: `${t('fields.token_type')}`, field: 'tokenType' },
      { title: `${t('fields.grant_type')}`, field: 'grantType' },
      {
        title: `${t('fields.expiration_date')}`,
        field: 'expirationDate',
      },
    ],
    [t],
  )

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={true}>
            <Box position="relative" display="flex" justifyContent="flex-end">
              <Box display="flex" justifyContent="flex-end" alignItems="center" p={2} width="500px">
                <MaterialButton
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilter(!showFilter)}
                >
                  {t('titles.filters')}
                </MaterialButton>
                <Tooltip title={isDataEmpty ? t('messages.no_data_to_export') : ''}>
                  <span>
                    <MaterialButton
                      onClick={downloadCSV}
                      startIcon={<GetAppIcon />}
                      disabled={isDataEmpty}
                      sx={{ ml: 2 }}
                    >
                      {t('titles.export_csv')}
                    </MaterialButton>
                  </span>
                </Tooltip>
              </Box>

              {showFilter && (
                <Box
                  sx={{
                    p: 2,
                    mt: 2,
                    borderRadius: 1,
                    position: 'absolute',
                    top: '50%',
                    zIndex: 2,
                    backgroundColor: customColors.white,
                    width: '500px',
                  }}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  border={`1px solid ${customColors.lightGray}`}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <TextField
                        select
                        label="Search Filter"
                        value={searchFilter}
                        onChange={(e) => {
                          setSearchFilter(e.target.value)
                        }}
                        variant="outlined"
                        style={{ width: 150, marginTop: -3 }}
                      >
                        <MenuItem value="expirationDate">{t('titles.expiration_date')}</MenuItem>
                        <MenuItem value="creationDate">{t('titles.creation_date')}</MenuItem>
                      </TextField>
                    </Grid>

                    {(searchFilter === 'expirationDate' || searchFilter === 'creationDate') && (
                      <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="MM/DD/YYYY"
                            label={t('dashboard.start_date')}
                            value={pattern.dateAfter}
                            onChange={(val) => {
                              setPattern({ ...pattern, dateAfter: val })
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                          />
                        </LocalizationProvider>
                      </Grid>
                    )}
                    {(searchFilter === 'expirationDate' || searchFilter === 'creationDate') && (
                      <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="MM/DD/YYYY"
                            label={t('dashboard.end_date')}
                            value={pattern.dateBefore}
                            onChange={(val) => {
                              setPattern({ ...pattern, dateBefore: val })
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                          />
                        </LocalizationProvider>
                      </Grid>
                    )}

                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={
                          pattern.dateAfter === null || pattern.dateBefore === null ? true : false
                        }
                        onClick={() => {
                          handleSearch()
                        }}
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
              data={data}
              isLoading={loading}
              title=""
              actions={myActions}
              options={{
                search: false,
                idSynonym: 'id',
                searchFieldAlignment: 'left',
                selection: false,
                pageSize: limit,
                rowStyle: (rowData) => ({
                  backgroundColor: rowData.enabled ? customColors.logo : customColors.white,
                }),
                headerStyle: {
                  ...applicationStyle.tableHeaderStyle,
                  ...bgThemeColor,
                },
                actionsColumnIndex: -1,
              }}
              editable={{
                isDeleteHidden: () => false,
                onRowDelete: (oldData) => {
                  return new Promise((resolve) => {
                    handleRevokeToken(oldData)
                    resolve()
                  })
                },
              }}
              detailPanel={DetailPanel}
            />
          </GluuViewWrapper>
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

ClientActiveTokens.propTypes = {
  client: PropTypes.any,
}
export default ClientActiveTokens
