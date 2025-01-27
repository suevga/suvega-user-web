import axios from "axios";
import { envConfig } from "./envConfig";

const axiosInstance = axios.create({
  baseURL: envConfig.apiUrl,
  // baseURL: "http://localhost:8080",
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
})


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;