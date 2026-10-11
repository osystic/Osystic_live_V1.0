"use client";

import Link, { useLinkStatus } from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Menu, X } from "lucide-react";
import { lockPageScroll } from "./scrollLock";
import { BrandLogo } from "./BrandLogo";
import { BookingButton } from "./CalBooking";

const navigation = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blogs", href: "/insights" },
  { label: "About", href: "/about" },
] as const;

function NavigationFeedback() {
  const { pending } = useLinkStatus();
  return pending
    ? createPortal(
        <span className="navigation-pending" role="status">
          <span className="sr-only">Loading page…</span>
        </span>,
        document.body,
      )
    : null;
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const mobileDialog = useRef<HTMLDialogElement>(null);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const navActive = (href: string) =>
    href === "/services"
      ? active("/services") || active("/capabilities")
      : active(href);
  const clientPortalUrl =
    process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL?.trim() ||
    "/contact?intent=client-portal";
  const clientPortalExternal = /^https?:\/\//i.test(clientPortalUrl);

  function closeMenu() {
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape" || !open) return;
      setOpen(false);
      mobileToggle.current?.focus();
    }

    const breakpoint = window.matchMedia("(max-width: 1200px)");
    function resize() {
      setOpen(false);
    }

    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    breakpoint.addEventListener("change", resize);

    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      breakpoint.removeEventListener("change", resize);
    };
  }, [open]);

  useEffect(() => {
    const dialog = mobileDialog.current;
    if (!dialog || !open) return;
    const unlock = lockPageScroll();
    dialog.showModal();

    return () => {
      dialog.close();
      unlock();
    };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.header
      className={`site-header future-site-header approved-home-header${scrolled ? " is-scrolled" : ""}`}
      ref={headerRef}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) closeMenu();
      }}
    >
      <div className="container-shell nav-shell future-nav-shell">
        <div className="future-brand-wrap" onClick={closeMenu}>
          <BrandLogo priority />
        </div>

        <nav className="desktop-nav future-desktop-nav" aria-label="Primary navigation">
          {navigation.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link future-nav-link${navActive(item.href) ? " active" : ""}`}
              aria-current={navActive(item.href) ? "page" : undefined}
              onClick={closeMenu}
            >
              {item.label}
              <NavigationFeedback />
            </Link>
          ))}
        </nav>

        <div className="nav-actions future-nav-actions">
          <a
            className="future-client-portal"
            href={clientPortalUrl}
            target={clientPortalExternal ? "_blank" : undefined}
            rel={clientPortalExternal ? "noreferrer" : undefined}
            onClick={closeMenu}
          >
            Client Portal <LogIn size={14} aria-hidden="true" />
          </a>

          <div onClick={closeMenu} className="desktop-booking">
            <BookingButton className="button button-primary nav-cta future-nav-cta">
              Book a Call <ArrowRight size={15} />
            </BookingButton>
          </div>

          <button
            id="osystic-mobile-toggle"
            ref={mobileToggle}
            type="button"
            className="mobile-menu-button future-mobile-menu-button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(value => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <dialog
        ref={mobileDialog}
        id="mobile-navigation"
        className="mobile-nav-panel future-mobile-nav-panel"
        aria-label="OSYSTIC navigation"
        onCancel={event => {
          event.preventDefault();
          closeMenu();
        }}
        onClick={event => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="mobile-drawer-content future-mobile-drawer">
          <div className="mobile-drawer-head future-mobile-drawer-head">
            <BrandLogo compact />
            <button
              type="button"
              className="mobile-menu-button future-mobile-menu-button"
              aria-label="Close navigation"
              onClick={closeMenu}
              autoFocus
            >
              <X size={22} />
            </button>
          </div>

          <nav className="container-shell mobile-nav future-mobile-nav" aria-label="Mobile navigation">
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={navActive(item.href) ? "active" : undefined}
                aria-current={navActive(item.href) ? "page" : undefined}
                onClick={closeMenu}
              >
                {item.label}
                <NavigationFeedback />
                <ArrowRight size={16} />
              </Link>
            ))}

            <div className="future-mobile-actions">
              <a
                className="future-mobile-portal"
                href={clientPortalUrl}
                target={clientPortalExternal ? "_blank" : undefined}
                rel={clientPortalExternal ? "noreferrer" : undefined}
                onClick={closeMenu}
              >
                Client Portal <LogIn size={15} aria-hidden="true" />
              </a>

              <div onClick={closeMenu}>
                <BookingButton className="button button-primary mobile-booking-button future-mobile-booking">
                  Book a Technical Call <ArrowRight size={15} />
                </BookingButton>
              </div>
            </div>
          </nav>
        </div>
      </dialog>
    </motion.header>
  );
}
