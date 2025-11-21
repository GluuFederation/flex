import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { Paper, TablePagination } from '@mui/material'
import customColors from '@/customColors'
import { Card, CardBody } from 'Components'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import { buildPayload } from 'Utils/PermChecker'
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
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'

const WebhookListPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()
  const webhookResourceId = useMemo(() => ADMIN_UI_RESOURCES.Webhooks, [])
  const webhookScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[webhookResourceId], [webhookResourceId])

  const { t } = useTranslation()
  const [pageNumber, setPageNumber] = useState(0)
  const { totalItems, webhooks } = useSelector((state) => state.webhookReducer)
  const loading = useSelector((state) => state.webhookReducer.loading)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)
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

  const canReadWebhooks = useMemo(
    () => hasCedarReadPermission(webhookResourceId),
    [hasCedarReadPermission, webhookResourceId],
  )

  useEffect(() => {
    if (webhookScopes && webhookScopes.length > 0) {
      authorizeHelper(webhookScopes)
    }
  }, [authorizeHelper, webhookScopes])

  useEffect(() => {
    if (canReadWebhooks) {
      options['limit'] = 10
      dispatch(getWebhook({ action: options }))
    }
  }, [canReadWebhooks, dispatch])
  const canWriteWebhooks = useMemo(
    () => hasCedarWritePermission(webhookResourceId),
    [hasCedarWritePermission, webhookResourceId],
  )
  const canDeleteWebhooks = useMemo(
    () => hasCedarDeletePermission(webhookResourceId),
    [hasCedarDeletePermission, webhookResourceId],
  )

  // Build actions only when permissions change
  useEffect(() => {
    const actions = []

    if (canReadWebhooks) {
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
        iconProps: { color: 'primary', style: { borderColor: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => {},
      })

      actions.push({
        icon: 'refresh',
        tooltip: `${t('messages.refresh')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => {
          setLimit(memoLimit)
          setPattern(memoPattern)
          dispatch(getWebhook({ action: { limit: memoLimit, pattern: memoPattern } }))
        },
      })
    }

    if (canWriteWebhooks) {
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_webhook')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: navigateToAddPage,
      })

      actions.push((rowData) => ({
        icon: 'edit',
        iconProps: {
          color: 'primary',
          id: 'editScope' + rowData.inum,
          style: { color: customColors.darkGray },
        },
        onClick: (event, rowData) => navigateToEditPage(rowData),
        disabled: !canWriteWebhooks,
      }))
    }

    if (canDeleteWebhooks) {
      actions.push((rowData) => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          style: { color: customColors.darkGray },
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
    cedarPermissions,
    limit,
    pattern,
    t,
    navigateToAddPage,
    navigateToEditPage,
    canReadWebhooks,
    canWriteWebhooks,
    canDeleteWebhooks,
  ])

  let memoLimit = limit
  let memoPattern = pattern

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
        dispatch(getWebhook({ action: newOptions }))
      }
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
          <GluuViewWrapper canShow={canReadWebhooks}>
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
                  backgroundColor: rowData.enabled ? customColors.logo : customColors.white,
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
