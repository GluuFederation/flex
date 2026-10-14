import {
  LOCK_FIELD_SPECS,
  LOCK_LIST_SPECS,
  jansLockConstants,
} from 'Plugins/jans-lock/helper/constants'

describe('jansLockConstants', () => {
  it('has correct DOC_CATEGORY', () => {
    expect(jansLockConstants.DOC_CATEGORY).toBe('jans_lock')
  })

  it('matches the server enum values', () => {
    expect(jansLockConstants.PROTECTION_MODES).toEqual(['oauth', 'cedarling'])
    expect(jansLockConstants.AUDIT_PERSISTENCE_MODES).toEqual(['internal', 'config-api'])
    expect(jansLockConstants.CEDARLING_LOG_TYPES).toEqual(['OFF', 'MEMORY', 'STD_OUT'])
    expect(jansLockConstants.GRPC_SERVER_MODES).toEqual([
      'disabled',
      'bridge',
      'plain_server',
      'tls_server',
    ])
  })
})

describe('LOCK_FIELD_SPECS', () => {
  it('has unique paths', () => {
    const paths = [...LOCK_FIELD_SPECS, ...LOCK_LIST_SPECS].map(({ path }) => path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('marks the encrypted client password and base DN as read-only', () => {
    const readOnly = LOCK_FIELD_SPECS.filter((spec) => spec.readOnly).map(({ path }) => path)
    expect(readOnly).toEqual(['baseDN', 'clientPassword'])
  })

  it('assigns nested paths to their section', () => {
    LOCK_FIELD_SPECS.filter(({ path }) => path.includes('.')).forEach((spec) => {
      expect(spec.section).toBe(spec.path.split('.')[0])
    })
  })

  it('does not include fields removed from the server', () => {
    const paths = LOCK_FIELD_SPECS.map(({ path }) => path)
    ;['metricChannel', 'pdpType', 'policiesJsonUris', 'policiesZipUris', 'tokenUrl'].forEach(
      (removed) => expect(paths).not.toContain(removed),
    )
  })
})
