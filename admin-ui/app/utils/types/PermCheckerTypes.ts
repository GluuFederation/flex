import type { JsonPatch } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type ActionData =
  | Record<string, JsonValue>
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
