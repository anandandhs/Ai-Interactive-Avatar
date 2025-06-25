// Utility functions for testing API functionality

export const testTokenStorage = () => {
  console.log('Testing token storage...');
  
  const { tokenStorage } = require('./tokenStorage');
  
  // Test storing a token
  const testToken = {
    accessToken: 'test-access-token-123',
    refreshToken: 'test-refresh-token-456',
    tokenType: 'Bearer',
    expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour from now
  };
  
  console.log('Storing test token:', testToken);
  tokenStorage.setToken(testToken);
  
  // Test retrieving the token
  const retrievedToken = tokenStorage.getToken();
  console.log('Retrieved token:', retrievedToken);
  
  // Test access token getter
  const accessToken = tokenStorage.getAccessToken();
  console.log('Access token:', accessToken);
  
  // Test token validation
  const hasValidToken = tokenStorage.hasValidToken();
  console.log('Has valid token:', hasValidToken);
  
  // Clean up
  tokenStorage.removeToken();
  console.log('Token removed');
  
  const tokenAfterRemoval = tokenStorage.getToken();
  console.log('Token after removal:', tokenAfterRemoval);
};

export const logApiRequest = (url: string, method: string, data?: any) => {
  console.log(`API Request: ${method} ${url}`);
  if (data) {
    console.log('Request data:', data);
  }
};

export const logApiResponse = (response: any, error?: any) => {
  if (error) {
    console.error('API Error:', error);
  } else {
    console.log('API Response:', response);
  }
};

// Function to test the login API structure
export const createMockLoginResponse = (username: string) => {
  return {
    accessToken: `mock-token-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
    tokenType: 'Bearer',
    expiresIn: 3600, // 1 hour
    user: {
      id: '123',
      username: username,
      email: `${username}@example.com`,
    }
  };
};
