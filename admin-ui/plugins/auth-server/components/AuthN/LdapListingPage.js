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
import { STRINGS } from '../../helper/constants'
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
  const backgroundStyle = { backgroundColor: '#f5f5f5', padding: '20px' }
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

  function LdapDetailRow({ label, value }) {
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
            { title: `ACR`, field: 'acrName' },
            { title: `Level`, field: 'level' },
            { title: `Bind DN`, field: 'bindDN' },
            { title: `Enabled`, field: 'enabled' },
            { title: `Remote Primary Key`, field: 'primaryKey' },
          ]}
          data={
            loading
              ? []
              : ldapList.map((item) => ({
                  ...item,
                  acrName: item.configId,
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
              <Container style={backgroundStyle}>
                <LdapDetailRow
                  label={[STRINGS.authn.ldap.fields.acr, STRINGS.authn.ldap.fields.level]}
                  value={[row.acrName, row.level]}
                />
                <LdapDetailRow
                  label={[STRINGS.authn.ldap.fields.remote_primary_key]}
                  value={[row.primaryKey]}
                />
                <LdapDetailRow
                  label={[
                    STRINGS.authn.ldap.fields.bind_dn,
                    STRINGS.authn.ldap.fields.max_connections,
                  ]}
                  value={[row.bindDN, row.maxConnections]}
                />
                <LdapDetailRow
                  label={[
                    STRINGS.authn.ldap.fields.local_primary_key,
                    STRINGS.authn.ldap.fields.servers,
                  ]}
                  value={[row.localPrimaryKey, row.servers && row.servers.join(', ')]}
                />
                <LdapDetailRow
                  label={[STRINGS.authn.ldap.fields.base_dns, STRINGS.authn.ldap.fields.status]}
                  value={[
                    row.baseDNs && row.baseDNs.join(', '),
                    row.enabled
                      ? t(STRINGS.authn.ldap.fields.enable)
                      : t(STRINGS.authn.ldap.fields.disable),
                  ]}
                />
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
        onAccept={(userMessage) => {
          dispatch({
            type: 'authNLdap/deleteLdap',
            payload: { configId: selectedRow?.configId, userMessage },
          })
          setModal(false)
        }}
        feature={'ldap_delete'}
      />
    </>
  )
}

export default LdapListingPage
