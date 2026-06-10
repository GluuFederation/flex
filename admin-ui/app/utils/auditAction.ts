import type { ActionData, UserAction } from './types'

export const buildPayload = (
  userAction: UserAction,
  message: string,
  payload: ActionData,
): void => {
  userAction['action_message'] = message
  userAction['action_data'] = payload
}
