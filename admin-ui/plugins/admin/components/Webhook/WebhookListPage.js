import React, { useEffect, useState, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { Paper, TablePagination } from '@mui/material'

import { Card, CardBody } from 'Components'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import { WEBHOOK_WRITE, WEBHOOK_READ, WEBHOOK_DELETE, buildPayload } from 'Utils/PermChecker'
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

const WebhookListPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  const [pageNumber, setPageNumber] = useState(0)
  const { totalItems, webhooks } = useSelector((state) => state.webhookReducer)
  const loading = useSelector((state) => state.webhookReducer.loading)
  const PaperContainer = useCallback((props) => <Paper {...props} elevation={0} />, [])

  const theme = useContext(ThemeContext)
  const themeColors = getThemeColor(theme.state.theme)
  const bgThemeColor = { background: themeColors.background }
  SetTitle(t('titles.webhooks'))

  const [modal, setModal] = useState(false)
  const [deleteData, setDeleteData] = useState(null)
  const toggle = () => setModal(!modal)
  const submitForm = (userMessage) => {
    const userAction = {}
    toggle()
    buildPayload(userAction, userMessage, deleteData)
    dispatch(deleteWebhook({ action: userAction }))
  }

  const [myActions, setMyActions] = useState([])
  const options = {}

  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)

  // Initialize Cedar permissions
  useEffect(() => {
    const initPermissions = async () => {
      const permissions = [WEBHOOK_READ, WEBHOOK_WRITE, WEBHOOK_DELETE]
      for (const permission of permissions) {
        await authorize([permission])
      }
    }
    initPermissions()
    options['limit'] = 10
    dispatch(getWebhook({ action: options }))
  }, [])

  // Build actions only when permissions change
  useEffect(() => {
    const actions = []

    const canRead = hasCedarPermission(WEBHOOK_READ)
    const canWrite = hasCedarPermission(WEBHOOK_WRITE)
    const canDelete = hasCedarPermission(WEBHOOK_DELETE)

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
          dispatch(getWebhook({ action: { limit: memoLimit, pattern: memoPattern } }))
        },
      })
    }

    if (canWrite) {
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_webhook')}`,
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
  }, [
    hasCedarPermission(WEBHOOK_READ),
    hasCedarPermission(WEBHOOK_WRITE),
    hasCedarPermission(WEBHOOK_DELETE),
    limit,
    pattern,
    t,
    navigateToAddPage,
    navigateToEditPage,
  ])

  let memoLimit = limit
  let memoPattern = pattern

  const handleOptionsChange = useCallback((event) => {
    if (event.target.name == 'limit') {
      memoLimit = event.target.value
    } else if (event.target.name == 'pattern') {
      memoPattern = event.target.value
    }
  }, [])

  const onPageChangeClick = (page) => {
    const startCount = page * limit
    options['startIndex'] = parseInt(startCount)
    options['limit'] = limit
    options['pattern'] = pattern
    setPageNumber(page)
    dispatch(getWebhook({ action: options }))
  }
  const onRowCountChangeClick = (count) => {
    options['limit'] = count
    options['pattern'] = pattern
    setPageNumber(0)
    setLimit(count)
    dispatch(getWebhook({ action: options }))
  }

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
    dispatch(setSelectedWebhook({}))
    navigate('/adm/webhook/add')
  }, [dispatch, navigate])

  const navigateToEditPage = useCallback(
    (data) => {
      dispatch(setSelectedWebhook(data))
      navigate(`/adm/webhook/edit/${data.inum}`)
    },
    [dispatch, navigate],
  )

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <CardBody>
          <GluuViewWrapper canShow={hasCedarPermission(WEBHOOK_READ)}>
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
                  render: (rowData) => (
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
                rowStyle: (rowData) => ({
                  backgroundColor: rowData.enabled ? '#33AE9A' : '#FFF',
                }),
                headerStyle: {
                  ...applicationStyle.tableHeaderStyle,
                  ...bgThemeColor,
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

export default WebhookListPage
