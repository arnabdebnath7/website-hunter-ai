import { memo, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setV(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1900;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(to * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);

  return (
    <span ref={ref} aria-label={`${to}${suffix.replace("k", " thousand")}`}>
      <span aria-hidden="true">
        {v}
        {suffix}
      </span>
    </span>
  );
}

const points = [
  "Family restaurant, run like family since 2013",
  "Separate Indian & Chinese kitchens, one standard of care",
  "Spacious seating for celebrations big and small",
];

function About({ onReserve }: { onReserve: () => void }) {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden py-24 lg:py-32">
      <div
        className="pointer-events-none absolute -right-52 top-1/3 h-[460px] w-[460px] rounded-full bg-gold/[0.05] blur-[130px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* copy */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <Eyebrow center={false}>Our Story</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              id="about-title"
              className="mt-6 font-display text-4xl leading-[1.06] tracking-tight text-cream text-balance sm:text-5xl lg:text-6xl"
            >
              A Family Table,
              <br />
              <span className="italic text-gold-grad">Thirteen Years of Memories.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="dropcap mt-8 text-sm leading-[1.9] text-smoke text-pretty sm:text-[15px]">
              What began in 2013 as a modest family kitchen on Contai Bypass Road has grown into
              the town's most loved dining room. At Restaurant Niketa, premium Indian and Chinese
              cuisine meet the warmth of home — biryani sealed and slow-steamed the old way,
              woks that flame till midnight, and service that remembers your usual order.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-4 text-sm leading-[1.9] text-smoke text-pretty sm:text-[15px]">
              Every plate carries the same promise: quality you can taste, hospitality you can feel.
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <ul className="mt-8 space-y-4">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold">
                    <Check size={12} strokeWidth={2.4} aria-hidden="true" />
                  </span>
                  <span className="text-[13px] tracking-wide text-cream/80">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.34}>
            <div className="mt-10 grid grid-cols-3 divide-x divide-gold/15 border-y border-gold/10 py-8">
              {[
                { to: 13, suffix: "+", label: "Years" },
                { to: 160, suffix: "+", label: "Dishes" },
                { to: 673, suffix: "k+", label: "Meals Served" },
              ].map((s) => (
                <div key={s.label} className="px-4 text-center sm:px-6">
                  <div className="font-display text-3xl font-semibold text-gold-soft sm:text-4xl">
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.3em] text-smoke">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <button
              onClick={onReserve}
              className="btn-gold mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.24em]"
            >
              Reserve Your Table
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </Reveal>
        </div>

        {/* visual */}
        <Reveal className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-xl">
            <div className="absolute -inset-3 rounded-3xl border border-gold/15 sm:-inset-4" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7b7a9b4c1a?auto=format&fit=crop&w=1200&q=84"
                alt="The warm, candle-lit dining room of Restaurant Niketa"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            </div>
            <div className="glass-deep animate-floaty absolute -bottom-7 right-5 flex items-center gap-4 rounded-2xl px-5 py-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] sm:right-8">
              <span className="block h-14 w-14 overflow-hidden rounded-full ring-1 ring-gold/60">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7b7a9b4c1a?auto=format&fit=crop&w=160&q=80" alt="" width={56} height={56} className="h-full w-full object-cover" />
              </span>
              <span>
                <span className="block font-display text-xl font-semibold leading-none text-cream">
                  Estd. 2013
                </span>
                <span className="mt-1.5 block text-[9px] font-bold uppercase tracking-[0.3em] text-gold">
                  A Contai Landmark
                </span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default memo(About);
