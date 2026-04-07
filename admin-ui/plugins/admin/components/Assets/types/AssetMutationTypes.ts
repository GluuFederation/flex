import type { ApiError } from '../../../types'

export type AssetApiError = ApiError<{ responseMessage?: string }>
export type AssetMutationError = Error | AssetApiError
