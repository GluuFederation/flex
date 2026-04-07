interface RequireContext {
  keys(): string[]
  (id: string): unknown
  resolve(id: string): string
  id: string
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
