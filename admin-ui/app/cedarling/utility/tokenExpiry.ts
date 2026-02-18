import type { IToken, JwtPayloadExp } from '../types'

const EXPIRY_BUFFER_SECONDS = 30

export function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')),
    ) as JwtPayloadExp
    if (payload.exp == null) return false
    return payload.exp - EXPIRY_BUFFER_SECONDS < Date.now() / 1000
  } catch {
    return true
  }
}

export function isAnyTokenExpired(tokens: IToken): boolean {
  return (
    isJwtExpired(tokens.access_token) ||
    isJwtExpired(tokens.id_token) ||
    isJwtExpired(tokens.userinfo_token)
  )
}
