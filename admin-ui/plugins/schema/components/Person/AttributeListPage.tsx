import React, { useState, useEffect, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
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

// Define interfaces for TypeScript
interface AttributeValidation {
  regexp?: string | null
  minLength?: number | null
  maxLength?: number | null
}

interface AttributeItem {
  inum: string
  name: string
  displayName: string
  description: string
  status: string
  dataType: string
  editType: string[]
  viewType: string[]
  usageType: string[]
  jansHideOnDiscovery: boolean
  oxMultiValuedAttribute: boolean
  attributeValidation: AttributeValidation
  scimCustomAttr: boolean
  claimName?: string
  saml1Uri?: string
  saml2Uri?: string
}

interface AttributeState {
  items: AttributeItem[]
  item: AttributeItem
  loading: boolean
  totalItems: number
  entriesCount: number
}

interface CedarPermissionsState {
  permissions: { [key: string]: boolean }
  loading: boolean
  error: string | null
  initialized: boolean | null
  isInitializing: boolean
}

interface RootState {
  attributeReducer: AttributeState
  cedarPermissions: CedarPermissionsState
}

interface SearchOptions {
  startIndex?: number
  limit?: number
  pattern?: string
}

interface ThemeContextType {
  state: {
    theme: string
  }
}

function AttributeListPage() {
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const attributes = useSelector((state: RootState) => state.attributeReducer.items)
  const loading = useSelector((state: RootState) => state.attributeReducer.loading)
  const { totalItems } = useSelector((state: RootState) => state.attributeReducer)
  const { permissions: cedarPermissions } = useSelector(
    (state: RootState) => state.cedarPermissions,
  )

  // Permission initialization
  useEffect(() => {
    const authorizePermissions = async () => {
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

  const options: SearchOptions = {}
  const pageSize = localStorage.getItem('paggingSize')
    ? parseInt(localStorage.getItem('paggingSize') || '10')
    : 10
  const [limit, setLimit] = useState(pageSize)
  const [pageNumber, setPageNumber] = useState(0)
  const [pattern, setPattern] = useState<string | null>(null)
  const theme = useContext(ThemeContext) as ThemeContextType
  const selectedTheme = theme?.state?.theme || 'darkBlack'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  const StyledBadge = styled(Badge)<{ status: string }>`
    background-color: ${(props) =>
      props.status === 'active' ? customColors.darkGray : customColors.paleYellow} !important;
    color: ${customColors.white} !important;
  `

  useEffect(() => {
    makeOptions()
    dispatch(getAttributes({ options }))
  }, [dispatch])

  const limitId = 'searchLimit'
  const patternId = 'searchPattern'
  const myActions: any[] = []
  SetTitle(t('fields.attributes'))

  let memoLimit = limit
  let memoPattern = pattern

  const navigate = useNavigate()
  const [item, setItem] = useState<AttributeItem>({} as AttributeItem)
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  function handleOptionsChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === 'limit') {
      memoLimit = parseInt(event.target.value)
    } else if (event.target.name === 'pattern') {
      memoPattern = event.target.value
      if ((event as any).keyCode === 13) {
        makeOptions()
        dispatch(searchAttributes({ options }))
      }
    }
  }

  const onPageChangeClick = (page: number) => {
    makeOptions()
    const startCount = page * limit
    options.startIndex = startCount
    options.limit = limit
    setPageNumber(page)
    dispatch(getAttributes({ options }))
  }

  const onRowCountChangeClick = (count: number) => {
    makeOptions()
    options.startIndex = 0
    options.limit = count
    setPageNumber(0)
    setLimit(count)
    dispatch(getAttributes({ options }))
  }

  function makeOptions() {
    setPattern(memoPattern)
    options.limit = memoLimit
    if (memoPattern) {
      options.pattern = memoPattern
    }
  }

  function handleGoToAttributeEditPage(row: AttributeItem) {
    dispatch(setCurrentItem({ item: row }))
    return navigate(`/attribute/edit/:${row.inum}`)
  }

  function handleGoToAttributeViewPage(row: AttributeItem) {
    dispatch(setCurrentItem({ item: row }))
    return navigate(`/attribute/view/:${row.inum}`)
  }

  function handleAttribueDelete(row: AttributeItem) {
    setItem(row)
    toggle()
  }

  function handleGoToAttributeAddPage() {
    return navigate('/attribute/new')
  }

  const GluuSearch = useCallback(() => {
    return (
      <GluuAdvancedSearch
        limitId={limitId}
        limit={limit}
        pattern={pattern}
        patternId={patternId}
        handler={handleOptionsChange}
        showLimit={false}
      />
    )
  }, [limitId, limit, pattern, patternId])

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])
  const DetailsPanel = useCallback(
    (rowData: { rowData: AttributeItem }) => <AttributeDetailPage row={rowData.rowData} />,
    [],
  )

  if (hasCedarPermission(ATTRIBUTE_WRITE)) {
    myActions.push((rowData: AttributeItem) => ({
      icon: 'edit',
      iconProps: {
        id: 'editAttribute' + rowData.inum,
        style: { color: customColors.darkGray },
      },
      tooltip: `${t('tooltips.edit_attribute')}`,
      onClick: (event: React.MouseEvent, rowData: AttributeItem) =>
        handleGoToAttributeEditPage(rowData),
      disabled: !hasCedarPermission(ATTRIBUTE_WRITE),
    }))
    myActions.push({
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
  if (hasCedarPermission(ATTRIBUTE_READ)) {
    myActions.push((rowData: AttributeItem) => ({
      icon: 'visibility',
      iconProps: {
        id: 'viewAttribute' + rowData.inum,
        style: { color: customColors.darkGray },
      },
      tooltip: `${t('tooltips.view_attribute')}`,
      onClick: (event: React.MouseEvent, rowData: AttributeItem) =>
        handleGoToAttributeViewPage(rowData),
      disabled: false,
    }))
    myActions.push({
      icon: GluuSearch,
      tooltip: `${t('tooltips.advanced_search_options')}`,
      iconProps: {
        style: { color: customColors.lightBlue },
      },
      isFreeAction: true,
      onClick: () => {},
    })
    myActions.push({
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
  if (hasCedarPermission(ATTRIBUTE_DELETE)) {
    myActions.push((rowData: AttributeItem) => ({
      icon: DeleteOutlinedIcon,
      iconProps: {
        style: { color: customColors.darkGray, id: 'deleteAttribute' + rowData.inum },
      },
      tooltip: `${t('tooltips.delete_attribute')}`,
      onClick: (event: React.MouseEvent, rowData: AttributeItem) => handleAttribueDelete(rowData),
      disabled: !hasCedarPermission(ATTRIBUTE_DELETE),
    }))
  }

  function getBadgeTheme(status: string) {
    if (status === 'ACTIVE') {
      return `primary-${selectedTheme}`
    } else {
      return 'warning'
    }
  }

  function onDeletionConfirmed() {
    dispatch(deleteAttribute({ inum: item.inum, name: item?.name } as any))
    navigate('/attributes')
    toggle()
  }

  const PaginationWrapper = useCallback(
    () => (
      <TablePagination
        count={totalItems}
        page={pageNumber}
        onPageChange={(prop: any, page: number) => {
          onPageChangeClick(page)
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onRowCountChangeClick(parseInt(event.target.value))
        }
      />
    ),
    [pageNumber, totalItems, limit],
  )

  const PaperContainer = useCallback((props: any) => <Paper {...props} elevation={0} />, [])

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
            columns={[
              { title: `${t('fields.inum')}`, field: 'inum' },
              { title: `${t('fields.displayname')}`, field: 'displayName' },
              {
                title: `${t('fields.status')}`,
                field: 'status',
                type: 'boolean',
                render: (rowData: AttributeItem) => (
                  <StyledBadge status={rowData.status}>{rowData.status}</StyledBadge>
                ),
              },
            ]}
            data={attributes}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              search: false,
              idSynonym: 'inum',
              selection: false,
              searchFieldAlignment: 'left',
              pageSize: limit,
              headerStyle: {
                backgroundColor: bgThemeColor.background,
                color: customColors.white,
                padding: '12px',
                textTransform: 'uppercase' as const,
                fontSize: '16px',
              },
              actionsColumnIndex: -1,
            }}
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
