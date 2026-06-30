const TOKEN_KEY = 'liga_certa_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
