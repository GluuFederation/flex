import React, { useState, useEffect, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Paper, Skeleton, TablePagination } from '@mui/material'
import { Badge } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useCedarling } from '@/cedarling'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { Card, CardBody } from 'Components'
import CustomScriptDetailPage from './CustomScriptDetailPage'
import GluuCustomScriptSearch from 'Routes/Apps/Gluu/GluuCustomScriptSearch'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  deleteCustomScript,
  getCustomScriptByType,
  setCurrentItem,
  viewOnly,
  getScriptTypes,
} from 'Plugins/admin/redux/features/customScriptSlice'
import { buildPayload, SCRIPT_READ, SCRIPT_WRITE, SCRIPT_DELETE } from 'Utils/PermChecker'
import { LIMIT_ID, LIMIT, PATTERN, PATTERN_ID, TYPE, TYPE_ID } from '../../common/Constants'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import { getPagingSize } from '@/utils/pagingUtils'
import { RootState, UserAction } from './types'

function ScriptListTable(): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch<any>()
  const navigate = useNavigate()
  const { hasCedarPermission, authorize } = useCedarling()
  const userAction: UserAction = {}
  const options: any = {}
  const [myActions, setMyActions] = useState<any[]>([])
  const [item, setItem] = useState<any>({})
  const [modal, setModal] = useState<boolean>(false)
  const pageSize = getPagingSize()
  const [limit, setLimit] = useState<string | number>(pageSize)
  const [pattern, setPattern] = useState<string>('')
  const [type, setType] = useState<string>('person_authentication')
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlack'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  let memoType = type

  const scripts = useSelector((state: RootState) => state.customScriptReducer.items)
  const loading = useSelector((state: RootState) => state.customScriptReducer.loading)
  const { permissions: cedarPermissions } = useSelector(
    (state: RootState) => state.cedarPermissions,
  )
  const hasFetchedScriptTypes = useSelector(
    (state: RootState) => state.customScriptReducer.hasFetchedScriptTypes,
  )
  const { totalItems, scriptTypes, loadingScriptTypes } = useSelector(
    (state: RootState) => state.customScriptReducer,
  )

  const [pageNumber, setPageNumber] = useState<number>(0)
  SetTitle(t('titles.scripts'))

  function makeOptions(): void {
    setType(memoType)
    options[LIMIT] = parseInt(String(limit))
    const patternValue = pattern.trim()
    if (patternValue !== '') {
      options[PATTERN] = patternValue
    } else {
      delete options[PATTERN]
    }
    if (memoType != '') {
      options[TYPE] = memoType
    }
  }

  // Initialize Cedar permissions
  useEffect(() => {
    const initPermissions = async () => {
      const permissions = [SCRIPT_READ, SCRIPT_WRITE, SCRIPT_DELETE]
      for (const permission of permissions) {
        await authorize([permission])
      }
    }
    makeOptions()
    dispatch(getCustomScriptByType({ action: options } as any))
    initPermissions()
  }, [dispatch])

  useEffect(() => {
    if (!hasFetchedScriptTypes) {
      dispatch(getScriptTypes())
    }
  }, [hasFetchedScriptTypes, dispatch])

  const handleOptionsChange = useCallback(
    (event: any) => {
      const name = event.target.name
      const value = event.target.value
      if (name === 'pattern') {
        setPattern(value)
        if (event.keyCode === 13) {
          makeOptions()
          dispatch(getCustomScriptByType({ action: options } as any))
        }
      } else if (name === 'type') {
        memoType = event.target.value
        makeOptions()
        dispatch(getCustomScriptByType({ action: options } as any))
      }
    },
    [dispatch, pattern, type, limit],
  )

  const handleGoToCustomScriptAddPage = useCallback(() => {
    return navigate('/adm/script/new')
  }, [navigate])

  const handleGoToCustomScriptEditPage = useCallback(
    (row: any, edition?: boolean) => {
      dispatch(viewOnly({ view: edition || false }))
      dispatch(setCurrentItem({ item: row }))
      return navigate(`/adm/script/edit/:` + row.inum)
    },
    [dispatch, navigate],
  )

  const toggle = useCallback(() => setModal(!modal), [modal])

  const handleCustomScriptDelete = useCallback(
    (row: any) => {
      setItem(row)
      toggle()
    },
    [toggle],
  )

  const onDeletionConfirmed = useCallback(
    (message: string) => {
      buildPayload(userAction, message, item.inum)
      dispatch(deleteCustomScript({ action: userAction } as any))
      navigate('/adm/scripts')
      toggle()
    },
    [item.inum, dispatch, navigate, toggle],
  )

  const onPageChangeClick = useCallback(
    (page: number) => {
      makeOptions()
      const startCount = page * Number(limit)
      options['startIndex'] = parseInt(String(startCount))
      options['limit'] = Number(limit)
      setPageNumber(page)
      dispatch(getCustomScriptByType({ action: options } as any))
    },
    [limit, dispatch],
  )

  const onRowCountChangeClick = useCallback(
    (count: number) => {
      makeOptions()
      options['limit'] = count
      setPageNumber(0)
      setLimit(count)
      dispatch(getCustomScriptByType({ action: options } as any))
    },
    [dispatch],
  )

  // Build actions only when permissions change
  useEffect(() => {
    const actions: any[] = []
    const canRead = hasCedarPermission(SCRIPT_READ)
    const canWrite = hasCedarPermission(SCRIPT_WRITE)
    const canDelete = hasCedarPermission(SCRIPT_DELETE)
    if (canWrite) {
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_script')}`,
        iconProps: {
          color: 'primary',
          style: {
            color: customColors.lightBlue,
          },
        },
        isFreeAction: true,
        onClick: handleGoToCustomScriptAddPage,
      })
      actions.push((_rowData: any) => ({
        icon: 'edit',
        iconProps: {
          color: 'primary',
          style: {
            color: customColors.darkGray,
          },
        },
        tooltip: `${t('messages.edit_script')}`,
        onClick: (event?: any, entry?: any) => {
          if (entry) handleGoToCustomScriptEditPage(entry)
        },
        disabled: false,
      }))
    }

    if (canRead) {
      actions.push((_rowData: any) => ({
        icon: 'visibility',
        iconProps: {
          color: 'primary',
          style: {
            color: customColors.darkGray,
          },
        },
        tooltip: `${t('messages.view_script_details')}`,
        onClick: (event?: any, rowData?: any) => {
          if (rowData) handleGoToCustomScriptEditPage(rowData, true)
        },
        disabled: false,
      }))

      actions.push({
        icon: () => (
          <>
            {loadingScriptTypes ? (
              <Skeleton variant="text" width="10rem" sx={{ fontSize: '3rem' }} />
            ) : (
              <GluuCustomScriptSearch
                limitId={LIMIT_ID}
                limit={limit}
                typeId={TYPE_ID}
                patternId={PATTERN_ID}
                scriptType={type}
                pattern={pattern}
                handler={handleOptionsChange}
                options={scriptTypes}
              />
            )}
          </>
        ),
        tooltip: `${t('messages.advanced_search')}`,
        iconProps: {
          color: 'primary',
          style: {
            borderColor: customColors.lightBlue,
          },
        },
        isFreeAction: true,
      })

      actions.push({
        icon: 'refresh',
        tooltip: `${t('messages.refresh')}`,
        iconProps: {
          color: 'primary',
          style: {
            color: customColors.lightBlue,
          },
        },
        isFreeAction: true,
        onClick: () => {
          makeOptions()
          dispatch(getCustomScriptByType({ action: options } as any))
        },
      })
    }

    if (canDelete) {
      actions.push((_rowData: any) => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'primary',
          style: {
            color: customColors.darkGray,
          },
        },
        tooltip: `${t('messages.delete_script')}`,
        onClick: (event?: any, row?: any) => {
          if (row) handleCustomScriptDelete(row)
        },
        disabled: false,
      }))
    }

    setMyActions(actions)
  }, [
    cedarPermissions,
    loadingScriptTypes,
    limit,
    type,
    pattern,
    scriptTypes,
    t,
    dispatch,
    handleGoToCustomScriptEditPage,
    handleGoToCustomScriptAddPage,
    handleCustomScriptDelete,
    handleOptionsChange,
  ])

  // MaterialTable components
  const PaperContainer = useCallback((props: any) => <Paper {...props} elevation={0} />, [])

  const CustomPagination = useCallback(
    () => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(event: unknown, page: number) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={Number(limit)}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onRowCountChangeClick(Number(event.target.value))
        }}
      />
    ),
    [totalItems, pageNumber, limit, onPageChangeClick, onRowCountChangeClick],
  )

  const DetailPanel = useCallback((rowData: { rowData: any }) => {
    return <CustomScriptDetailPage row={rowData.rowData} />
  }, [])

  // MaterialTable options
  const tableOptions: any = {
    search: false,
    idSynonym: 'inum',
    searchFieldAlignment: 'left',
    selection: false,
    pageSize: Number(limit),
    rowStyle: (rowData: any) => ({
      backgroundColor:
        rowData.enabled && rowData?.scriptError?.stackTrace
          ? customColors.accentRed
          : rowData.enabled
            ? themeColors.lightBackground
            : customColors.white,
    }),
    headerStyle: {
      ...applicationStyle.tableHeaderStyle,
      ...bgThemeColor,
    },
    actionsColumnIndex: -1,
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasCedarPermission(SCRIPT_READ)}>
          <MaterialTable
            key={Number(limit)}
            components={{
              Container: PaperContainer,
              Pagination: CustomPagination,
            }}
            columns={[
              { title: `${t('fields.name')}`, field: 'name' },
              { title: `${t('fields.description')}`, field: 'description' },
              {
                title: `${t('options.enabled')}`,
                field: 'enabled',
                type: 'boolean',
                render: (rowData: any) => (
                  <Badge color={rowData.enabled == true ? `primary-${selectedTheme}` : 'dimmed'}>
                    {rowData.enabled ? 'true' : 'false'}
                  </Badge>
                ),
                defaultSort: 'desc',
              },
            ]}
            data={scripts}
            isLoading={loading}
            title=""
            actions={myActions}
            options={tableOptions}
            detailPanel={DetailPanel}
          />
        </GluuViewWrapper>
        {hasCedarPermission(SCRIPT_DELETE) && (
          <GluuDialog
            row={item}
            handler={toggle}
            modal={modal}
            subject="script"
            onAccept={onDeletionConfirmed}
            feature={adminUiFeatures.custom_script_delete}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default ScriptListTable
