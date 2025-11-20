import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import MaterialTable from '@material-table/core'
import type { Action } from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { Paper, TablePagination } from '@mui/material'
import { Badge } from 'reactstrap'
import { useCedarling } from '@/cedarling'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { Card, CardBody } from 'Components'
import CustomScriptDetailPage from '../CustomScriptDetailPage'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import { updateToast } from 'Redux/features/toastSlice'
import type { CustomScript } from '../types/domain'
import { useScriptList, useScriptFilters, useCustomScriptActions } from '../hooks'
import { ScriptListFilters } from '../components/ScriptList'
import { SCRIPT_PERMISSIONS, SCRIPT_ROUTES, getScriptRoute } from '../constants'

/**
 * Script list page component
 */
function ScriptListPage(): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { hasCedarPermission, authorize } = useCedarling()
  const { logScriptDeletion } = useCustomScriptActions()

  // State management
  const { filters, updateFilter, updateFilters, clearFilters } = useScriptFilters()
  const {
    scripts,
    totalItems,
    scriptTypes,
    loading,
    loadingScriptTypes,
    pageNumber,
    limit,
    error,
    resetPagination,
    handlePageChange,
    handleRowsPerPageChange,
    refresh,
    handleDelete,
  } = useScriptList(filters)

  const [item, setItem] = useState<CustomScript | null>(null)
  const [modal, setModal] = useState(false)
  const [myActions, setMyActions] = useState<Array<Action<CustomScript>>>([])

  // Theme
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlack'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  SetTitle(t('titles.scripts'))

  // Initialize Cedar permissions
  useEffect(() => {
    const initPermissions = async () => {
      const permissions = [
        SCRIPT_PERMISSIONS.READ,
        SCRIPT_PERMISSIONS.WRITE,
        SCRIPT_PERMISSIONS.DELETE,
      ]
      for (const permission of permissions) {
        await authorize([permission])
      }
    }
    initPermissions()
  }, [authorize])

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination()
  }, [filters.type, filters.pattern, filters.sortBy, filters.sortOrder, resetPagination])

  // Navigation handlers
  const handleGoToAddPage = useCallback(() => {
    navigate(SCRIPT_ROUTES.ADD)
  }, [navigate])

  const handleGoToEditPage = useCallback(
    (row: CustomScript) => {
      navigate(getScriptRoute('edit', row.inum))
    },
    [navigate],
  )

  const handleGoToViewPage = useCallback(
    (row: CustomScript) => {
      navigate(getScriptRoute('view', row.inum))
    },
    [navigate],
  )

  // Delete handlers
  const toggle = useCallback(() => setModal(!modal), [modal])

  const handleCustomScriptDelete = useCallback(
    (row: CustomScript) => {
      setItem(row)
      toggle()
    },
    [toggle],
  )

  const onDeletionConfirmed = useCallback(
    async (_message: string) => {
      if (item?.inum) {
        try {
          await handleDelete(item.inum)
          await logScriptDeletion(item, 'Custom script deleted successfully')
          dispatch(updateToast(true, 'success'))
          navigate(SCRIPT_ROUTES.LIST)
          toggle()
        } catch (error) {
          const errorMessage = (error as Error)?.message || 'Failed to delete custom script'
          dispatch(updateToast(true, 'error', errorMessage))
        }
      }
    },
    [item, handleDelete, logScriptDeletion, dispatch, navigate, toggle],
  )

  // Build actions based on permissions
  useEffect(() => {
    const actions: Array<Action<CustomScript>> = []
    const canRead = hasCedarPermission(SCRIPT_PERMISSIONS.READ)
    const canWrite = hasCedarPermission(SCRIPT_PERMISSIONS.WRITE)
    const canDelete = hasCedarPermission(SCRIPT_PERMISSIONS.DELETE)

    if (canWrite) {
      actions.push({
        icon: 'add',
        tooltip: `${t('messages.add_script')}`,
        iconProps: {
          color: 'primary',
          style: { color: customColors.lightBlue },
        },
        isFreeAction: true,
        onClick: handleGoToAddPage,
      })
      actions.push((_rowData: CustomScript) => ({
        icon: 'edit',
        iconProps: {
          color: 'primary',
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('messages.edit_script')}`,
        onClick: (event?: React.MouseEvent, entry?: CustomScript) => {
          if (entry) handleGoToEditPage(entry)
        },
        disabled: false,
      }))
    }

    if (canRead) {
      actions.push((_rowData: CustomScript) => ({
        icon: 'visibility',
        iconProps: {
          color: 'primary',
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('messages.view_script_details')}`,
        onClick: (event?: React.MouseEvent, rowData?: CustomScript) => {
          if (rowData) handleGoToViewPage(rowData)
        },
        disabled: false,
      }))
    }

    if (canDelete) {
      actions.push((_rowData: CustomScript) => ({
        icon: () => <DeleteOutlined />,
        iconProps: {
          color: 'primary',
          style: { color: customColors.darkGray },
        },
        tooltip: `${t('messages.delete_script')}`,
        onClick: (event?: React.MouseEvent, row?: CustomScript) => {
          if (row) handleCustomScriptDelete(row)
        },
        disabled: false,
      }))
    }

    setMyActions(actions)
  }, [
    hasCedarPermission,
    t,
    handleGoToAddPage,
    handleGoToEditPage,
    handleGoToViewPage,
    handleCustomScriptDelete,
  ])

  // MaterialTable components
  const PaperContainer = useCallback(
    (props: Record<string, unknown>) => <Paper {...props} elevation={0} />,
    [],
  )

  const CustomPagination = useCallback(
    () => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(event: unknown, page: number) => {
          handlePageChange(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleRowsPerPageChange(Number(event.target.value))
        }}
      />
    ),
    [totalItems, pageNumber, limit, handlePageChange, handleRowsPerPageChange],
  )

  const DetailPanel = useCallback((rowData: { rowData: CustomScript }) => {
    return <CustomScriptDetailPage row={rowData.rowData} />
  }, [])

  // MaterialTable options
  const tableOptions = useMemo(
    () => ({
      search: false,
      idSynonym: 'inum',
      searchFieldAlignment: 'left' as const,
      selection: false,
      pageSize: limit,
      columnsButton: false,
      rowStyle: (rowData: CustomScript) => ({
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
    }),
    [limit, themeColors.lightBackground, bgThemeColor],
  )

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasCedarPermission(SCRIPT_PERMISSIONS.READ)}>
          {error && (
            <div className="alert alert-danger" role="alert">
              <strong>{t('messages.error')}:</strong> {error.message || 'Failed to load scripts'}
            </div>
          )}

          {/* Filters */}
          <ScriptListFilters
            filters={filters}
            scriptTypes={scriptTypes}
            onFilterChange={updateFilters}
            onClearFilters={clearFilters}
            onRefresh={refresh}
            loadingScriptTypes={loadingScriptTypes}
          />

          {/* Table */}
          <MaterialTable
            key={limit}
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
                hiddenByColumnsButton: false,
                render: (rowData: CustomScript) => (
                  <Badge
                    color={rowData.enabled === true ? `primary-${selectedTheme}` : 'secondary'}
                  >
                    {rowData.enabled ? t('options.true') : t('options.false')}
                  </Badge>
                ),
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

        {/* Delete Confirmation Dialog */}
        {hasCedarPermission(SCRIPT_PERMISSIONS.DELETE) && item && (
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

export default ScriptListPage
