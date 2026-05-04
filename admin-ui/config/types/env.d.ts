// Build-time environment variables injected into the app config.
// These values are resolved during the Vite build and remain available via process.env

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      BASE_PATH?: string
      API_BASE_URL?: string
      CONFIG_API_BASE_URL?: string
      POLICY_STORE_CONFIG?: string // JSON string injected at build time
    }
  }
}

export {}
