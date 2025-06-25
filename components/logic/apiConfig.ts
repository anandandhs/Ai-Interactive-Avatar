import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { tokenStorage } from "./tokenStorage";

// API base URL - you can set this in environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenStorage.removeToken();
      // Optionally redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "Mobile/Authentication",
    REFRESH: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
  },
  USER: {
    PROFILE: "UserProfile/{Email}",
  },
  // Add more endpoints as needed
} as const;

// Login request interface based on the API schema
export interface LoginRequest {
  username: string;
  password: string;
  email: string;
  mobile: string;
  platform: string;
  manufacturer: string;
  model: string;
  deviceId: string;
  isRemember: boolean;
}

// Login response interface
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user?: {
    id: string;
    username: string;
    email: string;
    // Add other user properties as needed
  };
}

// User profile response interface
export interface UserProfileResponse {
  displayName: string;
  email: string;
  // Add other profile properties as needed
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export default apiClient;
