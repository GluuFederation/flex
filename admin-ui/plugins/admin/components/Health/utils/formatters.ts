import { REGEX_SEPARATOR_CHARS } from '@/utils/regex'

export const formatServiceName = (name: string): string =>
  name
    .split(REGEX_SEPARATOR_CHARS)
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
