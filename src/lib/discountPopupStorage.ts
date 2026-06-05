const SUBMITTED_KEY = "layngo-discount-submitted";
const DISMISSED_DATE_KEY = "layngo-discount-dismissed-date";

function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function hasCompletedDiscountSignup(): boolean {
  try {
    return localStorage.getItem(SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markDiscountSignupComplete(): void {
  try {
    localStorage.setItem(SUBMITTED_KEY, "1");
    localStorage.removeItem(DISMISSED_DATE_KEY);
  } catch {
    /* ignore */
  }
}

export function markDiscountDismissedToday(): void {
  try {
    localStorage.setItem(DISMISSED_DATE_KEY, todayLocal());
  } catch {
    /* ignore */
  }
}

/** Show again on each new calendar day until they complete signup. */
export function shouldShowDiscountPopup(): boolean {
  if (hasCompletedDiscountSignup()) return false;

  try {
    const dismissed = localStorage.getItem(DISMISSED_DATE_KEY);
    if (!dismissed) return true;
    return dismissed < todayLocal();
  } catch {
    return true;
  }
}
