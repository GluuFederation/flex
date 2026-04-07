import type { JsonPatch } from 'JansConfigApi'

export type ActionData =
  | Record<string, string | number | boolean | string[] | number[] | boolean[] | null>
  | { requestBody: JsonPatch[] }
  | string
  | number
  | string[]
  | number[]
  | boolean[]
  | null

export type UserAction = {
  action_message: string
  action_data: ActionData | null
  [key: string]: string | number | boolean | ActionData | string[] | number[] | boolean[] | null
}
