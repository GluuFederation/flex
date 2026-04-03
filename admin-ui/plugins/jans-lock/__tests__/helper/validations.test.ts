import i18next from 'i18next'
import { getLockValidationSchema } from 'Plugins/jans-lock/helper/validations'

const t = i18next.t.bind(i18next)

describe('getLockValidationSchema', () => {
  const schema = getLockValidationSchema(t)

  describe('cleanServiceInterval', () => {
    it('rejects empty value', async () => {
      await expect(
        schema.validateAt('cleanServiceInterval', { cleanServiceInterval: '' }),
      ).rejects.toThrow()
    })

    it('rejects non-integer value', async () => {
      await expect(
        schema.validateAt('cleanServiceInterval', { cleanServiceInterval: 1.5 }),
      ).rejects.toThrow()
    })

    it('rejects value less than 1', async () => {
      await expect(
        schema.validateAt('cleanServiceInterval', { cleanServiceInterval: 0 }),
      ).rejects.toThrow()
    })

    it('accepts valid integer >= 1', async () => {
      await expect(
        schema.validateAt('cleanServiceInterval', { cleanServiceInterval: 60 }),
      ).resolves.toBe(60)
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

    it('rejects non-integer', async () => {
      await expect(
        schema.validateAt('metricReporterInterval', { metricReporterInterval: 2.5 }),
      ).rejects.toThrow()
    })

    it('rejects value less than 1', async () => {
      await expect(
        schema.validateAt('metricReporterInterval', { metricReporterInterval: 0 }),
      ).rejects.toThrow()
    })

    it('accepts valid integer >= 1', async () => {
      await expect(
        schema.validateAt('metricReporterInterval', { metricReporterInterval: 300 }),
      ).resolves.toBe(300)
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

    it('rejects non-integer', async () => {
      await expect(
        schema.validateAt('metricReporterKeepDataDays', { metricReporterKeepDataDays: 1.5 }),
      ).rejects.toThrow()
    })

    it('accepts zero', async () => {
      await expect(
        schema.validateAt('metricReporterKeepDataDays', { metricReporterKeepDataDays: 0 }),
      ).resolves.toBe(0)
    })

    it('rejects negative value', async () => {
      await expect(
        schema.validateAt('metricReporterKeepDataDays', { metricReporterKeepDataDays: -1 }),
      ).rejects.toThrow()
    })

    it('accepts valid integer >= 0', async () => {
      await expect(
        schema.validateAt('metricReporterKeepDataDays', { metricReporterKeepDataDays: 15 }),
      ).resolves.toBe(15)
    })
  })

  describe('policiesJsonUris', () => {
    it('accepts empty value', async () => {
      await expect(
        schema.validateAt('policiesJsonUris', { policiesJsonUris: '' }),
      ).resolves.toBeDefined()
    })

    it('accepts valid http URL', async () => {
      await expect(
        schema.validateAt('policiesJsonUris', {
          policiesJsonUris: 'http://example.com/policy.json',
        }),
      ).resolves.toBeDefined()
    })

    it('accepts valid https URL', async () => {
      await expect(
        schema.validateAt('policiesJsonUris', {
          policiesJsonUris: 'https://example.com/policy.json',
        }),
      ).resolves.toBeDefined()
    })

    it('rejects invalid URL', async () => {
      await expect(
        schema.validateAt('policiesJsonUris', { policiesJsonUris: 'not-a-url' }),
      ).rejects.toThrow()
    })

    it('rejects ftp URL', async () => {
      await expect(
        schema.validateAt('policiesJsonUris', {
          policiesJsonUris: 'ftp://example.com/policy.json',
        }),
      ).rejects.toThrow()
    })
  })

  describe('policiesZipUris', () => {
    it('accepts empty value', async () => {
      await expect(
        schema.validateAt('policiesZipUris', { policiesZipUris: '' }),
      ).resolves.toBeDefined()
    })

    it('accepts valid https URL', async () => {
      await expect(
        schema.validateAt('policiesZipUris', {
          policiesZipUris: 'https://example.com/policy.zip',
        }),
      ).resolves.toBeDefined()
    })

    it('rejects invalid URL', async () => {
      await expect(
        schema.validateAt('policiesZipUris', { policiesZipUris: 'invalid' }),
      ).rejects.toThrow()
    })
  })
})
