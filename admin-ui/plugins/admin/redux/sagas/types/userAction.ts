export interface UserAction {
  action_message?: string
  action_data?: any
  [key: string]: any
}

export interface ActionPayload {
  action: UserAction
}
