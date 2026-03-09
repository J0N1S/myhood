
const API_BASE = 'http://127.0.0.1:8000';

/** Returns the access token from localStorage or sessionStorage */
export function getAccessToken(): string | null {
  return (
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token')
  );
}

/** Returns the refresh token from localStorage or sessionStorage */
export function getRefreshToken(): string | null {
  return (
    localStorage.getItem('refresh_token') ||
    sessionStorage.getItem('refresh_token')
  );
}

/** Removes all auth tokens from storage */
export function clearTokens(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
}

/**
 * Decodes a JWT payload without verifying the signature.
 * Returns null if invalid.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payloadB64] = token.split('.');
    const padded = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Returns true if the access token is missing or expired */
export function isTokenExpired(): boolean {
  const token = getAccessToken();
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  // exp is in seconds, Date.now() in milliseconds
  return payload.exp * 1000 < Date.now();
}

/**
 * Attempts to refresh the access token using the refresh token.
 * Stores the new access token if successful.
 * Returns true on success, false on failure.
 */
export async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE}/api/users/login/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (!data.access) return false;

    // Store new access token in whichever storage has the refresh token
    if (localStorage.getItem('refresh_token')) {
      localStorage.setItem('access_token', data.access);
    } else {
      sessionStorage.setItem('access_token', data.access);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns a valid access token, refreshing it if needed.
 * Clears tokens and returns null if refresh also fails.
 */
export async function getValidToken(): Promise<string | null> {
  if (!isTokenExpired()) {
    return getAccessToken();
  }

  const refreshed = await tryRefreshToken();
  if (refreshed) {
    return getAccessToken();
  }

  clearTokens();
  return null;
}
