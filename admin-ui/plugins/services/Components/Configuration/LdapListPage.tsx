import React, { useState, useEffect, useContext, useCallback, useMemo, ReactElement } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useDispatch } from 'react-redux'
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
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import customColors from '@/customColors'
import { getPagingSize } from '@/utils/pagingUtils'
import { useSetAtom } from 'jotai'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import {
  useGetConfigDatabaseLdap,
  useDeleteConfigDatabaseLdapByName,
  usePostConfigDatabaseLdapTest,
  useGetPropertiesPersistence,
  getGetConfigDatabaseLdapQueryKey,
  type GluuLdapConfiguration,
} from 'JansConfigApi'
import { currentLdapItemAtom } from './atoms'
import { useLdapAudit } from './hooks'
import type { PersistenceInfo } from './types'

function isPersistenceInfo(data: unknown): data is PersistenceInfo {
  return (
    data !== null &&
    typeof data === 'object' &&
    ('persistenceType' in data || Object.keys(data).length === 0)
  )
}

interface AlertState {
  severity: 'success' | 'error' | 'warning' | 'info' | ''
  message: string
  show: boolean
}

interface ActionObject {
  icon: string | (() => ReactElement)
  iconProps?: Record<string, unknown>
  tooltip: string
  onClick: (
    event: React.MouseEvent,
    rowData: GluuLdapConfiguration | GluuLdapConfiguration[],
  ) => void
  disabled?: boolean
  isFreeAction?: boolean
}

type ActionType = ActionObject | ((rowData: GluuLdapConfiguration) => ActionObject)

function LdapListPage(): ReactElement {
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()

  const dispatch = useDispatch()
  const { navigateToRoute, navigateBack } = useAppNavigation()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const setCurrentLdapItem = useSetAtom(currentLdapItemAtom)
  const { logLdapDelete } = useLdapAudit()

  const { data: ldapConfigurations, isLoading: loading } = useGetConfigDatabaseLdap({
    query: { staleTime: 30000 },
  })

  const { data: persistenceData, isLoading: persistenceTypeLoading } = useGetPropertiesPersistence({
    query: { staleTime: 30000 },
  })

  const persistenceType = isPersistenceInfo(persistenceData)
    ? persistenceData.persistenceType
    : undefined

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

  const [myActions, setMyActions] = useState<ActionType[]>([])
  const [item, setItem] = useState<GluuLdapConfiguration | null>(null)
  const [modal, setModal] = useState(false)
  const [testRunning, setTestRunning] = useState(false)
  const [alertObj, setAlertObj] = useState<AlertState>({
    severity: '',
    message: '',
    show: false,
  })

  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const pageSize = getPagingSize()

  SetTitle(t('titles.ldap_authentication'))

  const deleteMutation = useDeleteConfigDatabaseLdapByName({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseLdapQueryKey() })
      },
      onError: () => {
        dispatch(updateToast(true, 'danger'))
      },
    },
  })

  const testMutation = usePostConfigDatabaseLdapTest({
    mutation: {
      onSuccess: () => {
        setAlertObj({
          severity: 'success',
          message: t('messages.ldap_connection_success'),
          show: true,
        })
        setTestRunning(false)
      },
      onError: () => {
        setAlertObj({
          severity: 'error',
          message: t('messages.ldap_connection_error'),
          show: true,
        })
        setTestRunning(false)
      },
    },
  })

  const handleGoToLdapEditPage = useCallback(
    (row: GluuLdapConfiguration) => {
      if (!row?.configId) return
      setCurrentLdapItem(row)
      navigateToRoute(ROUTES.LDAP_EDIT(row.configId))
    },
    [setCurrentLdapItem, navigateToRoute],
  )

  const handleLdapDelete = useCallback((row: GluuLdapConfiguration) => {
    setItem(row)
    toggle()
  }, [])

  const handleGoToLdapAddPage = useCallback(() => {
    navigateToRoute(ROUTES.LDAP_ADD)
  }, [navigateToRoute])

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  useEffect(() => {
    const actions: ActionType[] = []

    if (canWriteLdap) {
      actions.push((rowData: GluuLdapConfiguration) => ({
        icon: 'edit',
        iconProps: {
          id: 'editLdap' + rowData.configId,
          style: { color: customColors.darkGray },
        },
        tooltip: t('tooltips.edit_ldap'),
        onClick: (
          _event: React.MouseEvent,
          data: GluuLdapConfiguration | GluuLdapConfiguration[],
        ) => {
          const row = Array.isArray(data) ? data[0] : data
          handleGoToLdapEditPage(row)
        },
        disabled: !canWriteLdap,
      }))
    }

    if (canReadLdap) {
      actions.push({
        icon: 'refresh',
        tooltip: t('tooltips.refresh_data'),
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => {
          queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseLdapQueryKey() })
        },
      })
    }

    if (canDeleteLdap) {
      actions.push((rowData: GluuLdapConfiguration) => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'secondary',
          id: 'deleteLdap' + rowData.configId,
          style: { color: customColors.darkGray },
        },
        tooltip: t('tooltips.delete_record'),
        onClick: (
          _event: React.MouseEvent,
          data: GluuLdapConfiguration | GluuLdapConfiguration[],
        ) => {
          const row = Array.isArray(data) ? data[0] : data
          handleLdapDelete(row)
        },
        disabled: !canDeleteLdap,
      }))
    }

    if (canWriteLdap) {
      actions.push({
        icon: 'add',
        tooltip: t('tooltips.add_ldap'),
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => handleGoToLdapAddPage(),
      })
    }

    setMyActions(actions as ActionType[])
  }, [
    canReadLdap,
    canWriteLdap,
    canDeleteLdap,
    t,
    queryClient,
    handleGoToLdapEditPage,
    handleLdapDelete,
    handleGoToLdapAddPage,
  ])

  const getBadgeTheme = useCallback(
    (status: boolean | undefined) => {
      if (status) {
        return `primary-${selectedTheme}`
      } else {
        return 'warning'
      }
    },
    [selectedTheme],
  )

  const onDeletionConfirmed = useCallback(
    async (message: string) => {
      if (item?.configId) {
        try {
          await deleteMutation.mutateAsync({ name: item.configId })
          await logLdapDelete(item, message)
        } catch (error) {
          console.error('Failed to delete LDAP config:', error)
        }
      }
      navigateBack(ROUTES.LDAP_LIST)
      toggle()
    },
    [item, navigateBack, toggle, deleteMutation, logLdapDelete],
  )

  const testLdapConnect = useCallback(
    (row: GluuLdapConfiguration) => {
      setAlertObj({ severity: '', message: '', show: false })
      setTestRunning(true)
      testMutation.mutate({ data: row })
    },
    [testMutation],
  )

  useEffect(() => {
    setAlertObj({ severity: '', message: '', show: false })
  }, [])

  const tableOptions = {
    search: true,
    selection: false,
    pageSize: pageSize,
    headerStyle: {
      ...applicationStyle.tableHeaderStyle,
      ...bgThemeColor,
      textTransform: 'uppercase' as const,
    },
    actionsColumnIndex: -1,
  }

  const PaperContainer = useCallback(
    (props: Record<string, unknown>) => <Paper {...props} elevation={0} />,
    [],
  )

  const DetailPanel = useCallback(
    (rowData: { rowData: GluuLdapConfiguration }) => {
      return <LdapDetailPage row={rowData.rowData} testLdapConnection={testLdapConnect} />
    },
    [testLdapConnect],
  )

  const isLoading = loading || deleteMutation.isPending || testMutation.isPending

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuLoader blocking={persistenceTypeLoading}>
          {persistenceType === 'ldap' ? (
            <MaterialTable
              components={{
                Container: PaperContainer,
              }}
              columns={[
                { title: t('fields.configuration_id'), field: 'configId' },
                { title: t('fields.bind_dn'), field: 'bindDN' },
                {
                  title: t('fields.status'),
                  field: 'enabled',
                  type: 'boolean',
                  render: (rowData: GluuLdapConfiguration) => (
                    <Badge color={getBadgeTheme(rowData.enabled)}>
                      {rowData.enabled ? t('fields.enable') : t('fields.disable')}
                    </Badge>
                  ),
                },
              ]}
              data={Array.isArray(ldapConfigurations) ? ldapConfigurations : []}
              isLoading={isLoading}
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
