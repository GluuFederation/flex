import * as Yup from 'yup'
import type { TFunction } from 'i18next'
import type { LockSections } from '../types'
import { jansLockConstants } from './constants'

const EVIDENCE_DOMAIN_ID_PATTERN = /^[A-Za-z0-9._:-]{1,64}$/

const isValidUrl = (value: string | undefined): boolean => {
  if (!value?.trim()) return true
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const emptyStringToNull = (value: number | null, original: string | number) =>
  original === '' ? null : value

const ALL_SECTIONS: LockSections = {
  cedarlingConfiguration: true,
  grpcConfiguration: true,
  traceConfiguration: true,
}

export const getLockValidationSchema = (t: TFunction, sections: LockSections = ALL_SECTIONS) => {
  const integer = (min?: number, max?: number) => {
    const schema = Yup.number()
      .transform(emptyStringToNull)
      .nullable()
      .required(t('messages.lock_field_required'))
      .typeError(t('messages.lock_field_integer'))
      .integer(t('messages.lock_field_integer'))
    const atLeast =
      min === undefined ? schema : schema.min(min, t('messages.lock_field_min', { min }))
    return max === undefined ? atLeast : atLeast.max(max, t('messages.lock_field_max', { max }))
  }
  const url = () => Yup.string().test('valid-url', t('messages.lock_url_invalid'), isValidUrl)
  const required = () => Yup.string().trim().required(t('messages.lock_field_required'))
  const requiredUrl = () => required().test('valid-url', t('messages.lock_url_invalid'), isValidUrl)
  const requiredWhen = (key: string, is: string | boolean) =>
    Yup.string().when(key, {
      is,
      then: (schema) => schema.trim().required(t('messages.lock_field_required')),
    })
  const domainId = () =>
    Yup.string()
      .trim()
      .matches(EVIDENCE_DOMAIN_ID_PATTERN, {
        message: t('messages.lock_trace_domain_id_invalid'),
        excludeEmptyString: true,
      })

  const cedarling = Yup.object({
    externalPolicyStoreUri: url(),
    maxEntries: integer(0),
    policySources: Yup.array().of(
      Yup.object({
        enabled: Yup.boolean(),
        policyStoreUri: requiredWhen('enabled', true).test(
          'valid-url',
          t('messages.lock_url_invalid'),
          isValidUrl,
        ),
      }),
    ),
  })

  const grpc = Yup.object({
    serverMode: Yup.string(),
    grpcPort: integer(1, jansLockConstants.MAX_PORT),
    tlsCertChainFilePath: requiredWhen('serverMode', 'tls_server'),
    tlsPrivateKeyFilePath: requiredWhen('serverMode', 'tls_server'),
  })

  const trace = Yup.object({
    defaultEvidenceDomainId: domainId(),
    latenessThresholdSeconds: integer(1),
    maxRequestBytes: integer(1),
    maxJsonDepth: integer(1),
    maxStringLength: integer(1),
    maxArrayLength: integer(1),
    maxObjectMembers: integer(1),
    receiptAllocationRetryLimit: integer(1),
    receiptRepairIntervalSeconds: integer(1),
    pendingReceiptTimeoutSeconds: integer(1),
    maxBulkRecords: integer(1),
    maxBulkRequestBytes: integer(1),
    clientDomainBindings: Yup.array().of(
      Yup.object({
        clientId: required(),
        evidenceDomainId: domainId().required(t('messages.lock_field_required')),
      }),
    ),
  })

  return Yup.object({
    baseEndpoint: requiredUrl(),
    openIdIssuer: requiredUrl(),
    clientId: required(),
    statTimerIntervalInSeconds: integer(),
    metricReporterInterval: integer(0),
    metricReporterKeepDataDays: integer(0),
    cleanServiceInterval: integer(1),
    cleanServiceBatchChunkSize: integer(1),
    ...(sections.cedarlingConfiguration ? { cedarlingConfiguration: cedarling } : {}),
    ...(sections.grpcConfiguration ? { grpcConfiguration: grpc } : {}),
    ...(sections.traceConfiguration ? { traceConfiguration: trace } : {}),
  })
}
