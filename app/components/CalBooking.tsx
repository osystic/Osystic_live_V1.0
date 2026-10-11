"use client";

import dynamic from "next/dynamic";
import { lockPageScroll } from "./scrollLock";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type BookingContextValue = { openBooking: () => void };
const BookingContext = createContext<BookingContextValue | null>(null);

function normalizeCalLink(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?cal\.com\//i, "")
    .replace(/^\/+|\/+$/g, "");
}

const Calendar = dynamic(() => import("./CalendarEmbed"), {
  ssr: false,
  loading: () => null,
});

export function CalBookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDialogElement>(null);
  const configured = process.env.NEXT_PUBLIC_CALCOM_BOOKING_URL || "";
  const calLink = normalizeCalLink(configured);
  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openBooking }), [openBooking]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel.showModal();
    const unlock = lockPageScroll();
    panel.focus({ preventScroll: true });
    return () => {
      panel.close();
      unlock();
      if (previousFocus?.isConnected && previousFocus.getClientRects().length) previousFocus.focus({ preventScroll: true });
      else document.getElementById("osystic-mobile-toggle")?.focus({ preventScroll: true });
    };
  }, [closeBooking, open]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      {open ? (
        <dialog
          ref={panelRef}
          className="cal-dialog"
          tabIndex={-1}
          aria-label="Book a technical call"
          onCancel={event => {
            event.preventDefault();
            closeBooking();
          }}
          onClick={event => {
            if (event.target === event.currentTarget) closeBooking();
          }}
        >
          {calLink ? <Calendar calLink={calLink} /> : null}
        </dialog>
      ) : null}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within CalBookingProvider");
  return ctx;
}

export function BookingButton({
  children = "Book a Technical Call",
  className = "button button-primary",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { openBooking } = useBooking();
  return (
    <button type="button" className={className} aria-haspopup="dialog" onClick={openBooking}>
      {children}
    </button>
  );
}
