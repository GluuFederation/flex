import type { ApiError } from '@/utils/types'

export type AssetApiError = ApiError<{ responseMessage?: string }>
export type AssetMutationError = Error | AssetApiError
