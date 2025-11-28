import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import MaterialTable, { Action, Column, Options } from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import {
  Paper,
  TablePagination,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Button,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import ClearIcon from '@mui/icons-material/Clear'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from 'reactstrap'
import { Card, CardBody } from 'Components'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import AttributeDetailPage from './AttributeDetailPage'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useCedarling } from '@/cedarling'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import styled from 'styled-components'
import {
  JansAttribute,
  useGetAttributes,
  useDeleteAttributesByInum,
  getGetAttributesQueryKey,
} from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { DELETION } from '@/audit/UserActionType'
import { useSchemaAuditLogger } from '../../hooks/useSchemaAuditLogger'
import { useSchemaWebhook } from '../../hooks/useSchemaWebhook'
import { API_ATTRIBUTE } from '../../constants'
import { getErrorMessage } from '../../utils/errorHandler'
import type { StyledBadgeProps } from '../types/AttributeListPage.types'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'

type AttributeIdentifier = Pick<JansAttribute, 'inum' | 'name'>

const StyledBadge = styled(Badge)<StyledBadgeProps>`
  background-color: ${(props) =>
    props.status?.toLowerCase() === 'active'
      ? customColors.darkGray
      : customColors.paleYellow} !important;
  color: ${customColors.white} !important;
`

function AttributeListPage(): JSX.Element {
  const {
    authorizeHelper,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
  } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { logAudit } = useSchemaAuditLogger()
  const { triggerAttributeWebhook } = useSchemaWebhook()
  const pageSize = useMemo(() => {
    const stored = localStorage.getItem('paggingSize')
    return stored ? parseInt(stored) : 10
  }, [])

  const [limit, setLimit] = useState<number>(pageSize)
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pattern, setPattern] = useState<string | null>(null)
  const [startIndex, setStartIndex] = useState<number>(0)
  const [status, setStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending')

  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme ?? 'light'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const { data: attributesData, isLoading } = useGetAttributes({
    limit,
    ...(pattern && { pattern }),
    startIndex,
    ...(status && { status }),
    ...(sortBy && { sortBy }),
    ...(sortBy && sortOrder && { sortOrder }),
  })

  const attributes = (attributesData?.entries || []) as unknown as JansAttribute[]
  const totalItems = attributesData?.totalEntriesCount || 0

  const deleteAttributeMutation = useDeleteAttributesByInum({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetAttributesQueryKey() })
      },
      onError: (error: Error | Record<string, never>) => {
        const errorMessage = getErrorMessage(error, 'errors.attribute_delete_failed', t)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const attributeResourceId = useMemo(() => ADMIN_UI_RESOURCES.Attributes, [])
  const attributeScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[ADMIN_UI_RESOURCES.Attributes], [])
  const canReadAttributes = useMemo(
    () => hasCedarReadPermission(attributeResourceId),
    [hasCedarReadPermission, attributeResourceId],
  )
  const canWriteAttributes = useMemo(
    () => hasCedarWritePermission(attributeResourceId),
    [hasCedarWritePermission, attributeResourceId],
  )
  const canDeleteAttributes = useMemo(
    () => hasCedarDeletePermission(attributeResourceId),
    [hasCedarDeletePermission, attributeResourceId],
  )

  useEffect(() => {
    if (attributeScopes && attributeScopes.length > 0) {
      authorizeHelper(attributeScopes)
    }
  }, [authorizeHelper])

  SetTitle(t('fields.attributes'))

  const { navigateToRoute } = useAppNavigation()
  const [item, setItem] = useState<JansAttribute>({} as JansAttribute)
  const [modal, setModal] = useState<boolean>(false)
  const toggle = (): void => setModal(!modal)

  const handlePatternChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setPattern(value)
  }

  const handlePatternKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      setPageNumber(0)
      setStartIndex(0)
    }
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setStatus(value === 'all' ? null : value.toUpperCase())
    setPageNumber(0)
    setStartIndex(0)
  }

  const handleSortByChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    setSortBy(value === 'none' ? null : value)
    setPageNumber(0)
    setStartIndex(0)
  }

  const handleSortOrderToggle = (): void => {
    setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending')
  }

  const handleClearFilters = (): void => {
    setPattern(null)
    setStatus(null)
    setSortBy(null)
    setSortOrder('ascending')
    setPageNumber(0)
    setStartIndex(0)
  }

  const onPageChangeClick = (page: number): void => {
    const newStartIndex = page * limit
    setStartIndex(newStartIndex)
    setPageNumber(page)
  }

  const onRowCountChangeClick = (count: number): void => {
    setStartIndex(0)
    setPageNumber(0)
    setLimit(count)
  }

  const handleGoToAttributeEditPage = useCallback(
    (row: JansAttribute): void => {
      if (!row?.inum) return
      navigateToRoute(ROUTES.ATTRIBUTE_EDIT(row.inum))
    },
    [navigateToRoute],
  )

  const handleGoToAttributeViewPage = useCallback(
    (row: JansAttribute): void => {
      if (!row?.inum) return
      navigateToRoute(ROUTES.ATTRIBUTE_VIEW(row.inum))
    },
    [navigateToRoute],
  )

  const handleAttribueDelete = useCallback(
    (row: JansAttribute): void => {
      setItem(row)
      toggle()
    },
    [toggle],
  )

  const handleGoToAttributeAddPage = useCallback((): void => {
    navigateToRoute(ROUTES.ATTRIBUTE_ADD)
  }, [navigateToRoute])

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])

  const attributeActions = useMemo<
    (Action<JansAttribute> | ((rowData: JansAttribute) => Action<JansAttribute>))[]
  >(() => {
    const actions: Array<
      Action<JansAttribute> | ((rowData: JansAttribute) => Action<JansAttribute>)
    > = []

    if (canReadAttributes) {
      actions.push({
        icon: 'visibility',
        tooltip: `${t('tooltips.view_attribute')}`,
        onClick: (event, rowData) => handleGoToAttributeViewPage(rowData as JansAttribute),
        disabled: false,
      })
    }

    if (canWriteAttributes) {
      actions.push({
        icon: 'edit',
        tooltip: `${t('tooltips.edit_attribute')}`,
        onClick: (event, rowData) => handleGoToAttributeEditPage(rowData as JansAttribute),
        disabled: !canWriteAttributes,
      })
      actions.push({
        icon: 'add',
        tooltip: `${t('tooltips.add_attribute')}`,
        iconProps: {
          style: { color: customColors.lightBlue },
        },
        isFreeAction: true,
        onClick: () => handleGoToAttributeAddPage(),
        disabled: !canWriteAttributes,
      })
    }

    if (canDeleteAttributes) {
      actions.push({
        icon: DeleteOutlinedIcon,
        tooltip: `${t('tooltips.delete_attribute')}`,
        onClick: (event, rowData) => handleAttribueDelete(rowData as JansAttribute),
        disabled: !canDeleteAttributes,
      })
    }

    return actions
  }, [
    canReadAttributes,
    canWriteAttributes,
    canDeleteAttributes,
    t,
    handleGoToAttributeViewPage,
    handleGoToAttributeEditPage,
    handleGoToAttributeAddPage,
    handleAttribueDelete,
    DeleteOutlinedIcon,
  ])

  const DetailsPanel = useCallback(
    (rowData: { rowData: JansAttribute }) => <AttributeDetailPage row={rowData.rowData} />,
    [],
  )

  function onDeletionConfirmed(): void {
    if (item.inum) {
      deleteAttributeMutation.mutate(
        { inum: item.inum },
        {
          onSuccess: () => {
            const deletedAttribute: AttributeIdentifier = {
              inum: item.inum,
              name: item.name,
            }

            logAudit({
              action: DELETION,
              resource: API_ATTRIBUTE,
              message: `Deleted attribute ${item.name ?? item.inum}`,
              payload: deletedAttribute,
            })

            triggerAttributeWebhook(deletedAttribute)
          },
        },
      )
    }
    toggle()
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
        onRowsPerPageChange={(event) => onRowCountChangeClick(parseInt(event.target.value))}
      />
    ),
    [pageNumber, totalItems, limit],
  )

  const PaperContainer = useCallback(
    (props: React.ComponentProps<typeof Paper>) => <Paper {...props} elevation={0} />,
    [],
  )

  const columns: Column<JansAttribute>[] = useMemo(
    () => [
      { title: `${t('fields.inum')}`, field: 'inum' },
      { title: `${t('fields.displayname')}`, field: 'displayName' },
      {
        title: `${t('fields.status')}`,
        field: 'status',
        type: 'boolean',
        render: (rowData) => {
          const normalizedStatus = rowData.status?.toLowerCase() ?? 'inactive'
          return <StyledBadge status={normalizedStatus}>{rowData.status}</StyledBadge>
        },
      },
    ],
    [t],
  )

  const tableOptions: Options<JansAttribute> = useMemo(
    () => ({
      search: false,
      idSynonym: 'inum',
      selection: false,
      searchFieldAlignment: 'left',
      pageSize: limit,
      headerStyle: {
        ...applicationStyle.tableHeaderStyle,
        ...bgThemeColor,
      } as React.CSSProperties,
      actionsColumnIndex: -1,
    }),
    [limit, bgThemeColor],
  )

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={canReadAttributes}>
          <Box
            sx={{
              mb: '10px',
              p: 1,
              backgroundColor: '#fff',
              borderRadius: 1,
              border: '1px solid #e0e0e0',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  placeholder={t('placeholders.search_pattern')}
                  name="pattern"
                  value={pattern ?? ''}
                  onChange={handlePatternChange}
                  onKeyDown={handlePatternKeyDown}
                  sx={{ width: '250px' }}
                  inputProps={{
                    'aria-label': t('placeholders.search_pattern'),
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          fontSize="small"
                          sx={{
                            color: customColors.lightBlue,
                            pointerEvents: 'none',
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  select
                  size="small"
                  value={status?.toLowerCase() || 'all'}
                  onChange={handleStatusChange}
                  sx={{ width: '140px' }}
                  label={t('fields.status')}
                >
                  <MenuItem value="all">{t('options.all')}</MenuItem>
                  <MenuItem value="active">{t('options.active')}</MenuItem>
                  <MenuItem value="inactive">{t('options.inactive')}</MenuItem>
                </TextField>
                <TextField
                  select
                  size="small"
                  value={sortBy || 'none'}
                  onChange={handleSortByChange}
                  sx={{ width: '180px' }}
                  label={t('fields.sort_by')}
                >
                  <MenuItem value="none">{t('options.none')}</MenuItem>
                  <MenuItem value="displayName">{t('fields.displayname')}</MenuItem>
                  <MenuItem value="inum">{t('fields.inum')}</MenuItem>
                </TextField>
                {sortBy && sortBy !== 'none' && (
                  <IconButton
                    size="small"
                    onClick={handleSortOrderToggle}
                    title={
                      sortOrder === 'ascending' ? t('options.ascending') : t('options.descending')
                    }
                    aria-label={
                      sortOrder === 'ascending'
                        ? t('tooltips.sort_descending')
                        : t('tooltips.sort_ascending')
                    }
                    sx={{ color: customColors.lightBlue }}
                  >
                    <SwapVertIcon />
                  </IconButton>
                )}
                <Button
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  aria-label={t('tooltips.clear_filters')}
                  sx={{ color: customColors.lightBlue }}
                >
                  {t('actions.clear')}
                </Button>
              </Box>
              <IconButton
                size="small"
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: getGetAttributesQueryKey() })
                }
                title={t('tooltips.refresh_data')}
                aria-label={t('tooltips.refresh_data')}
                sx={{ color: customColors.lightBlue }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          <MaterialTable
            key={attributes ? attributes.length : 0}
            components={{
              Container: PaperContainer,
              Pagination: PaginationWrapper,
            }}
            columns={columns}
            data={attributes}
            isLoading={isLoading}
            title=""
            actions={attributeActions}
            options={tableOptions}
            detailPanel={DetailsPanel}
          />
        </GluuViewWrapper>
        {canDeleteAttributes && (
          <GluuDialog
            row={item}
            handler={toggle}
            modal={modal}
            subject="attribute"
            name={item.displayName}
            onAccept={onDeletionConfirmed}
            feature={adminUiFeatures.attributes_delete}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default AttributeListPage
