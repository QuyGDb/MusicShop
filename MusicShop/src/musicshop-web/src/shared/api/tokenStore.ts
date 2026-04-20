/**
 * In-memory token storage to prevent XSS attacks.
 * This variable is not persistent and is lost on page reload.
 */
let accessToken: string | null = null;

/**
 * Update the in-memory access token.
 */
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

/**
 * Retrieve the in-memory access token.
 */
export const getAccessToken = () => accessToken;
