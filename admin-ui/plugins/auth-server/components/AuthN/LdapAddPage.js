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
import { lDapFormInitialState } from 'Plugins/auth-server/helper'

function LdapAddPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const loading = useSelector((state) => state.authNLdap.loading)
  const errorInSaveOperationFlag = useSelector(
    (state) => state.authNLdap.errorInSaveOperationFlag || false,
  )
  const authNLdap = useSelector((state) => state.authNLdap)

  const isEdit = location.state?.isEdit
  const { item } = authNLdap
  const ldapConfig = React.useMemo(() => lDapFormInitialState(isEdit, item), [isEdit, item])

  const handleSuccessApply = React.useCallback(() => {
    dispatch({ type: 'authNLdap/getLdapList' })
    navigate('/auth-server/authn')
  }, [dispatch, navigate])

  return (
    <GluuLoader blocking={loading}>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={errorInSaveOperationFlag}
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
