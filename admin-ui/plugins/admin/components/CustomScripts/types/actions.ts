// Action Types

import { CustomScriptItem } from './customScript'

export interface UserAction {
  action_message?: string
  action_data?: any
  [key: string]: any
}

export interface SubmitData {
  customScript: CustomScriptItem
  [key: string]: any
} 