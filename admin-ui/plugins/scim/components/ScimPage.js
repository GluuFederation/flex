import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { Card, CardBody } from 'Components'
import ScimConfiguration from './ScimConfiguration'
import { getScimConfiguration, putScimConfiguration } from '../redux/features/ScimSlice'
import { buildPayload } from 'Utils/PermChecker'

const ScimPage = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.scim_management'))
  const scimConfiguration = useSelector((state) => state.scimReducer)
  const dispatch = useDispatch()
  const userAction = {}
  useEffect(() => {
    dispatch(getScimConfiguration())
  }, [])

  const handleSubmit = (data, userMessage) => {
    buildPayload(userAction, userMessage, {})
    userAction.action_message = userMessage
    userAction.action_data = data
    dispatch(putScimConfiguration({ action: userAction }))
  }

  return (
    <GluuLoader blocking={scimConfiguration?.loading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          {!scimConfiguration?.loading && <ScimConfiguration handleSubmit={handleSubmit} />}
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ScimPage
