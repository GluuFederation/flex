import React, { useState, useEffect, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useCedarling } from '@/cedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { SCOPE_READ } from 'Utils/PermChecker'
import SetTitle from 'Utils/SetTitle'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { getScripts } from 'Redux/features/initSlice'

function ScriptsListPage() {
  const { hasCedarPermission } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [myActions, setMyActions] = useState([])
  const navigate = useNavigate()
  const [limit] = useState(10)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const { scripts, loading: scriptsLoading } = useSelector((state) => state.initReducer)

  SetTitle(t('titles.custom_scripts'))

  const handleGoToScriptDetailPage = useCallback(
    (row) => {
      return navigate(`/admin/scripts/edit/${row.inum}`)
    },
    [navigate],
  )

  const handleGoToScriptEditPage = useCallback(
    (row) => {
      return navigate(`/admin/scripts/edit/${row.inum}`)
    },
    [navigate],
  )

  useEffect(() => {
    if (hasCedarPermission(SCOPE_READ)) {
      const userAction = {}
      dispatch(getScripts({ action: userAction }))
    }
  }, [hasCedarPermission, dispatch])

  useEffect(() => {
    const newActions = []

    if (hasCedarPermission(SCOPE_READ)) {
      newActions.push(() => {
        return {
          icon: 'visibility',
          tooltip: `${t('messages.view')}`,
          onClick: (event, rowData) => handleGoToScriptDetailPage(rowData),
          disabled: false,
        }
      })

      newActions.push(() => {
        return {
          icon: 'edit',
          tooltip: `${t('messages.edit')}`,
          onClick: (event, rowData) => handleGoToScriptEditPage(rowData),
          disabled: false,
        }
      })
    }

    setMyActions(newActions)
  }, [hasCedarPermission, t, handleGoToScriptDetailPage, handleGoToScriptEditPage])

  const authScripts = scripts
    .filter((script) => script.scriptType === 'person_authentication')
    .map((script) => ({
      ...script,
      acrName: script.name,
      level: script.level || 0,
      samlACR: script.name,
    }))

  console.log('Auth scripts:', authScripts)

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
        ]}
        data={scriptsLoading ? [] : authScripts}
        isLoading={scriptsLoading}
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
      />
    </GluuViewWrapper>
  )
}

export default ScriptsListPage
