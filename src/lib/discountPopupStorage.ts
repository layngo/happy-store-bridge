const SUBMITTED_KEY = "layngo-discount-submitted";
const SUBMITTED_EMAIL_KEY = "layngo-discount-email";
const SEEN_SESSION_KEY = "layngo-discount-popup-seen";

export function hasCompletedDiscountSignup(): boolean {
  try {
    return localStorage.getItem(SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function getCompletedDiscountEmail(): string | null {
  try {
    return localStorage.getItem(SUBMITTED_EMAIL_KEY);
  } catch {
    return null;
  }
}

export function markDiscountSignupComplete(email?: string): void {
  try {
    localStorage.setItem(SUBMITTED_KEY, "1");
    const normalized = email?.trim().toLowerCase();
    if (normalized) {
      localStorage.setItem(SUBMITTED_EMAIL_KEY, normalized);
    }
  } catch {
    /* ignore */
  }
}

/** Popup was shown or dismissed this browser session: do not show again until a new session. */
export function hasSeenDiscountPopupThisSession(): boolean {
  try {
    return sessionStorage.getItem(SEEN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markDiscountPopupSeenThisSession(): void {
  try {
    sessionStorage.setItem(SEEN_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Auto-show once per session on the homepage; never again after signup is completed. */
export function shouldShowDiscountPopup(): boolean {
  if (hasCompletedDiscountSignup()) return false;
  if (hasSeenDiscountPopupThisSession()) return false;
  return true;
}
