const REMEMBER_LOGIN_EMAIL_KEY = 'librechat_remember_login_email';

export function getRememberedLoginEmail(): string | null {
  try {
    const value = localStorage.getItem(REMEMBER_LOGIN_EMAIL_KEY);
    return value != null && value !== '' ? value : null;
  } catch {
    return null;
  }
}

export function setRememberedLoginEmail(email: string): void {
  try {
    localStorage.setItem(REMEMBER_LOGIN_EMAIL_KEY, email);
  } catch {
    // Storage may be unavailable (private mode / quota); ignore.
  }
}

export function clearRememberedLoginEmail(): void {
  try {
    localStorage.removeItem(REMEMBER_LOGIN_EMAIL_KEY);
  } catch {
    // ignore
  }
}
