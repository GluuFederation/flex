import React from 'react'
import ConfigurationForm from '../ConfigurationForm'
import { buildPayload } from 'Utils/PermChecker'
import { useDispatch, useSelector } from 'react-redux'
import {
  convertToStringArray,
  isStringsArray,
} from 'Plugins/jans-link/components/SourceBackendServers/SourceBackendServerForm'
import { putConfiguration } from 'Plugins/jans-kc-link/redux/features/JansKcLinkSlice'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'

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

  const {
    bindDN = '',
    configId = '',
    bindPassword,
    maxConnections = 0,
    baseDNs = [],
    servers = [],
    useAnonymousBind = false,
    useSSL = false,
    enabled = false,
    localPrimaryKey = '',
    primaryKey = '',
  } = inumConfig

  const initialValues = {
    bindDN,
    configId,
    bindPassword,
    maxConnections,
    baseDNs,
    servers,
    useAnonymousBind,
    useSSL,
    enabled,
    localPrimaryKey,
    primaryKey,
  }

  const validationSchema = Yup.object({
    configId: Yup.string()
      .min(2, 'Mininum 2 characters')
      .required(`${t('fields.name')} ${t('messages.is_required')}`),
    bindDN: Yup.string()
      .min(2, 'Mininum 2 characters')
      .required(`${t('fields.bind_dn')} ${t('messages.is_required')}`),
    maxConnections: Yup.string().required(
      `${t('fields.max_connections')} ${t('messages.is_required')}`
    ),
    bindPassword: Yup.string().required(
      `${t('fields.bind_password')} ${t('messages.is_required')}`
    ),
    servers: Yup.array().min(
      1,
      `${t('fields.server_port')} ${t('messages.is_required')}`
    ),
    baseDNs: Yup.array().min(
      1,
      `${t('fields.base_dns')} ${t('messages.is_required')}`
    ),
  })

  return (
    <ConfigurationForm
      handleFormSubmission={handleFormSubmission}
      validationSchema={validationSchema}
      initialValues={initialValues}
    />
  )
}

export default InumConfiguration