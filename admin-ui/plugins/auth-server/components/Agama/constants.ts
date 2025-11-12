/**
 * Constants for Agama components
 */

// API Endpoints
export const API_ENDPOINTS = {
  AGAMA_DEPLOYMENT: '/api/v1/agama-deployment',
  AGAMA_REPO: '/api/v1/agama-repo',
  AGAMA_REPO_DOWNLOAD: '/api/v1/agama-repo/download/',
  AGAMA_CONFIG: '/api/v1/agama-deployment/configs',
} as const

// Timing constants
export const COPY_FEEDBACK_DURATION = 6000 // 6 seconds

// Pagination constants
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE_NUMBER = 0

// File upload constants
export const ACCEPTED_PROJECT_TYPES = {
  'application/octet-stream': ['.gama'],
  'application/x-zip-compressed': ['.zip'],
} as const

export const ACCEPTED_SHA_TYPES = {
  'text/plain': ['.sha256sum'],
} as const

// Date format options
export const DATE_TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
} as const
