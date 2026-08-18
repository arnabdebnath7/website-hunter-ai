import { memo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Sun, Moon, ShoppingBag, UserRound, LogOut } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL } from "../lib/data";
import { useActiveSection } from "../lib/hooks";
import type { NiketaUser } from "../lib/user";
import { easeLux } from "./Reveal";

const links = [
  { label: "Menu", href: "#menu" },
  { label: "Why Us", href: "#why-us" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function ThemeIcon({ light }: { light: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={light ? "moon" : "sun"}
        initial={{ y: 12, opacity: 0, rotate: 70 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: -12, opacity: 0, rotate: -70 }}
        transition={{ duration: 0.45, ease: easeLux }}
        className="flex"
      >
        {light ? <Moon size={15} aria-hidden="true" /> : <Sun size={15} aria-hidden="true" />}
      </motion.span>
    </AnimatePresence>
  );
}

function initialsOf(name?: string) {
  return (name ?? "G")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function Navbar({
  onReserve,
  light,
  onToggleTheme,
  cartCount,
  onOpenCart,
  user,
  onOpenAuth,
  onSignOut,
}: {
  onReserve: () => void;
  light: boolean;
  onToggleTheme: () => void;
  cartCount: number;
  onOpenCart: () => void;
  user: NiketaUser | null;
  onOpenAuth: () => void;
  onSignOut: () => Promise<void>;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const active = useActiveSection();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const away = (e: PointerEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener("pointerdown", away);
    return () => window.removeEventListener("pointerdown", away);
  }, [profileOpen]);

  const profileButton = user ? (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setProfileOpen((v) => !v)}
        aria-label={profileOpen ? "Close account menu" : "Open account menu"}
        aria-expanded={profileOpen}
        aria-haspopup="menu"
        className="btn-ghost relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-gold"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            width={40}
            height={40}
            referrerPolicy="no-referrer"
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-display text-sm font-semibold text-gold">
            {initialsOf(user.name)}
          </span>
        )}
      </button>
      <AnimatePresence>
        {profileOpen && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.35, ease: easeLux }}
            className="glass-deep absolute right-0 top-12 z-50 w-60 rounded-2xl p-4"
          >
            <p className="truncate font-display text-lg font-semibold text-cream">{user.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-smoke">
              {user.email ?? user.phone ?? "Guest session"}
            </p>
            <button
              role="menuitem"
              onClick={() => {
                setProfileOpen(false);
                void onSignOut();
              }}
              className="btn-ghost mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cream"
            >
              <LogOut size={13} aria-hidden="true" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <button
      onClick={onOpenAuth}
      aria-label="Sign in to your account"
      className="btn-ghost inline-flex h-10 w-10 items-center justify-center rounded-full text-cream"
    >
      <UserRound size={15} aria-hidden="true" />
    </button>
  );

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1.7, ease: easeLux }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-deep py-2 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.6)]"
            : "bg-transparent py-3.5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between pl-4 pr-2 sm:pl-5 sm:pr-4">
          {/* brand */}
          <a
            href="#home"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Restaurant Niketa — back to top"
          >
            <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/50 transition-transform duration-500 group-hover:scale-105 sm:h-10 sm:w-10">
              <img
                src="/images/logo.jpg"
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="flex flex-col justify-center leading-none">
              <span className="font-display text-[14px] italic leading-none tracking-[0.16em] text-gold sm:text-[15px]">
                Restaurant
              </span>
              <span className="mt-[3px] font-display text-[1.36rem] font-semibold leading-none tracking-wide text-cream">
                Niketa
              </span>
            </span>
          </a>

          {/* links */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {links.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`nav-link text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 hover:text-cream ${
                    isActive ? "is-active" : "text-cream/70"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          {/* actions — profile · cart · theme · reserve · menu on one baseline */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${PHONE_TEL}`}
              className="mr-1 hidden items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-cream/70 transition-colors hover:text-gold md:flex"
              aria-label={`Call us at ${PHONE_DISPLAY}`}
            >
              <Phone size={13} className="text-gold" aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>

            {profileButton}

            <button
              onClick={onOpenCart}
              aria-label={cartCount > 0 ? `Open your order, ${cartCount} items` : "Open your order, empty"}
              className="btn-ghost relative inline-flex h-10 w-10 items-center justify-center rounded-full text-cream"
            >
              <ShoppingBag size={15} aria-hidden="true" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.35, ease: easeLux }}
                    className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold px-1 text-[9px] font-bold text-ongold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={onToggleTheme}
              aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
              aria-pressed={light}
              className="btn-ghost inline-flex h-10 w-10 items-center justify-center rounded-full text-cream"
            >
              <ThemeIcon light={light} />
            </button>

            <button
              onClick={onReserve}
              className="btn-gold ml-1 hidden items-center rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] sm:inline-flex"
            >
              Reserve
            </button>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="btn-ghost inline-flex h-10 w-10 items-center justify-center rounded-full text-cream lg:hidden"
            >
              <Menu size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[80] bg-ink/80 backdrop-blur-2xl"
          >
            <div className="flex h-full flex-col px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="flex flex-col leading-none">
                  <span className="font-display text-[15px] italic leading-none tracking-[0.16em] text-gold">
                    Restaurant
                  </span>
                  <span className="mt-[3px] font-display text-xl font-semibold leading-none text-cream">
                    Niketa
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onToggleTheme}
                    aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
                    className="btn-ghost inline-flex h-10 w-10 items-center justify-center rounded-full text-cream"
                  >
                    <ThemeIcon light={light} />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close navigation menu"
                    className="btn-ghost inline-flex h-10 w-10 items-center justify-center rounded-full text-cream"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <nav className="flex flex-1 flex-col items-start justify-center gap-1" aria-label="Mobile">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={active === l.href.slice(1) ? "true" : undefined}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.08 + i * 0.07, ease: easeLux }}
                    className="group flex items-baseline gap-4 py-2"
                  >
                    <span className="text-[10px] font-bold tracking-[0.3em] text-gold/70">0{i + 1}</span>
                    <span
                      className={`font-display text-4xl font-medium transition-colors group-hover:text-gold sm:text-5xl ${
                        active === l.href.slice(1) ? "text-gold" : "text-cream"
                      }`}
                    >
                      {l.label}
                    </span>
                  </motion.a>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: easeLux }}
                className="flex items-center justify-between gap-4 border-t border-gold/10 pt-5"
              >
                <a href={`tel:${PHONE_TEL}`} className="text-xs tracking-[0.14em] text-smoke">
                  {PHONE_DISPLAY}
                </a>
                <button
                  onClick={() => {
                    setOpen(false);
                    onReserve();
                  }}
                  className="btn-gold rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em]"
                >
                  Reserve Table
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(Navbar);
