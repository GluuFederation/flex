import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MaterialTable from '@material-table/core'
import { useTranslation } from 'react-i18next'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { buildPayload } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
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
import customColors from '@/customColors'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'

const TrustRelationshipList = () => {
  const { authorizeHelper, hasCedarReadPermission, hasCedarWritePermission } = useCedarling()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme ?? 'light'
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  const [modal, setModal] = useState(false)
  const [item, setItem] = useState({})

  const toggle = () => setModal(!modal)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { trustRelationships, loadingTrustRelationship } = useSelector(
    (state) => state.idpSamlReducer,
  )
  const samlResourceId = useMemo(() => ADMIN_UI_RESOURCES.SAML, [])
  const samlScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[samlResourceId], [samlResourceId])
  const canReadTrustRelationships = useMemo(
    () => hasCedarReadPermission(samlResourceId) === true,
    [hasCedarReadPermission, samlResourceId],
  )
  const canWriteTrustRelationships = useMemo(
    () => hasCedarWritePermission(samlResourceId) === true,
    [hasCedarWritePermission, samlResourceId],
  )

  useEffect(() => {
    authorizeHelper(samlScopes)
  }, [authorizeHelper, samlScopes])

  useEffect(() => {
    if (!canReadTrustRelationships) {
      return
    }
    dispatch(getTrustRelationship())
  }, [dispatch, canReadTrustRelationships])

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
      <GluuViewWrapper canShow={canReadTrustRelationships}>
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
              iconProps: { color: 'primary', style: { color: customColors.darkGray } },
              onClick: (event, rowData) => {
                const data = { ...rowData }
                delete data.tableData
                handleGoToEditPage(data)
              },
              disabled: !canWriteTrustRelationships,
            },
            {
              icon: 'visibility',
              iconProps: {
                style: { color: customColors.darkGray },
              },
              tooltip: `${t('messages.view_service_provider')}`,
              onClick: (event, rowData) => handleGoToEditPage(rowData, true),
              disabled: !canReadTrustRelationships,
            },
            {
              icon: DeleteOutlinedIcon,
              iconProps: {
                color: 'secondary',
              },
              tooltip: `${t('messages.delete_service_provider')}`,
              onClick: (event, rowData) => handleDelete(rowData),
              disabled: !canWriteTrustRelationships,
            },
            {
              icon: 'add',
              tooltip: `${t('messages.add_service_provider')}`,
              iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
              isFreeAction: true,
              onClick: () => handleGoToAddPage(),
              disabled: !canWriteTrustRelationships,
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
      {canWriteTrustRelationships && (
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
