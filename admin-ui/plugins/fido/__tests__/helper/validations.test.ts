import {
  isLastKeyValueComplete,
  isLastStringEntryComplete,
  isLastMetadataServerComplete,
  validationSchema,
} from 'Plugins/fido/helper/validations'

describe('fido validations', () => {
  describe('isLastKeyValueComplete', () => {
    it('returns true for an empty list', () => {
      expect(isLastKeyValueComplete([])).toBe(true)
    })

    it('returns true when the last row has both key and value', () => {
      expect(isLastKeyValueComplete([{ key: 'a', value: '1' }])).toBe(true)
    })

    it('returns false when the last row is missing the value', () => {
      expect(isLastKeyValueComplete([{ key: 'a', value: '' }])).toBe(false)
    })

    it('returns false when the last row is missing the key', () => {
      expect(isLastKeyValueComplete([{ key: '   ', value: '1' }])).toBe(false)
    })

    it('only inspects the last row', () => {
      expect(
        isLastKeyValueComplete([
          { key: '', value: '' },
          { key: 'b', value: '2' },
        ]),
      ).toBe(true)
    })

    it('handles undefined key/value', () => {
      expect(isLastKeyValueComplete([{}])).toBe(false)
    })
  })

  describe('isLastStringEntryComplete', () => {
    it('returns true for an empty list', () => {
      expect(isLastStringEntryComplete([])).toBe(true)
    })

    it('returns true when the last entry is non-empty', () => {
      expect(isLastStringEntryComplete(['value'])).toBe(true)
    })

    it('returns false when the last entry is blank', () => {
      expect(isLastStringEntryComplete(['  '])).toBe(false)
      expect(isLastStringEntryComplete([''])).toBe(false)
    })

    it('only inspects the last entry', () => {
      expect(isLastStringEntryComplete(['', 'ok'])).toBe(true)
    })
  })

  describe('isLastMetadataServerComplete', () => {
    it('returns true for an empty list', () => {
      expect(isLastMetadataServerComplete([])).toBe(true)
    })

    it('returns true when the last server has url and rootCert', () => {
      expect(isLastMetadataServerComplete([{ url: 'https://mds', rootCert: 'cert' }])).toBe(true)
    })

    it('returns false when the last server is missing rootCert', () => {
      expect(isLastMetadataServerComplete([{ url: 'https://mds', rootCert: '' }])).toBe(false)
    })

    it('returns false when the last server is missing url', () => {
      expect(isLastMetadataServerComplete([{ url: '', rootCert: 'cert' }])).toBe(false)
    })

    it('handles undefined fields', () => {
      expect(isLastMetadataServerComplete([{}])).toBe(false)
    })
  })

  describe('validationSchema', () => {
    it('exposes the dynamic and static config schemas', () => {
      expect(validationSchema.dynamicConfigValidationSchema).toBeDefined()
      expect(validationSchema.staticConfigValidationSchema).toBeDefined()
    })

    it('rejects a dynamic config missing required fields', async () => {
      await expect(validationSchema.dynamicConfigValidationSchema.validate({})).rejects.toBeTruthy()
    })

    it('accepts a valid dynamic config', async () => {
      const valid = {
        issuer: 'https://issuer',
        baseEndpoint: 'https://issuer/fido2',
        cleanServiceInterval: 60,
        cleanServiceBatchChunkSize: 100,
        useLocalCache: true,
        disableJdkLogger: false,
        loggingLevel: 'INFO',
        loggingLayout: 'text',
        metricReporterEnabled: true,
        metricReporterInterval: 300,
        metricReporterKeepDataDays: 15,
        fido2MetricsEnabled: true,
        fido2MetricsRetentionDays: 30,
        fido2DeviceInfoCollection: true,
        fido2ErrorCategorization: true,
        fido2PerformanceMetrics: true,
      }
      await expect(
        validationSchema.dynamicConfigValidationSchema.validate(valid),
      ).resolves.toBeTruthy()
    })

    it('rejects a dynamic config with a non-numeric interval', async () => {
      await expect(
        validationSchema.dynamicConfigValidationSchema.validateAt('cleanServiceInterval', {
          cleanServiceInterval: 'not-a-number',
        }),
      ).rejects.toBeTruthy()
    })

    it('rejects a static config with an invalid attestation mode', async () => {
      await expect(
        validationSchema.staticConfigValidationSchema.validateAt('attestationMode', {
          attestationMode: 'INVALID_MODE',
        }),
      ).rejects.toBeTruthy()
    })

    it('rejects a static config requestedParties row with empty key/value', async () => {
      await expect(
        validationSchema.staticConfigValidationSchema.validateAt('requestedParties', {
          requestedParties: [{ key: '', value: '' }],
        }),
      ).rejects.toBeTruthy()
    })
  })
})
