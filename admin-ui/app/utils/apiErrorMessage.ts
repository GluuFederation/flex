type ApiErrorResponseBody = {
  message?: string
  description?: string
  error_description?: string
}

type ApiErrorSource = {
  message?: string
  response?: {
    status?: number
    data?: ApiErrorResponseBody
    body?: ApiErrorResponseBody
    text?: string
  }
}

export type ResolveApiErrorMessageOptions = {
  fallback?: string
  trimString?: boolean
  emptyStringFallback?: boolean
  preferDescriptionFor4xx?: boolean
}

const DEFAULT_FALLBACK = 'An error occurred'

const pickFirstString = (...values: Array<string | undefined>): string | undefined => {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed.length > 0) {
        return trimmed
      }
    }
  }

  return undefined
}

export const resolveApiErrorMessage = (
  error: ApiErrorSource | Error | string | null | undefined,
  {
    fallback = DEFAULT_FALLBACK,
    trimString = true,
    emptyStringFallback = true,
    preferDescriptionFor4xx = true,
  }: ResolveApiErrorMessageOptions = {},
): string => {
  if (typeof error === 'string') {
    const stringValue = trimString ? error.trim() : error
    if (emptyStringFallback && stringValue.length === 0) {
      return fallback
    }
    return stringValue
  }

  if (typeof error !== 'object' || error === null) {
    return fallback
  }

  const typedError = error as ApiErrorSource
  const status = typedError.response?.status
  const data = typedError.response?.data
  const body = typedError.response?.body

  const description = pickFirstString(
    data?.description,
    data?.error_description,
    body?.description,
    body?.error_description,
  )

  const message = pickFirstString(data?.message, body?.message)
  const responseText = pickFirstString(typedError.response?.text)
  const errorMessage = pickFirstString(typedError.message)

  if (preferDescriptionFor4xx && status && status >= 400 && status < 500 && description) {
    return description
  }

  return message || description || responseText || errorMessage || fallback
}
