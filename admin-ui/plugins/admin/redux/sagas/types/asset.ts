import { Asset } from '../../../components/Assets/types/Asset'

export interface AssetActionPayload {
  action?: {
    action_data?: Asset
    [key: string]: unknown
  }
  [key: string]: unknown
}
