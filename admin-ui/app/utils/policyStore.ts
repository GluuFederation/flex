import type { AdminUIPolicyStore } from 'JansConfigApi'
import { CJAR_EXTENSION, POLICY_STORE_STATUS } from '@/constants/policyStore'
import { REGEX_ARCHIVE_FILE_EXTENSION } from '@/utils/regex'

type PolicyStoreListEnvelope = {
  start?: number
  totalEntriesCount?: number
  entriesCount?: number
  entries?: AdminUIPolicyStore[]
}

export type PolicyStoreListResponse = AdminUIPolicyStore[] | PolicyStoreListEnvelope

const BASE64_PADDING = '='

type MaybePolicyStoreListResponse = PolicyStoreListResponse | null | undefined

export const toPolicyStoreEntries = (
  payload: MaybePolicyStoreListResponse,
): AdminUIPolicyStore[] => {
  if (Array.isArray(payload)) {
    return payload
  }
  const entries = payload?.entries
  return Array.isArray(entries) ? entries : []
}

export const toPolicyStoreTotal = (payload: MaybePolicyStoreListResponse): number => {
  if (!Array.isArray(payload)) {
    const total = payload?.totalEntriesCount
    if (typeof total === 'number' && Number.isFinite(total)) {
      return total
    }
  }
  return toPolicyStoreEntries(payload).length
}

export const selectActivePolicyStore = (
  entries: readonly AdminUIPolicyStore[],
): AdminUIPolicyStore | undefined =>
  entries.find((entry) => entry.jansStatus === POLICY_STORE_STATUS.ACTIVE)

export const isActivePolicyStore = (entry: AdminUIPolicyStore): boolean =>
  entry.jansStatus === POLICY_STORE_STATUS.ACTIVE

export const base64ToUint8Array = (base64: string): Uint8Array<ArrayBuffer> => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(new ArrayBuffer(binaryString.length))
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

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

export const buildArchiveDownloadName = (
  displayname: string | undefined,
  inum: string | undefined,
  now: Date,
): string => {
  const pad = (value: number) => String(value).padStart(2, '0')
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`
  const source = displayname?.trim() || inum || 'policy-store'
  const [, base, extension] = REGEX_ARCHIVE_FILE_EXTENSION.exec(source) ?? []
  return `${base || source}-${stamp}${extension || CJAR_EXTENSION}`
}
