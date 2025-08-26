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
import { getLdapConfig } from 'Plugins/services/redux/features/ldapSlice'
import { getCustomScriptByType } from 'Plugins/admin/redux/features/customScriptSlice'
import { setCurrentItem } from '../../redux/features/authNSlice'
import { getAcrsConfig } from 'Plugins/auth-server/redux/features/acrSlice'

function AuthNListPage({ isBuiltIn = false }) {
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

  const [list, setList] = useState({
    ldap: [],
    scripts: [],
  })

  const authN = useSelector((state) => state.authNReducer.acrs)
  const ldap = useSelector((state) => state.ldapReducer.ldap)
  const scripts = useSelector((state) => state.customScriptReducer.items)
  const scriptsLoading = useSelector((state) => state.customScriptReducer.loading)
  const loading = useSelector((state) => state.ldapReducer.loading)
  const acrs = useSelector((state) => state.acrReducer.acrReponse)
  const customScriptloading = useSelector((state) => state.customScriptReducer.loading)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  SetTitle(t('titles.authn'))

  // Permission initialization
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
    dispatch(getLdapConfig())
    dispatch(getCustomScriptByType({ action: { type: 'person_authentication' } }))
    dispatch(getAcrsConfig())

    return () => {
      // Cleanup if needed
    }
  }, [dispatch])

  // Actions as state that will rebuild when permissions change
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

  useEffect(() => {
    setList({ ...list, ldap: [] })

    if (ldap.length > 0 && !loading) {
      const getEnabledldap = ldap.filter((item) => item.enabled === true)
      if (getEnabledldap?.length > 0) {
        const updateLDAPItems = ldap.map((item) => ({
          ...item,
          name: 'default_ldap_password',
          acrName: item.configId,
        }))
        setList({ ...list, ldap: updateLDAPItems })
      }
    }
  }, [ldap, loading])

  useEffect(() => {
    setList({ ...list, scripts: [] })
    if (scripts.length > 0 && !scriptsLoading) {
      const getEnabledscripts = scripts.filter((item) => item.enabled === true)
      if (getEnabledscripts?.length > 0) {
        const updateScriptsItems = getEnabledscripts.map((item) => ({
          ...item,
          name: 'myAuthnScript',
          acrName: item.name,
        }))
        setList({ ...list, scripts: updateScriptsItems })
      }
    }
  }, [scripts])

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
          { title: `${t('fields.acr')}`, field: 'acrName' },
          { title: `${t('fields.saml_acr')}`, field: 'samlACR' },
          { title: `${t('fields.level')}`, field: 'level' },
          {
            title: `${t('options.default')}`,
            field: '',
            render: (rowData) => {
              return rowData.acrName === acrs.defaultAcr ? (
                <i
                  className="fa fa-check"
                  style={{ color: customColors.logo, fontSize: '24px' }}
                ></i>
              ) : (
                <i
                  className="fa fa-close"
                  style={{ color: customColors.accentRed, fontSize: '24px' }}
                ></i>
              )
            },
          },
        ]}
        data={
          loading || customScriptloading
            ? []
            : isBuiltIn
              ? authN
              : [...list.ldap, ...list.scripts].sort((item1, item2) => item1.level - item2.level)
        }
        isLoading={loading || customScriptloading}
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

export default AuthNListPage
