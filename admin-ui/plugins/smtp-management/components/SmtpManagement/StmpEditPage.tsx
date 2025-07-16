import React, { useEffect } from 'react'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { CardBody, Card } from 'Components'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { clearSmtpConfig, getSmpts, updateSmpt } from '../../redux/features/smtpSlice'
import SmtpForm from './SmtpForm'
import GluuInfo from '../../../../app/routes/Apps/Gluu/GluuInfo'

// Define interfaces for SMTP state
interface SmtpConfiguration {
  host?: string
  port?: number
  connect_protection?: string
  from_name?: string
  from_email_address?: string
  requires_authentication?: boolean
  smtp_authentication_account_username?: string
  smtp_authentication_account_password?: string
  trust_host?: boolean
  key_store?: string
  key_store_password?: string
  key_store_alias?: string
  signing_algorithm?: string
}

interface SmtpState {
  smtp: SmtpConfiguration
  loading: boolean
  testStatus: any
  openModal: boolean
}

interface AuthState {
  config?: {
    allowSmtpKeystoreEdit?: boolean
  }
}

interface RootState {
  smtpsReducer: SmtpState
  authReducer: AuthState
}

interface UpdateSmtpOptions {
  smtpConfiguration: SmtpConfiguration
}

function StmpEditPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const loading = useSelector((state: RootState) => state.smtpsReducer.loading)
  const item = useSelector((state: RootState) => state.smtpsReducer)

  const handleSubmit = (data: SmtpConfiguration) => {
    const opts: UpdateSmtpOptions = {
      smtpConfiguration: data,
    }
    dispatch(updateSmpt(opts))
  }

  const allowSmtpKeystoreEdit = useSelector(
    (state: RootState) => state.authReducer?.config?.allowSmtpKeystoreEdit || false,
  )

  SetTitle(t('menus.stmp_management'))

  useEffect(() => {
    dispatch(getSmpts({ payload: {} }))
  }, [dispatch])

  return (
    <GluuLoader blocking={loading}>
      <GluuInfo
        item={item}
        handler={() => {
          dispatch(clearSmtpConfig())
        }}
      />
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          {!loading && (
            <SmtpForm
              item={{ ...item.smtp }}
              allowSmtpKeystoreEdit={allowSmtpKeystoreEdit}
              handleSubmit={handleSubmit}
            />
          )}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default StmpEditPage
