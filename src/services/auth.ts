const TOKEN_KEY = 'vps_monitor_token';
const USER_KEY = 'vps_monitor_user';

export function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username && password.length >= 3) {
        localStorage.setItem(TOKEN_KEY, `mock-jwt-${Date.now()}`);
        localStorage.setItem(USER_KEY, JSON.stringify({ username, name: username, role: 'Administrator' }));
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'Invalid credentials. Password must be at least 3 characters.' });
      }
    }, 600);
  });
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): { username: string; name: string; role: string } | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
      return null;
  }
}
