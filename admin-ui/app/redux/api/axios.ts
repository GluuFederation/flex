import axios from 'axios'
import { REGEX_PYTHON_PLACEHOLDER } from '@/utils/regex'

declare global {
  interface Window {
    configApiBaseUrl?: string
  }
}

const windowUrl =
  window.configApiBaseUrl && !REGEX_PYTHON_PLACEHOLDER.test(window.configApiBaseUrl)
    ? window.configApiBaseUrl
    : undefined

export const baseUrl = windowUrl || process.env.CONFIG_API_BASE_URL || 'http://localhost:8080'
export default axios.create({
  baseURL: baseUrl,
  timeout: 60000,
})
