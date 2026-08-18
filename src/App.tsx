import { useCallback, useMemo, useState, useEffect } from "react";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Dishes from "./components/Dishes";
import WhyUs from "./components/WhyUs";
import Reviews from "./components/Reviews";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ReservationModal from "./components/ReservationModal";
import CartDrawer, { type CartItems } from "./components/CartDrawer";
import AuthModal from "./components/AuthModal";
import { watchAuth, signOutUser } from "./lib/firebase";
import type { NiketaUser } from "./lib/user";
import type { MenuItem } from "./lib/data";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cart, setCart] = useState<CartItems>({});
  const [user, setUser] = useState<NiketaUser | null>(null);
  const [light, setLight] = useState<boolean>(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("light")
  );

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 1500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  /* firebase auth state */
  useEffect(() => {
    const unsub = watchAuth((fu) => {
      if (fu) {
        setUser({
          name: fu.displayName ?? "Niketa Guest",
          email: fu.email,
          phone: fu.phoneNumber,
          photoURL: fu.photoURL,
        });
      } else {
        setUser((u) => (u?.guest ? u : null));
      }
    });
    return unsub;
  }, []);

  const toggleTheme = useCallback(() => {
    setLight((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("light", next);
      try {
        localStorage.setItem("niketa-theme", next ? "light" : "dark");
      } catch {
        /* storage unavailable */
      }
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", next ? "#f6f1e6" : "#0a0806");
      return next;
    });
  }, []);

  const openReserve = useCallback(() => setReserveOpen(true), []);
  const closeReserve = useCallback(() => setReserveOpen(false), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openAuth = useCallback(() => setAuthOpen(true), []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const continueAsGuest = useCallback(() => {
    setUser({ name: "Guest", guest: true });
    setAuthOpen(false);
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
    setUser(null);
  }, []);

  const addToCart = useCallback((d: MenuItem) => {
    setCart((c) => ({ ...c, [d.id]: (c[d.id] ?? 0) + 1 }));
  }, []);
  const incQty = useCallback((id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }, []);
  const decQty = useCallback((id: string) => {
    setCart((c) => {
      const next = { ...c };
      const q = (next[id] ?? 0) - 1;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  }, []);
  const clearCart = useCallback(() => setCart({}), []);

  const cartCount = useMemo(() => Object.values(cart).reduce((s, q) => s + q, 0), [cart]);

  return (
    <div className="relative min-h-screen bg-ink font-body text-cream transition-colors duration-500">
      <a
        href="#main-content"
        className="skip-link btn-gold rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em]"
      >
        Skip to content
      </a>

      <Preloader show={loading} />
      {/* film grain */}
      <div className="grain pointer-events-none fixed inset-0 z-[60] opacity-[0.05]" aria-hidden="true" />

      <Navbar
        onReserve={openReserve}
        light={light}
        onToggleTheme={toggleTheme}
        cartCount={cartCount}
        onOpenCart={openCart}
        user={user}
        onOpenAuth={openAuth}
        onSignOut={signOut}
      />
      <main id="main-content" tabIndex={-1}>
        <Hero ready={!loading} onReserve={openReserve} />
        <Dishes onAdd={addToCart} />
        <WhyUs />
        <Reviews />
        <About onReserve={openReserve} />
        <Contact />
      </main>
      <Footer />

      <FloatingWhatsApp />
      <AuthModal open={authOpen} onClose={closeAuth} onGuest={continueAsGuest} />
      <ReservationModal open={reserveOpen} onClose={closeReserve} user={user} />
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={closeCart}
        onInc={incQty}
        onDec={decQty}
        onClear={clearCart}
        user={user}
        onRequireAuth={openAuth}
      />
    </div>
  );
}
