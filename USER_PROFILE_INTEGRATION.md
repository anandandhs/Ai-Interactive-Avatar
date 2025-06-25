# User Profile Integration

This document describes the implementation of user profile fetching and display name integration with HeyGen avatar.

## Overview

After successful login, the application now:
1. Calls the user profile API to get the user's display name
2. Stores the display name in the user object
3. Passes the display name to HeyGen avatar for personalized interactions

## Implementation Details

### 1. API Configuration

**New Endpoint Added:**
- `GET /api/UserProfile/{Email}` - Fetches user profile by email

**Request Headers:**
- `Authorization: Bearer {accessToken}` - Uses the access token from login
- `Content-Type: application/json`

**Expected Response:**
```json
{
  "displayName": "John Doe",
  "email": "john.doe@example.com"
}
```

### 2. Authentication Flow Updates

**Enhanced Login Process:**
1. User logs in with username/password
2. Receives access token from `/Mobile/Authentication`
3. **NEW:** Automatically calls `/api/UserProfile/{Email}` with access token
4. Extracts `displayName` from profile response
5. Stores complete user data (including displayName) in localStorage
6. Updates UI to show display name

**User Object Structure:**
```typescript
interface User {
  id?: string;
  username: string;
  email?: string;
  displayName?: string; // NEW FIELD
}
```

### 3. HeyGen Integration

**Personalized Avatar Configuration:**
- The user's display name is passed to HeyGen via the `knowledgeBase` field
- Creates a personalized system prompt that includes the user's name
- Avatar will address the user by their display name during conversations

**Example Personalized Prompt:**
```
You are an AI avatar assistant. The user you are speaking with is named John Doe. 
Please address them by their name when appropriate and provide helpful, friendly responses.
```

### 4. UI Updates

**Navigation Bar:**
- Now displays `displayName` if available, falls back to `username`
- Shows: "Welcome back, John Doe" instead of "Welcome back, johndoe"

**Avatar Interaction:**
- Avatar will use the display name in conversations
- More personalized and natural interaction experience

## Code Changes

### Files Modified:

1. **`components/logic/apiConfig.ts`**
   - Added `USER.PROFILE` endpoint
   - Added `UserProfileResponse` interface

2. **`components/logic/useAuth.ts`**
   - Added `displayName` to User interface
   - Added `fetchUserProfile()` function
   - Enhanced login flow to fetch profile after authentication
   - Added localStorage persistence for user data

3. **`components/InteractiveAvatar.tsx`**
   - Added user context integration
   - Enhanced avatar configuration with personalized knowledge base
   - Passes display name to HeyGen for personalized interactions

4. **`components/NavBar.tsx`**
   - Updated to display `displayName` with fallback to `username`

## Testing

### Manual Testing Steps:

1. **Login Flow:**
   - Open browser console to see API calls
   - Login with valid credentials
   - Check console for profile API call logs
   - Verify display name appears in navigation

2. **Avatar Interaction:**
   - Start voice or text chat with avatar
   - Check console for personalized configuration logs
   - Verify avatar addresses user by display name

3. **Error Handling:**
   - Test with invalid email (should fallback gracefully)
   - Test with network errors (should not break login)
   - Test with missing display name (should use username)

### Console Logs to Monitor:

```
Fetching user profile from: [API_URL]
Using access token: Token available
Profile API response status: 200
User profile fetched successfully: {displayName: "John Doe", email: "..."}
Personalized avatar config with user display name: John Doe
```

## Error Handling

- **Profile API Failure:** Login continues, uses username as fallback
- **Missing Display Name:** Uses username for avatar personalization
- **Network Errors:** Logged to console, doesn't break user experience
- **Invalid Token:** Profile fetch fails gracefully, user remains logged in

## Security Considerations

- Access token is securely stored and used for profile API calls
- User data is stored in localStorage (consider encryption for production)
- API calls include proper authorization headers
- Error responses don't expose sensitive information

## Future Enhancements

1. **Profile Caching:** Cache profile data to reduce API calls
2. **Profile Updates:** Allow users to update their display name
3. **Avatar Customization:** Use profile data for avatar appearance
4. **Conversation History:** Personalize based on user preferences
