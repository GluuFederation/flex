import { REGEX_SEPARATOR_CHARS } from '@/utils/regex'

export function formatServiceName(name: string): string {
  return name
    .split(REGEX_SEPARATOR_CHARS)
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
