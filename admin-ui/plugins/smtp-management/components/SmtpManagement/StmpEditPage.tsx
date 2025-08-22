import React, { useEffect } from 'react'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { CardBody, Card } from 'Components'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { clearSmtpConfig, getSmtps, updateSmpt } from '../../redux/features/smtpSlice'
import SmtpForm from './SmtpForm'
import GluuInfo from '../../../../app/routes/Apps/Gluu/GluuInfo'
import { RootState, SmtpConfiguration } from '../../redux/types'

function StmpEditPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const loading = useSelector((state: RootState) => state.smtpsReducer.loading)
  const item = useSelector((state: RootState) => state.smtpsReducer)

  const handleSubmit = (data: SmtpConfiguration) => {
    const opts = { smtpConfiguration: data }
    dispatch(updateSmpt(opts))
  }
  const allowSmtpKeystoreEdit = useSelector(
    (state: RootState) => state.authReducer?.config?.allowSmtpKeystoreEdit as boolean,
  )
  SetTitle(t('menus.stmp_management'))
  useEffect(() => {
    dispatch(getSmtps())
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
