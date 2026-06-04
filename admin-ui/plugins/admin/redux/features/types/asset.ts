import { Document } from '../../../components/Assets/types/AssetApiTypes'

export type AssetState = {
  selectedAsset: Document | Record<string, never>
}
