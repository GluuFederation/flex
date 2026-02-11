import cloneDeep from 'lodash/cloneDeep'
import type { Dayjs } from '@/utils/dayjsUtils'
import {
  REGEX_AUDIT_LIST_TIMESTAMP,
  REGEX_BRACED_PLACEHOLDER,
  regexForBracedKey,
} from '@/utils/regex'
import { isValidDate as isValidDateUtil, isAfterDate, formatDate } from '@/utils/dayjsUtils'

export type DateLike = string | number | Date | Dayjs | null | undefined

export interface JsonObject {
  [key: string]: JsonValue
}
export type JsonValue = string | number | boolean | null | JsonObject

const getNestedValue = (obj: Record<string, JsonValue>, path: string): JsonValue | undefined => {
  return path.split('.').reduce<JsonValue | undefined>((acc, part) => {
    return acc != null && typeof acc === 'object' && !Array.isArray(acc) && part in acc
      ? (acc as Record<string, JsonValue>)[part]
      : undefined
  }, obj as JsonValue)
}

export const hasValue = <T>(value: T): value is NonNullable<T> => !!value

export const hasBothDates = (startDate: DateLike, endDate: DateLike): boolean =>
  !!startDate && !!endDate

export const hasOnlyOneDate = (startDate: DateLike, endDate: DateLike): boolean =>
  (!!startDate && !endDate) || (!startDate && !!endDate)

export const isValidDate = (date: DateLike): boolean => isValidDateUtil(date)

export const isStartAfterEnd = (startDate: DateLike, endDate: DateLike): boolean =>
  !!startDate && !!endDate && isAfterDate(startDate, endDate)

export const dateConverter = (date: DateLike, datePattern = 'DD-MM-YYYY'): string =>
  formatDate(date, datePattern)

export const clearInputById = (id: string): void => {
  const el = document.getElementById(id)
  if (el && 'value' in el) {
    const input = el as HTMLInputElement
    input.value = ''
  }
}

/** Re-export for backward compatibility; prefer importing REGEX_AUDIT_LIST_TIMESTAMP from @/utils/regex. */
export const auditListTimestampRegex = REGEX_AUDIT_LIST_TIMESTAMP

export interface WebhookOutputItem {
  webhookId: string
  shortcodeValueMap: Record<string, JsonValue>
  url: string
}

interface WebhookWithBody {
  inum?: string
  url?: string
  httpRequestBody?: Record<string, JsonValue>
}

export const webhookOutputObject = (
  enabledFeatureWebhooks: WebhookWithBody[],
  createdFeatureValue: Record<string, JsonValue>,
): WebhookOutputItem[] => {
  return enabledFeatureWebhooks.map((originalWebhook) => {
    const webhook = cloneDeep(originalWebhook) as WebhookWithBody & {
      httpRequestBody?: Record<string, JsonValue>
    }
    const url = webhook.url ?? ''
    const shortcodeValueMap: Record<string, JsonValue> = {}

    url.match(REGEX_BRACED_PLACEHOLDER)?.forEach((placeholder) => {
      const key = placeholder.slice(1, -1)
      const value = key?.includes('.')
        ? getNestedProperty(createdFeatureValue, key)
        : createdFeatureValue[key]

      if (value !== undefined) {
        shortcodeValueMap[key] = value
        webhook.url = (webhook.url ?? '').replace(regexForBracedKey(key), String(value))
      }
    })

    if (webhook.httpRequestBody) {
      Object.entries(webhook.httpRequestBody).forEach(([key, templateValue]) => {
        if (typeof templateValue === 'string' && templateValue.includes('{')) {
          templateValue.match(REGEX_BRACED_PLACEHOLDER)?.forEach((placeholder) => {
            const placeholderKey = placeholder.slice(1, -1)
            const value = placeholderKey.includes('.')
              ? getNestedValue(createdFeatureValue, placeholderKey)
              : createdFeatureValue[placeholderKey]
            if (value !== undefined && webhook.httpRequestBody) {
              webhook.httpRequestBody[key] = (templateValue as string).replace(
                regexForBracedKey(placeholderKey),
                String(value),
              )
              shortcodeValueMap[placeholderKey] = value
            }
          })
        }
      })
    }

    return {
      webhookId: webhook.inum ?? '',
      shortcodeValueMap,
      url: webhook.url ?? '',
    }
  })
}

function getNestedProperty(obj: Record<string, JsonValue>, path: string): JsonValue | undefined {
  const keys = path.split('.')
  let current: JsonValue | undefined = obj

  for (const key of keys) {
    if (
      current == null ||
      typeof current !== 'object' ||
      Array.isArray(current) ||
      !(key in current)
    ) {
      return undefined
    }
    current = (current as Record<string, JsonValue>)[key]
  }

  return current
}

export const adminUiFeatures = {
  custom_script_write: 'custom_script_write',
  custom_script_delete: 'custom_script_delete',
  oidc_clients_delete: 'oidc_clients_delete',
  oidc_clients_write: 'oidc_clients_write',
  scopes_write: 'scopes_write',
  scopes_delete: 'scopes_delete',
  ssa_write: 'ssa_write',
  ssa_delete: 'ssa_delete',
  fido_configuration_write: 'fido_configuration_write',
  jans_keycloak_link_write: 'jans_keycloak_link_write',
  jans_link_write: 'jans_link_write',
  saml_configuration_write: 'saml_configuration_write',
  saml_idp_write: 'saml_idp_write',
  attributes_write: 'attributes_write',
  attributes_delete: 'attributes_delete',
  scim_configuration_edit: 'scim_configuration_edit',
  smtp_configuration_edit: 'smtp_configuration_edit',
  users_edit: 'users_edit',
  users_delete: 'users_delete',
  sessions: 'sessions',
} as const

export type AdminUiFeatureKey = keyof typeof adminUiFeatures
