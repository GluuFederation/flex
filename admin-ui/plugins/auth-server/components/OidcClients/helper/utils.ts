import type { Client } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { formatDate } from '@/utils/dayjsUtils'
import type {
  ClientRow,
  ClientTokenRow,
  TokenSearchFilterField,
  TokenSearchPattern,
} from '../types'
import { TOKEN_CSV_FILENAME, TOKEN_CSV_MIME_TYPE, TOKEN_DATE_QUERY_FORMAT } from '../constants'

export const toClientJsonRecord = (
  value: Client | ClientRow | undefined,
): Record<string, JsonValue> => {
  if (!value) return {}
  return JSON.parse(JSON.stringify(value)) as Record<string, JsonValue>
}

export const buildClientTokenFieldValuePair = (
  clientInum: string,
  pattern: TokenSearchPattern,
  filterField: TokenSearchFilterField,
): string => {
  let query = `clnId=${clientInum}`
  if (pattern.dateAfter && pattern.dateBefore) {
    query += `,${filterField}>${formatDate(pattern.dateAfter, TOKEN_DATE_QUERY_FORMAT)}`
    query += `,${filterField}<${formatDate(pattern.dateBefore, TOKEN_DATE_QUERY_FORMAT)}`
  }
  return query
}

const TOKEN_CSV_KEYS: ReadonlyArray<keyof Omit<ClientTokenRow, 'attributes'>> = [
  'id',
  'tokenCode',
  'scope',
  'deletable',
  'grantType',
  'expirationDate',
  'creationDate',
  'tokenType',
]

export const convertTokensToCSV = (rows: ClientTokenRow[]): string => {
  if (!rows || rows.length === 0) return ''
  const header = TOKEN_CSV_KEYS.map((key) => key.replace(/-/g, ' ').toUpperCase()).join(',')
  const body = rows.map((row) =>
    TOKEN_CSV_KEYS.map((key) => {
      const value = row[key]
      return value != null ? String(value) : ''
    }).join(','),
  )
  return [header, ...body].join('\n')
}

export const getClientAttributeValue = <T extends JsonValue = JsonValue>(
  values: Record<string, unknown>,
  key: string,
  fallback?: T,
): T | undefined => {
  const attrs = values.attributes
  if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
    const value = (attrs as Record<string, JsonValue>)[key]
    if (value !== undefined) return value as T
  }
  return fallback
}

export const downloadClientTokensCSV = (csv: string): void => {
  if (!csv || typeof window === 'undefined') return
  const blob = new Blob([csv], { type: TOKEN_CSV_MIME_TYPE })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', TOKEN_CSV_FILENAME)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
