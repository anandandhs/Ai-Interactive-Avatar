import axios, { AxiosInstance, AxiosResponse } from "axios";
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
  AI: {
    CREATE_INTENTION: "AI/CreateAiIntension",
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

export interface SessionResponse {
  success: boolean;
  message: string;
  data: SessionData;
  errors: null;
}

export interface SessionData {
  id: number;
  userId: number;
  sessionId: string;
  metaDataId: string;
  preferredLanguage: string;
  user: SessionUser;
  createdAt: string;
  updatedAt: string;
  metadata: null;
}

export interface SessionUser {
  userID: number;
  adEmployeeID: null;
  adObjectID: string;
  adEmployeeType: string;
  adUserType: string;
  adManagerObjectId: string;
  phone: string;
  mobileNumber: null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  profilePhotoUrl: string;
  accountEnabled: boolean;
  pushNotificationEnabled: boolean;
  isManagerRole: boolean;
  userCreatedDateTime: string;
  lastUpdatedDateTime: string;
  manager: null;
  groups: null;
  groupIds: null;
  role: null;
  tenantRoles: null;
  preferenceMetadataId: string;
  preference: null;
  responsibilityDTOs: null;
  selectedSign: string;
  isGlobalAdmin: boolean;
  isAdmin: boolean;
  roleNames: null;
  permissions: null;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  adUserPrincipalName: string;
  departmentName: string;
  jobTitle: string;
}

export interface SessionRequest {
  sessionId: string;
  preferredLanguage: string;
  metadata: string;
}

// User profile response interface
export interface UserProfileResponse {
  displayName: string;
  email: string;
  // Add other profile properties as needed
}

// AI Intention API interfaces
export interface AiIntentionRequest {
  avatarResponse: string;
}

export interface AiIntentionData {
  id: number;
  avatarResponse: string;
  openAiIntension: string;
  createdAt: string;
}

export interface AiIntentionResponse {
  success: boolean;
  message: string;
  data: AiIntentionData;
  errors: null | string[];
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// API function to create AI intention
export const createAiIntention = async (
  avatarResponse: string
): Promise<AiIntentionResponse> => {
  const response = await apiClient.post<AiIntentionResponse>(
    API_ENDPOINTS.AI.CREATE_INTENTION,
    {
      avatarResponse,
    } as AiIntentionRequest
  );
  return response.data;
};

export default apiClient;
