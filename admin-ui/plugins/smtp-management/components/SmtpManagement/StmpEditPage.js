import React, { useEffect } from 'react'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { CardBody, Card } from 'Components'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle"
import { getSmpts, updateSmpt } from '../../redux/actions/SmtpActions'
import SmtpForm from './SmtpForm'

function StmpEditPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const loading = useSelector((state) => state.smtpsReducer.loading)
  const item = useSelector((state) => state.smtpsReducer);

  const handleSubmit = (data) => {
    const opts = {}
    const smtpData = JSON.stringify(data)
    opts['smtpConfiguration'] = JSON.parse(smtpData)
    dispatch(updateSmpt(opts));
  }

  SetTitle(t('menus.stmp_management'))
  useEffect(() => {
    dispatch(getSmpts())
  }, [])


  return (
    <GluuLoader blocking={loading}>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
      />
      <Card className='mb-3' style={applicationStyle.mainCard}>
        <CardBody>
         {!loading && <SmtpForm item={item.smtp} handleSubmit={handleSubmit}/>} 
        </CardBody>
      </Card>
    </GluuLoader>
  )
}
export default StmpEditPage