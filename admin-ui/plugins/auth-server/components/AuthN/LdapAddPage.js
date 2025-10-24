import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import LdapForm from './LdapForm'
import { useLocation } from 'react-router-dom'
import { ldapFormInitialState } from 'Plugins/auth-server/helper/utils'

function LdapAddPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const { loading, saveStatus = 'idle', item } = useSelector((state) => state.authNLdap)
  const isEdit = Boolean(location.state?.isEdit)

  const ldapConfig = React.useMemo(() => ldapFormInitialState(isEdit, item), [isEdit, item])

  const handleSuccessApply = React.useCallback(() => {
    dispatch({ type: 'authNLdap/getLdapList' })
    navigate('/auth-server/authn')
  }, [dispatch, navigate])

  return (
    <GluuLoader blocking={loading}>
      <GluuAlert
        severity="error"
        message={t('messages.error_in_saving')}
        show={saveStatus === 'failed'}
      />
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <LdapForm isEdit={isEdit} ldapConfig={ldapConfig} onSuccessApply={handleSuccessApply} />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default LdapAddPage
