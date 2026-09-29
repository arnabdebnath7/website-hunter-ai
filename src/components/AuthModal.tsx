import { memo, useEffect, useState } from "react";
import { NIKETA_LOGO_DATA_URL } from "../lib/brand-images";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserRound } from "lucide-react";
import { easeLux } from "./Reveal";
import { signInWithGoogle, firebaseConfigured } from "../lib/firebase";

export type { NiketaUser } from "../lib/user";

function GoogleMark() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-display text-lg font-bold text-[#4285F4] shadow-sm">
      G
    </span>
  );
}

function AuthModal({
  open,
  onClose,
  onGuest,
}: {
  open: boolean;
  onClose: () => void;
  onGuest: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setBusy(false);
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", esc);
    };
  }, [open, onClose]);

  const google = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (e) {
      const err = e as { code?: string };
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        /* user closed — stay silent */
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain needs to be added in Firebase → Authentication → Authorized domains.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Google sign-in is not enabled yet — enable it in Firebase → Authentication → Sign-in method.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error — check your connection and try again.");
      } else if ((e as Error).message === "firebase-not-configured") {
        setError("Firebase keys are missing — paste your config in src/lib/firebase.ts.");
      } else {
        setError("Sign-in could not be completed. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          className="fixed inset-0 z-[110] flex items-end justify-center bg-ink/75 p-0 backdrop-blur-xl sm:items-center sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            initial={{ opacity: 0, y: 70, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.97 }}
            transition={{ duration: 0.6, ease: easeLux }}
            onClick={(e) => e.stopPropagation()}
            className="glass-deep w-full max-w-sm rounded-t-3xl p-8 text-center sm:rounded-3xl"
          >
            <div className="flex justify-end">
              <button
                onClick={onClose}
                aria-label="Close sign-in dialog"
                className="btn-ghost flex h-11 w-11 items-center justify-center rounded-full text-cream"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            <span className="mx-auto -mt-4 block h-16 w-16 overflow-hidden rounded-full ring-1 ring-gold/50">
              <img src="NIKETA_LOGO_DATA_URL" alt="Restaurant Niketa" className="h-full w-full object-cover" />
            </span>
            <h3 id="auth-title" className="mt-5 font-display text-3xl font-semibold text-cream">
              Welcome to <span className="italic text-gold-grad">Restaurant Niketa</span>
            </h3>
            <p className="mx-auto mt-2 max-w-[260px] text-xs leading-relaxed text-smoke">
              Sign in to save your orders and check out faster.
            </p>

            <button
              onClick={google}
              disabled={busy}
              className={`mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full py-4 text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-400 ${
                busy
                  ? "cursor-wait bg-white/70 text-slate-500"
                  : "bg-white text-slate-800 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(255,255,255,0.35)]"
              }`}
            >
              <GoogleMark />
              {busy ? "Connecting\u2026" : "Continue with Google"}
            </button>

            {!firebaseConfigured && (
              <p className="mt-4 rounded-xl border border-gold/25 bg-gold/[0.06] px-4 py-3 text-[10px] leading-relaxed tracking-wide text-gold-soft">
                Owner setup needed: paste your Firebase config in{" "}
                <span className="font-semibold">src/lib/firebase.ts</span> and enable Google sign-in
                in the Firebase console.
              </p>
            )}

            {error && (
              <p className="mt-4 rounded-xl border border-wine/40 bg-wine/10 px-4 py-3 text-[11px] leading-relaxed text-cream/85" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center gap-4" aria-hidden="true">
              <span className="hairline flex-1" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-smoke/60">or</span>
              <span className="hairline flex-1" />
            </div>

            <button
              onClick={onGuest}
              className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-smoke transition-colors hover:text-gold"
            >
              <UserRound size={13} className="text-gold" aria-hidden="true" />
              Continue as guest
            </button>

            <p className="mt-8 text-[9px] uppercase tracking-[0.26em] text-smoke/50">
              Secured by Firebase Authentication
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(AuthModal);
