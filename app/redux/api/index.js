import axios from 'axios';

export const baseUrl = 'http://localhost:8080';

export default
   axios.create({
      baseURL: baseUrl,
      timeout: 30000
   });

