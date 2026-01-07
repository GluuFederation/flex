import React, { useState, useEffect, useContext, useCallback, useMemo, ReactElement } from 'react'
import MaterialTable from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useDispatch } from 'react-redux'
import { useCedarling, ADMIN_UI_RESOURCES, CEDAR_RESOURCE_SCOPES } from '@/cedarling'
import { Paper } from '@mui/material'
import { Card, CardBody } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import SqlDetailPage from './SqlDetailPage'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
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
  useGetConfigDatabaseSql,
  useDeleteConfigDatabaseSqlByName,
  usePostConfigDatabaseSqlTest,
  useGetPropertiesPersistence,
  getGetConfigDatabaseSqlQueryKey,
  type SqlConfiguration,
} from 'JansConfigApi'
import { currentSqlItemAtom } from './atoms'
import { useSqlAudit } from './hooks'
import type { PersistenceInfo } from './types'

function isPersistenceInfo(data: unknown): data is PersistenceInfo {
  return (
    data !== null &&
    typeof data === 'object' &&
    ('persistenceType' in data || Object.keys(data).length === 0)
  )
}

interface AlertState {
  severity: 'success' | 'error' | 'warning' | 'info' | undefined
  message: string
  show: boolean
}

interface ActionObject {
  icon: string | (() => ReactElement)
  iconProps?: Record<string, unknown>
  tooltip: string
  onClick: (event: React.MouseEvent, rowData: SqlConfiguration | SqlConfiguration[]) => void
  disabled?: boolean
  isFreeAction?: boolean
}

type ActionType = ActionObject | ((rowData: SqlConfiguration) => ActionObject)

function SqlListPage(): ReactElement {
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const setCurrentSqlItem = useSetAtom(currentSqlItemAtom)
  const { logSqlDelete } = useSqlAudit()
  const { navigateToRoute, navigateBack } = useAppNavigation()

  const { data: sqlConfigurations, isLoading: loading } = useGetConfigDatabaseSql({
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

  const canReadSql = useMemo(
    () => hasCedarReadPermission(persistenceResourceId),
    [hasCedarReadPermission, persistenceResourceId],
  )
  const canWriteSql = useMemo(
    () => hasCedarWritePermission(persistenceResourceId),
    [hasCedarWritePermission, persistenceResourceId],
  )
  const canDeleteSql = useMemo(
    () => hasCedarDeletePermission(persistenceResourceId),
    [hasCedarDeletePermission, persistenceResourceId],
  )

  useEffect(() => {
    authorizeHelper(persistenceScopes)
  }, [authorizeHelper, persistenceScopes])

  const [myActions, setMyActions] = useState<ActionType[]>([])
  const [item, setItem] = useState<SqlConfiguration | null>(null)
  const [modal, setModal] = useState(false)
  const pageSize = getPagingSize()
  const [alertObj, setAlertObj] = useState<AlertState>({
    severity: undefined,
    message: '',
    show: false,
  })

  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const toggle = useCallback(() => setModal((prev) => !prev), [])

  SetTitle(t('titles.sql_authentication'))

  const deleteMutation = useDeleteConfigDatabaseSqlByName({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseSqlQueryKey() })
      },
      onError: () => {
        dispatch(updateToast(true, 'danger'))
      },
    },
  })

  const testMutation = usePostConfigDatabaseSqlTest({
    mutation: {
      onSuccess: () => {
        setAlertObj({
          severity: 'success',
          message: t('messages.sql_connection_success'),
          show: true,
        })
      },
      onError: () => {
        setAlertObj({
          severity: 'error',
          message: t('messages.sql_connection_error'),
          show: true,
        })
      },
    },
  })

  const handleGoToSqlEditPage = useCallback(
    (row: SqlConfiguration) => {
      if (!row?.configId) return
      setCurrentSqlItem(row)
      navigateToRoute(ROUTES.SQL_EDIT(row.configId))
    },
    [setCurrentSqlItem, navigateToRoute],
  )

  const handleSqlDelete = useCallback(
    (row: SqlConfiguration) => {
      setItem(row)
      toggle()
    },
    [toggle],
  )

  const handleGoToSqlAddPage = useCallback(() => {
    navigateToRoute(ROUTES.SQL_ADD)
  }, [navigateToRoute])

  useEffect(() => {
    const actions: ActionType[] = []

    if (canWriteSql) {
      actions.push({
        icon: 'add',
        tooltip: t('tooltips.add_sql'),
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: handleGoToSqlAddPage,
      })
      actions.push((rowData: SqlConfiguration) => ({
        icon: 'edit',
        iconProps: {
          id: 'editSql' + rowData.configId,
          style: { color: customColors.darkGray },
        },
        tooltip: t('tooltips.edit_sql'),
        onClick: (_event: React.MouseEvent, data: SqlConfiguration | SqlConfiguration[]) => {
          const row = Array.isArray(data) ? data[0] : data
          handleGoToSqlEditPage(row)
        },
        disabled: !canWriteSql,
      }))
    }

    if (canReadSql) {
      actions.push({
        icon: 'refresh',
        tooltip: t('tooltips.refresh_data'),
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => {
          queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseSqlQueryKey() })
        },
      })
    }

    if (canDeleteSql) {
      actions.push((rowData: SqlConfiguration) => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'secondary',
          id: 'deleteSql' + rowData.configId,
          style: { color: customColors.darkGray },
        },
        tooltip: t('tooltips.delete_record'),
        onClick: (_event: React.MouseEvent, data: SqlConfiguration | SqlConfiguration[]) => {
          const row = Array.isArray(data) ? data[0] : data
          handleSqlDelete(row)
        },
        disabled: !canDeleteSql,
      }))
    }

    setMyActions(actions as ActionType[])
  }, [
    canReadSql,
    canWriteSql,
    canDeleteSql,
    t,
    queryClient,
    handleGoToSqlAddPage,
    handleGoToSqlEditPage,
    handleSqlDelete,
  ])

  const onDeletionConfirmed = useCallback(
    async (message: string) => {
      if (item?.configId) {
        try {
          await deleteMutation.mutateAsync({ name: item.configId })
          await logSqlDelete(item, message)
          navigateBack(ROUTES.SQL_LIST)
        } catch (error) {
          console.error('Failed to delete SQL config:', error)
        }
      }
      toggle()
    },
    [item, deleteMutation, logSqlDelete, navigateBack, toggle],
  )

  const testSqlConnect = useCallback(
    (row: SqlConfiguration) => {
      setAlertObj({ severity: undefined, message: '', show: false })
      testMutation.mutate({ data: row })
    },
    [testMutation],
  )

  const PaperContainer = useCallback(
    (props: Record<string, unknown>) => <Paper {...props} elevation={0} />,
    [],
  )

  const isLoading = loading || deleteMutation.isPending || testMutation.isPending

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuLoader blocking={persistenceTypeLoading}>
          {persistenceType === 'sql' ? (
            <MaterialTable
              components={{
                Container: PaperContainer,
              }}
              columns={[
                { title: t('fields.name'), field: 'configId' },
                {
                  title: t('fields.connectionUris'),
                  field: 'connectionUri',
                },
                { title: t('fields.schemaName'), field: 'schemaName' },
              ]}
              data={Array.isArray(sqlConfigurations) ? sqlConfigurations : []}
              isLoading={isLoading}
              title=""
              actions={myActions}
              options={{
                search: true,
                selection: false,
                pageSize: pageSize,
                headerStyle: {
                  ...applicationStyle.tableHeaderStyle,
                  ...bgThemeColor,
                  textTransform: 'uppercase' as const,
                },
                actionsColumnIndex: -1,
              }}
              detailPanel={(rowData: { rowData: SqlConfiguration }) => {
                return <SqlDetailPage row={rowData.rowData} testSqlConnection={testSqlConnect} />
              }}
            />
          ) : (
            <Alert severity="info">The current data store provider is not RDBMS.</Alert>
          )}
          <GluuAlert severity={alertObj.severity} message={alertObj.message} show={alertObj.show} />
          <GluuDialog
            row={item}
            handler={toggle}
            modal={modal}
            subject="sql"
            onAccept={onDeletionConfirmed}
          />
        </GluuLoader>
      </CardBody>
    </Card>
  )
}

export default SqlListPage
