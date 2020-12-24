import axios from "axios";

export const baseUrl = "https://gluu.gasmyr.com" || "http://localhost:8080";
export default axios.create({
  baseURL: baseUrl,
  timeout: 30000
});
