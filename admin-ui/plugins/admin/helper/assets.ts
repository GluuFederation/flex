import type { AssetFormValues } from '../components/Assets/types/FormTypes'
import type { Document } from '../components/Assets/types/AssetApiTypes'

/** Normalize service from API (may be service, jansService, or jansModuleProperty[0]) */
export function getServiceFromAsset(
  asset: Document | Record<string, unknown> | null | undefined,
): string | undefined {
  if (!asset || typeof asset !== 'object') return undefined
  const rec = asset as Record<string, unknown>
  if (typeof rec.service === 'string' && rec.service) return rec.service
  if (typeof rec.jansService === 'string' && rec.jansService) return rec.jansService
  const arr = rec.jansModuleProperty
  if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'string') return arr[0]
  return undefined
}

function toDocumentValue(val: unknown, fallback: string): string | File | Blob | null {
  if (typeof val === 'string') return val
  if (val instanceof File || val instanceof Blob) return val
  return val != null ? String(val) : fallback
}

function toStringValue(val: unknown, fallback: string): string {
  return typeof val === 'string' ? val : val != null ? String(val) : fallback
}

export const buildAssetInitialValues = (
  asset?: Document | Record<string, unknown> | null,
): AssetFormValues => {
  const service = getServiceFromAsset(asset)
  const rec = asset as Record<string, unknown> | undefined
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
