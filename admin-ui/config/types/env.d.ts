// Environment variables injected by webpack DefinePlugin
// These are build-time environment variables available via process.env

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      BASE_PATH?: string
      API_BASE_URL?: string
      CONFIG_API_BASE_URL?: string
      POLICY_STORE_CONFIG?: string // JSON string injected by webpack DefinePlugin
    }
  }
}

export {}
