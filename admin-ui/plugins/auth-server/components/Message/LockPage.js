import React, { useEffect } from 'react'
import MessageForm from './MessageForm'
import { Card, CardBody } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useDispatch, useSelector } from 'react-redux'
import { getConfigMessage } from 'Plugins/auth-server/redux/features/MessageSlice'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'

const LockPage = () => {
  const { loading, savingConfig } = useSelector((state) => state.messageReducer)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  SetTitle(t('menus.lock'))

  useEffect(() => {
    dispatch(getConfigMessage())
  }, [])

  return (
    <GluuLoader blocking={loading || savingConfig}>
      <Card style={applicationStyle.mainCard}>
        <CardBody style={{ minHeight: '70vh' }} className="p-2">
          {!loading && !savingConfig && <MessageForm />}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default LockPage
