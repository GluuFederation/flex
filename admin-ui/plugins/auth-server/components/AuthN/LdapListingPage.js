import React, { useState, useEffect, useContext, useCallback } from 'react'
import MaterialTable from '@material-table/core'
import { Paper } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { useCedarling } from '@/cedarling'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { getLdapList, setCurrentItem } from '../../redux/features/authNLdapSlice'
import { useNavigate } from 'react-router-dom'
import customColors from '@/customColors'
import { LDAP_READ, LDAP_WRITE, LDAP_DELETE } from 'Utils/PermChecker'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { Container, Row, Col } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuDialog from 'Routes/Apps/Gluu/GluuDialog'

function LdapListingPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { hasCedarPermission, authorize } = useCedarling()

  const [limit] = useState(10)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const bgThemeColor = { background: themeColors.background }

  const ldapListRaw = useSelector((state) => state.authNLdap.ldapList)
  const loading = useSelector((state) => state.authNLdap.loading)
  const [ldapList, setLdapList] = useState([])
  const [myActions, setMyActions] = useState([])
  const navigate = useNavigate()

  const [modal, setModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const toggle = useCallback(() => setModal(!modal), [modal])
  const { permissions } = useSelector((state) => state.cedarPermissions)

  useEffect(() => {
    const initPermissions = async () => {
      const permissions = [LDAP_READ, LDAP_WRITE, LDAP_DELETE]
      for (const permission of permissions) {
        await authorize([permission])
      }
    }
    initPermissions()
    dispatch(getLdapList())
  }, [dispatch])

  useEffect(() => {}, [permissions])

  useEffect(() => {
    const actions = []
    if (hasCedarPermission(LDAP_WRITE)) {
      actions.push((rowData) => ({
        icon: 'edit',
        iconProps: { id: 'editLdap' + rowData.configId },
        tooltip: `${t('actions.edit')}`,
        onClick: () => {
          dispatch(setCurrentItem({ item: rowData }))
          navigate('/auth-server/authn/ldap/new', {
            state: { isEdit: true },
          })
        },
        disabled: !hasCedarPermission(LDAP_WRITE),
      }))
      actions.push({
        icon: 'add',
        tooltip: `${t('tooltips.add_ldap')}`,
        iconProps: { color: 'primary', style: { color: customColors.lightBlue } },
        isFreeAction: true,
        onClick: () => {
          navigate('/auth-server/authn/ldap/new', {
            state: { isEdit: false },
          })
        },
        disabled: !hasCedarPermission(LDAP_WRITE),
      })
    }
    if (hasCedarPermission(LDAP_DELETE)) {
      actions.push((rowData) => ({
        icon: 'delete_outline',
        iconProps: {
          color: 'primary',
          style: {
            color: customColors.darkGray,
          },
          id: 'deleteLdap' + rowData.configId,
        },
        tooltip: `${t('actions.delete')}`,
        onClick: (_event, rowData) => {
          setSelectedRow(rowData)
          setModal(true)
        },
        disabled: !hasCedarPermission(LDAP_DELETE),
      }))
    }
    setMyActions(actions)
  }, [hasCedarPermission, t, dispatch, navigate])

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

  return (
    <>
      <GluuViewWrapper canShow={hasCedarPermission(LDAP_READ)}>
        <MaterialTable
          key={limit ? limit : 0}
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
          }}
          columns={[
            { title: `${t('fields.acr')}`, field: 'acrName' },
            { title: `${t('fields.saml_acr')}`, field: 'samlACR' },
            { title: `${t('fields.level')}`, field: 'level' },
            { title: `${t('fields.bindDN')}`, field: 'bindDN' },
            { title: `${t('fields.enabled')}`, field: 'enabled' },
            { title: `${t('fields.primaryKey')}`, field: 'primaryKey' },
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
          actions={myActions}
          options={{
            columnsButton: false,
            search: false,
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
                    <GluuFormDetailRow
                      label="fields.local_primary_key"
                      value={row.localPrimaryKey}
                    />
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
      </GluuViewWrapper>
      <GluuDialog
        row={selectedRow}
        name={selectedRow?.configId}
        handler={toggle}
        modal={modal}
        subject="ldap"
        onAccept={() => {
          dispatch({ type: 'authNLdap/deleteLdap', payload: { configId: selectedRow?.configId } })
          setModal(false)
        }}
        feature={'ldap_delete'}
      />
    </>
  )
}

export default LdapListingPage
