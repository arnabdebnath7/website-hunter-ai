import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { Reveal, SectionHead, easeLux } from "./Reveal";
import { MAP_REVIEWS_LINK, reviews } from "../lib/data";

const displayReviews = reviews.slice(0, 7);

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const full = rating >= i;
        const half = !full && rating >= i - 0.5;
        return (
          <span key={i} className="relative inline-block">
            <Star size={size} className="text-cream/15" aria-hidden="true" />
            {(full || half) && (
              <span className={`absolute inset-0 overflow-hidden ${half ? "w-1/2" : ""}`}>
                <Star size={size} className="fill-gold text-gold" aria-hidden="true" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-display text-lg font-semibold text-gold sm:h-16 sm:w-16 sm:text-xl"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function Reviews() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const current = displayReviews[active];

  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % displayReviews.length);
    }, 5200);
    return () => window.clearInterval(t);
  }, [paused, reduce]);

  const go = (dir: 1 | -1) => {
    setActive((i) => (i + dir + displayReviews.length) % displayReviews.length);
  };

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative overflow-hidden bg-onyx py-24 transition-colors duration-500 lg:py-32"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-gold/[0.05] blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[420px] w-[420px] rounded-full bg-wine/[0.06] blur-[130px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          id="reviews-title"
          eyebrow="Guest Stories"
          title={
            <>
              Loved by <span className="italic text-gold-grad">Contai</span>
            </>
          }
          sub="Live Google review access is restricted here, so these are carefully curated demo guest stories inspired by the restaurant experience. Tap more to open the real Google reviews."
        />

        <Reveal delay={0.15} className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <div className="glass flex items-center gap-5 rounded-full px-7 py-3.5">
            <span className="font-display text-3xl font-semibold text-gold-soft">3.8</span>
            <span className="h-8 w-px bg-gold/20" aria-hidden="true" />
            <span>
              <Stars rating={3.8} size={12} />
              <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-smoke">
                800+ Google reviews
              </span>
            </span>
          </div>
          <a
            href={MAP_REVIEWS_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-cream"
            aria-label="Open more Restaurant Niketa reviews on Google Maps"
          >
            More Reviews
            <ArrowRight size={13} aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal delay={0.22}>
          <div
            className="relative mx-auto mt-12 max-w-4xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            role="region"
            aria-roledescription="carousel"
            aria-label="Auto sliding customer reviews, one review per slide"
          >
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] border border-gold/10 sm:-inset-6" aria-hidden="true" />
            <div className="glass relative min-h-[430px] overflow-hidden rounded-[1.75rem] p-7 shadow-[0_40px_100px_-48px_rgba(0,0,0,0.9)] sm:min-h-[390px] sm:p-10 lg:p-12">
              <Quote
                size={140}
                className="absolute -right-8 -top-9 text-gold/[0.08]"
                fill="currentColor"
                strokeWidth={0}
                aria-hidden="true"
              />

              <AnimatePresence mode="wait">
                <motion.article
                  key={`${active}-${current.name}`}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 64, filter: "blur(8px)" }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -64, filter: "blur(8px)" }}
                  transition={{ duration: 0.72, ease: easeLux }}
                  aria-live="polite"
                  className="relative z-10 flex min-h-[330px] flex-col justify-between sm:min-h-[290px]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <Stars rating={current.rating} size={15} />
                      <span className="font-display text-sm italic text-gold/70" aria-hidden="true">
                        {String(active + 1).padStart(2, "0")} / {String(displayReviews.length).padStart(2, "0")}
                      </span>
                    </div>
                    <blockquote className="mt-8">
                      <p className="font-display text-2xl leading-snug text-cream/90 text-balance sm:text-3xl lg:text-[2.35rem]">
                        “{current.text}”
                      </p>
                    </blockquote>
                  </div>

                  <footer className="mt-9 flex items-center gap-4 border-t border-cream/[0.08] pt-6">
                    <Avatar name={current.name} />
                    <div>
                      <cite className="block text-base font-semibold not-italic tracking-wide text-cream sm:text-lg">
                        {current.name}
                      </cite>
                      <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-smoke">
                        {current.meta}
                      </span>
                    </div>
                  </footer>
                </motion.article>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-5 sm:flex-row">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous review"
                  className="btn-ghost flex h-12 w-12 items-center justify-center rounded-full text-cream"
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next review"
                  className="btn-ghost flex h-12 w-12 items-center justify-center rounded-full text-cream"
                >
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Select review slide">
                {displayReviews.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Show review ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === active ? "w-9 bg-gold" : "w-3 bg-cream/20 hover:bg-cream/40"
                    }`}
                  />
                ))}
              </div>

              <span className="hidden min-w-[6.5rem] text-right text-[10px] font-bold uppercase tracking-[0.24em] text-smoke/70 sm:block">
                One per slide
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default memo(Reviews);
