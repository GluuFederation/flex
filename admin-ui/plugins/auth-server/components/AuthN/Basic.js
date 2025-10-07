import React, { useState, useEffect, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { SCOPE_READ, SCOPE_WRITE } from 'Utils/PermChecker'
import customColors from '@/customColors'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import AuthNDetailPage from './AuthNDetailPage'
import { getAcrsConfig } from 'Plugins/auth-server/redux/features/acrSlice'
import { setCurrentItem } from '../../redux/features/authNSlice'

function Basic() {
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [myActions, setMyActions] = useState([])
  const navigate = useNavigate()
  const [limit] = useState(10)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const authN = useSelector((state) => state.authNReducer.acrs)
  const acrs = useSelector((state) => state.acrReducer.acrReponse)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  SetTitle(t('menus.built_in'))

  useEffect(() => {
    const authorizePermissions = async () => {
      const permissions = [SCOPE_READ, SCOPE_WRITE]
      try {
        for (const permission of permissions) {
          await authorize([permission])
        }
      } catch (error) {
        console.error('Error authorizing scope permissions:', error)
      }
    }

    authorizePermissions()
    dispatch(getAcrsConfig())
  }, [dispatch])

  useEffect(() => {
    const newActions = []

    if (hasCedarPermission(SCOPE_WRITE)) {
      newActions.push((rowData) => {
        return {
          icon: 'edit',
          iconProps: {
            id: 'editAutN' + rowData.inum,
            style: { color: customColors.darkGray },
          },
          tooltip: `${t('messages.edit_authn')}`,
          onClick: (event, rowData) => handleGoToAuthNEditPage(rowData),
          disabled: !hasCedarPermission(SCOPE_WRITE),
        }
      })
    }

    setMyActions(newActions)
  }, [cedarPermissions, t, handleGoToAuthNEditPage])

  const handleGoToAuthNEditPage = useCallback(
    (row) => {
      dispatch(setCurrentItem({ item: row }))
      return navigate(`/auth-server/authn/edit/:` + row.inum)
    },
    [dispatch, navigate],
  )

  return (
    <GluuViewWrapper canShow={hasCedarPermission(SCOPE_READ)}>
      <MaterialTable
        key={limit ? limit : 0}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
        columns={[
          { title: t('fields.acr'), field: 'acrName' },
          { title: t('fields.saml_acr'), field: 'samlACR' },
          { title: t('fields.level'), field: 'level' },
          {
            title: t('fields.default'),
            field: '',
            render: (rowData) => (
              <i
                className={rowData.acrName === acrs.defaultAcr ? 'fa fa-check' : 'fa fa-close'}
                style={{ color: customColors.logo, fontSize: '24px' }}
              />
            ),
          },
        ]}
        data={authN}
        isLoading={false}
        title=""
        actions={myActions}
        options={{
          columnsButton: false,
          search: false,
          idSynonym: 'inum',
          selection: false,
          pageSize: limit,
          headerStyle: {
            ...applicationStyle.tableHeaderStyle,
            ...bgThemeColor,
          },
          actionsColumnIndex: -1,
        }}
        detailPanel={(rowData) => {
          return <AuthNDetailPage row={rowData.rowData} />
        }}
      />
    </GluuViewWrapper>
  )
}

export default Basic
