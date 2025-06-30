import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MaterialTable from '@material-table/core'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { hasPermission, SAML_TR_READ, SAML_TR_WRITE, buildPayload } from 'Utils/PermChecker'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { useNavigate } from 'react-router'
import { DeleteOutlined } from '@mui/icons-material'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'
import {
  getTrustRelationship,
  deleteTrustRelationship,
} from 'Plugins/saml/redux/features/SamlSlice'
import { PaperContainer, getTableCols } from './SamlIdentityList'

const TrustRelationshipList = () => {
  const theme = useContext(ThemeContext)
  const themeColors = getThemeColor(theme.state.theme)
  const bgThemeColor = { background: themeColors.background }
  const [modal, setModal] = useState(false)
  const [item, setItem] = useState({})

  const toggle = () => setModal(!modal)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const permissions = useSelector((state) => state.authReducer.permissions)
  const { trustRelationships, loadingTrustRelationship } = useSelector(
    (state) => state.idpSamlReducer,
  )

  useEffect(() => {
    dispatch(getTrustRelationship())
  }, [])

  const handleGoToEditPage = useCallback((rowData, viewOnly) => {
    navigate('/saml/service-providers/edit', { state: { rowData: rowData, viewOnly: viewOnly } })
  }, [])

  const handleGoToAddPage = useCallback(() => {
    navigate('/saml/service-providers/add')
  }, [])

  function handleDelete(row) {
    setItem(row)
    toggle()
  }

  function onDeletionConfirmed(message) {
    const userAction = {}
    buildPayload(userAction, message, item.inum)
    dispatch(deleteTrustRelationship({ action: userAction }))
    toggle()
  }

  const DeleteOutlinedIcon = useCallback(() => <DeleteOutlined />, [])

  return (
    <>
      <GluuViewWrapper canShow={hasPermission(permissions, SAML_TR_READ)}>
        <MaterialTable
          components={{
            Container: PaperContainer,
          }}
          columns={getTableCols(t)}
          data={trustRelationships}
          isLoading={loadingTrustRelationship}
          title=""
          actions={[
            {
              icon: 'edit',
              tooltip: `${t('messages.edit_service_provider')}`,
              iconProps: { color: 'primary' },
              onClick: (event, rowData) => {
                const data = { ...rowData }
                delete data.tableData
                handleGoToEditPage(data)
              },
              disabled: !hasPermission(permissions, SAML_TR_WRITE),
            },
            {
              icon: 'visibility',
              tooltip: `${t('messages.view_service_provider')}`,
              onClick: (event, rowData) => handleGoToEditPage(rowData, true),
              disabled: !hasPermission(permissions, SAML_TR_READ),
            },
            {
              icon: DeleteOutlinedIcon,
              iconProps: {
                color: 'secondary',
              },
              tooltip: `${t('messages.delete_service_provider')}`,
              onClick: (event, rowData) => handleDelete(rowData),
              disabled: !hasPermission(permissions, SAML_TR_WRITE),
            },
            {
              icon: 'add',
              tooltip: `${t('messages.add_service_provider')}`,
              iconProps: { color: 'primary' },
              isFreeAction: true,
              onClick: () => handleGoToAddPage(),
              disabled: !hasPermission(permissions, SAML_TR_WRITE),
            },
          ]}
          options={{
            search: true,
            searchFieldAlignment: 'left',
            selection: false,
            pageSize: 10,
            headerStyle: {
              ...applicationStyle.tableHeaderStyle,
              ...bgThemeColor,
            },
            actionsColumnIndex: -1,
          }}
        />
      </GluuViewWrapper>
      {hasPermission(permissions, SAML_TR_WRITE) && (
        <GluuDialog
          row={item}
          name={item?.displayName || ''}
          handler={toggle}
          modal={modal}
          subject="saml trust relationship"
          onAccept={onDeletionConfirmed}
        />
      )}
    </>
  )
}

export default TrustRelationshipList
