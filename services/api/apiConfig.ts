import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://34.57.169.12:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export default api;
