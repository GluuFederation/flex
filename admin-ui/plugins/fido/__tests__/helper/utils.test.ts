import type { TFunction } from 'i18next'
import {
  transformToFormValues,
  createFidoConfigPayload,
  getModifiedFields,
  buildChangedFieldOperations,
} from 'Plugins/fido/helper/utils'
import { fidoConstants } from 'Plugins/fido/helper/constants'
import type {
  DynamicConfigFormValues,
  StaticConfigFormValues,
  FidoFormValues,
} from 'Plugins/fido/types'

const t = ((key: string) => key) as TFunction

// The transforms accept API config objects; fixtures intentionally use raw
// strings (e.g. 'true', '') to exercise coercion, so they enter through a
// loosely-typed record cast to the parameter type.
type LooseConfig = Parameters<typeof transformToFormValues>[0]
const cfg = (value: Record<string, string | number | boolean | string[] | object[]>): LooseConfig =>
  value as object as LooseConfig

describe('transformToFormValues (dynamic)', () => {
  it('maps a dynamic config, coercing booleans and defaulting empties', () => {
    const result = transformToFormValues(
      cfg({
        issuer: 'https://issuer',
        useLocalCache: true,
        metricReporterEnabled: 'true',
        cleanServiceInterval: '',
      }),
      fidoConstants.DYNAMIC,
    ) as DynamicConfigFormValues
    expect(result.issuer).toBe('https://issuer')
    expect(result.useLocalCache).toBe(true)
    expect(result.metricReporterEnabled).toBe(true)
    expect(result.baseEndpoint).toBe('')
  })

  it('defaults to the dynamic shape when the type is unknown', () => {
    const result = transformToFormValues({ issuer: 'x' }) as DynamicConfigFormValues
    expect(result.issuer).toBe('x')
  })
})

describe('transformToFormValues (static)', () => {
  it('maps a static config, splitting rp origins and filtering hints', () => {
    const result = transformToFormValues(
      cfg({
        authenticatorCertsFolder: '/certs',
        userAutoEnrollment: 'true',
        rp: [{ id: 'rp1', origins: ['https://a', 'https://b'] }],
        hints: ['not-a-real-hint'],
      }),
      fidoConstants.STATIC,
    ) as StaticConfigFormValues
    expect(result.authenticatorCertsFolder).toBe('/certs')
    expect(result.userAutoEnrollment).toBe(true)
    expect(result.requestedParties).toEqual([{ key: 'rp1', value: 'https://a,https://b' }])
    // Unknown hints are dropped by arrayValidationWithSchema.
    expect(result.hints).toEqual([])
  })
})

describe('createFidoConfigPayload (dynamic)', () => {
  it('applies dynamic changes onto a cloned payload without mutating the source', () => {
    const source = { issuer: 'orig', fido2Configuration: {} }
    const data = transformToFormValues(source, fidoConstants.DYNAMIC) as DynamicConfigFormValues
    const result = createFidoConfigPayload({
      fidoConfiguration: source,
      data: { ...data, issuer: 'changed' },
      type: fidoConstants.DYNAMIC,
    })
    expect(result.data.issuer).toBe('changed')
    expect(source.issuer).toBe('orig')
  })
})

describe('createFidoConfigPayload (static)', () => {
  it('converts numeric string fields and writes fido2Configuration', () => {
    const source = { fido2Configuration: {} }
    const data = transformToFormValues(
      { fido2Configuration: {} } as never,
      fidoConstants.STATIC,
    ) as StaticConfigFormValues
    const result = createFidoConfigPayload({
      fidoConfiguration: source,
      data: { ...data, unfinishedRequestExpiration: '120' },
      type: fidoConstants.STATIC,
    })
    expect(result.data.fido2Configuration?.unfinishedRequestExpiration).toBe(120)
  })
})

describe('getModifiedFields', () => {
  it('returns only the fields that differ from the original config', () => {
    const original = { issuer: 'orig', baseEndpoint: 'base' }
    const current = transformToFormValues(
      original,
      fidoConstants.DYNAMIC,
    ) as DynamicConfigFormValues
    const modified = getModifiedFields(
      { ...current, issuer: 'changed' } as FidoFormValues,
      original,
      fidoConstants.DYNAMIC,
    )
    expect(modified).toEqual({ issuer: 'changed' })
  })
})

describe('buildChangedFieldOperations', () => {
  it('returns no operations when nothing changed', () => {
    const values = transformToFormValues(
      { issuer: 'x' },
      fidoConstants.DYNAMIC,
    ) as DynamicConfigFormValues
    expect(
      buildChangedFieldOperations(
        values as FidoFormValues,
        values as FidoFormValues,
        fidoConstants.DYNAMIC,
        t,
      ),
    ).toEqual([])
  })

  it('records a labelled operation for a changed field', () => {
    const initial = transformToFormValues(
      { issuer: 'x' },
      fidoConstants.DYNAMIC,
    ) as DynamicConfigFormValues
    const current = { ...initial, issuer: 'y' }
    const ops = buildChangedFieldOperations(
      initial as FidoFormValues,
      current as FidoFormValues,
      fidoConstants.DYNAMIC,
      t,
    )
    expect(ops).toHaveLength(1)
    expect(ops[0].value).toBe('y')
  })
})
