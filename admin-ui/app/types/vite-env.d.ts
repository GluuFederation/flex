interface ImportMetaEnv {
  readonly BASE_PATH?: string
  readonly API_BASE_URL?: string
  readonly CONFIG_API_BASE_URL?: string
  readonly POLICY_STORE_CONFIG?: string
}

interface ViteHotContext {
  accept(): void
  accept<T extends object = Record<string, never>>(cb: (mod: T | undefined) => void): void
  accept<T extends object = Record<string, never>>(
    path: string,
    cb: (mod: T | undefined) => void,
  ): void
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly hot?: ViteHotContext
  glob<T>(pattern: string, options?: { eager?: boolean; import?: string }): Record<string, T>
}
