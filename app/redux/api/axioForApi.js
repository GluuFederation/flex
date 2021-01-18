import axios from "axios";
export const baseUrl = "https://gasmyr.gluu.org" || "http://localhost:8080";
export default axios.create({
  timeout: 30000
});
