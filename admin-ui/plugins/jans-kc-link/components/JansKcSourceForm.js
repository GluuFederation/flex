import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import {
  convertToStringArray,
  isStringsArray,
} from 'Plugins/jans-link/components/SourceBackendServers/SourceBackendServerForm'
import { buildPayload } from 'Utils/PermChecker'
import { putConfiguration, toggleSavedFormFlag } from 'Plugins/jans-kc-link/redux/features/JansKcLinkSlice'
import ConfigurationForm from './ConfigurationForm'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { Card, CardBody } from 'Components'
import { getInitalValues, getValidationSchema } from 'Plugins/jans-kc-link/helper/index'
import SetTitle from 'Utils/SetTitle'

const JansKcSourceForm = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const sourceConfig = useLocation().state?.sourceConfig || {}
  const configuration = useSelector(
    (state) => state.jansKcLinkReducer.configuration
  )
  const savedForm = useSelector((state) => state.jansKcLinkReducer.savedForm)
  const loading = useSelector((state) => state.jansKcLinkReducer.loading)
  const viewOnly = useLocation().state?.viewOnly || false

  if (viewOnly) {
    SetTitle(t('menus.view_source'))
  } else if (sourceConfig?.configId) {
    SetTitle(t('menus.edit_source'))
  } else {
    SetTitle(t('menus.add_source'))
  }

  const handleSubmit = ({ userAction, userMessage, values }) => {
    const baseDNs = isStringsArray(values?.baseDNs || [])
      ? values.baseDNs
      : convertToStringArray(values?.baseDNs || [])
    const servers = isStringsArray(values?.servers || [])
      ? values?.servers
      : convertToStringArray(values?.servers || [])

    let payload

    if (!sourceConfig?.configId) {
      const sourceConfigs = [...(configuration?.sourceConfigs || [])]
      payload = [
        ...sourceConfigs,
        {
          ...values,
          baseDNs: baseDNs,
          servers: servers,
        },
      ]
    } else {
      payload = configuration.sourceConfigs?.map((config) => {
        return config.configId === sourceConfig.configId
          ? {
              ...config,
              ...values,
              baseDNs: baseDNs,
              servers: servers,
            }
          : config
      })
    }
    buildPayload(userAction, userMessage, {
      appConfiguration4: {
        ...configuration,
        sourceConfigs: payload,
      },
    })

    dispatch(putConfiguration({ action: userAction }))
  }

  useEffect(() => {
    if (savedForm) {
      navigate('/jans-kc-link/sources')
    }

    return () => {
      dispatch(toggleSavedFormFlag(false))
    }
  }, [savedForm])

  return (
    <GluuLoader blocking={loading}>
      <Card className='mb-3' style={applicationStyle.mainCard}>
        <CardBody>
          <ConfigurationForm
            handleFormSubmission={handleSubmit}
            validationSchema={getValidationSchema(t)}
            initialValues={getInitalValues(sourceConfig)}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default JansKcSourceForm
