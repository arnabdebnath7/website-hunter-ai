import { memo } from "react";
import { Facebook, Instagram, Youtube, MapPin, Phone, Clock, ArrowUp } from "lucide-react";
import { ADDRESS_SHORT, HOURS, PHONE_DISPLAY, PHONE_TEL } from "../lib/data";

const explore = [
  { label: "Signature Menu", href: "#menu" },
  { label: "Why Niketa", href: "#why-us" },
  { label: "Guest Reviews", href: "#reviews" },
  { label: "Our Story", href: "#about" },
];

const socials = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/search/top?q=restaurant%20niketa%20contai",
    label: "Restaurant Niketa on Facebook",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/explore/search/keyword/?q=restaurant%20niketa%20contai",
    label: "Restaurant Niketa on Instagram",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/results?search_query=restaurant+niketa+contai",
    label: "Restaurant Niketa on YouTube",
  },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gold/10 bg-footer transition-colors duration-500">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        aria-hidden="true"
      />

      <a
        href="#home"
        aria-label="Back to top"
        className="glass-deep group absolute -top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full text-gold transition-transform duration-500 hover:-translate-y-1 sm:right-10"
      >
        <ArrowUp size={17} className="transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden="true" />
      </a>

      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 lg:pt-20">
        <div className="relative z-10 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div>
            <a href="#home" className="flex items-center gap-3" aria-label="Restaurant Niketa — back to top">
              <span className="block h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/50">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7b7a9b4c1a?auto=format&fit=crop&w=160&q=80" alt="" width={48} height={48} className="h-full w-full object-cover" />
              </span>
              <span className="font-display text-xl font-semibold text-cream">
                Restaurant Niketa
                <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-[0.38em] text-gold">
                  Estd 2013 · Contai
                </span>
              </span>
            </a>
            <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-smoke text-pretty">
              Where every meal becomes a memory — premium Indian & Chinese cuisine, served with
              warmth since 2013.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="glass flex h-11 w-11 items-center justify-center rounded-full text-cream/60 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:text-gold"
                >
                  <s.icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* explore */}
          <nav aria-label="Footer">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.34em] text-gold">Explore</h4>
            <ul className="mt-6 space-y-3.5">
              {explore.map((e) => (
                <li key={e.href}>
                  <a
                    href={e.href}
                    className="group inline-flex items-center gap-2 py-0.5 text-[13px] text-cream/65 transition-colors duration-300 hover:text-cream"
                  >
                    <span
                      className="h-px w-0 bg-gold transition-all duration-500 group-hover:w-4"
                      aria-hidden="true"
                    />
                    {e.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* cuisines */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.34em] text-gold">
              Our Kitchens
            </h4>
            <ul className="mt-6 space-y-3.5 text-[13px] text-cream/65">
              {[
                "Dum Biryani & Kebabs",
                "Tandoor & Breads",
                "Indo-Chinese Wok",
                "Bengali Favourites",
                "Family Combos & Thalis",
              ].map((c) => (
                <li key={c} className="flex items-center gap-3">
                  <span className="block h-1 w-1 rotate-45 bg-gold/60" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.34em] text-gold">Reach Us</h4>
            <ul className="mt-6 space-y-5 text-[13px] text-cream/65">
              <li className="flex gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <address className="not-italic leading-relaxed">{ADDRESS_SHORT}</address>
              </li>
              <li className="flex gap-3">
                <Phone size={15} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <a href={`tel:${PHONE_TEL}`} className="transition-colors hover:text-cream">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={15} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  Open Daily
                  <span className="block text-smoke">{HOURS}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* giant watermark */}
        <div className="wm-fade pointer-events-none mt-10 select-none text-center" aria-hidden="true">
          <span className="text-outline font-display text-[19.5vw] font-semibold uppercase leading-[0.82] tracking-[0.05em]">
            Niketa
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-4 border-t border-cream/[0.06] py-8 sm:flex-row">
          <p className="text-[11px] tracking-[0.14em] text-smoke">
            © {new Date().getFullYear()} Restaurant Niketa. All rights reserved.
          </p>
          <p className="text-[11px] uppercase tracking-[0.3em] text-smoke/70">
            Crafted with pride in Contai, West Bengal
          </p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
