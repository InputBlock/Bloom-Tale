import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

/**
 * Google OAuth 2.0 Authentication Service
 * 
 * Handles the complete OAuth flow with Google:
 * 1. Build Google authorization URL for user login
 * 2. Exchange authorization code for access tokens
 * 3. Verify ID tokens and fetch user profile data
 * 4. Fallback mechanisms for token validation
 * 
 * Flow: User Login → Authorization Code → Access Tokens → User Profile
 */

// Google OAuth endpoints
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

// Initialize Google OAuth client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * Build Google OAuth authorization URL for user login.
 * @param {string|null} state - Optional state parameter for CSRF protection
 * @returns {string} Complete Google authorization URL
 */
export function buildGoogleAuthUrl(state = null) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account"
  });

  if (state) {
    params.append("state", state);
  }

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access and ID tokens.
 * @param {string} code - Authorization code from Google callback
 * @returns {Promise<Object>} Dictionary containing access_token, id_token, refresh_token
 */
export async function exchangeCodeForTokens(code) {
  const payload = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code"
  };

  try {
    const response = await axios.post(GOOGLE_TOKEN_URL, payload, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Token exchange failed: ${error.message}`);
  }
}

/**
 * Verify Google ID token signature and extract user payload.
 * @param {string} idToken - JWT ID token from Google
 * @returns {Promise<Object>} Verified user profile data (email, name, picture, etc.)
 */
export async function verifyIdToken(idToken) {
  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    throw new Error(`ID token verification failed: ${error.message}`);
  }
}

/**
 * Fetch user profile data using access token (fallback method).
 * @param {string} accessToken - Google access token
 * @returns {Promise<Object>} User profile information from Google API
 */
export async function fetchUserInfo(accessToken) {
  try {
    const response = await axios.get(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user info: ${error.message}`);
  }
}

/**
 * Main function to get verified Google user profile.
 * @param {string} code - Authorization code from Google callback
 * @returns {Promise<Object>} Verified user profile data
 * @throws {Error} If no valid tokens received from Google
 */
export async function getVerifiedGoogleProfile(code) {
  const tokens = await exchangeCodeForTokens(code);

  // Prefer ID token verification (more secure)
  const idToken = tokens.id_token;
  
  if (!idToken) {
    const accessToken = tokens.access_token;
    
    if (!accessToken) {
      throw new Error("No id_token or access_token from Google");
    }
    
    const userinfo = await fetchUserInfo(accessToken);
    return userinfo;
  }
  
  const payload = await verifyIdToken(idToken);
  return payload;
}