import type { AssetFormValues, Document } from '../components/Assets/types'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types'

const getServiceFromAsset = (
  asset:
    | Document
    | Record<string, string | number | boolean | object | null | undefined>
    | null
    | undefined,
): string | undefined => {
  if (!asset || typeof asset !== 'object') return undefined
  const rec = asset as Record<string, string | number | boolean | object | null | undefined>
  if (typeof rec.service === 'string' && rec.service) return rec.service
  if (typeof rec.jansService === 'string' && rec.jansService) return rec.jansService
  const arr = rec.jansModuleProperty
  if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string') return arr[0]
  return undefined
}

const toDocumentValue = (
  val: string | number | boolean | File | Blob | object | null | undefined,
  fallback: string,
): string | File | Blob | null => {
  if (typeof val === 'string') return val
  if (val instanceof File || val instanceof Blob) return val
  return val != null ? String(val) : fallback
}

const toStringValue = (
  val: string | number | boolean | object | null | undefined,
  fallback: string,
): string => (typeof val === 'string' ? val : val != null ? String(val) : fallback)

export const buildAssetInitialValues = (
  asset?: Document | Record<string, string | number | boolean | object | null | undefined> | null,
): AssetFormValues => {
  const service = getServiceFromAsset(asset)
  const rec = asset as
    Record<string, string | number | boolean | object | null | undefined> | undefined
  const doc = asset as Document | undefined
  const fileName = toStringValue(doc?.fileName ?? rec?.displayName ?? rec?.fileName, '')
  return {
    creationDate: doc?.creationDate ? String(doc.creationDate) : '',
    document: toDocumentValue(doc?.document ?? rec?.document ?? (fileName || ''), ''),
    fileName,
    enabled: Boolean(doc?.enabled ?? rec?.jansEnabled ?? rec?.enabled),
    description: toStringValue(doc?.description ?? rec?.description, ''),
    service: service ? [service] : [],
    inum: toStringValue(doc?.inum ?? rec?.inum, ''),
    dn: toStringValue(doc?.dn ?? rec?.dn, ''),
    baseDn: toStringValue(doc?.baseDn ?? rec?.baseDn, ''),
  }
}

const toOperationValue = (val: AssetFormValues['document']): string =>
  val instanceof File ? val.name : typeof val === 'string' ? val : ''

export const buildAssetCommitOperations = (
  initial: AssetFormValues,
  current: AssetFormValues,
  labels: {
    document: string
    fileName: string
    service: string
    description: string
    enabled: string
  },
): GluuCommitDialogOperation[] => {
  const operations: GluuCommitDialogOperation[] = []
  const currentDocument = toOperationValue(current.document)
  if (current.document instanceof File || currentDocument !== toOperationValue(initial.document)) {
    operations.push({ path: 'document', label: labels.document, value: currentDocument })
  }
  if (current.fileName !== initial.fileName) {
    operations.push({ path: 'fileName', label: labels.fileName, value: current.fileName })
  }
  const currentService = current.service[0] ?? ''
  if (currentService !== (initial.service[0] ?? '')) {
    operations.push({ path: 'service', label: labels.service, value: currentService })
  }
  if (current.description !== initial.description) {
    operations.push({ path: 'description', label: labels.description, value: current.description })
  }
  if (current.enabled !== initial.enabled) {
    operations.push({ path: 'enabled', label: labels.enabled, value: current.enabled })
  }
  return operations
}
