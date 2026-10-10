"use client";

import Link, { useLinkStatus } from "next/link";
import { lockPageScroll } from "./scrollLock";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  ChevronDown,
  Code2,
  Database,
  Menu,
  X,
} from "lucide-react";
import { capabilityGroups, siteConfig } from "../config/site";
import { BrandLogo } from "./BrandLogo";
import { BookingButton } from "./CalBooking";

function NavigationFeedback() {
  const { pending } = useLinkStatus();
  return pending
    ? createPortal(
        <span className="navigation-pending" role="status"><span className="sr-only">Loading page…</span></span>,
        document.body,
      )
    : null;
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const megaToggle = useRef<HTMLButtonElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const mobileDialog = useRef<HTMLDialogElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const icons = [BrainCircuit, Code2, Database];
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const capabilitiesActive = active("/capabilities") || active("/services");

  function clearTimer() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }

  function closeMenus() {
    clearTimer();
    setOpen(false);
    setMegaOpen(false);
  }

  function hoverMenu(show: boolean) {
    clearTimer();
    hoverTimer.current = setTimeout(() => setMegaOpen(show), show ? 110 : 180);
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
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        setOpen(false);
        setMegaOpen(false);
      }
    }

    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (megaOpen) {
        setMegaOpen(false);
        megaToggle.current?.focus();
      } else if (open) {
        setOpen(false);
        mobileToggle.current?.focus();
      }
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    }

    const breakpoint = window.matchMedia("(max-width: 1200px)");
    function resize() {
      setOpen(false);
      setMegaOpen(false);
    }

    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    breakpoint.addEventListener("change", resize);

    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      breakpoint.removeEventListener("change", resize);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, [open, megaOpen]);

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
      className={`site-header future-site-header${scrolled ? " is-scrolled" : ""}`}
      ref={headerRef}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) closeMenus();
      }}
    >
      <div className="container-shell nav-shell future-nav-shell">
        <div className="future-brand-wrap" onClick={closeMenus}>
          <BrandLogo priority />
          <span className="future-brand-status" aria-label="Systems operational"><i />LIVE</span>
        </div>

        <nav className="desktop-nav future-desktop-nav" aria-label="Primary navigation">
          {siteConfig.navigation.map(item => item.href === "/capabilities" ? (
            <div
              className="nav-capabilities"
              key={item.href}
              onPointerEnter={event => { if (event.pointerType === "mouse") hoverMenu(true); }}
              onPointerLeave={event => { if (event.pointerType === "mouse") hoverMenu(false); }}
            >
              <Link
                href={item.href}
                className={`nav-link future-nav-link${capabilitiesActive || megaOpen ? " active" : ""}`}
                aria-current={active(item.href) ? "page" : undefined}
                onClick={closeMenus}
              >
                {item.label}<NavigationFeedback />
              </Link>
              <button
                ref={megaToggle}
                type="button"
                className="nav-dropdown-toggle future-dropdown-toggle"
                aria-label="Toggle capabilities menu"
                aria-expanded={megaOpen}
                aria-controls="capabilities-menu"
                onClick={() => { clearTimer(); setMegaOpen(value => !value); }}
              >
                <ChevronDown size={14} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link future-nav-link${active(item.href) ? " active" : ""}`}
              aria-current={active(item.href) ? "page" : undefined}
              onClick={closeMenus}
              onPointerEnter={event => {
                if (event.pointerType === "mouse") {
                  clearTimer();
                  setMegaOpen(false);
                }
              }}
            >
              {item.label}<NavigationFeedback />
            </Link>
          ))}
        </nav>

        <div className="nav-actions future-nav-actions">
          <div onClick={closeMenus} className="desktop-booking">
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
            onClick={() => { setMegaOpen(false); setOpen(value => !value); }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        id="capabilities-menu"
        className="mega-menu container-shell future-mega-menu"
        hidden={!megaOpen}
        onPointerEnter={clearTimer}
        onPointerLeave={event => { if (event.pointerType === "mouse") hoverMenu(false); }}
      >
        <div className="future-mega-eyebrow"><span>ENGINEERING SYSTEM</span><strong>Explore by capability</strong></div>
        <nav className="mega-columns" aria-label="Capabilities">
          {capabilityGroups.map((group, index) => {
            const Icon = icons[index];
            return (
              <div className="mega-group" key={group.title}>
                <div className="mega-title">
                  <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
                  <Link href={group.href} onClick={closeMenus}>{group.title}</Link>
                </div>
                <p>{group.description}</p>
                <ul>
                  {group.items.map(([label, href]) => (
                    <li key={label}><Link href={href} onClick={closeMenus}>{label}<ArrowRight size={14} aria-hidden="true" /></Link></li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
        <Link href="/capabilities" className="mega-all" onClick={closeMenus}>
          Explore all capabilities <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <dialog
        ref={mobileDialog}
        id="mobile-navigation"
        className="mobile-nav-panel future-mobile-nav-panel"
        aria-label="OSYSTIC navigation"
        onCancel={event => { event.preventDefault(); closeMenus(); }}
        onClick={event => { if (event.target === event.currentTarget) closeMenus(); }}
      >
        <div className="mobile-drawer-content future-mobile-drawer">
          <div className="mobile-drawer-head future-mobile-drawer-head">
            <BrandLogo compact />
            <button type="button" className="mobile-menu-button future-mobile-menu-button" aria-label="Close navigation" onClick={closeMenus} autoFocus>
              <X size={22} />
            </button>
          </div>

          <nav className="container-shell mobile-nav future-mobile-nav" aria-label="Mobile navigation">
            {siteConfig.navigation.map(item => item.href === "/capabilities" ? (
              <div key={item.href} className="mobile-capabilities">
                <Link href={item.href} className={capabilitiesActive ? "active" : undefined} aria-current={active(item.href) ? "page" : undefined} onClick={closeMenus}>
                  {item.label}<NavigationFeedback /><ArrowRight size={16} />
                </Link>
                {capabilityGroups.map(group => (
                  <details key={group.title}>
                    <summary>{group.title}<ChevronDown size={16} aria-hidden="true" /></summary>
                    <ul>{group.items.map(([label, href]) => <li key={label}><Link href={href} onClick={closeMenus}>{label}</Link></li>)}</ul>
                  </details>
                ))}
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={active(item.href) ? "active" : undefined} aria-current={active(item.href) ? "page" : undefined} onClick={closeMenus}>
                {item.label}<NavigationFeedback /><ArrowRight size={16} />
              </Link>
            ))}

            <div className="future-mobile-actions">
              <div onClick={closeMenus}>
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
