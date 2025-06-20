import type { CedarlingConstants } from './types'

export const constants: CedarlingConstants = {
  PRINCIPAL_TYPE: 'Jans::User',
  RESOURCE_TYPE: 'Jans::Application',
  ACTION_TYPE: 'Jans::Action::"Execute"',
  APP_ID: 'admin_ui_id',
  APP_NAME: 'My App',
} as const
