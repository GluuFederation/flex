import {
  getErrorMessage,
  transformAcrMappingsToTableData,
  buildAcrMappingPayload,
  buildAcrMappingDeletePayload,
  prepareMappingsForUpdate,
  prepareMappingsForDelete,
  toActionData,
} from 'Plugins/auth-server/components/Authentication/AgamaFlows/helper/utils'

describe('getErrorMessage', () => {
  it('reads the message from an Error instance', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom')
  })

  it('uses the fallback for an Error with no message', () => {
    expect(getErrorMessage(new Error(''), 'fallback')).toBe('fallback')
  })

  it('reads a message off a plain error-like object', () => {
    expect(getErrorMessage({ message: 'plain error' })).toBe('plain error')
  })

  it('uses the fallback when there is no message at all', () => {
    expect(getErrorMessage({}, 'default')).toBe('default')
  })
})

describe('transformAcrMappingsToTableData', () => {
  it('returns an empty array when no mappings are provided', () => {
    expect(transformAcrMappingsToTableData()).toEqual([])
  })

  it('maps each entry to a mapping/source row', () => {
    expect(transformAcrMappingsToTableData({ acr1: 'flow1', acr2: 'flow2' })).toEqual([
      { mapping: 'acr1', source: 'flow1' },
      { mapping: 'acr2', source: 'flow2' },
    ])
  })
})

describe('buildAcrMappingPayload', () => {
  it('uses an add op when there are no existing mappings', () => {
    expect(buildAcrMappingPayload({ acr1: 'flow1' })).toEqual({
      requestBody: [{ path: '/acrMappings', value: { acr1: 'flow1' }, op: 'add' }],
    })
  })

  it('uses a replace op when existing mappings are present', () => {
    expect(buildAcrMappingPayload({ acr1: 'flow1' }, { acr0: 'flow0' })).toEqual({
      requestBody: [{ path: '/acrMappings', value: { acr1: 'flow1' }, op: 'replace' }],
    })
  })
})

describe('buildAcrMappingDeletePayload', () => {
  it('emits a remove op when clearing the last mapping', () => {
    expect(buildAcrMappingDeletePayload({}, { acr0: 'flow0' })).toEqual({
      requestBody: [{ path: '/acrMappings', op: 'remove' }],
    })
  })

  it('emits a replace op when mappings remain and existing mappings were present', () => {
    expect(buildAcrMappingDeletePayload({ acr1: 'flow1' }, { acr0: 'flow0' })).toEqual({
      requestBody: [{ path: '/acrMappings', value: { acr1: 'flow1' }, op: 'replace' }],
    })
  })

  it('emits an add op when mappings remain and there were no existing mappings', () => {
    expect(buildAcrMappingDeletePayload({ acr1: 'flow1' })).toEqual({
      requestBody: [{ path: '/acrMappings', value: { acr1: 'flow1' }, op: 'add' }],
    })
  })
})

describe('prepareMappingsForUpdate', () => {
  it('adds a new mapping without mutating the input', () => {
    const current = { acr1: 'flow1' }
    const result = prepareMappingsForUpdate(current, { mapping: 'acr2', source: 'flow2' }, false)
    expect(result).toEqual({ acr1: 'flow1', acr2: 'flow2' })
    expect(current).toEqual({ acr1: 'flow1' })
  })

  it('renames a key on edit when the mapping name changed', () => {
    const result = prepareMappingsForUpdate(
      { old: 'flow1' },
      { mapping: 'new', source: 'flow1' },
      true,
      'old',
    )
    expect(result).toEqual({ new: 'flow1' })
  })

  it('keeps the key on edit when the mapping name is unchanged', () => {
    const result = prepareMappingsForUpdate(
      { acr1: 'flow1' },
      { mapping: 'acr1', source: 'flow2' },
      true,
      'acr1',
    )
    expect(result).toEqual({ acr1: 'flow2' })
  })
})

describe('prepareMappingsForDelete', () => {
  it('removes the target key without mutating the input', () => {
    const current = { acr1: 'flow1', acr2: 'flow2' }
    expect(prepareMappingsForDelete(current, 'acr1')).toEqual({ acr2: 'flow2' })
    expect(current).toEqual({ acr1: 'flow1', acr2: 'flow2' })
  })
})

describe('toActionData', () => {
  it('lifts the request body onto an action data object', () => {
    const body = [{ path: '/acrMappings', op: 'add' as const, value: { acr1: 'flow1' } }]
    expect(toActionData({ requestBody: body })).toEqual({ requestBody: body })
  })
})
