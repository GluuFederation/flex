import i18next from 'i18next'
import { getLockValidationSchema } from 'Plugins/jans-lock/helper/validations'
import { transformToFormValues } from 'Plugins/jans-lock/helper/utils'
import type { JansLockConfigFormValues, LockConfig } from 'Plugins/jans-lock/types'

const t = i18next.t.bind(i18next)

const freshInstallConfig: LockConfig = {
  baseEndpoint: 'https://lock.example.org/jans-lock/api/v1',
  openIdIssuer: 'https://lock.example.org',
  protectionMode: 'oauth',
  auditPersistenceMode: 'internal',
  cedarlingConfiguration: {
    enabled: true,
    policySources: [{ enabled: false }],
    logType: 'STD_OUT',
    logLevel: 'INFO',
    maxEntries: 0,
  },
  grpcConfiguration: { serverMode: 'bridge', grpcPort: 50051, useTls: false },
  traceConfiguration: {
    enabled: true,
    clientDomainBindings: [
      { clientId: '2200.abc', evidenceDomainId: 'default', allowedProducerIds: ['*'] },
    ],
    latenessThresholdSeconds: 300,
    maxRequestBytes: 262144,
    maxJsonDepth: 32,
    maxStringLength: 8192,
    maxArrayLength: 256,
    maxObjectMembers: 256,
    receiptAllocationRetryLimit: 8,
    receiptRepairIntervalSeconds: 300,
    pendingReceiptTimeoutSeconds: 120,
    maxBulkRecords: 100,
    maxBulkRequestBytes: 4194304,
  },
  statEnabled: true,
  statTimerIntervalInSeconds: 0,
  clientId: '2200.abc',
  clientPassword: 'encrypted==',
  disableJdkLogger: true,
  disableExternalLoggerConfiguration: true,
  loggingLevel: 'INFO',
  loggingLayout: 'text',
  metricReporterInterval: 300,
  metricReporterKeepDataDays: 15,
  metricReporterEnabled: true,
  cleanServiceInterval: 60,
  messageConsumerType: 'DISABLED',
  errorReasonEnabled: false,
  cleanServiceBatchChunkSize: 10000,
}

const validValues = (): JansLockConfigFormValues => {
  const values = transformToFormValues({
    baseEndpoint: 'https://lock.example.org/jans-lock/api/v1',
    openIdIssuer: 'https://lock.example.org',
    clientId: '2200.abc',
    cleanServiceInterval: 60,
    cleanServiceBatchChunkSize: 10000,
    metricReporterInterval: 300,
    metricReporterKeepDataDays: 15,
    statTimerIntervalInSeconds: 0,
    cedarlingConfiguration: { maxEntries: 0, policySources: [] },
    grpcConfiguration: { grpcPort: 50051 },
    traceConfiguration: {
      latenessThresholdSeconds: 300,
      maxRequestBytes: 262144,
      maxJsonDepth: 32,
      maxStringLength: 8192,
      maxArrayLength: 256,
      maxObjectMembers: 256,
      receiptAllocationRetryLimit: 8,
      receiptRepairIntervalSeconds: 300,
      pendingReceiptTimeoutSeconds: 120,
      maxBulkRecords: 100,
      maxBulkRequestBytes: 4194304,
      clientDomainBindings: [],
    },
  })
  return values
}

describe('getLockValidationSchema', () => {
  const schema = getLockValidationSchema(t)

  it('accepts a valid configuration', () => {
    expect(schema.isValidSync(validValues())).toBe(true)
  })

  it('accepts the configuration a fresh 2.5.0 install returns', () => {
    expect(schema.isValidSync(transformToFormValues(freshInstallConfig))).toBe(true)
  })

  it.each([
    ['cleanServiceInterval', ''],
    ['cleanServiceInterval', 0],
    ['cleanServiceInterval', 1.5],
    ['metricReporterInterval', -1],
    ['metricReporterKeepDataDays', -1],
    ['statTimerIntervalInSeconds', ''],
    ['statTimerIntervalInSeconds', 1.5],
    ['cleanServiceBatchChunkSize', 0],
  ])('rejects %s = %p', (path, value) => {
    const values = { ...validValues(), [path]: value }
    expect(schema.isValidSync(values)).toBe(false)
  })

  it.each([
    ['statTimerIntervalInSeconds', -1],
    ['statTimerIntervalInSeconds', 0],
    ['metricReporterInterval', 0],
  ])('accepts %s = %p, which Lock treats as off or default', (path, value) => {
    expect(schema.isValidSync({ ...validValues(), [path]: value })).toBe(true)
  })

  it('requires the client id', () => {
    expect(schema.isValidSync({ ...validValues(), clientId: ' ' })).toBe(false)
  })

  it.each([0, 65536, 80.5])('rejects gRPC port %p', (grpcPort) => {
    const values = validValues()
    values.grpcConfiguration.grpcPort = grpcPort
    expect(schema.isValidSync(values)).toBe(false)
  })

  it('rejects a TRACE limit below 1', () => {
    const values = validValues()
    values.traceConfiguration.maxJsonDepth = 0
    expect(schema.isValidSync(values)).toBe(false)
  })

  it.each(['baseEndpoint', 'openIdIssuer'])('requires an http(s) %s', (path) => {
    expect(schema.isValidSync({ ...validValues(), [path]: 'ftp://host' })).toBe(false)
    expect(schema.isValidSync({ ...validValues(), [path]: '' })).toBe(false)
    expect(schema.isValidSync({ ...validValues(), [path]: 'https://host' })).toBe(true)
  })

  it('requires the TLS file paths only when gRPC runs as a TLS server', () => {
    const values = validValues()
    values.grpcConfiguration.serverMode = 'tls_server'
    expect(schema.isValidSync(values)).toBe(false)
    values.grpcConfiguration.tlsCertChainFilePath = '/etc/certs/lock.crt'
    values.grpcConfiguration.tlsPrivateKeyFilePath = '/etc/certs/lock.key'
    expect(schema.isValidSync(values)).toBe(true)
    values.grpcConfiguration.serverMode = 'plain_server'
    values.grpcConfiguration.tlsCertChainFilePath = ''
    values.grpcConfiguration.tlsPrivateKeyFilePath = ''
    expect(schema.isValidSync(values)).toBe(true)
  })

  it('requires a valid URI for every enabled policy source', () => {
    const values = validValues()
    values.cedarlingConfiguration.policySources = [
      { enabled: true, policyStoreUri: '', authorizationToken: '' },
    ]
    expect(schema.isValidSync(values)).toBe(false)
    values.cedarlingConfiguration.policySources[0].policyStoreUri = '   '
    expect(schema.isValidSync(values)).toBe(false)
    values.cedarlingConfiguration.policySources[0].policyStoreUri = 'not a url'
    expect(schema.isValidSync(values)).toBe(false)
    values.cedarlingConfiguration.policySources[0].policyStoreUri = 'https://store.example.org/x'
    expect(schema.isValidSync(values)).toBe(true)
  })

  it('accepts the empty disabled policy source a fresh install ships', () => {
    const values = validValues()
    values.cedarlingConfiguration.policySources = [
      { enabled: false, policyStoreUri: '', authorizationToken: '' },
    ]
    expect(schema.isValidSync(values)).toBe(true)
    values.cedarlingConfiguration.policySources[0].policyStoreUri = 'not a url'
    expect(schema.isValidSync(values)).toBe(false)
  })

  it('requires client id and evidence domain for every TRACE binding', () => {
    const values = validValues()
    values.traceConfiguration.clientDomainBindings = [
      { clientId: 'client', evidenceDomainId: ' ', allowedProducerIds: '' },
    ]
    expect(schema.isValidSync(values)).toBe(false)
    values.traceConfiguration.clientDomainBindings[0].evidenceDomainId = 'default'
    expect(schema.isValidSync(values)).toBe(true)
  })

  it.each(['my domain', 'tenant/1', 'x'.repeat(65)])(
    'rejects the evidence domain id %p, which Lock refuses',
    (domainId) => {
      const values = validValues()
      values.traceConfiguration.clientDomainBindings = [
        { clientId: 'client', evidenceDomainId: domainId, allowedProducerIds: '' },
      ]
      expect(schema.isValidSync(values)).toBe(false)
      const withDefault = validValues()
      withDefault.traceConfiguration.defaultEvidenceDomainId = domainId
      expect(schema.isValidSync(withDefault)).toBe(false)
    },
  )

  it('accepts evidence domain ids Lock allows, and an empty default domain', () => {
    const values = validValues()
    values.traceConfiguration.defaultEvidenceDomainId = ''
    values.traceConfiguration.clientDomainBindings = [
      { clientId: 'client', evidenceDomainId: 'tenant-1.prod:eu_west', allowedProducerIds: '*' },
    ]
    expect(schema.isValidSync(values)).toBe(true)
    values.traceConfiguration.defaultEvidenceDomainId = 'default'
    expect(schema.isValidSync(values)).toBe(true)
  })

  it('does not validate sections the server does not have', () => {
    const values = validValues()
    values.grpcConfiguration.grpcPort = ''
    values.traceConfiguration.maxJsonDepth = ''
    const partial = getLockValidationSchema(t, {
      cedarlingConfiguration: true,
      grpcConfiguration: false,
      traceConfiguration: false,
    })
    expect(partial.isValidSync(values)).toBe(true)
  })
})
