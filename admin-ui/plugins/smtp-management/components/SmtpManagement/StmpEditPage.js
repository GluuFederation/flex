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

function StmpEditPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const loading = useSelector((state) => state.smtpsReducer.loading)
  const item = useSelector((state) => state.smtpsReducer)

  const handleSubmit = (data) => {
    const opts = {}
    const smtpData = JSON.stringify(data)
    opts['smtpConfiguration'] = JSON.parse(smtpData)
    dispatch(updateSmpt(opts))
  }
  const allowSmtpKeystoreEdit = useSelector(
    (state) => state.authReducer?.config?.allowSmtpKeystoreEdit,
  )
  SetTitle(t('menus.stmp_management'))
  useEffect(() => {
    dispatch(getSmpts())
  }, [])

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
