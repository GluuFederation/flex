import { getLoggingValidationSchema } from 'Plugins/auth-server/components/Logging/validations'
import type { TFunction } from 'i18next'

const t = ((key: string) => key) as TFunction
const loggingValidationSchema = getLoggingValidationSchema(t)

const validValues = {
  loggingLevel: 'INFO',
  loggingLayout: 'text',
  httpLoggingEnabled: false,
  disableJdkLogger: true,
  enabledOAuthAuditLogging: false,
}

describe('loggingValidationSchema', () => {
  it('accepts a fully valid logging config', async () => {
    await expect(loggingValidationSchema.isValid(validValues)).resolves.toBe(true)
  })

  it('accepts every supported logging level', async () => {
    for (const level of ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR']) {
      await expect(
        loggingValidationSchema.isValid({ ...validValues, loggingLevel: level }),
      ).resolves.toBe(true)
    }
  })

  it('accepts every supported logging layout', async () => {
    for (const layout of ['text', 'json']) {
      await expect(
        loggingValidationSchema.isValid({ ...validValues, loggingLayout: layout }),
      ).resolves.toBe(true)
    }
  })

  it('rejects an unknown logging level', async () => {
    await expect(
      loggingValidationSchema.validate({ ...validValues, loggingLevel: 'VERBOSE' }),
    ).rejects.toThrow('messages.logging_level_invalid')
  })

  it('rejects an unknown logging layout', async () => {
    await expect(
      loggingValidationSchema.validate({ ...validValues, loggingLayout: 'xml' }),
    ).rejects.toThrow('messages.logging_layout_invalid')
  })

  it('requires the logging level', async () => {
    const { loggingLevel, ...rest } = validValues
    void loggingLevel
    await expect(loggingValidationSchema.validate(rest)).rejects.toThrow(
      'messages.logging_level_required',
    )
  })

  it('requires the logging layout', async () => {
    const { loggingLayout, ...rest } = validValues
    void loggingLayout
    await expect(loggingValidationSchema.validate(rest)).rejects.toThrow(
      'messages.logging_layout_required',
    )
  })

  it('requires the boolean flags to be present', async () => {
    const { httpLoggingEnabled, ...rest } = validValues
    void httpLoggingEnabled
    await expect(loggingValidationSchema.isValid(rest)).resolves.toBe(false)
  })
})
