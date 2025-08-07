import React, { useState, useEffect, useContext, useCallback } from 'react'
import MaterialTable, { Action, Column, Options } from '@material-table/core'
import { DeleteOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Paper, TablePagination } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { Badge } from 'reactstrap'
import { Card, CardBody } from 'Components'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import AttributeDetailPage from './AttributeDetailPage'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ATTRIBUTE_WRITE, ATTRIBUTE_READ, ATTRIBUTE_DELETE } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import {
  getAttributes,
  searchAttributes,
  setCurrentItem,
  deleteAttribute,
} from 'Plugins/schema/redux/features/attributeSlice'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import styled from 'styled-components'
import { LIMIT_ID, PATTERN_ID } from 'Plugins/admin/common/Constants'
import type { JansAttribute, GetAttributesOptions } from 'Plugins/schema/types'
import type { CedarPermissionsState } from '@/cedarling/types'
import type { Dispatch } from '@reduxjs/toolkit'
import type {
  AttributeState,
  RootState,
  ThemeState,
  ThemeContextType,
  OptionsChangeEvent,
  StyledBadgeProps,
} from '../types/AttributeListPage.types'

function AttributeListPage(): JSX.Element {
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useDispatch<Dispatch>()
  const attributes = useSelector((state: RootState) => state.attributeReducer.items)
  const loading = useSelector((state: RootState) => state.attributeReducer.loading)
  const { totalItems } = useSelector((state: RootState) => state.attributeReducer)
  const { permissions: cedarPermissions } = useSelector(
    (state: RootState) => state.cedarPermissions,
  )
  const [myActions, setMyActions] = useState<Action<JansAttribute>[]>([])

  // Permission initialization
  useEffect(() => {
    const authorizePermissions = async (): Promise<void> => {
      const permissions = [ATTRIBUTE_READ, ATTRIBUTE_WRITE, ATTRIBUTE_DELETE]
      try {
        for (const permission of permissions) {
          await authorize([permission])
        }
      } catch (error) {
        console.error('Error authorizing attribute permissions:', error)
      }
    }

    authorizePermissions()
  }, [authorize])

  useEffect(() => {}, [cedarPermissions])

  const options: GetAttributesOptions = {}
  const pageSize = localStorage.getItem('paggingSize')
    ? parseInt(localStorage.getItem('paggingSize')!)
    : 10
  const [limit, setLimit] = useState<number>(pageSize)
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [pattern, setPattern] = useState<string | null>(null)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const StyledBadge = styled(Badge)<StyledBadgeProps>`
    background-color: ${(props) =>
      props.status === 'active' ? customColors.darkGray : customColors.paleYellow} !important;
    color: ${customColors.white} !important;
  `

  useEffect(() => {
    makeOptions()
    dispatch(getAttributes({ options }))
  }, [])

  const limitId = 'searchLimit'
  const patternId = 'searchPattern'
  SetTitle(t('fields.attributes'))

  const navigate = useNavigate()
  const [item, setItem] = useState<JansAttribute>({})
  const [modal, setModal] = useState<boolean>(false)
  const toggle = (): void => setModal(!modal)

  function handleOptionsChange(event: OptionsChangeEvent): void {
    if (event.target.name === 'limit') {
      setLimit(parseInt(event.target.value))
    } else if (event.target.name === 'pattern') {
      setPattern(event.target.value)
      if (event.keyCode === 13) {
        // Use the value from the event directly for search
        const searchOpts = { ...options, limit, pattern: event.target.value }
        dispatch(searchAttributes({ options: searchOpts }))
      }
    }
  }

  const onPageChangeClick = (page: number): void => {
    makeOptions()
    const startCount = page * limit
    options['startIndex'] = startCount
    options['limit'] = limit
    setPageNumber(page)
    dispatch(getAttributes({ options }))
  }

  const onRowCountChangeClick = (count: number): void => {
    makeOptions()
    options['startIndex'] = 0
    options['limit'] = count
    setPageNumber(0)
    setLimit(count)
    dispatch(getAttributes({ options }))
  }

  function makeOptions(): void {
    options['limit'] = limit
    if (pattern) {
      options['pattern'] = pattern
    } else {
      delete options['pattern']
    }
  }

  function handleGoToAttributeEditPage(row: JansAttribute): void {
    dispatch(setCurrentItem({ item: row }))
    navigate(`/attribute/edit/:${row.inum}`)
  }

  function handleGoToAttributeViewPage(row: JansAttribute): void {
    dispatch(setCurrentItem({ item: row }))
    navigate(`/attribute/view/:${row.inum}`)
  }

  function handleAttribueDelete(row: JansAttribute): void {
    setItem(row)
    toggle()
  }

  function handleGoToAttributeAddPage(): void {
    navigate('/attribute/new')
  }

  useEffect(() => {
    const actions: Action<JansAttribute>[] = []

    const canRead = hasCedarPermission(ATTRIBUTE_READ)
    const canWrite = hasCedarPermission(ATTRIBUTE_WRITE)
    const canDelete = hasCedarPermission(ATTRIBUTE_DELETE)

    if (canRead) {
      actions.push({
        icon: 'visibility',
        tooltip: `${t('tooltips.view_attribute')}`,
        onClick: (event, rowData) => handleGoToAttributeViewPage(rowData as JansAttribute),
        disabled: false,
      })
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
        tooltip: `${t('tooltips.advanced_search_options')}`,
        iconProps: {
          style: { color: customColors.lightBlue },
        },
        isFreeAction: true,
        onClick: () => {},
      })
      actions.push({
        icon: 'refresh',
        tooltip: `${t('tooltips.refresh_data')}`,
        iconProps: {
          style: { color: customColors.lightBlue },
        },
        isFreeAction: true,
        onClick: () => {
          makeOptions()
          dispatch(searchAttributes({ options }))
        },
      })
    }

    if (canWrite) {
      actions.push({
        icon: 'edit',
        tooltip: `${t('tooltips.edit_attribute')}`,
        onClick: (event, rowData) => handleGoToAttributeEditPage(rowData as JansAttribute),
        disabled: !hasCedarPermission(ATTRIBUTE_WRITE),
      })
      actions.push({
        icon: 'add',
        tooltip: `${t('tooltips.add_attribute')}`,
        iconProps: {
          style: { color: customColors.lightBlue },
        },
        isFreeAction: true,
        onClick: () => handleGoToAttributeAddPage(),
        disabled: !hasCedarPermission(ATTRIBUTE_WRITE),
      })
    }

    if (canDelete) {
      actions.push({
        icon: DeleteOutlinedIcon,
        tooltip: `${t('tooltips.delete_attribute')}`,
        onClick: (event, rowData) => handleAttribueDelete(rowData as JansAttribute),
        disabled: !hasCedarPermission(ATTRIBUTE_DELETE),
      })
    }

    setMyActions(actions)
  }, [cedarPermissions, limit, pattern, t, hasCedarPermission])

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])
  const DetailsPanel = useCallback(
    (rowData: { rowData: JansAttribute }) => <AttributeDetailPage row={rowData.rowData} />,
    [],
  )

  function getBadgeTheme(status: string): string {
    if (status === 'ACTIVE') {
      return `primary-${selectedTheme}`
    } else {
      return 'warning'
    }
  }

  function onDeletionConfirmed(): void {
    dispatch(deleteAttribute({ inum: item.inum!, name: item?.name }))
    navigate('/attributes')
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

  const PaperContainer = useCallback((props: any) => <Paper {...props} elevation={0} />, [])

  const columns: Column<JansAttribute>[] = [
    { title: `${t('fields.inum')}`, field: 'inum' },
    { title: `${t('fields.displayname')}`, field: 'displayName' },
    {
      title: `${t('fields.status')}`,
      field: 'status',
      type: 'boolean',
      render: (rowData) => (
        <StyledBadge status={rowData.status || 'inactive'}>{rowData.status}</StyledBadge>
      ),
    },
  ]

  const tableOptions: Options<JansAttribute> = {
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
  }

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow={hasCedarPermission(ATTRIBUTE_READ)}>
          <MaterialTable
            key={attributes ? attributes.length : 0}
            components={{
              Container: PaperContainer,
              Pagination: PaginationWrapper,
            }}
            columns={columns}
            data={attributes}
            isLoading={loading}
            title=""
            actions={myActions}
            options={tableOptions}
            detailPanel={DetailsPanel}
          />
        </GluuViewWrapper>
        {hasCedarPermission(ATTRIBUTE_DELETE) && (
          <GluuDialog
            row={item}
            handler={toggle}
            modal={modal}
            subject="attribute"
            onAccept={onDeletionConfirmed}
            feature={adminUiFeatures.attributes_delete}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default AttributeListPage
