import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
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
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { Container, Row, Col } from 'Components'
import customColors from '@/customColors'

function ScriptsListPage() {
  const { hasCedarPermission } = useCedarling()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [limit] = useState(10)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }
  const backgroundStyle = { backgroundColor: customColors.lightGray, padding: '20px' }

  const { scripts, loading: scriptsLoading } = useSelector((state) => state.initReducer)

  SetTitle('Scripts')

  function ScriptDetailRow({ label, value }) {
    return (
      <Row>
        <Col sm={6}>
          <GluuFormDetailRow label={label[0]} value={value[0]} />
        </Col>
        {label[1] && value[1] && (
          <Col sm={6}>
            <GluuFormDetailRow label={label[1]} value={value[1]} />
          </Col>
        )}
      </Row>
    )
  }

  SetTitle(t('titles.custom_scripts'))

  useEffect(() => {
    if (hasCedarPermission(SCOPE_READ)) {
      const userAction = {}
      dispatch(getScripts({ action: userAction }))
    }
  }, [hasCedarPermission, dispatch])

  const authScripts = scripts
    .filter((script) => script.scriptType === 'person_authentication' && script.enabled)
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
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Pagination: () => (
            <TablePagination
              count={authScripts?.length}
              page={0}
              onPageChange={() => {}}
              rowsPerPage={10}
              onRowsPerPageChange={() => {}}
            />
          ),
        }}
        columns={[
          { title: `${t('fields.acr')}`, field: 'acrName' },
          { title: `${t('fields.saml_acr')}`, field: 'samlACR' },
          { title: `${t('fields.level')}`, field: 'level' },
        ]}
        data={authScripts}
        isLoading={scriptsLoading}
        title=""
        paging={false}
        options={{
          columnsButton: false,
          search: false,
          pagination: false,
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
          const row = rowData.rowData
          return (
            <Container style={backgroundStyle}>
              <ScriptDetailRow
                label={[t('fields.name'), t('fields.description')]}
                value={[row.acrName, row.description || 'N/A']}
              />
              <ScriptDetailRow
                label={[t('fields.script_type'), t('fields.programming_language')]}
                value={[row.scriptType, row.programmingLanguage]}
              />
              <ScriptDetailRow
                label={[t('fields.enabled'), t('fields.location_type')]}
                value={[row.enabled ? 'Yes' : 'No', row.locationType || 'N/A']}
              />
              <ScriptDetailRow label={[t('fields.inum')]} value={[row.inum || 'N/A']} />
            </Container>
          )
        }}
      />
    </GluuViewWrapper>
  )
}

export default ScriptsListPage
