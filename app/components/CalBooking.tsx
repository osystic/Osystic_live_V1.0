"use client";

import dynamic from "next/dynamic";
import { lockPageScroll } from "./scrollLock";
import {
  Component,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";

type BookingContextValue = { openBooking: () => void };
const BookingContext = createContext<BookingContextValue | null>(null);

function normalizeCalLink(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?cal\.com\//i, "")
    .replace(/^\/+|\/+$/g, "");
}

class CalendarBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p className="calendar-status" role="status">The calendar could not load. Please use the email link below.</p> : this.props.children;
  }
}

const Calendar = dynamic(() => import("./CalendarEmbed"), {
  ssr: false,
  loading: () => <div className="calendar-status" role="status">Loading calendar…</div>,
});

export function CalBookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
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
    closeRef.current?.focus({ preventScroll: true });
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
        <dialog ref={panelRef} className="cal-dialog" onCancel={event => { event.preventDefault(); closeBooking(); }}
          onClick={event => { if (event.target === event.currentTarget) closeBooking(); }}
          aria-labelledby="cal-booking-title" aria-describedby="cal-booking-description">
          <div
            className="cal-modal-panel"
          >
            <div className="cal-modal-head">
              <div>
                <span className="eyebrow">TECHNICAL DISCOVERY</span>
                <h2 id="cal-booking-title">Book a Technical Call</h2>
                <p id="cal-booking-description" className="sr-only">
                  Choose an available time for a technical discovery call with OSYSTIC.
                </p>
              </div>
              <button
                ref={closeRef}
                className="icon-button"
                aria-label="Close booking dialog"
                onClick={closeBooking}
              >
                <X size={20} />
              </button>
            </div>
            {calLink ? (
              <div className="cal-embed-wrap">
                <CalendarBoundary><Calendar calLink={calLink} /></CalendarBoundary>
              </div>
            ) : (
              <div className="cal-not-configured">
                <p>The booking calendar is not configured yet.</p>
                <a href="mailto:hello@osystic.com">Email hello@osystic.com</a>
              </div>
            )}
            {calLink ? <p className="calendar-help">Prefer email? <a href="mailto:hello@osystic.com">hello@osystic.com</a></p> : null}
          </div>
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
