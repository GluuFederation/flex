import React from 'react'
import ConfigurationForm from '../ConfigurationForm'
import { buildPayload } from 'Utils/PermChecker'
import { useDispatch, useSelector } from 'react-redux'
import {
  convertToStringArray,
  isStringsArray,
} from 'Plugins/jans-link/components/SourceBackendServers/SourceBackendServerForm'
import { putConfiguration } from 'Plugins/jans-kc-link/redux/features/JansKcLinkSlice'
import { useTranslation } from 'react-i18next'
import { getInitalValues, getValidationSchema } from 'Plugins/jans-kc-link/helper/index'

const InumConfiguration = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const configuration = useSelector(
    (state) => state.jansKcLinkReducer.configuration
  )
  const { inumConfig = {} } = configuration
  const handleFormSubmission = ({ userAction, userMessage, values }) => {
    const baseDNs = isStringsArray(values?.baseDNs || [])
      ? values.baseDNs
      : convertToStringArray(values?.baseDNs || [])
    const servers = isStringsArray(values?.servers || [])
      ? values?.servers
      : convertToStringArray(values?.servers || [])

    buildPayload(userAction, userMessage, {
      appConfiguration4: {
        ...configuration,
        inumConfig: {
          ...values,
          servers: servers,
          baseDNs: baseDNs,
        },
      },
    })

    dispatch(putConfiguration({ action: userAction }))
  }

  return (
    <ConfigurationForm
      handleFormSubmission={handleFormSubmission}
      validationSchema={getValidationSchema(t)}
      initialValues={getInitalValues(inumConfig)}
    />
  )
}

export default InumConfiguration