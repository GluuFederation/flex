import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useCedarling, ADMIN_UI_RESOURCES, CEDAR_RESOURCE_SCOPES } from '@/cedarling'
import { Badge } from 'reactstrap'
import { Paper } from '@mui/material'
import { Card, CardBody } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import LdapDetailPage from './LdapDetailPage'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import Alert from '@mui/material/Alert'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { buildPayload } from 'Utils/PermChecker'
import {
  getLdapConfig,
  setCurrentItem,
  deleteLdap,
  testLdap,
  resetTestLdap,
} from 'Plugins/services/redux/features/ldapSlice'
import { getPersistenceType } from 'Plugins/services/redux/features/persistenceTypeSlice'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import customColors from '@/customColors'
import { getPagingSize } from '@/utils/pagingUtils'

function LdapListPage() {
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()
  const ldapConfigurations = useSelector((state) => state.ldapReducer.ldap)
  const loading = useSelector((state) => state.ldapReducer.loading)
  const testStatus = useSelector((state) => state.ldapReducer.testStatus)
  const persistenceType = useSelector((state) => state.persistenceTypeReducer.type)
  const persistenceTypeLoading = useSelector((state) => state.persistenceTypeReducer.loading)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const persistenceResourceId = useMemo(() => ADMIN_UI_RESOURCES.Persistence, [])
  const persistenceScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[persistenceResourceId],
    [persistenceResourceId],
  )

  const canReadLdap = useMemo(
    () => hasCedarReadPermission(persistenceResourceId),
    [hasCedarReadPermission, persistenceResourceId],
  )
  const canWriteLdap = useMemo(
    () => hasCedarWritePermission(persistenceResourceId),
    [hasCedarWritePermission, persistenceResourceId],
  )
  const canDeleteLdap = useMemo(
    () => hasCedarDeletePermission(persistenceResourceId),
    [hasCedarDeletePermission, persistenceResourceId],
  )

  useEffect(() => {
    authorizeHelper(persistenceScopes)
  }, [authorizeHelper, persistenceScopes])

  useEffect(() => {
    dispatch(getLdapConfig())
    dispatch(getPersistenceType())
  }, [dispatch])

  // State for managing actions and UI
  const [myActions, setMyActions] = useState([])
  const [item, setItem] = useState({})
  const [modal, setModal] = useState(false)
  const [testRunning, setTestRunning] = useState(false)
  const [alertObj, setAlertObj] = useState({
    severity: '',
    message: '',
    show: false,
  })

  // Theme and styling
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  // Constants
  const userAction = {}
  const pageSize = getPagingSize()

  SetTitle(t('titles.ldap_authentication'))

  // Navigation handlers
  const handleGoToLdapEditPage = useCallback(
    (row) => {
      dispatch(setCurrentItem({ item: row }))
      return navigate(`/config/ldap/edit/:` + row.configId)
    },
    [dispatch, navigate],
  )

  const handleLdapDelete = useCallback((row) => {
    setItem(row)
    toggle()
  }, [])

  const handleGoToLdapAddPage = useCallback(() => {
    return navigate('/config/ldap/new')
  }, [navigate])

  const toggle = useCallback(() => setModal(!modal), [modal])

  // Build actions based on permissions
  useEffect(() => {
    const actions = []

    if (canWriteLdap) {
      actions.push((rowData) => ({
        icon: 'edit',
        iconProps: {
          id: 'editLdap' + rowData.configId,
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('tooltips.edit_ldap')}`,
        onClick: (event, rowData) => handleGoToLdapEditPage(rowData),
        disabled: !canWriteLdap,
      }))
    }

    if (canReadLdap) {
      actions.push({
        icon: 'refresh',
        tooltip: `${t('tooltips.refresh_data')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => {
          dispatch(getLdapConfig())
        },
      })
    }

    if (canDeleteLdap) {
      actions.push((rowData) => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'secondary',
          id: 'deleteLdap' + rowData.configId,
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('tooltips.delete_record')}`,
        onClick: (event, rowData) => handleLdapDelete(rowData),
        disabled: !canDeleteLdap,
      }))
    }

    if (canWriteLdap) {
      actions.push({
        icon: 'add',
        tooltip: `${t('tooltips.add_ldap')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => handleGoToLdapAddPage(),
      })
    }

    setMyActions(actions)
  }, [
    canReadLdap,
    canWriteLdap,
    canDeleteLdap,
    t,
    dispatch,
    handleGoToLdapEditPage,
    handleLdapDelete,
    handleGoToLdapAddPage,
  ])

  const getBadgeTheme = useCallback(
    (status) => {
      if (status) {
        return `primary-${selectedTheme}`
      } else {
        return 'warning'
      }
    },
    [selectedTheme],
  )

  const onDeletionConfirmed = useCallback(
    (message) => {
      buildPayload(userAction, message, item.configId)
      dispatch(deleteLdap({ configId: item.configId }))
      navigate('/config/ldap')
      toggle()
    },
    [item.configId, navigate, toggle, dispatch],
  )

  const testLdapConnect = useCallback(
    (row) => {
      const testPromise = new Promise(function (resolve) {
        setAlertObj({ ...alertObj, show: false })
        dispatch(resetTestLdap())
        resolve()
      })

      testPromise.then(() => {
        setTestRunning(true)
        dispatch(testLdap({ data: row }))
      })
    },
    [alertObj, dispatch],
  )

  useEffect(() => {
    dispatch(resetTestLdap())
    setAlertObj({ ...alertObj, show: false })
  }, [])

  useEffect(() => {
    if (testStatus === null || !testRunning) {
      return
    }

    if (testStatus) {
      setAlertObj({
        ...alertObj,
        severity: 'success',
        message: `${t('messages.ldap_connection_success')}`,
        show: true,
      })
    } else {
      setAlertObj({
        ...alertObj,
        severity: 'error',
        message: `${t('messages.ldap_connection_error')}`,
        show: true,
      })
    }
  }, [testStatus])

  // MaterialTable options
  const tableOptions = {
    search: true,
    selection: false,
    pageSize: pageSize,
    headerStyle: { ...applicationStyle.tableHeaderStyle, ...bgThemeColor },
    actionsColumnIndex: -1,
  }

  // Container and DetailPanel components
  const PaperContainer = useCallback((props) => <Paper {...props} elevation={0} />, [])

  const DetailPanel = useCallback(
    (rowData) => {
      return <LdapDetailPage row={rowData.rowData} testLdapConnection={testLdapConnect} />
    },
    [testLdapConnect],
  )

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuLoader blocking={persistenceTypeLoading}>
          {persistenceType == `ldap` ? (
            <MaterialTable
              components={{
                Container: PaperContainer,
              }}
              columns={[
                { title: `${t('fields.configuration_id')}`, field: 'configId' },
                { title: `${t('fields.bind_dn')}`, field: 'bindDN' },
                {
                  title: `${t('fields.status')}`,
                  field: 'enabled',
                  type: 'boolean',
                  render: (rowData) => (
                    <Badge color={getBadgeTheme(rowData.enabled)}>
                      {rowData.enabled ? `${t('fields.enable')}` : `${t('fields.disable')}`}
                    </Badge>
                  ),
                },
              ]}
              data={ldapConfigurations?.length ? ldapConfigurations : []}
              isLoading={loading}
              title=""
              actions={myActions}
              options={tableOptions}
              detailPanel={DetailPanel}
            />
          ) : (
            <Alert severity="info">
              {!persistenceTypeLoading && 'The current data store provider is not LDAP based.'}
            </Alert>
          )}
          <GluuAlert severity={alertObj.severity} message={alertObj.message} show={alertObj.show} />
          <GluuDialog
            row={item}
            handler={toggle}
            modal={modal}
            subject="ldap"
            onAccept={onDeletionConfirmed}
          />
        </GluuLoader>
      </CardBody>
    </Card>
  )
}

export default LdapListPage
