import React, { useEffect } from 'react'
import { CardBody, Card } from 'Components'
import AuthNForm from './AuthNForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useSelector, useDispatch } from 'react-redux'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import {
  editLDAPAuthAcr,
  editScriptAuthAcr,
  editSimpleAuthAcr,
  setSuccess,
} from '../../redux/features/authNSlice'

function AuthNEditPage() {
  const dispatch = useDispatch()
  const { navigateToRoute } = useAppNavigation()
  const { t } = useTranslation()
  const item = useSelector((state) => state.authNReducer.item)
  const loading = useSelector((state) => state.authNReducer.loading)
  const success = useSelector((state) => state.authNReducer.isSuccess)

  useEffect(() => {
    if (success) {
      dispatch(setSuccess({ data: false }))
      setTimeout(() => {
        navigateToRoute(ROUTES.AUTH_SERVER_AUTHN)
      }, [2000])
    }
  }, [success, navigateToRoute])

  function handleSubmit(data) {
    const payload = {}

    if (item.name === 'simple_password_auth') {
      if (data.defaultAuthNMethod === 'true' || data.defaultAuthNMethod === true) {
        payload.authenticationMethod = { defaultAcr: 'simple_password_auth' }
        dispatch(editSimpleAuthAcr({ data: payload }))
      }
    } else if (item.name === 'default_ldap_password') {
      const ldapPayload = { ...item }
      ldapPayload.level = data.level
      ldapPayload.bindDN = data.bindDN
      ldapPayload.maxConnections = data.maxConnections
      ldapPayload.primaryKey = data.primaryKey
      ldapPayload.localPrimaryKey = data.localPrimaryKey
      ldapPayload.servers = data.servers
      ldapPayload.baseDNs = data.baseDNs
      ldapPayload.bindPassword = data.bindPassword
      ldapPayload.useSSL = data.useSSL
      ldapPayload.enabled = data.enabled

      if (data.defaultAuthNMethod === 'true' || data.defaultAuthNMethod === true) {
        payload.authenticationMethod = { defaultAcr: data.configId }
        dispatch(editSimpleAuthAcr({ data: payload }))
      }
      dispatch(editLDAPAuthAcr({ data: ldapPayload }))
    } else {
      const scriptPayload = { ...item }
      scriptPayload.description = data.description
      scriptPayload.samlACR = data.samlACR
      scriptPayload.level = data.level
      scriptPayload.dn = data.baseDn
      scriptPayload.inum = data.inum
      scriptPayload.name = item.acrName
      if (data?.configurationProperties?.length > 0) {
        scriptPayload.configurationProperties = data?.configurationProperties
          .filter((e) => e != null)
          .filter((e) => Object.keys(e).length !== 0)
          .map((e) => ({
            value1: e.key || e.value1,
            value2: e.value || e.value2,
            hide: false,
          }))
      }
      if (data.defaultAuthNMethod === 'true' || data.defaultAuthNMethod === true) {
        payload.authenticationMethod = { defaultAcr: item.acrName }
        dispatch(editSimpleAuthAcr({ data: payload }))
      }

      payload.customScript = scriptPayload
      const scriptData = { ...payload }
      delete scriptData?.customScript?.acrName
      delete scriptData?.customScript?.tableData
      delete scriptData?.customScript?.samlACR
      dispatch(editScriptAuthAcr({ data: scriptData }))
    }
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuAlert severity={t('titles.error')} message={t('messages.error_in_saving')} />
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AuthNForm handleSubmit={handleSubmit} item={{ ...item }} />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default AuthNEditPage
