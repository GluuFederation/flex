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
import { ThemeContext } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
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
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'

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

  const selectedTheme = useMemo(() => theme?.state?.theme || DEFAULT_THEME, [theme?.state?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const darkThemeColors = useMemo(() => getThemeColor('dark'), [])
  const lightThemeColors = useMemo(() => getThemeColor('light'), [])

  const isDarkTheme = useMemo(() => selectedTheme === THEME_DARK, [selectedTheme])

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
    (row: ScriptTableRow) => {
      if (!row?.inum) return
      navigateToRoute(ROUTES.CUSTOM_SCRIPT_EDIT(row.inum))
    },
    [navigateToRoute],
  )

  const handleView = useCallback(
    (row: ScriptTableRow) => {
      if (!row?.inum) return
      navigateToRoute(ROUTES.CUSTOM_SCRIPT_VIEW(row.inum))
    },
    [navigateToRoute],
  )

  const handleDeleteClick = useCallback((row: ScriptTableRow) => {
    setItemToDelete(row)
    setModal(true)
  }, [])

  const handleDeleteConfirm = useCallback(
    async (message: string, inum?: string) => {
      if (!inum) return

      try {
        await deleteMutation.mutateAsync({
          inum,
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
    [deleteMutation, dispatch, t],
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
                opacity: rowData.enabled ? 1 : 0.6,
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
        render: (rowData: ScriptTableRow) => {
          const isEnabled = rowData.enabled === true
          return (
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 300,
                color: isEnabled ? customColors.white : lightThemeColors.fontColor,
                opacity: isEnabled ? 0.9 : 0.6,
              }}
            >
              {rowData.description || '—'}
            </Typography>
          )
        },
      },
      {
        title: t('fields.script_type'),
        field: 'scriptType',
        render: (rowData: ScriptTableRow) => {
          const isEnabled = rowData.enabled === true
          return (
            <Chip
              label={rowData.scriptType}
              size="small"
              variant="outlined"
              sx={{
                'fontFamily': 'monospace',
                'fontSize': '0.75rem',
                'borderRadius': 1,
                'color': isEnabled ? darkThemeColors.fontColor : customColors.primaryDark,
                'borderColor': isEnabled ? darkThemeColors.borderColor : customColors.lightBorder,
                '& .MuiChip-label': {
                  color: isEnabled ? darkThemeColors.fontColor : customColors.primaryDark,
                },
              }}
            />
          )
        },
      },
      {
        title: t('options.enabled'),
        field: 'enabled',
        type: 'boolean',
        render: (rowData: ScriptTableRow) => {
          return (
            <Chip
              label={rowData.enabled ? t('options.yes') : t('options.no')}
              size="small"
              sx={{
                minWidth: 60,
                fontWeight: 500,
                backgroundColor: darkThemeColors.background,
                color: darkThemeColors.fontColor,
                opacity: rowData.enabled ? 1 : 0.6,
              }}
            />
          )
        },
      },
      {
        title: t('fields.actions'),
        field: 'actions',
        sorting: false,
        render: (rowData: ScriptTableRow) => {
          const isEnabled = rowData.enabled === true
          const iconColor = isEnabled ? customColors.white : customColors.darkGray
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {canWrite && (
                <Tooltip title={t('messages.edit_script')}>
                  <IconButton size="small" onClick={() => handleEdit(rowData)}>
                    <EditOutlined sx={{ fontSize: 20, color: iconColor }} />
                  </IconButton>
                </Tooltip>
              )}
              {canRead && (
                <Tooltip title={t('messages.view_script_details')}>
                  <IconButton size="small" onClick={() => handleView(rowData)}>
                    <VisibilityOutlined sx={{ fontSize: 20, color: iconColor }} />
                  </IconButton>
                </Tooltip>
              )}
              {canDelete && (
                <Tooltip title={t('messages.delete_script')}>
                  <IconButton size="small" onClick={() => handleDeleteClick(rowData)}>
                    <DeleteOutlined sx={{ fontSize: 20, color: iconColor }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )
        },
      },
    ],
    [
      t,
      themeColors,
      darkThemeColors,
      customColors,
      isDarkTheme,
      canWrite,
      canRead,
      canDelete,
      handleEdit,
      handleView,
      handleDeleteClick,
    ],
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
              'color': themeColors.fontColor,
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
    }

    return actionList
  }, [canWrite, t, handleAdd, themeColors, customColors])

  const tableOptions = useMemo(
    () => ({
      search: false,
      idSynonym: 'inum',
      selection: false,
      pageSize: pageSize,
      headerStyle: {
        backgroundColor: themeColors.background,
        color: themeColors.fontColor,
        fontWeight: 600,
        fontSize: '0.875rem',
        borderBottom: '2px solid #e0e0e0',
      },
      rowStyle: (rowData: ScriptTableRow) => {
        const hasError = rowData.scriptError?.stackTrace

        if (hasError) {
          return {
            backgroundColor: `${customColors.accentRed}15`,
            color: customColors.darkGray,
            fontSize: '0.875rem',
          }
        }

        if (rowData.enabled) {
          return {
            backgroundColor: darkThemeColors.background,
            color: darkThemeColors.fontColor,
            fontSize: '0.875rem',
          }
        }

        return {
          backgroundColor: customColors.white,
          color: customColors.darkGray,
          fontSize: '0.875rem',
        }
      },
    }),
    [pageSize, themeColors, darkThemeColors, customColors, isDarkTheme],
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
                sx={{
                  minWidth: 220,
                }}
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
            onAccept={(message: string) => handleDeleteConfirm(message, itemToDelete?.inum)}
            feature={adminUiFeatures.custom_script_delete}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default CustomScriptListPage
