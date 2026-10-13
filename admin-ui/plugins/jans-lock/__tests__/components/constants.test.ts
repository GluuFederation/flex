import { JANS_LOCK_SECTIONS } from 'Plugins/jans-lock/components/constants'
import { LOCK_FIELD_SPECS } from 'Plugins/jans-lock/helper/constants'
import type { FieldType } from 'Plugins/jans-lock/types'

const VALID_TYPES: FieldType[] = ['text', 'number', 'select', 'toggle', 'password']
const allFields = JANS_LOCK_SECTIONS.flatMap(({ fields }) => fields)

describe('JANS_LOCK_SECTIONS', () => {
  it('renders every field spec exactly once', () => {
    const rendered = allFields.map(({ name }) => name).sort()
    const specs = LOCK_FIELD_SPECS.map(({ path }) => path).sort()
    expect(rendered).toEqual(specs)
  })

  it.each(allFields)('$name has a valid type and label', (config) => {
    expect(VALID_TYPES).toContain(config.type)
    expect(config.label).toMatch(/^fields\./)
  })

  it.each(allFields.filter(({ type }) => type === 'select'))(
    '$name has options',
    ({ selectOptions }) => {
      expect(selectOptions?.length).toBeGreaterThan(0)
    },
  )

  it('renders the client password as a read-only password field', () => {
    const password = allFields.find(({ name }) => name === 'clientPassword')
    expect(password).toMatchObject({ type: 'password', readOnly: true })
  })

  it('gates nested sections on the server returning them', () => {
    const requires = Object.fromEntries(
      JANS_LOCK_SECTIONS.map(({ id, requires }) => [id, requires]),
    )
    expect(requires).toMatchObject({
      cedarling: 'cedarlingConfiguration',
      grpc: 'grpcConfiguration',
      trace: 'traceConfiguration',
    })
  })

  it('edits policy sources and TRACE bindings as lists', () => {
    const lists = JANS_LOCK_SECTIONS.flatMap(({ list }) => (list ? [list.name] : []))
    expect(lists).toEqual([
      'cedarlingConfiguration.policySources',
      'traceConfiguration.clientDomainBindings',
    ])
  })
})
