"use client";

import Link, { useLinkStatus } from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  ChevronDown,
  CloudCog,
  Code2,
  Database,
  LogIn,
  Menu,
  X,
} from "lucide-react";
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

const serviceLinks = [
  {
    title: "AI & Machine Learning",
    copy: "Production AI systems, agents, evaluation, and intelligent workflows.",
    href: "/capabilities/ai-systems",
    icon: BrainCircuit,
  },
  {
    title: "Custom Software Development",
    copy: "Secure product engineering across web, backend, mobile, and APIs.",
    href: "/capabilities/product-engineering",
    icon: Code2,
  },
  {
    title: "Data Engineering",
    copy: "Reliable pipelines, data platforms, analytics, and AI-ready foundations.",
    href: "/services/data-cloud/data",
    icon: Database,
  },
  {
    title: "Cloud & DevOps",
    copy: "Cloud infrastructure, delivery automation, observability, and operations.",
    href: "/services/devops-cloud",
    icon: CloudCog,
  },
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
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const mobileDialog = useRef<HTMLDialogElement>(null);
  const servicesTrigger = useRef<HTMLAnchorElement>(null);
  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressServicesFocusOpen = useRef(false);
  const servicesDismissedUntil = useRef(0);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const navActive = (href: string) =>
    href === "/services"
      ? active("/services") || active("/capabilities")
      : active(href);
  const clientPortalUrl =
    process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL?.trim() ||
    "/contact?intent=client-portal";
  const clientPortalExternal = /^https?:\/\//i.test(clientPortalUrl);

  function clearServicesCloseTimer() {
    if (!servicesCloseTimer.current) return;
    clearTimeout(servicesCloseTimer.current);
    servicesCloseTimer.current = null;
  }

  function openServicesMenu() {
    clearServicesCloseTimer();
    if (Date.now() < servicesDismissedUntil.current) return;
    setServicesOpen(true);
  }

  function closeServicesMenu() {
    clearServicesCloseTimer();
    setServicesOpen(false);
  }

  function scheduleServicesClose() {
    clearServicesCloseTimer();
    servicesCloseTimer.current = setTimeout(() => {
      setServicesOpen(false);
      servicesCloseTimer.current = null;
    }, 140);
  }

  function closeMenu() {
    servicesDismissedUntil.current = 0;
    setOpen(false);
    setMobileServicesOpen(false);
    closeServicesMenu();
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    };
  }, []);

  useEffect(() => {
    function closeAllNavigation() {
      if (servicesCloseTimer.current) {
        clearTimeout(servicesCloseTimer.current);
        servicesCloseTimer.current = null;
      }
      setOpen(false);
      setMobileServicesOpen(false);
      setServicesOpen(false);
    }

    function outside(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        closeAllNavigation();
      }
    }

    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      if (servicesOpen) {
        if (servicesCloseTimer.current) {
          clearTimeout(servicesCloseTimer.current);
          servicesCloseTimer.current = null;
        }
        suppressServicesFocusOpen.current = true;
        servicesDismissedUntil.current = Date.now() + 360;
        setServicesOpen(false);
        servicesTrigger.current?.focus();
        requestAnimationFrame(() => {
          suppressServicesFocusOpen.current = false;
        });
        return;
      }

      if (open) {
        setOpen(false);
        setMobileServicesOpen(false);
        mobileToggle.current?.focus();
      }
    }

    const breakpoint = window.matchMedia("(max-width: 1200px)");

    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    breakpoint.addEventListener("change", closeAllNavigation);

    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      breakpoint.removeEventListener("change", closeAllNavigation);
    };
  }, [open, servicesOpen]);

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
          <div
            className="future-services-menu-root"
            onMouseEnter={openServicesMenu}
            onMouseLeave={scheduleServicesClose}
            onFocus={() => {
              if (!suppressServicesFocusOpen.current) openServicesMenu();
            }}
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                scheduleServicesClose();
              }
            }}
          >
            <Link
              ref={servicesTrigger}
              href="/services"
              className={`nav-link future-nav-link future-services-trigger${navActive("/services") ? " active" : ""}`}
              aria-current={navActive("/services") ? "page" : undefined}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              aria-controls="desktop-services-mega-menu"
              onClick={closeMenu}
              onKeyDown={event => {
                if (event.key !== "ArrowDown") return;
                event.preventDefault();
                openServicesMenu();
                requestAnimationFrame(() => {
                  document
                    .querySelector<HTMLAnchorElement>("#desktop-services-mega-menu .future-services-mega-grid a")
                    ?.focus();
                });
              }}
            >
              Services
              <ChevronDown
                className={`future-services-chevron${servicesOpen ? " is-open" : ""}`}
                size={13}
                aria-hidden="true"
              />
              <NavigationFeedback />
            </Link>

            <AnimatePresence>
              {servicesOpen ? (
                <motion.div
                  id="desktop-services-mega-menu"
                  className="future-services-mega-menu"
                  aria-label="Services"
                  initial={{ opacity: 0, y: -10, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.99 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={openServicesMenu}
                  onMouseLeave={scheduleServicesClose}
                >
                  <div className="future-services-mega-head">
                    <div>
                      <span>ENGINEERING CAPABILITIES</span>
                      <strong>From intelligence to production.</strong>
                    </div>
                    <Link href="/services" onClick={closeMenu}>
                      All services <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </div>

                  <div className="future-services-mega-grid">
                    {serviceLinks.map(item => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={navActive(item.href) ? "active" : undefined}
                          onClick={closeMenu}
                        >
                          <span className="future-services-mega-icon">
                            <Icon size={19} strokeWidth={1.55} aria-hidden="true" />
                          </span>
                          <span className="future-services-mega-copy">
                            <strong>{item.title}</strong>
                            <small>{item.copy}</small>
                          </span>
                          <ArrowRight
                            className="future-services-mega-arrow"
                            size={14}
                            aria-hidden="true"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {navigation.slice(1).map(item => (
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
            <div className="future-mobile-services">
              <button
                type="button"
                className={`future-mobile-services-toggle${navActive("/services") ? " active" : ""}`}
                aria-expanded={mobileServicesOpen}
                aria-controls="mobile-services-panel"
                onClick={() => setMobileServicesOpen(value => !value)}
              >
                <span>Services</span>
                <ChevronDown
                  className={`future-mobile-services-chevron${mobileServicesOpen ? " is-open" : ""}`}
                  size={17}
                  aria-hidden="true"
                />
              </button>

              <div
                id="mobile-services-panel"
                className={`future-mobile-services-panel${mobileServicesOpen ? " is-open" : ""}`}
                aria-hidden={!mobileServicesOpen}
                inert={!mobileServicesOpen}
              >
                <div className="future-mobile-services-inner">
                  {serviceLinks.map(item => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={navActive(item.href) ? "active" : undefined}
                        onClick={closeMenu}
                      >
                        <span className="future-mobile-services-icon">
                          <Icon size={17} strokeWidth={1.55} aria-hidden="true" />
                        </span>
                        <span>{item.title}</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    );
                  })}
                  <Link
                    href="/services"
                    className="future-mobile-services-all"
                    onClick={closeMenu}
                  >
                    View all services <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            {navigation.slice(1).map(item => (
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
