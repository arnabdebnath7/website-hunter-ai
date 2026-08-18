import { memo, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Smartphone,
  CreditCard,
  Banknote,
  ArrowLeft,
  Check,
  Loader2,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";
import { menuItemById, WA_LINK, type MenuItem } from "../lib/data";
import { saveOrder } from "../lib/firebase";
import type { NiketaUser } from "../lib/user";
import { easeLux } from "./Reveal";

export type CartItems = Record<string, number>;
type Method = "upi" | "card" | "cod";
type View = "cart" | "pay" | "success";

const GST_RATE = 0.05;
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

interface Props {
  open: boolean;
  items: CartItems;
  onClose: () => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onClear: () => void;
  user: NiketaUser | null;
  onRequireAuth: () => void;
}

const field =
  "field-input w-full rounded-xl border border-cream/10 px-4 py-3.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors duration-300 focus:border-gold/50";

function CartDrawer({
  open,
  items,
  onClose,
  onInc,
  onDec,
  onClear,
  user,
  onRequireAuth,
}: Props) {
  const [view, setView] = useState<View>("cart");
  const [method, setMethod] = useState<Method>("upi");
  const [processing, setProcessing] = useState(false);

  // payment fields
  const [upiId, setUpiId] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [orderId, setOrderId] = useState("");

  const entries: Array<{ item: MenuItem; qty: number }> = useMemo(
    () =>
      Object.entries(items)
        .map(([id, qty]) => ({ item: menuItemById[id], qty }))
        .filter((e): e is { item: MenuItem; qty: number } => Boolean(e.item) && e.qty > 0),
    [items]
  );

  const subtotal = entries.reduce((s, e) => s + e.item.price * e.qty, 0);
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;

  const upiValid = /.+@.+/.test(upiId.trim());
  const cardDigits = cardNumber.replace(/\s/g, "");
  const cardValid =
    cardName.trim().length >= 2 &&
    cardDigits.length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvv.length === 3;
  const canPay = method === "cod" ? true : method === "upi" ? upiValid : cardValid;

  const signedIn = !!user && !user.guest;
  const firstName = user?.name.split(" ")[0] ?? null;

  useEffect(() => {
    if (open) {
      setView("cart");
      setProcessing(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  const pay = () => {
    if (!canPay || processing) return;
    setProcessing(true);
    const oid = `NKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const snapshot = {
      orderId: oid,
      method: methodLabel,
      items: entries.map((e) => ({ id: e.item.id, name: e.item.name, qty: e.qty, price: e.item.price })),
      subtotal,
      gst,
      total,
      itemCount: entries.reduce((s, e) => s + e.qty, 0),
      customer: user && !user.guest ? user.email ?? user.name : null,
    };
    window.setTimeout(() => {
      // persist to Firebase — never blocks checkout if it fails
      void saveOrder(snapshot);
      setPaidAmount(total);
      setOrderId(oid);
      setProcessing(false);
      setView("success");
      onClear();
    }, 1700);
  };

  const methodLabel = method === "upi" ? "UPI" : method === "card" ? "Card" : "Cash on Delivery";

  const browse = () => {
    onClose();
    window.setTimeout(() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }), 150);
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
          className="fixed inset-0 z-[100] bg-ink/70 backdrop-blur-md"
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your order and checkout"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.65, ease: easeLux }}
            onClick={(e) => e.stopPropagation()}
            className="glass-deep absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-gold/15"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-cream/[0.08] px-6 py-5">
              <div className="flex items-center gap-3">
                {view === "pay" && (
                  <button
                    onClick={() => setView("cart")}
                    aria-label="Back to order"
                    className="btn-ghost flex h-11 w-11 items-center justify-center rounded-full text-cream"
                  >
                    <ArrowLeft size={15} aria-hidden="true" />
                  </button>
                )}
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                  <ShoppingBag size={17} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold leading-none text-cream">
                    {view === "cart" ? "Your Order" : view === "pay" ? "Payment" : "Order Confirmed"}
                  </h3>
                  <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.26em] text-gold">
                    {firstName ? `Hi ${firstName} · ` : ""}Restaurant Niketa · Demo Checkout
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close order panel"
                className="btn-ghost flex h-11 w-11 items-center justify-center rounded-full text-cream"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {/* body */}
            <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-6">
              {view === "cart" && (
                <>
                  {entries.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/20 bg-gold/[0.05] text-gold/60">
                        <ShoppingBag size={30} aria-hidden="true" />
                      </span>
                      <p className="mt-6 font-display text-2xl text-cream">Your order is empty</p>
                      <p className="mt-2 max-w-[250px] text-xs leading-relaxed text-smoke">
                        Add a few signatures from the menu — the biryani is calling.
                      </p>
                      <button
                        onClick={browse}
                        className="btn-gold mt-8 rounded-full px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.24em]"
                      >
                        Browse the Menu
                      </button>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      <AnimatePresence initial={false}>
                        {entries.map(({ item, qty }) => (
                          <motion.li
                            layout
                            key={item.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                            className="glass flex items-center gap-4 rounded-2xl p-4"
                          >
                            {item.img ? (
                              <span className="block h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                                <img
                                  src={item.img}
                                  alt=""
                                  loading="lazy"
                                  decoding="async"
                                  className="h-full w-full object-cover"
                                />
                              </span>
                            ) : (
                              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/[0.07] text-gold">
                                <UtensilsCrossed size={20} strokeWidth={1.5} aria-hidden="true" />
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-display text-lg font-semibold leading-tight text-cream">
                                {item.name}
                              </p>
                              <p className="mt-1 text-[11px] text-smoke">{inr(item.price)} each</p>
                              <div className="mt-2 flex items-center gap-3">
                                <button
                                  onClick={() => onDec(item.id)}
                                  aria-label={qty === 1 ? `Remove ${item.name} from order` : `Decrease ${item.name} quantity`}
                                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-gold/50 hover:text-gold"
                                >
                                  {qty === 1 ? (
                                    <Trash2 size={13} aria-hidden="true" />
                                  ) : (
                                    <Minus size={13} aria-hidden="true" />
                                  )}
                                </button>
                                <span className="min-w-[1.2rem] text-center font-display text-base font-semibold text-cream" aria-live="polite">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => onInc(item.id)}
                                  aria-label={`Increase ${item.name} quantity`}
                                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-gold/50 hover:text-gold"
                                >
                                  <Plus size={13} aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                            <span className="w-[4.5rem] shrink-0 self-center text-right font-display text-lg font-semibold text-gold-soft">
                              {inr(item.price * qty)}
                            </span>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </>
              )}

              {view === "pay" && (
                <>
                  {/* account banner */}
                  {signedIn ? (
                    <div className="glass mb-5 flex items-center gap-3 rounded-2xl p-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center bg-gold/15 font-display text-sm font-semibold text-gold">
                            {(firstName?.[0] ?? "G").toUpperCase()}
                          </span>
                        )}
                      </span>
                      <p className="min-w-0 text-[12px] leading-snug text-cream/85">
                        Ordering as <span className="font-semibold text-gold">{firstName}</span>
                        {user?.email && (
                          <span className="block truncate text-[10px] text-smoke">{user.email}</span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={onRequireAuth}
                      className="glass mb-5 flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition-colors duration-300 hover:border-gold/40"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-display text-base font-bold text-[#4285F4] shadow-sm">
                        G
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] font-semibold text-cream">
                          Sign in with Google
                        </span>
                        <span className="block text-[10px] text-smoke">
                          Faster checkout · saved orders
                        </span>
                      </span>
                    </button>
                  )}

                  {/* method tabs */}
                  <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Payment method">
                    {(
                      [
                        { id: "upi", label: "UPI", icon: Smartphone },
                        { id: "card", label: "Card", icon: CreditCard },
                        { id: "cod", label: "Cash", icon: Banknote },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        role="tab"
                        aria-selected={method === m.id}
                        onClick={() => setMethod(m.id)}
                        className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-400 ${
                          method === m.id
                            ? "border-gold/60 bg-gold/10 text-gold"
                            : "border-cream/10 text-cream/50 hover:border-cream/25 hover:text-cream"
                        }`}
                      >
                        <m.icon size={19} aria-hidden="true" />
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6">
                    {method === "upi" && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="pay-upi" className="mb-2 block text-[9px] font-bold uppercase tracking-[0.3em] text-gold/80">
                            UPI ID
                          </label>
                          <input
                            id="pay-upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="yourname@upi"
                            autoComplete="off"
                            inputMode="email"
                            className={field}
                          />
                        </div>
                        <div className="glass flex items-center gap-3 rounded-2xl p-5">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-leaf/40 bg-leaf/10 text-leaf">
                            <ShieldCheck size={16} aria-hidden="true" />
                          </span>
                          <p className="text-[11px] leading-relaxed text-smoke">
                            A collect request will be sent to your UPI app. This is a
                            <span className="font-semibold text-gold"> demo checkout </span>
                            — no real money is charged.
                          </p>
                        </div>
                      </div>
                    )}

                    {method === "card" && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="pay-name" className="mb-2 block text-[9px] font-bold uppercase tracking-[0.3em] text-gold/80">
                            Name on Card
                          </label>
                          <input
                            id="pay-name"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Full name"
                            autoComplete="cc-name"
                            className={field}
                          />
                        </div>
                        <div>
                          <label htmlFor="pay-card" className="mb-2 block text-[9px] font-bold uppercase tracking-[0.3em] text-gold/80">
                            Card Number
                          </label>
                          <input
                            id="pay-card"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCard(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            className={field}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="pay-exp" className="mb-2 block text-[9px] font-bold uppercase tracking-[0.3em] text-gold/80">
                              Expiry
                            </label>
                            <input
                              id="pay-exp"
                              value={expiry}
                              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                              placeholder="MM/YY"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              className={field}
                            />
                          </div>
                          <div>
                            <label htmlFor="pay-cvv" className="mb-2 block text-[9px] font-bold uppercase tracking-[0.3em] text-gold/80">
                              CVV
                            </label>
                            <input
                              id="pay-cvv"
                              type="password"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                              placeholder="•••"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              className={field}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {method === "cod" && (
                      <div className="glass rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                            <Banknote size={17} aria-hidden="true" />
                          </span>
                          <p className="font-display text-lg font-semibold text-cream">
                            Pay at the table or on delivery
                          </p>
                        </div>
                        <p className="mt-3 text-[12px] leading-relaxed text-smoke">
                          Confirm your order now and pay in cash or UPI when your food arrives.
                          This is a <span className="font-semibold text-gold">demo checkout</span>
                          — no real order is placed.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {view === "success" && (
                <div className="flex h-full flex-col items-center justify-center text-center" role="alert" aria-live="polite">
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: easeLux }}
                    className="relative flex h-20 w-20 items-center justify-center rounded-full border border-leaf/40 bg-leaf/10 text-leaf"
                  >
                    <span className="animate-pulse-ring absolute inset-0 rounded-full bg-leaf/40" aria-hidden="true" />
                    <Check size={34} strokeWidth={2.4} aria-hidden="true" />
                  </motion.span>
                  <p className="mt-8 font-display text-3xl font-semibold text-cream">Order Placed!</p>
                  <p className="mt-2 text-xs text-smoke">
                    Order <span className="font-semibold text-gold">{orderId}</span> · {methodLabel} ·{" "}
                    {inr(paidAmount)}
                  </p>
                  <div className="glass mt-8 w-full rounded-2xl p-5">
                    <p className="text-[12px] leading-relaxed text-smoke">
                      Our kitchen will start right away — expected in 30–40 minutes. This was a
                      demo checkout, so no real payment was processed.
                    </p>
                  </div>
                  <a
                    href={`${WA_LINK}?text=${encodeURIComponent(`Hello Restaurant Niketa! I just placed demo order ${orderId} of ${inr(paidAmount)}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost mt-6 rounded-full px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cream"
                  >
                    Share on WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* footer */}
            {view !== "success" && entries.length > 0 && (
              <div className="border-t border-cream/[0.08] px-6 py-6">
                <dl className="space-y-2 text-[13px]">
                  <div className="flex justify-between text-smoke">
                    <dt>Subtotal</dt>
                    <dd className="text-cream/85">{inr(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-smoke">
                    <dt>GST (5%)</dt>
                    <dd className="text-cream/85">{inr(gst)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-cream/[0.08] pt-3 text-base">
                    <dt className="font-semibold text-cream">Total</dt>
                    <dd className="font-display text-xl font-semibold text-gold-soft">{inr(total)}</dd>
                  </div>
                </dl>

                {view === "cart" ? (
                  <button
                    onClick={() => setView("pay")}
                    className="btn-gold mt-5 w-full rounded-full py-4 text-[11px] font-bold uppercase tracking-[0.26em]"
                  >
                    Proceed to Pay · {inr(total)}
                  </button>
                ) : (
                  <button
                    onClick={pay}
                    disabled={!canPay || processing}
                    aria-disabled={!canPay || processing}
                    className="btn-gold mt-5 flex w-full items-center justify-center gap-3 rounded-full py-4 text-[11px] font-bold uppercase tracking-[0.26em] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {processing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                        Processing…
                      </>
                    ) : method === "cod" ? (
                      "Confirm Order"
                    ) : (
                      `Pay ${inr(total)}`
                    )}
                  </button>
                )}
                <p className="mt-3.5 text-center text-[10px] uppercase tracking-[0.24em] text-smoke/70">
                  Demo checkout · No real payment
                </p>
              </div>
            )}

            {view === "success" && (
              <div className="border-t border-cream/[0.08] px-6 py-6">
                <button
                  onClick={onClose}
                  className="btn-gold w-full rounded-full py-4 text-[11px] font-bold uppercase tracking-[0.26em]"
                >
                  Done
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(CartDrawer);
