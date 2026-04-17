import type { MauEntry } from 'Redux/types'

export type MauApiClient = {
  getStat: (
    options: Record<string, string>,
    callback: (error: Error | null, data: MauEntry[]) => void,
  ) => void
}
