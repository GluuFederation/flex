import axios from 'axios'
import { resolveConfigApiBaseUrl } from '@/utils/configApiBaseUrl'

const baseUrl = resolveConfigApiBaseUrl('http://localhost:8080')
export default axios.create({
  baseURL: baseUrl,
  timeout: 60000,
})
