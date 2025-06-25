"use client";

// Simple encryption/decryption for token storage
// In production, consider using more robust encryption libraries
const STORAGE_KEY = 'ai_avatar_token';
const ENCRYPTION_KEY = 'ai-avatar-secret-key-2024'; // In production, use environment variable

// Simple XOR encryption for basic obfuscation
function simpleEncrypt(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result); // Base64 encode
}

function simpleDecrypt(encryptedText: string, key: string): string {
  try {
    const decoded = atob(encryptedText); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (error) {
    console.error('Failed to decrypt token:', error);
    return '';
  }
}

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: string;
}

export const tokenStorage = {
  // Store token securely
  setToken: (tokenData: TokenData): void => {
    try {
      const tokenString = JSON.stringify(tokenData);
      const encryptedToken = simpleEncrypt(tokenString, ENCRYPTION_KEY);
      localStorage.setItem(STORAGE_KEY, encryptedToken);
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  // Retrieve token securely
  getToken: (): TokenData | null => {
    try {
      const encryptedToken = localStorage.getItem(STORAGE_KEY);
      if (!encryptedToken) return null;

      const decryptedToken = simpleDecrypt(encryptedToken, ENCRYPTION_KEY);
      if (!decryptedToken) return null;

      const tokenData: TokenData = JSON.parse(decryptedToken);
      
      // Check if token is expired
      if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
        tokenStorage.removeToken();
        return null;
      }

      return tokenData;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      tokenStorage.removeToken(); // Clear corrupted token
      return null;
    }
  },

  // Remove token
  removeToken: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  // Check if token exists and is valid
  hasValidToken: (): boolean => {
    const tokenData = tokenStorage.getToken();
    return tokenData !== null && !!tokenData.accessToken;
  },

  // Get access token directly
  getAccessToken: (): string | null => {
    const tokenData = tokenStorage.getToken();
    return tokenData?.accessToken || null;
  }
};
