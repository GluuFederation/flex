import type { GenericItem, PagedResult } from 'Redux/types'

export interface InitApiClient {
  getOauthScopes: (
    options: Record<string, string | number>,
    callback: (error: Error | null, data: GenericItem[]) => void,
  ) => void
  getConfigScripts: (
    options: Record<string, string | number>,
    callback: (error: Error | null, data: PagedResult) => void,
  ) => void
  getAttributes: (
    options: Record<string, string | number>,
    callback: (error: Error | null, data: PagedResult) => void,
  ) => void
  getOauthOpenidClients: (
    options: Record<string, string | number>,
    callback: (error: Error | null, data: PagedResult) => void,
  ) => void
}
