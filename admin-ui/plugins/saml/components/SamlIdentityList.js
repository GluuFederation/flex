import React, { useCallback, useEffect, useContext, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSamlIdentites, deleteSamlIdentity } from 'Plugins/saml/redux/features/SamlSlice'
import MaterialTable from '@material-table/core'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { buildPayload } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useNavigate } from 'react-router'
import { DeleteOutlined } from '@mui/icons-material'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { Paper, TablePagination } from '@mui/material'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import getThemeColor from 'Context/theme/config'
import { ThemeContext } from 'Context/theme/themeContext'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'

export const getTableCols = (t) => {
  return [
    {
      title: `${t('fields.inum')}`,
      field: 'inum',
    },
    {
      title: `${t('fields.displayName')}`,
      field: 'displayName',
    },
    {
      title: `${t('fields.enabled')}`,
      field: 'enabled',
    },
  ]
}

const SamlIdentityList = () => {
  const {
    authorizeHelper,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
  } = useCedarling()
  const options = {}
  const [modal, setModal] = useState(false)
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)
  const [item, setItem] = useState({})
  const [pageNumber, setPageNumber] = useState(0)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme
  const themeColors = getThemeColor(selectedTheme)

  let memoLimit = limit
  let memoPattern = pattern
  const toggle = () => setModal(!modal)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, loadingSamlIdp, totalItems } = useSelector((state) => state.idpSamlReducer)
  const samlResourceId = useMemo(() => ADMIN_UI_RESOURCES.SAML, [])
  const samlScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[samlResourceId], [samlResourceId])
  const canReadIdentities = useMemo(
    () => hasCedarReadPermission(samlResourceId) === true,
    [hasCedarReadPermission, samlResourceId],
  )
  const canWriteIdentities = useMemo(
    () => hasCedarWritePermission(samlResourceId) === true,
    [hasCedarWritePermission, samlResourceId],
  )
  const canDeleteIdentities = useMemo(
    () => hasCedarDeletePermission(samlResourceId) === true,
    [hasCedarDeletePermission, samlResourceId],
  )

  // Permission initialization
  useEffect(() => {
    authorizeHelper(samlScopes)
  }, [authorizeHelper, samlScopes])

  useEffect(() => {
    if (!canReadIdentities) {
      return
    }
    makeOptions()
    dispatch(getSamlIdentites(options))
  }, [dispatch, canReadIdentities])

  const handleGoToEditPage = useCallback((rowData, viewOnly) => {
    navigate('/saml/identity-providers/edit', { state: { rowData: rowData, viewOnly: viewOnly } })
  }, [])

  const handleGoToAddPage = useCallback(() => {
    navigate('/saml/identity-providers/add')
  }, [])

  function handleDelete(row) {
    setItem(row)
    toggle()
  }

  function onDeletionConfirmed(message) {
    const userAction = {}
    buildPayload(userAction, message, item.inum)
    dispatch(deleteSamlIdentity({ action: userAction }))
    toggle()
  }

  function makeOptions() {
    setLimit(memoLimit)
    setPattern(memoPattern)
    options['limit'] = memoLimit
    if (memoPattern) {
      options['pattern'] = memoPattern
    }
  }

  const onRowCountChangeClick = (count) => {
    makeOptions()
    options['startIndex'] = 0
    options['limit'] = count
    setPageNumber(0)
    setLimit(count)
    dispatch(getSamlIdentites(options))
  }

  const onPageChangeClick = (page) => {
    makeOptions()
    const startCount = page * limit
    options['startIndex'] = parseInt(startCount)
    options['limit'] = limit
    setPageNumber(page)
    dispatch(getSamlIdentites(options))
  }

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
        dispatch(getSamlIdentites({ action: newOptions }))
      }
    }
  }, [])

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])

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

  const GluuSearch = useCallback(() => {
    return (
      <GluuAdvancedSearch
        limitId={'searchLimit'}
        patternId={'searchPattern'}
        limit={limit}
        pattern={pattern}
        handler={handleOptionsChange}
        showLimit={false}
      />
    )
  }, [limit, pattern, handleOptionsChange])

  return (
    <>
      <GluuViewWrapper canShow={canReadIdentities}>
        <MaterialTable
          components={{
            Container: PaperContainer,
            Pagination: PaginationWrapper,
          }}
          columns={getTableCols(t)}
          data={items}
          isLoading={loadingSamlIdp}
          title=""
          actions={[
            {
              icon: 'edit',
              tooltip: `${t('messages.edit_identity_provider')}`,
              iconProps: { style: { color: customColors.darkGray } },
              onClick: (event, rowData) => {
                const data = { ...rowData }
                delete data.tableData
                handleGoToEditPage(data)
              },
              disabled: !canWriteIdentities,
            },
            {
              icon: 'visibility',
              tooltip: `${t('messages.view_identity_provider')}`,
              onClick: (event, rowData) => handleGoToEditPage(rowData, true),
              disabled: !canReadIdentities,
            },
            {
              icon: DeleteOutlinedIcon,
              iconProps: {
                color: 'secondary',
              },
              tooltip: `${t('messages.delete_identity_provider')}`,
              onClick: (event, rowData) => handleDelete(rowData),
              disabled: !canDeleteIdentities,
            },
            {
              icon: GluuSearch,
              tooltip: `${t('messages.advanced_search')}`,
              iconProps: { color: 'primary' },
              isFreeAction: true,
              onClick: () => {},
            },
            {
              icon: 'refresh',
              tooltip: `${t('messages.refresh')}`,
              iconProps: { color: 'primary' },
              ['data-testid']: `${t('messages.refresh')}`,
              isFreeAction: true,
              onClick: () => {
                makeOptions()
                dispatch(getSamlIdentites(options))
              },
            },
            {
              icon: 'add',
              tooltip: `${t('messages.add_identity_provider')}`,
              iconProps: { color: 'primary' },
              isFreeAction: true,
              onClick: () => handleGoToAddPage(),
              disabled: !canWriteIdentities,
            },
          ]}
          options={{
            search: false,
            selection: false,
            idSynonym: 'inum',
            pageSize: limit,
            headerStyle: {
              ...applicationStyle.tableHeaderStyle,
              backgroundColor: themeColors.menu.background,
              color: customColors.white,
            },
            actionsColumnIndex: -1,
          }}
        />
      </GluuViewWrapper>
      {canDeleteIdentities && (
        <GluuDialog
          row={item}
          name={item?.displayName || ''}
          handler={toggle}
          modal={modal}
          subject="saml idp"
          onAccept={onDeletionConfirmed}
          feature={adminUiFeatures.saml_idp_write}
        />
      )}
    </>
  )
}

export default SamlIdentityList
export const PaperContainer = (props) => <Paper {...props} elevation={0} />
