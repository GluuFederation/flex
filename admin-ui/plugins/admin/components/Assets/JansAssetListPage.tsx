import React, { useEffect, useState, useContext, useCallback } from 'react'
import MaterialTable, { Action, Column } from '@material-table/core'
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

// Type definitions
interface Asset {
  inum: string
  dn: string
  baseDn: string
  creationDate: string
  fileName: string
  enabled: boolean
  description: string
  service: string
  [key: string]: any // Add index signature for compatibility with ActionData
}

interface AssetReducerState {
  totalItems: number
  assets: Asset[]
  services: string[]
  fileTypes: string[]
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  entriesCount: number
  selectedAsset: Asset | null
  loadingAssets: boolean
  assetModal: boolean
  showErrorModal: boolean
}

interface CedarPermissionsState {
  permissions: Record<string, boolean>
  loading: boolean
  error: string | null
  initialized: boolean | null
  isInitializing: boolean
}

interface RootState {
  assetReducer: AssetReducerState
  cedarPermissions: CedarPermissionsState
}

interface ActionOptions {
  limit?: number
  pattern?: string | null
  startIndex?: number
}

interface SearchEvent {
  target: {
    name: string
    value: string | number
  }
}

interface UserAction {
  action_message?: string
  action_data?: any
  [key: string]: any
}

const JansAssetListPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  SetTitle(t('titles.assets'))
  const [pageNumber, setPageNumber] = useState<number>(0)
  const { totalItems, assets } = useSelector((state: RootState) => state.assetReducer)
  const loadingAssets = useSelector((state: RootState) => state.assetReducer.loadingAssets)
  const { permissions: cedarPermissions } = useSelector(
    (state: RootState) => state.cedarPermissions,
  )

  const [myActions, setMyActions] = useState<Action<Asset>[]>([])
  const [options, setOptions] = useState<ActionOptions>({})
  const [limit, setLimit] = useState<number>(10)
  const [pattern, setPattern] = useState<string | null>(null)
  let memoLimit = limit
  let memoPattern = pattern

  const navigateToAddPage = useCallback(() => {
    dispatch(setSelectedAsset({} as any))
    navigate('/adm/asset/add')
  }, [dispatch, navigate])

  const navigateToEditPage = useCallback(
    (data: Asset) => {
      dispatch(setSelectedAsset(data as any))
      navigate(`/adm/asset/edit/${data.inum}`)
    },
    [dispatch, navigate],
  )

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
    const initialOptions: ActionOptions = { limit: 10 }
    setOptions(initialOptions)
    dispatch(fetchJansAssets({ action: initialOptions }))
    dispatch(getAssetServices({ action: options }))
  }, [dispatch, authorize])

  useEffect(() => {
    const actions: Action<Asset>[] = []

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

      actions.push({
        icon: 'edit',
        iconProps: {
          id: 'editScope',
        },
        onClick: (_event: any, data: Asset | Asset[]) => {
          if (!Array.isArray(data)) {
            navigateToEditPage(data)
          }
        },
        disabled: !canWrite,
      })
    }

    if (canDelete) {
      actions.push({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'secondary',
          id: 'deleteClient',
        },
        onClick: (_event: any, data: Asset | Asset[]) => {
          if (!Array.isArray(data)) {
            setDeleteData(data)
            toggle()
          }
        },
        disabled: false,
      })
    }

    setMyActions(actions)
  }, [
    cedarPermissions,
    limit,
    pattern,
    t,
    navigateToAddPage,
    navigateToEditPage,
    hasCedarPermission,
  ])

  const PaperContainer = useCallback((props: any) => <Paper {...props} elevation={0} />, [])
  const theme = useContext(ThemeContext)
  const themeColors = getThemeColor(theme?.state.theme || 'darkBlack')
  const bgThemeColor = { background: themeColors.background }
  const [modal, setModal] = useState<boolean>(false)
  const [deleteData, setDeleteData] = useState<Asset | null>(null)
  const toggle = () => setModal(!modal)

  const submitForm = useCallback(
    (userMessage: string) => {
      const userAction: UserAction = {}
      toggle()
      buildPayload(userAction, userMessage, deleteData)
      dispatch((deleteJansAsset as any)({ action: userAction }))
    },
    [deleteData, dispatch],
  )

  const handleOptionsChange = useCallback((event: SearchEvent) => {
    if (event.target.name === 'limit') {
      memoLimit = Number(event.target.value)
    } else if (event.target.name === 'pattern') {
      memoPattern = String(event.target.value)
    }
  }, [])

  const onPageChangeClick = useCallback(
    (page: number) => {
      const startCount = page * limit
      const newOptions: ActionOptions = {
        startIndex: startCount,
        limit: limit,
        pattern: pattern,
      }
      setPageNumber(page)
      dispatch(fetchJansAssets({ action: newOptions }))
    },
    [limit, pattern, dispatch],
  )

  const onRowCountChangeClick = useCallback(
    (count: number) => {
      const newOptions: ActionOptions = {
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
        onPageChange={(_event, page) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(event) => onRowCountChangeClick(Number(event.target.value))}
      />
    ),
    [pageNumber, totalItems, onPageChangeClick, limit, onRowCountChangeClick],
  )

  const columns: Column<Asset>[] = [
    {
      title: `${t('fields.name')}`,
      field: 'fileName',
    },
    {
      title: `${t('fields.description')}`,
      field: 'description',
      width: '40%',
      render: (rowData: Asset) => (
        <div style={{ wordWrap: 'break-word', maxWidth: '420px' }}>{rowData.description}</div>
      ),
    },
    {
      title: `${t('fields.creationDate')}`,
      field: 'creationDate',
      render: (rowData: Asset) => (
        <div style={{ wordWrap: 'break-word', maxWidth: '420px' }}>
          {moment(rowData.creationDate).format('YYYY-MM-DD')}
        </div>
      ),
    },
    { title: `${t('fields.enabled')}`, field: 'enabled' },
  ]

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
              columns={columns}
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
                rowStyle: (rowData: Asset) => ({
                  backgroundColor: rowData.enabled ? customColors.logo : customColors.white,
                }),
                headerStyle: {
                  ...applicationStyle.tableHeaderStyle,
                  ...bgThemeColor,
                } as React.CSSProperties,
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
