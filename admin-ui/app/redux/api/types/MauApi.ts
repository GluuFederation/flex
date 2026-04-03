import type { MauEntry } from 'Redux/types'

export interface MauApiClient {
  getStat: (
    options: Record<string, string>,
    callback: (error: Error | null, data: MauEntry[]) => void,
  ) => void
}
