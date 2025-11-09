import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden:", error.response.data);
          break;
        case 404:
          // Not found
          console.error("Resource not found:", error.response.data);
          break;
        case 500:
          // Server error
          console.error("Server error:", error.response.data);
          break;
      }
    }
    return Promise.reject(error);
  }
);
