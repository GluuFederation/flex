export type JansApiClient = {
  instance: {
    timeout: number
    authentications: Record<string, { accessToken: string | undefined }>
    basePath: string
    enableCookies: boolean
    defaultHeaders: Record<string, string>
  }
}

export type JansConfigApiModule = {
  ApiClient: JansApiClient
}
