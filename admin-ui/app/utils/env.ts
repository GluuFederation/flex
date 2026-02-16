export const isDevelopment = process.env.NODE_ENV === 'development'

export function devWarn(...args: unknown[]): void {
  if (isDevelopment) {
    console.warn(...args)
  }
}
