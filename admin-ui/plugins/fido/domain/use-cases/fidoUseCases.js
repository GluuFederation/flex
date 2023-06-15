export const fidoApiPayload = ({ fidoConfiguration, data }) => {
  const payload = fidoConfiguration.fido
  payload.authenticatorCertsFolder = data.authenticatorCertsFolder
  payload.mdsCertsFolder = data.mdsCertsFolder
  payload.mdsTocsFolder = data.mdsTocsFolder
  payload.checkU2fAttestations = data.checkU2fAttestations
  payload.unfinishedRequestExpiration = data.unfinishedRequestExpiration
  payload.authenticationHistoryExpiration = data.authenticationHistoryExpiration
  payload.serverMetadataFolder = data.serverMetadataFolder
  payload.userAutoEnrollment = data.userAutoEnrollment
  payload.requestedCredentialTypes = data.requestedCredentialTypes.map((item) =>
    item?.value ? item?.value : item
  )
  payload.requestedParties = data.requestedParties.map((item) => {
    return {
      name: item.key,
      domains: [item.key],
    }
  })
  
  const newPayload = {
    ...fidoConfiguration.fido,
    fido2Configuration: payload,
  }

  const opts = {}
  const fiodData = JSON.stringify(newPayload)
  opts['appConfiguration1'] = JSON.parse(fiodData)

  return opts
}

export const fidoApiPayloadDynamicConfig = ({ fidoConfiguration, data }) => {
  const payload = fidoConfiguration.fido
  payload.issuer = data.issuer
  payload.baseEndpoint = data.baseEndpoint
  payload.cleanServiceInterval = data.cleanServiceInterval
  payload.cleanServiceBatchChunkSize = data.cleanServiceBatchChunkSize
  payload.useLocalCache = data.useLocalCache
  payload.disableJdkLogger = data.disableJdkLogger
  payload.loggingLevel = data.loggingLevel
  payload.loggingLayout = data.loggingLayout
  payload.externalLoggerConfiguration = data.externalLoggerConfiguration
  payload.metricReporterEnabled = data.metricReporterEnabled
  payload.metricReporterInterval = data.metricReporterInterval
  payload.metricReporterKeepDataDays = data.metricReporterKeepDataDays
  payload.personCustomObjectClassList = data.personCustomObjectClassList
  payload.superGluuEnabled = data.superGluuEnabled
  payload.personCustomObjectClassList = data.personCustomObjectClassList.map(
    (item) => (item?.value ? item?.value : item)
  )

  const opts = {}
  const fiodData = JSON.stringify(data)
  opts['appConfiguration1'] = JSON.parse(fiodData)

  return opts
}
