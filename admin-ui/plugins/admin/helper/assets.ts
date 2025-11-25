import type { AssetFormValues } from '../components/Assets/types/FormTypes'
import type { Document } from '../components/Assets/types/AssetApiTypes'

export const buildAssetInitialValues = (asset?: Document | null): AssetFormValues => ({
  creationDate: asset?.creationDate ? String(asset.creationDate) : '',
  document: asset?.document || '',
  fileName: asset?.fileName || '',
  enabled: Boolean(asset?.enabled),
  description: asset?.description || '',
  service: asset?.service ? [asset.service] : [],
})
