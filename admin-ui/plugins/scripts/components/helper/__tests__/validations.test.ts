import type { TFunction } from 'i18next'
import { getCustomScriptValidationSchema } from 'Plugins/scripts/components/helper/validations'
import { DEFAULT_SCRIPT_TYPE } from '@/constants'

// The schema only uses t() to produce message strings; echo the key back so the
// assertions can match on message identity without pulling in the i18n bundle.
const t = ((key: string) => key) as TFunction

const schema = getCustomScriptValidationSchema(t)

const validBase = {
  name: 'my_script',
  description: '',
  scriptType: 'other_type',
  programmingLanguage: 'python',
  level: 1,
  script: 'print(1)',
  moduleProperties: [],
}

describe('getCustomScriptValidationSchema', () => {
  it('accepts a fully valid non-person script', async () => {
    await expect(schema.isValid(validBase)).resolves.toBe(true)
  })

  it('rejects a name shorter than 3 characters', async () => {
    await expect(schema.validate({ ...validBase, name: 'ab' })).rejects.toThrow(
      'messages.script_name_min',
    )
  })

  it('rejects a name with invalid characters', async () => {
    await expect(schema.validate({ ...validBase, name: 'bad name!' })).rejects.toThrow(
      'messages.script_name_pattern',
    )
  })

  it('requires the script type', async () => {
    await expect(schema.validate({ ...validBase, scriptType: '' })).rejects.toThrow(
      'messages.script_type_required',
    )
  })

  it('requires the programming language', async () => {
    // An empty string trips the min-length rule before the required rule.
    await expect(schema.validate({ ...validBase, programmingLanguage: '' })).rejects.toThrow(
      'messages.script_language_min',
    )
  })

  it('rejects a programming language shorter than 3 characters', async () => {
    await expect(schema.validate({ ...validBase, programmingLanguage: 'py' })).rejects.toThrow(
      'messages.script_language_min',
    )
  })

  it('rejects a negative level', async () => {
    await expect(schema.validate({ ...validBase, level: -1 })).rejects.toThrow(
      'messages.script_level_non_negative',
    )
  })

  it('requires the script body', async () => {
    await expect(schema.validate({ ...validBase, script: '' })).rejects.toThrow(
      'messages.script_code_required',
    )
  })

  describe('person authentication usage_type rules', () => {
    const personBase = { ...validBase, scriptType: DEFAULT_SCRIPT_TYPE }

    it('requires a usage_type module property', async () => {
      await expect(schema.validate({ ...personBase, moduleProperties: [] })).rejects.toThrow(
        'messages.script_usage_type_required',
      )
    })

    it('rejects a blank usage_type value', async () => {
      await expect(
        schema.validate({
          ...personBase,
          moduleProperties: [{ value1: 'usage_type', value2: '   ' }],
        }),
      ).rejects.toThrow('messages.script_usage_type_required')
    })

    it('rejects an unsupported usage_type value', async () => {
      await expect(
        schema.validate({
          ...personBase,
          moduleProperties: [{ value1: 'usage_type', value2: 'sometimes' }],
        }),
      ).rejects.toThrow('messages.script_usage_type_valid')
    })

    it('accepts a supported usage_type value', async () => {
      await expect(
        schema.isValid({
          ...personBase,
          moduleProperties: [{ value1: 'usage_type', value2: 'interactive' }],
        }),
      ).resolves.toBe(true)
    })
  })
})
