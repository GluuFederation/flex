interface RequireContext {
  keys(): string[]
  (id: string): unknown
  <T>(id: string): T
  resolve(id: string): string
  id: string | number
}

declare namespace NodeJS {
  interface Require {
    context(
      directory: string,
      useSubdirectories?: boolean,
      regExp?: RegExp,
      mode?: 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once',
    ): RequireContext
  }
}
