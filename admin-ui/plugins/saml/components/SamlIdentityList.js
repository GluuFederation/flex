import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSamlIdentites, deleteSamlIdentity } from 'Plugins/saml/redux/features/SamlSlice'
import MaterialTable from '@material-table/core'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { SAML_READ, SAML_WRITE, SAML_DELETE, buildPayload } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { useNavigate } from 'react-router'
import { DeleteOutlined } from '@mui/icons-material'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import { Paper, TablePagination } from '@mui/material'
import GluuAdvancedSearch from 'Routes/Apps/Gluu/GluuAdvancedSearch'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

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
  const { hasCedarPermission, authorize } = useCedarling()
  const options = {}
  const theme = useContext(ThemeContext)
  const themeColors = getThemeColor(theme.state.theme)
  const bgThemeColor = { background: themeColors.background }
  const [modal, setModal] = useState(false)
  const [limit, setLimit] = useState(10)
  const [pattern, setPattern] = useState(null)
  const [item, setItem] = useState({})
  const [pageNumber, setPageNumber] = useState(0)

  let memoLimit = limit
  let memoPattern = pattern
  const toggle = () => setModal(!modal)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, loadingSamlIdp, totalItems } = useSelector((state) => state.idpSamlReducer)

  // Permission initialization
  useEffect(() => {
    const initPermissions = async () => {
      const permissions = [SAML_READ, SAML_WRITE, SAML_DELETE]
      for (const permission of permissions) {
        await authorize([permission])
      }
    }
    initPermissions()
  }, [])

  useEffect(() => {
    makeOptions()
    dispatch(getSamlIdentites(options))
  }, [])

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

  function handleOptionsChange(event) {
    if (event.target.name == 'limit') {
      memoLimit = event.target.value
    } else if (event.target.name == 'pattern') {
      memoPattern = event.target.value
    }
  }

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
      <GluuViewWrapper canShow={hasCedarPermission(SAML_READ)}>
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
              iconProps: { color: 'primary' },
              onClick: (event, rowData) => {
                const data = { ...rowData }
                delete data.tableData
                handleGoToEditPage(data)
              },
              disabled: !hasCedarPermission(SAML_WRITE),
            },
            {
              icon: 'visibility',
              tooltip: `${t('messages.view_identity_provider')}`,
              onClick: (event, rowData) => handleGoToEditPage(rowData, true),
              disabled: !hasCedarPermission(SAML_READ),
            },
            {
              icon: DeleteOutlinedIcon,
              iconProps: {
                color: 'secondary',
              },
              tooltip: `${t('messages.delete_identity_provider')}`,
              onClick: (event, rowData) => handleDelete(rowData),
              disabled: !hasCedarPermission(SAML_DELETE),
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
              disabled: !hasCedarPermission(SAML_WRITE),
            },
          ]}
          options={{
            search: false,
            selection: false,
            idSynonym: 'inum',
            pageSize: limit,
            headerStyle: {
              ...applicationStyle.tableHeaderStyle,
              ...bgThemeColor,
            },
            actionsColumnIndex: -1,
          }}
        />
      </GluuViewWrapper>
      {hasCedarPermission(SAML_DELETE) && (
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
