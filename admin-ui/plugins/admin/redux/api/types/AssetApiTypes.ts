export interface AssetApiClient {
  getAllAssets: (
    opts: Record<string, unknown>,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  getAssetServices: (callback: (error: Error | null, data: unknown) => void) => void
  getAssetTypes: (callback: (error: Error | null, data: unknown) => void) => void
  deleteAsset: (id: string, callback: (error: Error | null, data: unknown) => void) => void
  getAssetByInum: (id: string, callback: (error: Error | null, data: unknown) => void) => void
  getAssetByName: (name: string, callback: (error: Error | null, data: unknown) => void) => void
}

export interface AssetBody {
  fileName: string
  description: string
  document: string
  service?: string
  enabled: boolean
  inum?: string
  dn?: string
  baseDn?: string
}
