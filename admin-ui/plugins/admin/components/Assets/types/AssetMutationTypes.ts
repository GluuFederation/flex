import type { ApiError } from '@/utils/types'

export type AssetApiError = ApiError<{ responseMessage?: string }>
export type AssetMutationError = Error | AssetApiError

export type AssetMutationCallbacks = {
  onSuccess?: () => void
  onError?: (err: Error) => void
}
