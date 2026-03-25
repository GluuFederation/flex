import i18next from 'i18next'
import { getScimConfigurationSchema } from 'Plugins/scim/helper/validations'

const t = i18next.t.bind(i18next)

describe('getScimConfigurationSchema', () => {
  const schema = getScimConfigurationSchema(t)

  describe('applicationUrl', () => {
    it('accepts empty value', async () => {
      await expect(
        schema.validateAt('applicationUrl', { applicationUrl: '' }),
      ).resolves.toBeDefined()
    })

    it('accepts valid http URL', async () => {
      await expect(
        schema.validateAt('applicationUrl', { applicationUrl: 'http://example.com' }),
      ).resolves.toBeDefined()
    })

    it('accepts valid https URL', async () => {
      await expect(
        schema.validateAt('applicationUrl', { applicationUrl: 'https://example.com' }),
      ).resolves.toBeDefined()
    })

    it('rejects invalid URL', async () => {
      await expect(
        schema.validateAt('applicationUrl', { applicationUrl: 'not-a-url' }),
      ).rejects.toThrow()
    })

    it('rejects ftp URL', async () => {
      await expect(
        schema.validateAt('applicationUrl', { applicationUrl: 'ftp://example.com' }),
      ).rejects.toThrow()
    })
  })

  describe('protectionMode', () => {
    it('accepts OAUTH', async () => {
      await expect(schema.validateAt('protectionMode', { protectionMode: 'OAUTH' })).resolves.toBe(
        'OAUTH',
      )
    })

    it('accepts BYPASS', async () => {
      await expect(schema.validateAt('protectionMode', { protectionMode: 'BYPASS' })).resolves.toBe(
        'BYPASS',
      )
    })

    it('accepts empty string', async () => {
      await expect(
        schema.validateAt('protectionMode', { protectionMode: '' }),
      ).resolves.toBeDefined()
    })

    it('rejects invalid value', async () => {
      await expect(
        schema.validateAt('protectionMode', { protectionMode: 'INVALID' }),
      ).rejects.toThrow()
    })
  })

  describe('maxCount', () => {
    it('accepts empty value (optional)', async () => {
      await expect(schema.validateAt('maxCount', { maxCount: '' })).resolves.toBeNull()
    })

    it('accepts null value (optional)', async () => {
      await expect(schema.validateAt('maxCount', { maxCount: null })).resolves.toBeNull()
    })

    it('accepts valid positive integer', async () => {
      await expect(schema.validateAt('maxCount', { maxCount: 200 })).resolves.toBe(200)
    })

    it('rejects non-integer', async () => {
      await expect(schema.validateAt('maxCount', { maxCount: 1.5 })).rejects.toThrow()
    })

    it('rejects zero', async () => {
      await expect(schema.validateAt('maxCount', { maxCount: 0 })).rejects.toThrow()
    })

    it('rejects negative value', async () => {
      await expect(schema.validateAt('maxCount', { maxCount: -1 })).rejects.toThrow()
    })

    it('rejects value exceeding max', async () => {
      await expect(schema.validateAt('maxCount', { maxCount: 2147483648 })).rejects.toThrow()
    })
  })

  describe('bulkMaxOperations', () => {
    it('accepts empty value (optional)', async () => {
      await expect(
        schema.validateAt('bulkMaxOperations', { bulkMaxOperations: '' }),
      ).resolves.toBeNull()
    })

    it('accepts null value (optional)', async () => {
      await expect(
        schema.validateAt('bulkMaxOperations', { bulkMaxOperations: null }),
      ).resolves.toBeNull()
    })

    it('accepts valid positive integer', async () => {
      await expect(schema.validateAt('bulkMaxOperations', { bulkMaxOperations: 30 })).resolves.toBe(
        30,
      )
    })

    it('rejects value exceeding max', async () => {
      await expect(
        schema.validateAt('bulkMaxOperations', { bulkMaxOperations: 100001 }),
      ).rejects.toThrow()
    })
  })

  describe('bulkMaxPayloadSize', () => {
    it('accepts empty value (optional)', async () => {
      await expect(
        schema.validateAt('bulkMaxPayloadSize', { bulkMaxPayloadSize: '' }),
      ).resolves.toBeNull()
    })

    it('accepts null value (optional)', async () => {
      await expect(
        schema.validateAt('bulkMaxPayloadSize', { bulkMaxPayloadSize: null }),
      ).resolves.toBeNull()
    })

    it('accepts valid positive integer', async () => {
      await expect(
        schema.validateAt('bulkMaxPayloadSize', { bulkMaxPayloadSize: 3145728 }),
      ).resolves.toBe(3145728)
    })

    it('rejects value exceeding max', async () => {
      await expect(
        schema.validateAt('bulkMaxPayloadSize', { bulkMaxPayloadSize: 104857601 }),
      ).rejects.toThrow()
    })
  })

  describe('metricReporterInterval', () => {
    it('accepts empty value (optional)', async () => {
      await expect(
        schema.validateAt('metricReporterInterval', { metricReporterInterval: '' }),
      ).resolves.toBeNull()
    })

    it('accepts null value (optional)', async () => {
      await expect(
        schema.validateAt('metricReporterInterval', { metricReporterInterval: null }),
      ).resolves.toBeNull()
    })

    it('accepts valid positive integer', async () => {
      await expect(
        schema.validateAt('metricReporterInterval', { metricReporterInterval: 300 }),
      ).resolves.toBe(300)
    })

    it('rejects value exceeding max', async () => {
      await expect(
        schema.validateAt('metricReporterInterval', { metricReporterInterval: 86401 }),
      ).rejects.toThrow()
    })
  })

  describe('metricReporterKeepDataDays', () => {
    it('accepts empty value (optional)', async () => {
      await expect(
        schema.validateAt('metricReporterKeepDataDays', { metricReporterKeepDataDays: '' }),
      ).resolves.toBeNull()
    })

    it('accepts null value (optional)', async () => {
      await expect(
        schema.validateAt('metricReporterKeepDataDays', { metricReporterKeepDataDays: null }),
      ).resolves.toBeNull()
    })

    it('accepts valid positive integer', async () => {
      await expect(
        schema.validateAt('metricReporterKeepDataDays', { metricReporterKeepDataDays: 15 }),
      ).resolves.toBe(15)
    })

    it('rejects value exceeding max', async () => {
      await expect(
        schema.validateAt('metricReporterKeepDataDays', { metricReporterKeepDataDays: 3651 }),
      ).rejects.toThrow()
    })
  })
})
