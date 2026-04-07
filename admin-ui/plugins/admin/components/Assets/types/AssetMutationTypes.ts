export type AssetApiError = {
  response?: { data?: { responseMessage?: string } }
}

export type AssetMutationError = Error | AssetApiError
