import axios, { AxiosError } from "axios";

// API Error type for type-safe error handling
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

export function isApiError(
  error: unknown
): error is AxiosError<ApiErrorResponse> {
  return (
    error instanceof Error && "response" in error && "isAxiosError" in error
  );
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: This sends cookies with requests
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          // Serialize arrays as multiple parameters with the same key
          value.forEach((item) => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      });
      return searchParams.toString();
    },
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - only redirect if not already on login page
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/login")
          ) {
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
