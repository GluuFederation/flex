export const WEBHOOK_FIELDS = {
  DISPLAY_NAME: 'displayName',
  URL: 'url',
  HTTP_METHOD: 'httpMethod',
  HTTP_HEADERS: 'httpHeaders',
  HTTP_REQUEST_BODY: 'httpRequestBody',
  JANS_ENABLED: 'jansEnabled',
} as const

export type ShortcodeFieldName = typeof WEBHOOK_FIELDS.URL | typeof WEBHOOK_FIELDS.HTTP_REQUEST_BODY
