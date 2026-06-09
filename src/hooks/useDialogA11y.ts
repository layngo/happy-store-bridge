import { useEffect, useRef } from "react";

type UseDialogA11yOptions = {
  open: boolean;
  onClose: () => void;
  /** Element to restore focus to when the dialog closes. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** Skip auto-focus on open (caller handles focus). */
  autoFocus?: boolean;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
  );
}

/** Focus trap, Escape-to-close, and focus restore for custom dialogs. */
export function useDialogA11y({
  open,
  onClose,
  returnFocusRef,
  autoFocus = false,
}: UseDialogA11yOptions) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    if (autoFocus) {
      const dialog = dialogRef.current;
      if (dialog) {
        const focusable = getFocusable(dialog);
        (focusable[0] ?? dialog).focus();
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }

      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = getFocusable(dialogRef.current);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, autoFocus]);

  useEffect(() => {
    if (open) return;
    const target = returnFocusRef?.current ?? previousFocusRef.current;
    target?.focus?.();
  }, [open, returnFocusRef]);

  return dialogRef;
}
