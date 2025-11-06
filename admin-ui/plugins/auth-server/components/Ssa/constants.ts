export const GRANT_TYPES = [
  'authorization_code',
  'implicit',
  'refresh_token',
  'client_credentials',
  'password',
  'urn:ietf:params:oauth:grant-type:uma-ticket',
] as const

export type GrantType = (typeof GRANT_TYPES)[number]

export const DEBOUNCE_DELAY = 500

export const FORM_LAYOUT = {
  LABEL_SIZE: 2,
  INPUT_SIZE: 10,
  HALF_WIDTH: 6,
  THIRD_WIDTH: 4,
  FULL_WIDTH_LEFT: 8,
} as const
