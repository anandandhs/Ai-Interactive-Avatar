"use client";

import { useState, useCallback } from "react";
import { AxiosRequestConfig, AxiosError } from "axios";
import apiClient from "./apiConfig";

export interface ApiState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (config?: AxiosRequestConfig) => Promise<T | null>;
  reset: () => void;
}

// Generic hook for API calls
export function useApi<T = any>(
  initialConfig?: AxiosRequestConfig
): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (config?: AxiosRequestConfig): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const finalConfig = { ...initialConfig, ...config };
        const response = await apiClient(finalConfig);

        setState({
          data: response.data,
          loading: false,
          error: null,
        });

        return response.data;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });

        return null;
      }
    },
    [initialConfig]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  };
}

// Hook for GET requests
export function useApiGet<T = any>(
  url: string,
  config?: AxiosRequestConfig
): UseApiReturn<T> {
  return useApi<T>({ method: "GET", url, ...config });
}

// Hook for POST requests
export function useApiPost<T = any>(
  url: string,
  config?: AxiosRequestConfig
): UseApiReturn<T> {
  return useApi<T>({ method: "POST", url, ...config });
}

// Hook for PUT requests
export function useApiPut<T = any>(
  url: string,
  config?: AxiosRequestConfig
): UseApiReturn<T> {
  return useApi<T>({ method: "PUT", url, ...config });
}

// Hook for DELETE requests
export function useApiDelete<T = any>(
  url: string,
  config?: AxiosRequestConfig
): UseApiReturn<T> {
  return useApi<T>({ method: "DELETE", url, ...config });
}

// Utility function to extract error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Handle different types of axios errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (data?.message) {
        return data.message;
      }

      if (data?.errors && Array.isArray(data.errors)) {
        return data.errors.join(", ");
      }

      if (typeof data === "string") {
        return data;
      }

      // Default status-based messages
      switch (status) {
        case 400:
          return "Bad request. Please check your input.";
        case 401:
          return "Authentication failed. Please login again.";
        case 403:
          return "Access denied. You do not have permission.";
        case 404:
          return "Resource not found.";
        case 500:
          return "Server error. Please try again later.";
        default:
          return `Request failed with status ${status}`;
      }
    } else if (error.request) {
      // Network error
      return "Network error. Please check your connection.";
    } else {
      // Other axios error
      return error.message || "An unexpected error occurred.";
    }
  }

  // Non-axios error
  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
}

// Hook specifically for login API call
export function useLoginApi() {
  return useApiPost("/Mobile/Authentication");
}
