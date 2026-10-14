import type { TFunction } from 'i18next'
import {
  buildLockChangedFieldOperations,
  createPatchOperations,
  getLockSections,
  transformToFormValues,
} from 'Plugins/jans-lock/helper/utils'
import type { JansLockConfigFormValues, LockConfig } from 'Plugins/jans-lock/types'

const liveConfig: LockConfig = {
  baseEndpoint: 'https://lock.example.org/jans-lock/api/v1',
  openIdIssuer: 'https://lock.example.org',
  protectionMode: 'oauth',
  auditPersistenceMode: 'internal',
  cedarlingConfiguration: {
    enabled: true,
    policySources: [
      { enabled: false, authorizationToken: '', policyStoreUri: 'https://a.example.org/store1' },
      { enabled: true, authorizationToken: 'tok', policyStoreUri: 'https://b.example.org/store2' },
      { enabled: true, authorizationToken: '', policyStoreUri: 'https://c.example.org/store3' },
    ],
    logType: 'STD_OUT',
    logLevel: 'INFO',
    externalPolicyStoreUri: '',
    maxEntries: 0,
  },
  grpcConfiguration: { serverMode: 'bridge', grpcPort: 50051, useTls: false },
  traceConfiguration: {
    enabled: true,
    defaultEvidenceDomainId: '',
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
  clientId: '2200.abc',
  clientPassword: 'encrypted==',
  cleanServiceInterval: 60,
  cleanServiceBatchChunkSize: 10000,
  disableJdkLogger: true,
  loggingLevel: 'INFO',
  loggingLayout: 'text',
  externalLoggerConfiguration: '',
  metricReporterInterval: 300,
  metricReporterKeepDataDays: 15,
  metricReporterEnabled: true,
  statEnabled: true,
  statTimerIntervalInSeconds: 0,
  errorReasonEnabled: false,
}

const edit = (
  mutate: (values: JansLockConfigFormValues) => void,
  config: LockConfig = liveConfig,
): JansLockConfigFormValues => {
  const values = transformToFormValues(config)
  mutate(values)
  return values
}

describe('getLockSections', () => {
  it('reports which nested sections the server returned', () => {
    expect(getLockSections(liveConfig)).toEqual({
      cedarlingConfiguration: true,
      grpcConfiguration: true,
      traceConfiguration: true,
    })
    expect(getLockSections({ grpcConfiguration: {} })).toEqual({
      cedarlingConfiguration: false,
      grpcConfiguration: true,
      traceConfiguration: false,
    })
  })
})

describe('transformToFormValues', () => {
  it('maps flat, nested and list values', () => {
    const values = transformToFormValues(liveConfig)

    expect(values.baseEndpoint).toBe('https://lock.example.org/jans-lock/api/v1')
    expect(values.protectionMode).toBe('oauth')
    expect(values.cleanServiceInterval).toBe(60)
    expect(values.cedarlingConfiguration.logType).toBe('STD_OUT')
    expect(values.grpcConfiguration.grpcPort).toBe(50051)
    expect(values.traceConfiguration.maxBulkRecords).toBe(100)
    expect(values.cedarlingConfiguration.policySources).toHaveLength(3)
    expect(values.cedarlingConfiguration.policySources[0]).toEqual({
      enabled: false,
      authorizationToken: '',
      policyStoreUri: 'https://a.example.org/store1',
    })
    expect(values.traceConfiguration.clientDomainBindings).toEqual([
      { clientId: '2200.abc', evidenceDomainId: 'default', allowedProducerIds: '*' },
    ])
  })

  it('keeps the encrypted client password as stored', () => {
    expect(transformToFormValues(liveConfig).clientPassword).toBe('encrypted==')
  })

  it('applies server defaults for missing values', () => {
    const values = transformToFormValues({})

    expect(values.protectionMode).toBe('oauth')
    expect(values.auditPersistenceMode).toBe('internal')
    expect(values.disableJdkLogger).toBe(true)
    expect(values.disableExternalLoggerConfiguration).toBe(true)
    expect(values.traceConfiguration.enabled).toBe(true)
    expect(values.grpcConfiguration.serverMode).toBe('bridge')
    expect(values.cleanServiceInterval).toBe('')
    expect(values.tokenChannels).toBe('')
    expect(values.cedarlingConfiguration.policySources).toEqual([])
  })

  it('joins token channels into a comma-separated string', () => {
    expect(transformToFormValues({ tokenChannels: ['jans_token', 'other'] }).tokenChannels).toBe(
      'jans_token, other',
    )
  })

  it('treats a policy source without an enabled flag as enabled', () => {
    const values = transformToFormValues({
      cedarlingConfiguration: { policySources: [{ policyStoreUri: 'https://x' }] },
    })
    expect(values.cedarlingConfiguration.policySources[0].enabled).toBe(true)
  })
})

describe('createPatchOperations', () => {
  it('returns no operations for an untouched form', () => {
    expect(createPatchOperations(transformToFormValues(liveConfig), liveConfig)).toEqual([])
  })

  it('returns no operations when defaults are shown for missing values', () => {
    const sparse: LockConfig = { cedarlingConfiguration: {}, traceConfiguration: {} }
    expect(createPatchOperations(transformToFormValues(sparse), sparse)).toEqual([])
  })

  it('replaces a changed top-level value', () => {
    const values = edit((v) => {
      v.cleanServiceInterval = 120
      v.protectionMode = 'cedarling'
    })
    expect(createPatchOperations(values, liveConfig)).toEqual([
      { op: 'replace', path: '/protectionMode', value: 'cedarling' },
      { op: 'replace', path: '/cleanServiceInterval', value: 120 },
    ])
  })

  it('patches nested values by their own path', () => {
    const values = edit((v) => {
      v.grpcConfiguration.grpcPort = 50052
      v.traceConfiguration.maxJsonDepth = 16
      v.cedarlingConfiguration.logLevel = 'DEBUG'
    })
    expect(createPatchOperations(values, liveConfig)).toEqual([
      { op: 'replace', path: '/cedarlingConfiguration/logLevel', value: 'DEBUG' },
      { op: 'replace', path: '/grpcConfiguration/grpcPort', value: 50052 },
      { op: 'replace', path: '/traceConfiguration/maxJsonDepth', value: 16 },
    ])
  })

  it('adds a value the server did not return', () => {
    const values = edit((v) => {
      v.grpcConfiguration.tlsCertChainFilePath = ' /etc/certs/chain.pem '
      v.tokenChannels = 'jans_token, extra'
    })
    expect(createPatchOperations(values, liveConfig)).toEqual([
      { op: 'add', path: '/tokenChannels', value: ['jans_token', 'extra'] },
      {
        op: 'add',
        path: '/grpcConfiguration/tlsCertChainFilePath',
        value: '/etc/certs/chain.pem',
      },
    ])
  })

  it('never patches read-only fields', () => {
    const values = edit((v) => {
      v.clientPassword = 'plain-text'
      v.baseDN = 'ou=other'
    })
    expect(createPatchOperations(values, liveConfig)).toEqual([])
  })

  it('keeps every policy source and its enabled flag when one URI changes', () => {
    const values = edit((v) => {
      v.cedarlingConfiguration.policySources[1].policyStoreUri = 'https://b.example.org/new'
    })
    expect(createPatchOperations(values, liveConfig)).toEqual([
      {
        op: 'replace',
        path: '/cedarlingConfiguration/policySources',
        value: [
          {
            enabled: false,
            policyStoreUri: 'https://a.example.org/store1',
            authorizationToken: '',
          },
          { enabled: true, policyStoreUri: 'https://b.example.org/new', authorizationToken: 'tok' },
          {
            enabled: true,
            policyStoreUri: 'https://c.example.org/store3',
            authorizationToken: '',
          },
        ],
      },
    ])
  })

  it('sends a disabled policy source as disabled', () => {
    const values = edit((v) => {
      v.cedarlingConfiguration.policySources[2].enabled = false
    })
    const [operation] = createPatchOperations(values, liveConfig)
    const sources = operation.value as Array<{ enabled: boolean }>
    expect(sources.map(({ enabled }) => enabled)).toEqual([false, true, false])
  })

  it('removes a policy source', () => {
    const values = edit((v) => {
      v.cedarlingConfiguration.policySources.splice(0, 1)
    })
    const [operation] = createPatchOperations(values, liveConfig)
    expect(operation.path).toBe('/cedarlingConfiguration/policySources')
    expect(operation.value).toHaveLength(2)
  })

  it('splits allowed producer ids into a list for client bindings', () => {
    const values = edit((v) => {
      v.traceConfiguration.clientDomainBindings.push({
        clientId: 'client-2',
        evidenceDomainId: 'payments',
        allowedProducerIds: 'svc-a, svc-b',
      })
    })
    expect(createPatchOperations(values, liveConfig)).toEqual([
      {
        op: 'replace',
        path: '/traceConfiguration/clientDomainBindings',
        value: [
          { clientId: '2200.abc', evidenceDomainId: 'default', allowedProducerIds: ['*'] },
          {
            clientId: 'client-2',
            evidenceDomainId: 'payments',
            allowedProducerIds: ['svc-a', 'svc-b'],
          },
        ],
      },
    ])
  })

  it('skips sections the server does not have', () => {
    const config: LockConfig = { loggingLevel: 'INFO' }
    const values = edit((v) => {
      v.traceConfiguration.maxJsonDepth = 10
      v.grpcConfiguration.grpcPort = 1234
      v.cedarlingConfiguration.policySources = [
        { enabled: true, policyStoreUri: 'https://x', authorizationToken: '' },
      ]
    }, config)
    expect(createPatchOperations(values, config)).toEqual([])
  })

  it('skips cleared numbers instead of sending null', () => {
    const values = edit((v) => {
      v.metricReporterInterval = ''
    })
    expect(createPatchOperations(values, liveConfig)).toEqual([])
  })

  it('does not patch removed legacy fields', () => {
    const legacy = { ...liveConfig, metricChannel: 'x', pdpType: 'OPA' } as LockConfig
    const operations = createPatchOperations(transformToFormValues(legacy), legacy)
    expect(operations).toEqual([])
  })
})

describe('buildLockChangedFieldOperations', () => {
  const t = ((key: string) => `t:${key}`) as TFunction

  it('labels each patch with its translated field name', () => {
    expect(
      buildLockChangedFieldOperations(
        [
          { op: 'replace', path: '/grpcConfiguration/grpcPort', value: 1 },
          { op: 'replace', path: '/cedarlingConfiguration/policySources', value: [] },
        ],
        t,
      ),
    ).toEqual([
      { path: 't:fields.lock_grpc_port', value: 1 },
      { path: 't:fields.lock_policy_sources', value: [] },
    ])
  })

  it('falls back to the JSON pointer for unknown paths', () => {
    expect(
      buildLockChangedFieldOperations([{ op: 'add', path: '/unknown', value: 'x' }], t),
    ).toEqual([{ path: '/unknown', value: 'x' }])
  })
})
