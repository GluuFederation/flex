import axios from "axios"

export const baseUrl = process.env.CONFIG_API_BASE_URL || "http://localhost:8080"
export default axios.create({
  baseURL: baseUrl,
  timeout: 30000
})
