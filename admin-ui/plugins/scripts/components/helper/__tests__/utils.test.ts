import type { TFunction } from 'i18next'
import {
  getApiErrorDetail,
  getModuleProperty,
  transformToFormValues,
  buildChangedFieldOperations,
} from 'Plugins/scripts/components/helper/utils'
import type { FormValues } from 'Plugins/scripts/components/types/forms'
import type { ModuleProperty } from 'Plugins/scripts/components/types/customScript'

const t = ((key: string) => key) as TFunction

describe('getApiErrorDetail', () => {
  it('returns an empty string for a nullish error', () => {
    expect(getApiErrorDetail(null)).toBe('')
    expect(getApiErrorDetail(undefined)).toBe('')
  })

  it('returns a string error verbatim', () => {
    expect(getApiErrorDetail('bad thing')).toBe('bad thing')
  })

  it('reads a string response body', () => {
    expect(getApiErrorDetail({ response: { data: 'server error' } })).toBe('server error')
  })

  it('reads a message off a structured response body', () => {
    expect(getApiErrorDetail({ response: { data: { message: 'structured' } } })).toBe('structured')
  })

  it('falls back to the error message', () => {
    expect(getApiErrorDetail(new Error('plain'))).toBe('plain')
  })
})

describe('getModuleProperty', () => {
  it('returns the matching value2 for a key', () => {
    expect(getModuleProperty('usage_type', [{ value1: 'usage_type', value2: 'interactive' }])).toBe(
      'interactive',
    )
  })

  it('returns undefined when the key is absent', () => {
    expect(getModuleProperty('missing', [{ value1: 'other', value2: 'x' }])).toBeUndefined()
  })

  it('returns undefined when there are no properties', () => {
    expect(getModuleProperty('usage_type')).toBeUndefined()
  })
})

describe('transformToFormValues', () => {
  it('fills defaults for a minimal item', () => {
    const result = transformToFormValues({ name: 'my_script' })
    expect(result).toMatchObject({
      name: 'my_script',
      description: '',
      scriptType: '',
      programmingLanguage: 'python',
      level: 1,
      script: '',
      aliases: [],
      enabled: true,
      action_message: '',
    })
    expect(result.moduleProperties).toEqual([])
    expect(result.configurationProperties).toEqual([])
  })

  it('normalizes key/value properties, trimming whitespace', () => {
    // normalizeProperty also accepts the legacy key/value shape; cast the raw
    // input to the declared moduleProperties element type to exercise it.
    const result = transformToFormValues({
      name: 's',
      moduleProperties: [{ key: ' k ', value: ' v ' } as object as ModuleProperty],
    })
    expect(result.moduleProperties).toEqual([{ value1: 'k', value2: 'v' }])
  })

  it('preserves an explicit enabled=false', () => {
    expect(transformToFormValues({ name: 's', enabled: false }).enabled).toBe(false)
  })
})

describe('buildChangedFieldOperations', () => {
  const base: FormValues = {
    name: 'orig',
    description: '',
    scriptType: 'type-a',
    programmingLanguage: 'python',
    level: 1,
    script: 'print(1)',
    aliases: [],
    moduleProperties: [],
    configurationProperties: [],
    enabled: true,
    action_message: '',
  }

  it('returns no operations when nothing changed', () => {
    expect(buildChangedFieldOperations(base, { ...base }, t)).toEqual([])
  })

  it('records a changed simple field', () => {
    const ops = buildChangedFieldOperations(base, { ...base, name: 'updated' }, t)
    expect(ops).toContainEqual({ path: 'fields.name', value: 'updated' })
  })

  it('records added and removed module properties', () => {
    const current = { ...base, moduleProperties: [{ value1: 'usage_type', value2: 'interactive' }] }
    const ops = buildChangedFieldOperations(base, current, t)
    expect(ops).toContainEqual({
      path: 'fields.module_properties [usage_type]',
      value: 'interactive',
    })
  })

  it('truncates a long changed script preview', () => {
    const longScript = 'x'.repeat(80)
    const ops = buildChangedFieldOperations(base, { ...base, script: longScript }, t)
    const scriptOp = ops.find((op) => op.path === 'fields.script')
    expect(scriptOp?.value).toMatch(/\.\.\.$/)
    expect(String(scriptOp?.value).length).toBeLessThanOrEqual(43)
  })
})
