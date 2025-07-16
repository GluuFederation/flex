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

// Type definitions
interface ScimConfigurationData {
  baseDN?: string
  applicationUrl?: string
  baseEndpoint?: string
  personCustomObjectClass?: string
  oxAuthIssuer?: string
  maxCount?: number
  bulkMaxOperations?: number
  bulkMaxPayloadSize?: number
  userExtensionSchemaURI?: string
  loggingLevel?: string
  loggingLayout?: string
  externalLoggerConfiguration?: string
  metricReporterInterval?: number
  metricReporterKeepDataDays?: number
  metricReporterEnabled?: boolean
  disableJdkLogger?: boolean
  useLocalCache?: boolean
  [key: string]: any
}

interface ScimState {
  scim: ScimConfigurationData
  loading: boolean
}

interface RootState {
  scimReducer: ScimState
}

interface UserAction {
  action_message?: string
  action_data?: any
  [key: string]: any
}

interface PatchOperation {
  op: 'replace' | 'add' | 'remove'
  path: string
  value: any
}

const ScimPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.scim_management'))
  const scimConfiguration = useSelector((state: RootState) => state.scimReducer)
  const dispatch = useDispatch()
  const userAction: UserAction = {}
  
  useEffect(() => {
    dispatch(getScimConfiguration())
  }, [dispatch])

  const handleSubmit = (data: PatchOperation[], userMessage: string): void => {
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
