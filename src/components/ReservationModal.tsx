import { memo, useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarCheck, Check, Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL, WA_LINK } from "../lib/data";
import { saveReservation } from "../lib/firebase";
import type { NiketaUser } from "./AuthModal";
import { easeLux } from "./Reveal";

const times = [
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM",
  "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM",
];
const guestOptions = ["2 Guests", "3 Guests", "4 Guests", "5 Guests", "6 Guests", "8 Guests", "10+ Guests"];

const field =
  "field-input w-full rounded-xl border border-cream/10 px-4 py-3.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors duration-300 focus:border-gold/50";

const label = "mb-2 block text-[9px] font-bold uppercase tracking-[0.3em] text-gold/80";

function ReservationModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: NiketaUser | null;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(times[0]);
  const [guests, setGuests] = useState(guestOptions[1]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    setSent(false);
    if (user && !user.guest) {
      setName((n) => n || user.name);
      if (user.phone) setPhone((p) => p || user.phone || "");
    }
    const id = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input, select")?.focus();
    }, 350);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(id);
      window.removeEventListener("keydown", esc);
      prevFocus.current?.focus();
    };
  }, [open, onClose]);

  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // persist to Firebase — never blocks the guest flow if it fails
    void saveReservation({
      name: name.trim(),
      phone: phone.trim(),
      date,
      time,
      guests,
      note: note.trim() || null,
    });
    const msg = `Hello Restaurant Niketa! I would like to reserve a table.\n\nName: ${name}\nPhone: ${phone}\nGuests: ${guests}\nDate: ${date}\nTime: ${time}${
      note ? `\nNote: ${note}` : ""
    }`;
    window.open(`${WA_LINK}?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
    window.setTimeout(onClose, 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/75 p-0 backdrop-blur-xl sm:items-center sm:p-6"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reserve-title"
            onKeyDown={trapTab}
            initial={{ opacity: 0, y: 90, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ duration: 0.7, ease: easeLux }}
            onClick={(e) => e.stopPropagation()}
            className="glass-deep no-scrollbar max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-3xl p-6 sm:rounded-3xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <CalendarCheck size={18} className="text-gold" aria-hidden="true" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-gold">
                    Niketa · Contai
                  </span>
                </div>
                <h3 id="reserve-title" className="mt-3 font-display text-3xl font-semibold text-cream">
                  Reserve Your <span className="italic text-gold-grad">Table</span>
                </h3>
                <p className="mt-2 text-xs text-smoke">We confirm instantly on WhatsApp.</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close reservation dialog"
                className="btn-ghost flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cream"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {sent ? (
              <div className="flex flex-col items-center py-12 text-center" role="alert" aria-live="polite">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-leaf/40 bg-leaf/10 text-leaf">
                  <Check size={26} aria-hidden="true" />
                </span>
                <p className="mt-5 font-display text-2xl text-cream">Opening WhatsApp…</p>
                <p className="mt-2 text-xs text-smoke">Your reservation details are ready to send.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={label} htmlFor="r-name">Your Name</label>
                    <input id="r-name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={field} />
                  </div>
                  <div>
                    <label className={label} htmlFor="r-phone">Phone</label>
                    <input id="r-phone" required type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile number" className={field} />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className={label} htmlFor="r-date">Date</label>
                    <input id="r-date" required type="date" min={new Date().toISOString().split("T")[0]} value={date} onChange={(e) => setDate(e.target.value)} className={field} />
                  </div>
                  <div>
                    <label className={label} htmlFor="r-time">Time</label>
                    <select id="r-time" value={time} onChange={(e) => setTime(e.target.value)} className={field}>
                      {times.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={label} htmlFor="r-guests">Guests</label>
                    <select id="r-guests" value={guests} onChange={(e) => setGuests(e.target.value)} className={field}>
                      {guestOptions.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={label} htmlFor="r-note">
                    Special Request <span className="normal-case tracking-normal text-cream/30">(optional)</span>
                  </label>
                  <textarea id="r-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anniversary, window seat, extra spicy…" className={`${field} resize-none`} />
                </div>
                <button type="submit" className="btn-gold w-full rounded-full py-4 text-[11px] font-bold uppercase tracking-[0.26em]">
                  Confirm via WhatsApp
                </button>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="flex items-center justify-center gap-2 py-1 text-[11px] tracking-[0.14em] text-smoke transition-colors hover:text-gold"
                >
                  <Phone size={12} className="text-gold" aria-hidden="true" />
                  or call us — {PHONE_DISPLAY}
                </a>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(ReservationModal);
