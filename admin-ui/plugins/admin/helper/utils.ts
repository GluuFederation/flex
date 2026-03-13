import cloneDeep from 'lodash/cloneDeep'
import type { Dayjs } from '@/utils/dayjsUtils'
import {
  REGEX_AUDIT_LIST_TIMESTAMP,
  REGEX_BRACED_PLACEHOLDER,
  regexForBracedKey,
} from '@/utils/regex'
import { isValidDate as isValidDateUtil, isAfterDate, formatDate } from '@/utils/dayjsUtils'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type DateLike = string | number | Date | Dayjs | null | undefined

export type { JsonValue }

const getNestedValue = (obj: Record<string, JsonValue>, path: string): JsonValue | undefined => {
  return path.split('.').reduce<JsonValue | undefined>((acc, part) => {
    if (acc == null || typeof acc !== 'object') return undefined
    if (Array.isArray(acc)) {
      const index = Number(part)
      return Number.isInteger(index) && index >= 0 && index < acc.length ? acc[index] : undefined
    }
    return part in acc ? (acc as Record<string, JsonValue>)[part] : undefined
  }, obj as JsonValue)
}

export const hasValue = <T>(value: T): value is NonNullable<T> =>
  value !== null && value !== undefined

export const hasBothDates = (startDate: DateLike, endDate: DateLike): boolean =>
  !!startDate && !!endDate

export const hasOnlyOneDate = (startDate: DateLike, endDate: DateLike): boolean =>
  (!!startDate && !endDate) || (!startDate && !!endDate)

export const isValidDate = (date: DateLike): boolean => isValidDateUtil(date)

export const isStartAfterEnd = (startDate: DateLike, endDate: DateLike): boolean =>
  !!startDate && !!endDate && isAfterDate(startDate, endDate)

export const dateConverter = (date: DateLike, datePattern = 'DD-MM-YYYY'): string =>
  formatDate(date, datePattern)

export const clearControlledInput = (setValue: (v: string) => void): void => {
  setValue('')
}
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
        ? getNestedValue(createdFeatureValue, key)
        : createdFeatureValue[key]

      if (value !== undefined) {
        shortcodeValueMap[key] = value
        webhook.url = (webhook.url ?? '').replace(regexForBracedKey(key), String(value))
      }
    })

    if (webhook.httpRequestBody) {
      Object.keys(webhook.httpRequestBody).forEach((key) => {
        const templateValue = webhook.httpRequestBody![key]
        if (typeof templateValue === 'string' && templateValue.includes('{')) {
          let currentValue = templateValue
          templateValue.match(REGEX_BRACED_PLACEHOLDER)?.forEach((placeholder) => {
            const placeholderKey = placeholder.slice(1, -1)
            const value = placeholderKey.includes('.')
              ? getNestedValue(createdFeatureValue as Record<string, JsonValue>, placeholderKey)
              : createdFeatureValue[placeholderKey]
            if (value !== undefined) {
              currentValue = currentValue.replace(regexForBracedKey(placeholderKey), String(value))
              shortcodeValueMap[placeholderKey] = value
            }
          })
          webhook.httpRequestBody![key] = currentValue
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
