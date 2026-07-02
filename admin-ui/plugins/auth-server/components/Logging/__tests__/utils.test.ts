import {
  LOG_LEVELS,
  LOG_LAYOUTS,
  getLoggingInitialValues,
  getMergedValues,
  getChangedFields,
} from 'Plugins/auth-server/components/Logging/utils'
import type { LoggingConfigLike } from 'Plugins/auth-server/components/Logging/types/LoggingTypes'

describe('logging constants', () => {
  it('exposes the supported levels and layouts', () => {
    expect(LOG_LEVELS).toEqual(['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'])
    expect(LOG_LAYOUTS).toEqual(['text', 'json'])
  })
})

describe('getLoggingInitialValues', () => {
  it('returns first-choice defaults when no config is provided', () => {
    expect(getLoggingInitialValues()).toEqual({
      loggingLevel: 'TRACE',
      loggingLayout: 'text',
      httpLoggingEnabled: false,
      disableJdkLogger: false,
      enabledOAuthAuditLogging: false,
    })
  })

  it('returns the same defaults for null', () => {
    expect(getLoggingInitialValues(null)).toEqual(getLoggingInitialValues())
  })

  it('maps a valid config through, coercing truthy values to booleans', () => {
    // A truthy non-boolean (1) exercises the Boolean() coercion path; the field
    // is typed boolean | null, so the whole fixture is cast to the param type.
    const config = {
      loggingLevel: 'ERROR',
      loggingLayout: 'json',
      httpLoggingEnabled: 1,
      disableJdkLogger: true,
      enabledOAuthAuditLogging: false,
    } as object as LoggingConfigLike
    expect(getLoggingInitialValues(config)).toEqual({
      loggingLevel: 'ERROR',
      loggingLayout: 'json',
      httpLoggingEnabled: true,
      disableJdkLogger: true,
      enabledOAuthAuditLogging: false,
    })
  })

  it('falls back to defaults for invalid level/layout', () => {
    const values = getLoggingInitialValues({
      loggingLevel: 'VERBOSE',
      loggingLayout: 'xml',
      httpLoggingEnabled: false,
      disableJdkLogger: false,
      enabledOAuthAuditLogging: false,
    })
    expect(values.loggingLevel).toBe('TRACE')
    expect(values.loggingLayout).toBe('text')
  })
})

describe('getMergedValues', () => {
  it('overlays updated fields onto the original', () => {
    expect(getMergedValues({ a: 1, b: 2 }, { b: 3 })).toEqual({ a: 1, b: 3 })
  })
})

describe('getChangedFields', () => {
  it('reports only changed fields with old/new values', () => {
    expect(getChangedFields({ a: 1, b: 2 }, { a: 1, b: 5 })).toEqual({
      b: { oldValue: 2, newValue: 5 },
    })
  })

  it('ignores undefined new values', () => {
    const original = { a: 1 }
    const updated: { a: number } = { a: undefined as never }
    expect(getChangedFields(original, updated)).toEqual({})
  })

  it('returns an empty object when nothing changed', () => {
    expect(getChangedFields({ a: 1 }, { a: 1 })).toEqual({})
  })
})
