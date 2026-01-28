import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import MaterialTable, { Action, Column } from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { Paper, TablePagination } from '@mui/material'
import { Card, CardBody } from 'Components'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { LIMIT_ID, PATTERN_ID } from 'Plugins/admin/common/Constants'
import SetTitle from 'Utils/SetTitle'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import {
  fetchJansAssets,
  deleteJansAsset,
  setSelectedAsset,
  getAssetServices,
  getAssetTypes,
} from 'Plugins/admin/redux/features/AssetSlice'
import customColors from '../../../../app/customColors'
import moment from 'moment'
import { Document, RootState, SearchEvent } from './types'
import { DeleteAssetSagaPayload } from 'Plugins/admin/redux/features/types'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'

const JansAssetListPage: React.FC = () => {
  const dispatch = useDispatch()
  const { navigateToRoute } = useAppNavigation()
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()
  const assetsResourceId = useMemo(() => ADMIN_UI_RESOURCES.Assets, [])
  const assetScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[assetsResourceId], [assetsResourceId])

  const { t } = useTranslation()
  SetTitle(t('titles.assets'))
  const [pageNumber, setPageNumber] = useState<number>(0)
  const { totalItems, assets } = useSelector((state: RootState) => state.assetReducer)
  const loadingAssets = useSelector((state: RootState) => state.assetReducer.loadingAssets)
  const { permissions: cedarPermissions } = useSelector(
    (state: RootState) => state.cedarPermissions,
  )

  const [myActions, setMyActions] = useState<Action<Document>[]>([])
  const options: Record<string, string | number | undefined> = {}
  const [limit, setLimit] = useState<number>(10)
  const [pattern, setPattern] = useState<string | undefined>(undefined)
  let memoLimit: number = limit
  let memoPattern: string | undefined = pattern
  const [modal, setModal] = useState<boolean>(false)
  const [deleteData, setDeleteData] = useState<Document | null>(null)

  const toggle = (): void => setModal(!modal)

  const navigateToAddPage = useCallback((): void => {
    dispatch(setSelectedAsset({}))
    navigateToRoute(ROUTES.ASSET_ADD)
  }, [dispatch, navigateToRoute])

  const navigateToEditPage = useCallback(
    (data: Document): void => {
      if (!data?.inum) return
      dispatch(setSelectedAsset(data))
      navigateToRoute(ROUTES.ASSET_EDIT(data.inum))
    },
    [dispatch, navigateToRoute],
  )

  const handleOptionsChange = useCallback(
    (event: SearchEvent) => {
      if (event.target.name === 'limit') {
        memoLimit = Number(event.target.value)
      } else if (event.target.name === 'pattern') {
        memoPattern = String(event.target.value) || undefined
        if (event.keyCode === 13) {
          const newOptions = {
            limit: limit,
            pattern: memoPattern,
          }
          dispatch(fetchJansAssets(newOptions))
        }
      }
    },
    [limit, dispatch],
  )

  // Initialize Cedar permissions
  useEffect(() => {
    const initPermissions = async () => {
      await authorizeHelper(assetScopes)
    }
    initPermissions()
    dispatch(getAssetTypes())
    options['limit'] = 10
    dispatch(fetchJansAssets(options))
    dispatch(getAssetServices())
  }, [dispatch, authorizeHelper, assetScopes])

  const canReadAssets = useMemo(
    () => hasCedarReadPermission(assetsResourceId),
    [hasCedarReadPermission, assetsResourceId],
  )
  const canWriteAssets = useMemo(
    () => hasCedarWritePermission(assetsResourceId),
    [hasCedarWritePermission, assetsResourceId],
  )
  const canDeleteAssets = useMemo(
    () => hasCedarDeletePermission(assetsResourceId),
    [hasCedarDeletePermission, assetsResourceId],
  )

  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const themeColors = getThemeColor(selectedTheme)
  const isDarkTheme = selectedTheme === THEME_DARK

  useEffect(() => {
    const actions: Action<Document>[] = []

    if (canReadAssets) {
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
          dispatch(fetchJansAssets({ limit: memoLimit, pattern: memoPattern }))
        },
      })
    }

    if (canWriteAssets) {
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_asset')}`,
        iconProps: { color: 'primary' },
        isFreeAction: true,
        onClick: navigateToAddPage,
      })

      actions.push({
        icon: 'edit',
        tooltip: `${t('messages.edit')}`,
        iconProps: {
          style: { color: isDarkTheme ? themeColors.fontColor : customColors.darkGray },
        },
        onClick: (event: React.MouseEvent, rowData: Document | Document[]) => {
          if (!Array.isArray(rowData)) {
            navigateToEditPage(rowData)
          }
        },
      })
    }

    if (canDeleteAssets) {
      actions.push({
        icon: () => (
          <DeleteOutlined
            sx={{ color: isDarkTheme ? themeColors.fontColor : customColors.accentRed }}
          />
        ),
        tooltip: `${t('messages.delete')}`,
        onClick: (event: React.MouseEvent, rowData: Document | Document[]) => {
          if (!Array.isArray(rowData)) {
            setDeleteData(rowData)
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
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    handleOptionsChange,
    dispatch,
    isDarkTheme,
    themeColors.fontColor,
  ])

  const PaperContainer = useCallback(
    (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    [],
  )
  const bgThemeColor = { background: themeColors.background }

  const submitForm = useCallback(
    (userMessage: string) => {
      toggle()
      if (deleteData?.inum) {
        dispatch(
          deleteJansAsset({
            action_message: userMessage,
            action: { action_data: { inum: deleteData.inum } },
          } as DeleteAssetSagaPayload),
        )
      }
    },
    [deleteData, dispatch],
  )

  const onPageChangeClick = useCallback(
    (page: number) => {
      const startCount = page * limit
      const newOptions = {
        startIndex: parseInt(String(startCount)),
        limit: limit,
        pattern: pattern,
      }
      setPageNumber(page)
      dispatch(fetchJansAssets(newOptions))
    },
    [limit, pattern, dispatch],
  )

  const onRowCountChangeClick = useCallback(
    (count: number) => {
      const newOptions = {
        limit: count,
        pattern: pattern,
      }
      setPageNumber(0)
      setLimit(count)
      dispatch(fetchJansAssets(newOptions))
    },
    [pattern, dispatch],
  )

  const PaginationWrapper = useCallback(
    () => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          onRowCountChangeClick(parseInt(event.target.value, 10))
        }}
      />
    ),
    [pageNumber, totalItems, onPageChangeClick, limit, onRowCountChangeClick],
  )

  return (
    <GluuLoader blocking={loadingAssets}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={canReadAssets}>
            <MaterialTable<Document>
              components={{
                Container: PaperContainer,
                Pagination: PaginationWrapper,
              }}
              columns={
                [
                  {
                    title: `${t('fields.name')}`,
                    field: 'fileName',
                  },
                  {
                    title: `${t('fields.description')}`,
                    field: 'description',
                    width: '40%',
                    render: (rowData: Document) => (
                      <div style={{ wordWrap: 'break-word', maxWidth: '420px' }}>
                        {rowData.description}
                      </div>
                    ),
                  },
                  {
                    title: `${t('fields.creationDate')}`,
                    field: 'creationDate',
                    render: (rowData: Document) => (
                      <div style={{ wordWrap: 'break-word', maxWidth: '420px' }}>
                        {moment(rowData.creationDate).format('YYYY-MM-DD')}
                      </div>
                    ),
                  },
                  { title: `${t('fields.enabled')}`, field: 'enabled' },
                ] as Column<Document>[]
              }
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
                rowStyle: (rowData: Document) => {
                  const isEnabled = Boolean(rowData.enabled)
                  const backgroundColor = isEnabled
                    ? themeColors.lightBackground
                    : customColors.white
                  const color = isEnabled ? themeColors.fontColor : customColors.primaryDark

                  return {
                    backgroundColor,
                    color,
                  }
                },
                headerStyle: {
                  ...applicationStyle.tableHeaderStyle,
                  ...bgThemeColor,
                  color: themeColors.fontColor,
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
