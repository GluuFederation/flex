import React, { useState, useEffect, useContext } from 'react'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { getLdapList } from '../../redux/features/authNLdapSlice'
import { useNavigate } from 'react-router-dom'
import customColors from '@/customColors'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { Container, Row, Col } from 'Components'

function LdapListingPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [limit] = useState(10)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const ldapListRaw = useSelector((state) => state.authNLdap.ldapList)
  const loading = useSelector((state) => state.authNLdap.loading)
  const [ldapList, setLdapList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getLdapList())
  }, [dispatch])

  useEffect(() => {
    if (ldapListRaw && ldapListRaw.length > 0 && !loading) {
      const processed = ldapListRaw.map((item) => ({
        ...item,
        configId: item.configId,
        bindDN: item.bindDN,
        enabled: item.enabled,
      }))
      setLdapList(processed)
    } else {
      setLdapList([])
    }
  }, [ldapListRaw, loading])

  const actions = [
    {
      icon: 'add',
      tooltip: `${t('tooltips.add_ldap')}`,
      isFreeAction: true,
      iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
      onClick: () => navigate('/auth-server/authn/ldap/new'),
    },
  ]

  return (
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
      data={
        loading
          ? []
          : ldapList.map((item) => ({
              ...item,
              acrName: item.configId,
              samlACR: item.configId,
              level: item.level || 0,
            }))
      }
      isLoading={loading}
      title=""
      actions={actions}
      options={{
        columnsButton: true,
        search: true,
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
          <Container style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
            <Row>
              <Col sm={6}>
                <GluuFormDetailRow label="fields.acr" value={row.acrName} />
              </Col>
              <Col sm={6}>
                <GluuFormDetailRow label="fields.level" value={row.level} />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <GluuFormDetailRow label="fields.primary_key" value={row.primaryKey} />
              </Col>
              <Col sm={6}>
                <GluuFormDetailRow label="fields.saml_acr" value={row.samlACR} />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <GluuFormDetailRow label="fields.bind_dn" value={row.bindDN} />
              </Col>
              <Col sm={6}>
                <GluuFormDetailRow label="fields.max_connections" value={row.maxConnections} />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <GluuFormDetailRow label="fields.local_primary_key" value={row.localPrimaryKey} />
              </Col>
              <Col sm={6}>
                <GluuFormDetailRow
                  label="fields.servers"
                  value={row.servers && row.servers.join(', ')}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <GluuFormDetailRow
                  label="fields.base_dns"
                  value={row.baseDNs && row.baseDNs.join(', ')}
                />
              </Col>
              <Col sm={6}>
                <GluuFormDetailRow
                  label="fields.status"
                  value={row.enabled ? t('fields.enable') : t('fields.disable')}
                />
              </Col>
            </Row>
          </Container>
        )
      }}
    />
  )
}

export default LdapListingPage
