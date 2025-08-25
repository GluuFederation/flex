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
import { getScriptsByType } from '../../redux/features/scriptSlice'

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

  const [scriptsList, setScriptsList] = useState([])

  const scripts = useSelector((state) => state.scriptReducer?.scripts || [])
  const scriptsLoading = useSelector((state) => state.scriptReducer?.loading || false)
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

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

  // Fetch scripts data
  useEffect(() => {
    if (hasCedarPermission(SCOPE_READ)) {
      dispatch(getScriptsByType({ action: 'PERSON_AUTHENTICATION' }))
    }
  }, [hasCedarPermission])

  // Actions as state that will rebuild when permissions change
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
  }, [cedarPermissions, t, handleGoToScriptDetailPage, handleGoToScriptEditPage])

  // Process scripts data
  useEffect(() => {
    if (scripts && scripts.length > 0 && !scriptsLoading) {
      const authScripts = scripts
        .filter(
          (script) => script.scriptType === 'PERSON_AUTHENTICATION' && script.enabled === true,
        )
        .map((script) => ({
          ...script,
          acrName: script.name,
          level: script.level || 0,
          samlACR: script.name,
        }))

      setScriptsList(authScripts)
    } else {
      setScriptsList([])
    }
  }, [scriptsLoading])

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
        data={scriptsLoading ? [] : scriptsList}
        isLoading={scriptsLoading}
        title=""
        actions={myActions}
        options={{
          columnsButton: true,
          search: true,
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
          return (
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
              <h6>{t('messages.details')}</h6>
              <div>
                <strong>{t('fields.name')}:</strong> {rowData.rowData.name}
              </div>
              <div>
                <strong>{t('fields.description')}:</strong> {rowData.rowData.description || 'N/A'}
              </div>
              <div>
                <strong>{t('fields.script_type')}:</strong> {rowData.rowData.scriptType}
              </div>
              <div>
                <strong>{t('fields.programming_language')}:</strong>{' '}
                {rowData.rowData.programmingLanguage}
              </div>
              <div>
                <strong>{t('fields.enabled')}:</strong> {rowData.rowData.enabled ? 'Yes' : 'No'}
              </div>
            </div>
          )
        }}
      />
    </GluuViewWrapper>
  )
}

export default ScriptsListPage
