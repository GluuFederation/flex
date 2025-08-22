export interface UserAction {
  action_message?: string
  action_data?: unknown
  [key: string]: unknown
}

export interface ActionPayload {
  action: UserAction
}
