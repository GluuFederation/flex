import type { ExtendedClient, ClientFormValues, ModifiedFields } from '../types'
import { EMPTY_CLIENT } from '../types'

export function buildClientInitialValues(client: Partial<ExtendedClient>): ClientFormValues {
  const merged = {
    ...EMPTY_CLIENT,
    ...client,
    attributes: {
      ...EMPTY_CLIENT.attributes,
      ...client.attributes,
    },
    expirable: Boolean(client.expirationDate),
  }

  return merged as ClientFormValues
}

export function buildClientPayload(values: ClientFormValues): ExtendedClient {
  const payload: ExtendedClient = { ...values }

  if (!payload.expirable) {
    delete payload.expirationDate
  }
  delete payload.expirable

  if (typeof payload.accessTokenAsJwt === 'string') {
    payload.accessTokenAsJwt = payload.accessTokenAsJwt === 'true'
  }
  if (typeof payload.rptAsJwt === 'string') {
    payload.rptAsJwt = payload.rptAsJwt === 'true'
  }

  return payload
}

export function hasFormChanges(
  currentValues: ClientFormValues,
  initialValues: ClientFormValues,
): boolean {
  return JSON.stringify(currentValues) !== JSON.stringify(initialValues)
}

export function trackFieldChange(
  fieldLabel: string,
  value: unknown,
  setModifiedFields: React.Dispatch<React.SetStateAction<ModifiedFields>>,
): void {
  setModifiedFields((prev) => ({
    ...prev,
    [fieldLabel]: value,
  }))
}

export function formatScopeDisplay(scopeDn: string): string {
  const parts = scopeDn.split(',')
  const inumPart = parts.find((p) => p.startsWith('inum='))
  if (inumPart) {
    return inumPart.replace('inum=', '')
  }
  return scopeDn
}

export function formatGrantTypeLabel(grantType: string): string {
  const labels: Record<string, string> = {
    'authorization_code': 'Authorization Code',
    'implicit': 'Implicit',
    'refresh_token': 'Refresh Token',
    'client_credentials': 'Client Credentials',
    'password': 'Password',
    'urn:ietf:params:oauth:grant-type:uma-ticket': 'UMA Ticket',
    'urn:openid:params:grant-type:ciba': 'CIBA',
    'urn:ietf:params:oauth:grant-type:device_code': 'Device Code',
    'urn:ietf:params:oauth:grant-type:token-exchange': 'Token Exchange',
    'urn:ietf:params:oauth:grant-type:jwt-bearer': 'JWT Bearer',
  }
  return labels[grantType] || grantType
}

export function formatResponseTypeLabel(responseType: string): string {
  const labels: Record<string, string> = {
    code: 'Code',
    token: 'Token',
    id_token: 'ID Token',
  }
  return labels[responseType] || responseType
}

export function extractInumFromDn(dn: string): string {
  const match = dn.match(/inum=([^,]+)/)
  return match ? match[1] : dn
}

export function buildScopeDn(inum: string): string {
  return `inum=${inum},ou=scopes,o=jans`
}

export function filterScriptsByType(
  scripts: Array<{ scriptType?: string; enabled?: boolean; dn?: string; name?: string }>,
  scriptType: string,
): Array<{ dn: string; name: string }> {
  return scripts
    .filter((script) => script.scriptType === scriptType && script.enabled)
    .map((script) => ({
      dn: script.dn || '',
      name: script.name || '',
    }))
}

export function getScriptNameFromDn(
  dn: string,
  scripts: Array<{ dn?: string; name?: string }>,
): string {
  const script = scripts.find((s) => s.dn === dn)
  return script?.name || extractInumFromDn(dn)
}

export function formatDateForDisplay(dateString: string | undefined): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleString()
  } catch {
    return dateString
  }
}

export function formatDateForInput(dateString: string | undefined): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  } catch {
    return ''
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isValidUri(uri: string): boolean {
  if (!uri) return false
  const uriPattern = /^[a-zA-Z][a-zA-Z0-9+.-]*:/
  return uriPattern.test(uri)
}

export function downloadClientAsJson(client: ExtendedClient): void {
  const jsonData = JSON.stringify(client, null, 2)
  const blob = new Blob([jsonData], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = client.displayName
    ? `${client.displayName}.json`
    : client.clientName
      ? `${client.clientName}.json`
      : 'client-data.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

export function generateClientSecretPlaceholder(): string {
  return '••••••••••••••••'
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

export function sortByName<T extends { name?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
}

export function removeDuplicates<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

export function arrayEquals(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((val, idx) => val === sortedB[idx])
}
