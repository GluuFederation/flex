import { AssetBody } from '../../api/types/AssetApiTypes'

export interface AssetActionPayload {
  action?: {
    action_data?: AssetBody
    [key: string]: unknown
  }
  [key: string]: unknown
}
