import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'https://imaginative-inspiration-production.up.railway.app/api',
  withCredentials: true,
});

export default api; 