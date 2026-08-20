import type { AdminUIPolicyStore } from 'JansConfigApi'
import { POLICY_STORE_STATUS } from '@/constants/policyStore'

/**
 * Shape of `GET /admin-ui/security1/policyStore`.
 *
 * The feature-branch spec declares the response as `AdminUIPolicyStore[]` (so orval types it that
 * way) but the example alongside it returns a paged envelope. Until upstream settles on one, treat
 * either as valid — see `toPolicyStoreEntries`.
 */
export type PolicyStoreListEnvelope = {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: AdminUIPolicyStore[]
}

export type PolicyStoreListResponse = AdminUIPolicyStore[] | PolicyStoreListEnvelope

const BASE64_PADDING = '='

type MaybePolicyStoreListResponse = PolicyStoreListResponse | null | undefined

/** Reads the entry list out of either response shape. Never throws; returns [] on anything else. */
export const toPolicyStoreEntries = (
  payload: MaybePolicyStoreListResponse,
): AdminUIPolicyStore[] => {
  if (Array.isArray(payload)) {
    return payload
  }
  const entries = payload?.entries
  return Array.isArray(entries) ? entries : []
}

/**
 * Total number of stores on the server, for server-side pagination. Falls back to the length of
 * the current page when the response is a bare array with no envelope to read a total from.
 */
export const toPolicyStoreTotal = (payload: MaybePolicyStoreListResponse): number => {
  if (!Array.isArray(payload)) {
    const total = payload?.totalEntriesCount
    if (typeof total === 'number' && Number.isFinite(total)) {
      return total
    }
  }
  return toPolicyStoreEntries(payload).length
}

/**
 * The store Cedarling loads at sign-in. Exactly one row should carry `active`.
 *
 * Returns undefined rather than guessing when the page contains no active entry — which happens
 * if the result set is truncated by the server's default `limit`, or if a status filter is ignored.
 * Booting Cedarling from a deactivated store would silently hand the admin permissions from a
 * policy set someone explicitly turned off; undefined instead lets the caller fall through to the
 * legacy endpoint, which reports the genuinely active store.
 */
export const selectActivePolicyStore = (
  entries: readonly AdminUIPolicyStore[],
): AdminUIPolicyStore | undefined =>
  entries.find((entry) => entry.jansStatus === POLICY_STORE_STATUS.ACTIVE)

export const isActivePolicyStore = (entry: AdminUIPolicyStore): boolean =>
  entry.jansStatus === POLICY_STORE_STATUS.ACTIVE

// Explicitly ArrayBuffer-backed (not the wider ArrayBufferLike) so the result stays a valid
// BlobPart for the archive download.
export const base64ToUint8Array = (base64: string): Uint8Array<ArrayBuffer> => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(new ArrayBuffer(binaryString.length))
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

/**
 * Base64-encodes a `.cjar` for the JSON create payload. Uses FileReader rather than
 * `btoa(String.fromCharCode(...bytes))`, which overflows the call stack on archives of any size.
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read policy store file'))
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Unexpected policy store file encoding'))
        return
      }
      const separatorIndex = result.indexOf(',')
      resolve(separatorIndex === -1 ? result : result.slice(separatorIndex + 1))
    }
    reader.readAsDataURL(file)
  })

/** Decoded size of a base64 payload, so the history table can show an archive size. */
export const decodedByteLength = (base64: string | undefined): number => {
  if (!base64) {
    return 0
  }
  const normalized = base64.trim()
  if (normalized.length === 0) {
    return 0
  }
  let padding = 0
  if (normalized.endsWith(`${BASE64_PADDING}${BASE64_PADDING}`)) {
    padding = 2
  } else if (normalized.endsWith(BASE64_PADDING)) {
    padding = 1
  }
  return Math.max(0, Math.floor((normalized.length * 3) / 4) - padding)
}
