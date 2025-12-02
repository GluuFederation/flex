import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import MaterialTable from '@material-table/core'
import {
  DeleteOutlined,
  AddOutlined,
  EditOutlined,
  VisibilityOutlined,
  ErrorOutline,
} from '@mui/icons-material'
import {
  Paper,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Button,
  Chip,
  Alert,
  InputAdornment,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import ClearIcon from '@mui/icons-material/Clear'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { useDispatch } from 'react-redux'
import { Card, CardBody } from 'Components'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import CustomScriptDetailPage from './CustomScriptDetailPage'
import { useTranslation } from 'react-i18next'
import { useCedarling, CEDAR_RESOURCE_SCOPES, ADMIN_UI_RESOURCES } from '@/cedarling'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import { updateToast } from 'Redux/features/toastSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { getPagingSize } from '@/utils/pagingUtils'
import { useCustomScriptsByType, useDeleteCustomScript, useCustomScriptTypes } from './hooks'
import { DEFAULT_SCRIPT_TYPE } from './constants'
import type { CustomScript } from 'JansConfigApi'
import type { Column, Action } from '@material-table/core'
import type { ScriptError } from './types/customScript'

interface ScriptTableRow extends CustomScript {
  scriptError?: ScriptError
}

const CustomScriptListPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { navigateToRoute } = useAppNavigation()
  const {
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    authorizeHelper,
  } = useCedarling()

  const pageSize = getPagingSize()
  const [pattern, setPattern] = useState<string>('')
  const [scriptType, setScriptType] = useState<string>(DEFAULT_SCRIPT_TYPE)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending')
  const [modal, setModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<CustomScript | null>(null)

  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'
  const themeColors = getThemeColor(selectedTheme)

  const scriptsResourceId = ADMIN_UI_RESOURCES.Scripts
  const scriptScopes = CEDAR_RESOURCE_SCOPES[scriptsResourceId] || []

  const canRead = useMemo(
    () => hasCedarReadPermission(scriptsResourceId),
    [hasCedarReadPermission, scriptsResourceId],
  )
  const canWrite = useMemo(
    () => hasCedarWritePermission(scriptsResourceId),
    [hasCedarWritePermission, scriptsResourceId],
  )
  const canDelete = useMemo(
    () => hasCedarDeletePermission(scriptsResourceId),
    [hasCedarDeletePermission, scriptsResourceId],
  )

  useEffect(() => {
    authorizeHelper(scriptScopes)
  }, [authorizeHelper, scriptScopes])

  const {
    data: scriptsResponse,
    isLoading,
    error,
    refetch,
  } = useCustomScriptsByType(scriptType, {
    pattern: pattern || undefined,
    sortBy: sortBy || undefined,
    sortOrder: sortBy ? sortOrder : undefined,
  })

  const { data: scriptTypes, isLoading: loadingTypes } = useCustomScriptTypes()

  const deleteMutation = useDeleteCustomScript()

  const scripts = (scriptsResponse?.entries || []) as ScriptTableRow[]

  SetTitle(t('titles.scripts'))

  const handleAdd = useCallback(() => {
    navigateToRoute(ROUTES.CUSTOM_SCRIPT_ADD)
  }, [navigateToRoute])

  const handleEdit = useCallback(
    (row: CustomScript) => {
      if (!row?.inum) return
      navigateToRoute(ROUTES.CUSTOM_SCRIPT_EDIT(row.inum))
    },
    [navigateToRoute],
  )

  const handleView = useCallback(
    (row: CustomScript) => {
      if (!row?.inum) return
      navigateToRoute(`${ROUTES.CUSTOM_SCRIPT_EDIT(row.inum)}?view=true`)
    },
    [navigateToRoute],
  )

  const handleDeleteClick = useCallback((row: CustomScript) => {
    setItemToDelete(row)
    setModal(true)
  }, [])

  const handleDeleteConfirm = useCallback(
    async (message: string) => {
      if (!itemToDelete?.inum) return

      try {
        await deleteMutation.mutateAsync({
          inum: itemToDelete.inum,
          actionMessage: message,
        })
        dispatch(updateToast(true, 'success', t('messages.script_deleted_successfully')))
        setModal(false)
        setItemToDelete(null)
      } catch (error) {
        console.error('Failed to delete custom script:', error)
        const errorMessage =
          error instanceof Error ? error.message : t('messages.error_deleting_script')
        dispatch(updateToast(true, 'error', errorMessage))
      }
    },
    [deleteMutation, itemToDelete, dispatch, t],
  )

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  const handleSearchClear = useCallback(() => {
    setPattern('')
  }, [])

  const handleTypeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setScriptType(event.target.value)
  }, [])

  const handlePatternChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPattern(event.target.value)
  }, [])

  const handlePatternKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        refetch()
      }
    },
    [refetch],
  )

  const handleSortByChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSortBy(value)
  }, [])

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'ascending' ? 'descending' : 'ascending'))
  }, [])

  const columns: Column<ScriptTableRow>[] = useMemo(
    () => [
      {
        title: t('fields.name'),
        field: 'name',
        render: (rowData: ScriptTableRow) => (
          <Box>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{
                mt: 0.5,
                color: rowData.enabled
                  ? `${customColors.black} !important`
                  : `${customColors.black}80`,
              }}
            >
              {rowData.name}
            </Typography>
            {rowData.scriptError?.stackTrace && (
              <Tooltip title={t('tooltips.script_has_errors')}>
                <Chip
                  size="small"
                  icon={<ErrorOutline sx={{ fontSize: 16 }} />}
                  label={t('fields.error')}
                  color="error"
                />
              </Tooltip>
            )}
          </Box>
        ),
      },
      {
        title: t('fields.description'),
        field: 'description',
        render: (rowData: ScriptTableRow) => (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 300,
              color: rowData.enabled
                ? `${customColors.black} !important`
                : `${customColors.black}80`,
            }}
          >
            {rowData.description || '—'}
          </Typography>
        ),
      },
      {
        title: t('fields.script_type'),
        field: 'scriptType',
        render: (rowData: ScriptTableRow) => (
          <Chip
            label={rowData.scriptType}
            size="small"
            variant="outlined"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              borderRadius: 1,
            }}
          />
        ),
      },
      {
        title: t('fields.level'),
        field: 'level',
        type: 'numeric',
        cellStyle: { textAlign: 'center' },
      },
      {
        title: t('fields.programming_language'),
        field: 'programmingLanguage',
        render: (rowData: ScriptTableRow) => (
          <Typography
            variant="body2"
            sx={{
              textTransform: 'capitalize',
              color: rowData.enabled
                ? `${customColors.black} !important`
                : `${customColors.black}80`,
            }}
          >
            {rowData.programmingLanguage || '—'}
          </Typography>
        ),
      },
      {
        title: t('options.enabled'),
        field: 'enabled',
        type: 'boolean',
        render: (rowData: ScriptTableRow) => (
          <Chip
            label={rowData.enabled ? t('options.yes') : t('options.no')}
            size="small"
            color={rowData.enabled ? 'success' : 'default'}
            sx={{ minWidth: 60, fontWeight: 500 }}
          />
        ),
        cellStyle: { textAlign: 'center' },
      },
    ],
    [t],
  )

  const actions: Action<ScriptTableRow>[] = useMemo(() => {
    const actionList: Action<ScriptTableRow>[] = []

    if (canWrite) {
      actionList.push({
        icon: () => (
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            size="small"
            sx={{
              'textTransform': 'none',
              'backgroundColor': themeColors.background,
              'color': customColors.white,
              '&:hover': {
                backgroundColor: customColors.darkGray,
              },
            }}
          >
            {t('messages.add_script')}
          </Button>
        ),
        isFreeAction: true,
        onClick: handleAdd,
        tooltip: t('messages.add_script'),
      })

      actionList.push({
        icon: () => (
          <Tooltip title={t('messages.edit_script')}>
            <EditOutlined sx={{ fontSize: 20, color: customColors.darkGray }} />
          </Tooltip>
        ),
        tooltip: t('messages.edit_script'),
        onClick: (_event, rowData) => handleEdit(rowData as CustomScript),
      })
    }

    if (canRead) {
      actionList.push({
        icon: () => (
          <Tooltip title={t('messages.view_script_details')}>
            <VisibilityOutlined sx={{ fontSize: 20, color: customColors.darkGray }} />
          </Tooltip>
        ),
        tooltip: t('messages.view_script_details'),
        onClick: (_event, rowData) => handleView(rowData as CustomScript),
      })
    }

    if (canDelete) {
      actionList.push({
        icon: () => (
          <Tooltip title={t('messages.delete_script')}>
            <DeleteOutlined sx={{ fontSize: 20, color: customColors.accentRed }} />
          </Tooltip>
        ),
        tooltip: t('messages.delete_script'),
        onClick: (_event, rowData) => handleDeleteClick(rowData as CustomScript),
      })
    }

    return actionList
  }, [
    canRead,
    canWrite,
    canDelete,
    t,
    handleAdd,
    handleEdit,
    handleView,
    handleDeleteClick,
    themeColors,
    customColors,
  ])

  const tableOptions = useMemo(
    () => ({
      search: false,
      idSynonym: 'inum',
      selection: false,
      pageSize: pageSize,
      headerStyle: {
        backgroundColor: themeColors.background,
        color: customColors.white,
        fontWeight: 600,
        fontSize: '0.875rem',
        borderBottom: '2px solid #e0e0e0',
      },
      rowStyle: (rowData: ScriptTableRow) => {
        const hasError = rowData.scriptError?.stackTrace
        const baseColor = rowData.enabled ? themeColors.lightBackground : customColors.white
        return {
          backgroundColor: hasError ? `${customColors.accentRed}15` : baseColor,
          color: customColors.darkGray,
          fontSize: '0.875rem',
        }
      },
      actionsColumnIndex: -1,
    }),
    [pageSize, themeColors, customColors],
  )

  if (error) {
    return (
      <Card>
        <CardBody>
          <GluuViewWrapper canShow={canRead}>
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('messages.error_loading_scripts')}
              </Typography>
              <Typography variant="body2">
                {error && typeof error === 'object' && 'message' in error
                  ? (error as { message: string }).message
                  : String(error)}
              </Typography>
            </Alert>
            <Button
              variant="contained"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
              sx={{ textTransform: 'none' }}
            >
              {t('actions.retry')}
            </Button>
          </GluuViewWrapper>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody>
        <GluuViewWrapper canShow={canRead}>
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
              <TextField
                size="small"
                label={t('fields.search')}
                placeholder={t('placeholders.search_scripts')}
                value={pattern}
                onChange={handlePatternChange}
                onKeyDown={handlePatternKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: pattern && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleSearchClear} edge="end">
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />

              <TextField
                select
                size="small"
                label={t('fields.script_type')}
                value={scriptType}
                onChange={handleTypeChange}
                disabled={loadingTypes}
                sx={{ minWidth: 220 }}
              >
                {(scriptTypes || []).map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label={t('fields.sort_by')}
                value={sortBy}
                onChange={handleSortByChange}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="">{t('options.none')}</MenuItem>
                <MenuItem value="inum">{t('fields.inum')}</MenuItem>
                <MenuItem value="description">{t('fields.description')}</MenuItem>
              </TextField>

              {sortBy && (
                <Tooltip title={t('tooltips.toggle_sort_order')}>
                  <IconButton
                    onClick={handleSortOrderToggle}
                    size="small"
                    sx={{
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  >
                    <SwapVertIcon
                      sx={{
                        transform: sortOrder === 'descending' ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease-in-out',
                      }}
                    />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title={t('tooltips.refresh_data')}>
                <IconButton
                  onClick={handleRefresh}
                  size="small"
                  sx={{
                    'color': customColors.lightBlue,
                    '&:hover': {
                      backgroundColor: `${customColors.lightBlue}20`,
                    },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <MaterialTable
            columns={columns}
            data={scripts}
            isLoading={isLoading || deleteMutation.isPending}
            title=""
            actions={actions}
            options={tableOptions}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            detailPanel={({ rowData }: { rowData: ScriptTableRow }) => (
              <Box sx={{ p: 2, backgroundColor: themeColors.lightBackground }}>
                <CustomScriptDetailPage row={rowData} />
              </Box>
            )}
            localization={{
              body: {
                emptyDataSourceMessage: t('messages.no_scripts_found'),
              },
            }}
          />
        </GluuViewWrapper>

        {canDelete && itemToDelete && (
          <GluuDialog
            row={itemToDelete}
            name={itemToDelete.name}
            handler={() => {
              setModal(false)
              setItemToDelete(null)
            }}
            modal={modal}
            subject="script"
            onAccept={handleDeleteConfirm}
            feature={adminUiFeatures.custom_script_delete}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default CustomScriptListPage
