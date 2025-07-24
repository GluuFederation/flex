import React, { useEffect, useState, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { Paper, TablePagination } from '@mui/material'
import { Card, CardBody } from 'Components'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import { ASSETS_WRITE, ASSETS_READ, ASSETS_DELETE, buildPayload } from 'Utils/PermChecker'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { LIMIT_ID, PATTERN_ID } from 'Plugins/admin/common/Constants'
import SetTitle from 'Utils/SetTitle'
import { useNavigate } from 'react-router'
import {
  fetchJansAssets,
  deleteJansAsset,
  setSelectedAsset,
  getAssetServices,
  getAssetTypes,
} from 'Plugins/admin/redux/features/AssetSlice'
import customColors from '@/customColors'
import moment from 'moment'

const JansAssetListPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  SetTitle(t('titles.assets'))
  const [pageNumber, setPageNumber] = useState(0)
  const { totalItems, assets } = useSelector((state) => state.assetReducer)
  const loadingAssets = useSelector((state) => state.assetReducer.loadingAssets)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  const [myActions, setMyActions] = useState([])
  const options = {}
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)
  let memoLimit = limit
  let memoPattern = pattern

  // Initialize Cedar permissions
  useEffect(() => {
    const initPermissions = async () => {
      const permissions = [ASSETS_READ, ASSETS_WRITE, ASSETS_DELETE]
      for (const permission of permissions) {
        await authorize([permission])
      }
    }
    initPermissions()
    dispatch(getAssetTypes({ action: options }))
    options['limit'] = 10
    dispatch(fetchJansAssets({ action: options }))
    dispatch(getAssetServices({ action: options }))
  }, [dispatch])

  useEffect(() => {
    const actions = []

    const canRead = hasCedarPermission(ASSETS_READ)
    const canWrite = hasCedarPermission(ASSETS_WRITE)
    const canDelete = hasCedarPermission(ASSETS_DELETE)

    if (canRead) {
      actions.push({
        icon: () => (
          <GluuAdvancedSearch
            limitId={LIMIT_ID}
            patternId={PATTERN_ID}
            limit={limit}
            pattern={pattern}
            handler={handleOptionsChange}
            showLimit={false}
          />
        ),
        tooltip: `${t('messages.advanced_search')}`,
        iconProps: { color: 'primary' },
        isFreeAction: true,
        onClick: () => {},
      })

      actions.push({
        icon: 'refresh',
        tooltip: `${t('messages.refresh')}`,
        iconProps: { color: 'primary' },
        isFreeAction: true,
        onClick: () => {
          setLimit(memoLimit)
          setPattern(memoPattern)
          dispatch(fetchJansAssets({ action: { limit: memoLimit, pattern: memoPattern } }))
        },
      })
    }

    if (canWrite) {
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_asset')}`,
        iconProps: { color: 'primary' },
        isFreeAction: true,
        onClick: navigateToAddPage,
      })

      actions.push((rowData) => ({
        icon: 'edit',
        iconProps: {
          id: 'editScope' + rowData.inum,
        },
        onClick: (event, rowData) => navigateToEditPage(rowData),
        disabled: !canWrite,
      }))
    }

    if (canDelete) {
      actions.push((rowData) => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'secondary',
          id: 'deleteClient' + rowData.inum,
        },
        onClick: (event, rowData) => {
          setDeleteData(rowData)
          toggle()
        },
        disabled: false,
      }))
    }

    setMyActions(actions)
  }, [cedarPermissions, limit, pattern, t, navigateToAddPage, navigateToEditPage])

  const PaperContainer = useCallback((props) => <Paper {...props} elevation={0} />, [])
  const theme = useContext(ThemeContext)
  const themeColors = getThemeColor(theme.state.theme)
  const bgThemeColor = { background: themeColors.background }
  const [modal, setModal] = useState(false)
  const [deleteData, setDeleteData] = useState(null)
  const toggle = () => setModal(!modal)

  const submitForm = useCallback(
    (userMessage) => {
      const userAction = {}
      toggle()
      buildPayload(userAction, userMessage, deleteData)
      dispatch(deleteJansAsset({ action: userAction }))
    },
    [deleteData, dispatch],
  )

  const handleOptionsChange = useCallback((event) => {
    if (event.target.name == 'limit') {
      memoLimit = event.target.value
    } else if (event.target.name == 'pattern') {
      memoPattern = event.target.value
      if (event.keyCode === 13) {
        const newOptions = {
          limit: limit,
          pattern: memoPattern,
        }
        dispatch(fetchJansAssets({ action: newOptions }))
      }
    }
  }, [])

  const onPageChangeClick = useCallback(
    (page) => {
      const startCount = page * limit
      const newOptions = {
        startIndex: parseInt(startCount),
        limit: limit,
        pattern: pattern,
      }
      setPageNumber(page)
      dispatch(fetchJansAssets({ action: newOptions }))
    },
    [limit, pattern, dispatch],
  )

  const onRowCountChangeClick = useCallback(
    (count) => {
      const newOptions = {
        limit: count,
        pattern: pattern,
      }
      setPageNumber(0)
      setLimit(count)
      dispatch(fetchJansAssets({ action: newOptions }))
    },
    [pattern, dispatch],
  )

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
    [pageNumber, totalItems, onPageChangeClick, limit, onRowCountChangeClick],
  )

  const navigateToAddPage = useCallback(() => {
    dispatch(setSelectedAsset({}))
    navigate('/adm/asset/add')
  }, [dispatch, navigate])

  const navigateToEditPage = useCallback(
    (data) => {
      dispatch(setSelectedAsset(data))
      navigate(`/adm/asset/edit/${data.inum}`)
    },
    [dispatch, navigate],
  )

  return (
    <GluuLoader blocking={loadingAssets}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={hasCedarPermission(ASSETS_READ)}>
            <MaterialTable
              components={{
                Container: PaperContainer,
                Pagination: PaginationWrapper,
              }}
              columns={[
                {
                  title: `${t('fields.name')}`,
                  field: 'fileName',
                },
                {
                  title: `${t('fields.description')}`,
                  field: 'description',
                  width: '40%',
                  render: (rowData) => (
                    <div style={{ wordWrap: 'break-word', maxWidth: '420px' }}>
                      {rowData.description}
                    </div>
                  ),
                },
                {
                  title: `${t('fields.creationDate')}`,
                  field: 'creationDate',
                  render: (rowData) => (
                    <div style={{ wordWrap: 'break-word', maxWidth: '420px' }}>
                      {moment(rowData.creationDate).format('YYYY-MM-DD')}
                    </div>
                  ),
                },
                { title: `${t('fields.enabled')}`, field: 'enabled' },
              ]}
              data={assets || []}
              isLoading={loadingAssets}
              title=""
              actions={myActions}
              options={{
                search: false,
                idSynonym: 'inum',
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
                cellStyle: {
                  backgroundColor: customColors.white,
                  border: `1px solid ${customColors.lightGray}`,
                },
                actionsCellStyle: {
                  backgroundColor: customColors.white,
                  border: `1px solid ${customColors.lightGray}`,
                },
                actionsColumnIndex: -1,
              }}
            />
          </GluuViewWrapper>
        </CardBody>
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
      </Card>
    </GluuLoader>
  )
}

export default JansAssetListPage
