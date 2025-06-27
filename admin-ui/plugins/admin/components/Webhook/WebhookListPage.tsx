import React, { useEffect, useState, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { Paper, TablePagination } from '@mui/material'

import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import {
  hasPermission,
  WEBHOOK_WRITE,
  WEBHOOK_READ,
  WEBHOOK_DELETE,
  buildPayload,
} from 'Utils/PermChecker'
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
  getWebhook,
  deleteWebhook,
  setSelectedWebhook,
} from 'Plugins/admin/redux/features/WebhookSlice'

// Type definitions
interface Webhook {
  inum: string
  displayName: string
  url: string
  httpMethod: string
  jansEnabled: boolean
  enabled?: boolean
}

interface WebhookState {
  totalItems: number
  webhooks: Webhook[]
  loading: boolean
}

interface AuthState {
  permissions: string[]
}

interface RootState {
  webhookReducer: WebhookState
  authReducer: AuthState
}

interface Options {
  limit?: number
  pattern?: string | null
  startIndex?: number
}

interface UserAction {
  [key: string]: any
}

interface DeleteData {
  inum: string
  displayName: string
  url: string
  httpMethod: string
  jansEnabled: boolean
}

interface PaperProps {
  [key: string]: any
}

interface PaginationProps {
  [key: string]: any
}

interface EventTarget {
  name: string
  value: string | number
}

interface ChangeEvent {
  target: EventTarget
}

interface RowData {
  inum: string
  displayName: string
  url: string
  httpMethod: string
  jansEnabled: boolean
  enabled?: boolean
}

const WebhookListPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [pageNumber, setPageNumber] = useState<number>(0)
  const { totalItems, webhooks } = useSelector((state: RootState) => state.webhookReducer)
  const permissions = useSelector((state: RootState) => state.authReducer.permissions)
  const loading = useSelector((state: RootState) => state.webhookReducer.loading)
  const PaperContainer = useCallback((props: PaperProps) => <Paper {...props} elevation={0} />, [])

  const theme = useContext(ThemeContext)
  const themeColors = getThemeColor(theme?.state.theme || 'darkBlack')
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.webhooks'))

  const [modal, setModal] = useState<boolean>(false)
  const [deleteData, setDeleteData] = useState<DeleteData | null>(null)
  const toggle = (): void => setModal(!modal)
  const submitForm = (userMessage: string): void => {
    const userAction: UserAction = {}
    toggle()
    buildPayload(userAction, userMessage, deleteData)
    dispatch(deleteWebhook({ action: userAction } as any))
  }

  const myActions: any[] = []
  const options: Options = {}

  const [limit, setLimit] = useState<number>(10)
  const [pattern, setPattern] = useState<string | null>(null)

  useEffect(() => {
    options.limit = 10
    dispatch(getWebhook({ action: options }))
  }, [])

  let memoLimit = limit
  let memoPattern = pattern

  function handleOptionsChange(event: ChangeEvent): void {
    if (event.target.name === 'limit') {
      memoLimit = Number(event.target.value)
    } else if (event.target.name === 'pattern') {
      memoPattern = String(event.target.value)
    }
  }

  const onPageChangeClick = (page: number): void => {
    const startCount = page * limit
    options.startIndex = startCount
    options.limit = limit
    options.pattern = pattern
    setPageNumber(page)
    dispatch(getWebhook({ action: options }))
  }

  const onRowCountChangeClick = (count: number): void => {
    options.limit = count
    options.pattern = pattern
    setPageNumber(0)
    setLimit(count)
    dispatch(getWebhook({ action: options }))
  }

  const PaginationWrapper = useCallback(
    (props: PaginationProps) => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(_event, page) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(_event) => {
          const target = _event.target as HTMLInputElement
          onRowCountChangeClick(Number(target.value))
        }}
      />
    ),
    [pageNumber, totalItems, limit],
  )

  const navigateToAddPage = useCallback((): void => {
    dispatch(setSelectedWebhook({}))
    navigate('/adm/webhook/add')
  }, [dispatch, navigate])

  const navigateToEditPage = useCallback(
    (data: RowData): void => {
      dispatch(setSelectedWebhook(data))
      navigate(`/adm/webhook/edit/${data.inum}`)
    },
    [dispatch, navigate],
  )

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])

  const GluuSearch = useCallback(() => {
    return (
      <GluuAdvancedSearch
        limitId={LIMIT_ID}
        patternId={PATTERN_ID}
        limit={limit}
        pattern={pattern}
        handler={handleOptionsChange}
        showLimit={false}
      />
    )
  }, [limit, pattern])

  if (hasPermission(permissions, WEBHOOK_READ)) {
    myActions.push({
      icon: GluuSearch,
      tooltip: `${t('messages.advanced_search')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {},
    })
  }

  if (hasPermission(permissions, WEBHOOK_READ)) {
    myActions.push({
      icon: 'refresh',
      tooltip: `${t('messages.refresh')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => {
        setLimit(memoLimit)
        setPattern(memoPattern)
        dispatch(getWebhook({ action: { limit: memoLimit, pattern: memoPattern } }))
      },
    })
  }

  if (hasPermission(permissions, WEBHOOK_WRITE)) {
    myActions.push({
      icon: 'add',
      tooltip: `${t('messages.add_webhook')}`,
      iconProps: { color: 'primary' },
      isFreeAction: true,
      onClick: () => navigateToAddPage(),
    })
  }

  if (hasPermission(permissions, WEBHOOK_WRITE)) {
    myActions.push((rowData: RowData) => ({
      icon: 'edit',
      iconProps: {
        id: 'editScope' + rowData.inum,
      },
      onClick: (_event: any, rowData: RowData) => navigateToEditPage(rowData),
      disabled: !hasPermission(permissions, WEBHOOK_WRITE),
    }))
  }

  if (hasPermission(permissions, WEBHOOK_DELETE)) {
    myActions.push((rowData: RowData) => ({
      icon: DeleteOutlinedIcon,
      iconProps: {
        color: 'secondary',
        id: 'deleteClient' + rowData.inum,
      },
      onClick: (_event: any, rowData: RowData) => {
        setDeleteData(rowData)
        toggle()
      },
      disabled: false,
    }))
  }

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={hasPermission(permissions, WEBHOOK_READ)}>
            <MaterialTable
              components={{
                Container: PaperContainer,
                Pagination: PaginationWrapper,
              }}
              columns={[
                {
                  title: `${t('fields.name')}`,
                  field: 'displayName',
                },
                {
                  title: `${t('fields.url')}`,
                  field: 'url',
                  width: '40%',
                  render: (rowData: RowData) => (
                    <div style={{ wordWrap: 'break-word', maxWidth: '420px' }}>{rowData.url}</div>
                  ),
                },
                { title: `${t('fields.http_method')}`, field: 'httpMethod' },
                { title: `${t('fields.enabled')}`, field: 'jansEnabled' },
              ]}
              data={webhooks}
              isLoading={loading}
              title=""
              actions={myActions}
              options={{
                idSynonym: 'inum',
                search: false,
                searchFieldAlignment: 'left',
                selection: false,
                pageSize: limit,
                rowStyle: (rowData: RowData) => ({
                  backgroundColor: rowData.jansEnabled ? '#33AE9A' : '#FFF',
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

export default WebhookListPage
