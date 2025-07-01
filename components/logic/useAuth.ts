"use client";

import { useState, useCallback, useEffect } from "react";
import { tokenStorage, TokenData } from "./tokenStorage";
import { useApiPost } from "./useApi";
import {
  LoginRequest,
  LoginResponse,
  UserProfileResponse,
  API_ENDPOINTS,
} from "./apiConfig";

export interface User {
  id?: string;
  username: string;
  email?: string;
  displayName?: string;
}

export interface UseAuthReturn {
  user: User | null;
  error: any;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const loginApi = useApiPost<LoginResponse>("/Mobile/Authentication");

  // Function to fetch user profile by email
  const fetchUserProfile = useCallback(
    async (email: string): Promise<UserProfileResponse | null> => {
      try {
        const profileUrl = API_ENDPOINTS.USER.PROFILE.replace("{Email}", email);
        const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${profileUrl}`;
        const accessToken = tokenStorage.getAccessToken();

        const response = await fetch(fullUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          console.log("User profile fetched successfully:", profileData);
          return profileData;
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch user profile:", {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
          });
          return null;
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
    },
    []
  );

  // Initialize auth state from stored token
  useEffect(() => {
    const initializeAuth = async () => {
      const tokenData = tokenStorage.getToken();
      if (tokenData && tokenData.accessToken) {
        // Try to get stored user data or fetch from server
        const storedUserData = localStorage.getItem("ai_avatar_user");
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            setUser(userData);
          } catch (error) {
            console.error("Error parsing stored user data:", error);
            setUser({ username: "User" });
          }
        } else {
          setUser({ username: "User" });
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        console.log("Login attempt for username:", username);

        // Prepare login request with all required fields
        const loginRequest: LoginRequest = {
          username,
          password,
          email: "", // Empty string as requested
          mobile: "", // Empty string as requested
          platform: "", // Empty string as requested
          manufacturer: "", // Empty string as requested
          model: "", // Empty string as requested
          deviceId: "", // Empty string as requested
          isRemember: false, // Default to false
        };

        console.log("Login request payload:", loginRequest);

        const response = await loginApi.execute({
          data: loginRequest,
        });

        console.log("Login API response:", response);

        if (response && response.accessToken) {
          console.log("Login successful, storing token...");

          // Store token securely
          const tokenData: TokenData = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            tokenType: response.tokenType || "Bearer",
            expiresAt: response.expiresIn
              ? Date.now() + response.expiresIn * 1000
              : undefined,
          };

          tokenStorage.setToken(tokenData);

          // Set initial user data
          let userData: User = {
            id: response.user?.id,
            username: response.user?.username || username,
            email: response.user?.email,
          };

          // Fetch user profile to get display name
          if (username) {
            console.log("Fetching user profile for email:", username);
            const profileData = await fetchUserProfile(username);
            if (profileData && profileData.displayName) {
              userData.displayName = profileData.displayName;
              console.log("Display name fetched:", profileData.displayName);
            }
          }

          // Store user data in localStorage for persistence
          localStorage.setItem("ai_avatar_user", JSON.stringify(userData));

          setUser(userData);
          console.log("User data set:", userData);
          return true;
        } else {
          console.log("Login failed: No access token in response");
          return false;
        }
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },
    [loginApi]
  );

  const logout = useCallback(() => {
    tokenStorage.removeToken();
    localStorage.removeItem("ai_avatar_user");
    setUser(null);
  }, []);

  const isAuthenticated = user !== null;

  return {
    user,
    error: loginApi.error,
    loading: loginApi.loading,
    login,
    logout,
    isAuthenticated,
    isInitialized,
  } as UseAuthReturn;
};
