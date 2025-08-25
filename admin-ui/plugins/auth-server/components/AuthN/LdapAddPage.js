import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import LdapForm from './LdapForm' // You may need to create this component for the form fields

function LdapAddPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const loading = useSelector((state) => state.authNLdap.loading)
  const saveOperationFlag = useSelector((state) => state.authNLdap.saveOperationFlag)
  const errorInSaveOperationFlag = useSelector((state) => state.authNLdap.errorInSaveOperationFlag)
  const [modifiedFields, setModifiedFields] = useState({})

  // Redirect on successful save
  React.useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) {
      navigate('/auth-server/authn')
    }
  }, [saveOperationFlag, errorInSaveOperationFlag])

  function handleSubmit() {
    // TODO: Dispatch add action here
    // dispatch(addLdap({ action: data }))
  }

  // Initial empty LDAP config
  const ldapConfig = {
    configId: '',
    bindDN: '',
    level: '',
    primaryKey: '',
    samlACR: '',
    maxConnections: '',
    localPrimaryKey: '',
    servers: '',
    baseDNs: '',
    enabled: true,
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={errorInSaveOperationFlag}
      />
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <LdapForm
            ldapConfig={ldapConfig}
            handleSubmit={handleSubmit}
            modifiedFields={modifiedFields}
            setModifiedFields={setModifiedFields}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default LdapAddPage
