import {
  REGEX_CAMEL_TO_SNAKE_BOUNDARY,
  REGEX_SPACE_OR_HYPHEN_SEQUENCE,
  REGEX_NON_ALPHANUMERIC_SEQUENCE,
} from '@/utils/regex'

export const buildKeyCandidates = (key: string): string[] => {
  const lowerFirst = key ? `${key.charAt(0).toLowerCase()}${key.slice(1)}` : key
  const snakeCase = key
    .replace(REGEX_CAMEL_TO_SNAKE_BOUNDARY, '$1_$2')
    .replace(REGEX_SPACE_OR_HYPHEN_SEQUENCE, '_')
    .toLowerCase()
  const compactSnakeCase = key
    .replace(REGEX_NON_ALPHANUMERIC_SEQUENCE, '_')
    .replace(REGEX_CAMEL_TO_SNAKE_BOUNDARY, '$1_$2')
    .toLowerCase()

  return Array.from(new Set([key, lowerFirst, snakeCase, compactSnakeCase].filter(Boolean)))
}
