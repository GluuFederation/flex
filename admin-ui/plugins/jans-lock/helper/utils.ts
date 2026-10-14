import { getIn } from 'formik'
import type { FormikProps } from 'formik'
import type { TFunction } from 'i18next'
import type { GluuCommitDialogOperation, JsonValue } from 'Routes/Apps/Gluu/types/index'
import type {
  JansLockConfigFormValues,
  LockConfig,
  LockFieldSpec,
  LockListKey,
  LockSections,
  PatchOperation,
  PolicySourceFormValues,
  TraceBindingFormValues,
} from '../types'
import { LOCK_FIELD_SPECS, LOCK_LIST_SPECS } from './constants'

type JsonRecord = Record<string, JsonValue | undefined>
type LockValue = JsonValue | object | undefined
type FormValue = JansLockConfigFormValues[keyof JansLockConfigFormValues]

const isRecord = (value: LockValue): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const getPath = (source: LockValue, path: string): LockValue =>
  path
    .split('.')
    .reduce<LockValue>((current, key) => (isRecord(current) ? current[key] : undefined), source)

const setPath = (target: JsonRecord, path: string, value: JsonValue): void => {
  const keys = path.split('.')
  const last = keys.pop() as string
  const parent = keys.reduce<JsonRecord>((current, key) => {
    if (!isRecord(current[key])) current[key] = {}
    return current[key] as JsonRecord
  }, target)
  parent[last] = value
}

const toPointer = (path: string): string => `/${path.split('.').join('/')}`

const splitCsv = (value: LockValue): string[] => {
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : []
  return items.map((item) => String(item).trim()).filter(Boolean)
}

const asString = (value: LockValue): string =>
  typeof value === 'string' ? value : value == null ? '' : String(value)

const asBoolean = (value: LockValue, fallback = false): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return fallback
}

const asNumberInput = (value: LockValue): number | '' =>
  typeof value === 'number' && Number.isFinite(value) ? value : ''

export const getLockSections = (config: LockConfig = {}): LockSections => ({
  cedarlingConfiguration: isRecord(config.cedarlingConfiguration),
  grpcConfiguration: isRecord(config.grpcConfiguration),
  traceConfiguration: isRecord(config.traceConfiguration),
})

const toFormValue = (spec: LockFieldSpec, value: LockValue): FormValue => {
  switch (spec.kind) {
    case 'boolean':
      return asBoolean(value, spec.defaultValue === true)
    case 'number':
      return asNumberInput(value)
    case 'csv':
      return splitCsv(value).join(', ')
    default:
      return value == null && typeof spec.defaultValue === 'string'
        ? spec.defaultValue
        : asString(value)
  }
}

const toPolicySourceForm = (source: LockValue): PolicySourceFormValues => ({
  enabled: asBoolean(getPath(source, 'enabled'), true),
  policyStoreUri: asString(getPath(source, 'policyStoreUri')).trim(),
  authorizationToken: asString(getPath(source, 'authorizationToken')).trim(),
})

const toTraceBindingForm = (binding: LockValue): TraceBindingFormValues => ({
  clientId: asString(getPath(binding, 'clientId')).trim(),
  evidenceDomainId: asString(getPath(binding, 'evidenceDomainId')).trim(),
  allowedProducerIds: splitCsv(getPath(binding, 'allowedProducerIds')).join(', '),
})

const toArray = (value: LockValue): LockValue[] => (Array.isArray(value) ? value : [])

export const transformToFormValues = (config: LockConfig = {}): JansLockConfigFormValues => {
  const values: JsonRecord = {}
  LOCK_FIELD_SPECS.forEach((spec) => {
    setPath(values, spec.path, toFormValue(spec, getPath(config, spec.path)) as JsonValue)
  })
  setPath(
    values,
    'cedarlingConfiguration.policySources',
    toArray(config.cedarlingConfiguration?.policySources).map(toPolicySourceForm),
  )
  setPath(
    values,
    'traceConfiguration.clientDomainBindings',
    toArray(config.traceConfiguration?.clientDomainBindings).map(toTraceBindingForm),
  )
  return values as object as JansLockConfigFormValues
}

const toServerValue = (spec: LockFieldSpec, value: LockValue): JsonValue | undefined => {
  switch (spec.kind) {
    case 'boolean':
      return Boolean(value)
    case 'number':
      return value === '' || value == null ? undefined : Number(value)
    case 'csv':
      return splitCsv(value)
    default:
      return asString(value).trim()
  }
}

const toComparable = (spec: LockFieldSpec, value: LockValue): JsonValue => {
  const resolved = value ?? spec.defaultValue
  switch (spec.kind) {
    case 'boolean':
      return asBoolean(resolved)
    case 'number':
      return typeof resolved === 'number' ? resolved : null
    case 'csv':
      return splitCsv(resolved)
    default:
      return asString(resolved).trim()
  }
}

const LIST_NORMALIZERS: Record<LockListKey, (items: LockValue[]) => JsonValue> = {
  'cedarlingConfiguration.policySources': (items) => items.map(toPolicySourceForm),
  'traceConfiguration.clientDomainBindings': (items) =>
    items.map((item) => {
      const binding = toTraceBindingForm(item)
      return { ...binding, allowedProducerIds: splitCsv(binding.allowedProducerIds) }
    }),
}

const isSameValue = (previous: JsonValue, next: JsonValue): boolean =>
  previous === next || JSON.stringify(previous) === JSON.stringify(next)

const buildOperation = (config: LockConfig, path: string, value: JsonValue): PatchOperation => {
  const keys = path.split('.')
  const key = keys.pop() as string
  const parent = keys.length ? getPath(config, keys.join('.')) : config
  const exists = isRecord(parent) && Object.prototype.hasOwnProperty.call(parent, key)
  return { op: exists ? 'replace' : 'add', path: toPointer(path), value }
}

export const createPatchOperations = (
  formValues: JansLockConfigFormValues,
  originalConfig: LockConfig = {},
): PatchOperation[] => {
  const sections = getLockSections(originalConfig)
  const operations: PatchOperation[] = []

  LOCK_FIELD_SPECS.forEach((spec) => {
    if (spec.readOnly || (spec.section && !sections[spec.section])) return
    const next = toServerValue(spec, getPath(formValues, spec.path))
    if (next === undefined) return
    const previous = toComparable(spec, getPath(originalConfig, spec.path))
    if (isSameValue(previous, next)) return
    operations.push(buildOperation(originalConfig, spec.path, next))
  })

  LOCK_LIST_SPECS.forEach(({ path, section }) => {
    if (!sections[section]) return
    const normalize = LIST_NORMALIZERS[path]
    const next = normalize(toArray(getPath(formValues, path)))
    const previous = normalize(toArray(getPath(originalConfig, path)))
    if (isSameValue(previous, next)) return
    operations.push(buildOperation(originalConfig, path, next))
  })

  return operations
}

const LABELS_BY_POINTER = new Map<string, string>(
  [...LOCK_FIELD_SPECS, ...LOCK_LIST_SPECS].map(({ path, label }) => [toPointer(path), label]),
)

export const buildLockChangedFieldOperations = (
  patches: PatchOperation[],
  t: TFunction,
): GluuCommitDialogOperation[] =>
  patches.map(({ path, value }) => {
    const label = LABELS_BY_POINTER.get(path)
    return { path: label ? t(label) : path, value }
  })

export const hasSameFieldState = (
  prev: FormikProps<JansLockConfigFormValues>,
  next: FormikProps<JansLockConfigFormValues>,
  name: string,
): boolean =>
  getIn(prev.values, name) === getIn(next.values, name) &&
  getIn(prev.errors, name) === getIn(next.errors, name)
