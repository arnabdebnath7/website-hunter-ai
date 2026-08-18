import { memo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { easeLux } from "./Reveal";

const fireflies = [
  { left: "9%", top: "22%", size: 4, delay: "0s", duration: "7.5s", opacity: 0.58 },
  { left: "16%", top: "42%", size: 3, delay: "1.4s", duration: "8.8s", opacity: 0.44 },
  { left: "27%", top: "18%", size: 3, delay: "2.2s", duration: "7.9s", opacity: 0.5 },
  { left: "74%", top: "16%", size: 4, delay: "0.7s", duration: "8.4s", opacity: 0.48 },
  { left: "84%", top: "34%", size: 3, delay: "1.9s", duration: "9.2s", opacity: 0.42 },
  { left: "91%", top: "56%", size: 4, delay: "2.8s", duration: "8.1s", opacity: 0.5 },
  { left: "12%", top: "70%", size: 3, delay: "3.2s", duration: "9.5s", opacity: 0.36 },
  { left: "68%", top: "74%", size: 3, delay: "1.1s", duration: "7.7s", opacity: 0.42 },
];

function PremiumTagline({ mobile = false }: { mobile?: boolean }) {
  return (
    <span
      className={`block font-display italic leading-[0.98] tracking-tight drop-shadow-[0_10px_30px_rgba(201,163,92,0.2)] ${
        mobile ? "text-[2.25rem] sm:text-[2.7rem]" : "text-[2.25rem]"
      }`}
    >
      <span className="block text-cream">Where Every Meal</span>
      <span className="mt-1 block text-gold-grad">Becomes a Memory</span>
    </span>
  );
}

function Hero({ ready }: { ready: boolean; onReserve: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const frameY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);
  const fade = useTransform(scrollYProgress, [0, 0.86], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      aria-label="Welcome to Restaurant Niketa"
      className="relative flex min-h-[calc(82vh+132px)] items-start overflow-hidden bg-ink px-4 pb-16 pt-[62px] transition-colors duration-500 sm:px-8 sm:pt-[68px] lg:min-h-[calc(82vh+124px)] lg:pt-[66px]"
    >
      <h1 className="sr-only">Restaurant Niketa — Premium Indian and Chinese Restaurant in Contai</h1>

      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
        {fireflies.map((dot, i) => (
          <span
            key={i}
            className="dust absolute rounded-full bg-gold"
            style={{
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
              animationDelay: dot.delay,
              animationDuration: dot.duration,
              boxShadow: "0 0 14px 4px rgba(201,163,92,0.42), 0 0 34px 10px rgba(201,163,92,0.12)",
            }}
          />
        ))}
      </div>

      <motion.div
        style={reduce ? undefined : { opacity: fade, y: frameY }}
        className="relative mx-auto flex w-full justify-center"
      >
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.978 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.28, delay: 0.25, ease: easeLux }}
          className="relative w-[92vw] max-w-[1120px] sm:w-[86vw] lg:w-[78vw]"
        >
          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={ready ? { opacity: 0.92, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.88, ease: easeLux }}
            className="mx-auto mb-4 max-w-[22rem] text-center"
          >
            <PremiumTagline mobile />
          </motion.p>

          {/* premium asymmetric organic image frame */}
          <div className="relative mx-auto h-[72vh] min-h-[500px] max-h-[760px] sm:h-[78vh] lg:h-[82vh]">
            {/* outer architectural rim - thin visible golden border */}
            <div
              className="pointer-events-none absolute -inset-[5px] border border-gold/60 bg-gradient-to-br from-gold/[0.035] via-transparent to-gold/[0.025] shadow-[0_36px_110px_-64px_rgba(0,0,0,0.86)] sm:-inset-[6px]"
              style={{
                clipPath: "inset(0 round 58px 112px 68px 124px)",
                borderRadius: "58px 112px 68px 124px / 74px 60px 88px 64px",
              }}
              aria-hidden="true"
            />

            {/* soft inner golden highlight rim */}
            <div
              className="pointer-events-none absolute -inset-px border border-gold/38 bg-transparent"
              style={{
                clipPath: "inset(0 round 52px 102px 62px 112px)",
                borderRadius: "52px 102px 62px 112px / 66px 54px 78px 58px",
              }}
              aria-hidden="true"
            />

            <motion.div
              animate={reduce ? undefined : { y: [0, -7, 0], rotate: [0, 0.12, 0] }}
              transition={reduce ? undefined : { duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 overflow-hidden border border-gold/45 bg-coal shadow-[0_44px_120px_-70px_rgba(0,0,0,0.95)]"
              style={{
                clipPath: "inset(0 round 52px 102px 62px 112px)",
                borderRadius: "52px 102px 62px 112px / 66px 54px 78px 58px",
              }}
            >
              <motion.img
                src="/images/niketa-uploaded-hero-opt.jpg"
                alt="Restaurant Niketa dining room interior"
                fetchPriority="high"
                width={1254}
                height={1254}
                initial={reduce ? false : { scale: 1.08 }}
                animate={reduce ? undefined : { scale: 1.018, x: [0, -4, 0, 4, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.015)_44%,rgba(0,0,0,0.18))]" />
            </motion.div>

            {/* compact floating info cards */}
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.95, delay: 1.12, ease: easeLux }}
              className="glass-deep pointer-events-none absolute right-[8%] top-[18%] z-20 flex items-center gap-2 rounded-2xl border border-gold/25 px-2.5 py-2 shadow-[0_18px_44px_-26px_rgba(0,0,0,0.78)]"
            >
              <span className="block h-8 w-8 overflow-hidden rounded-full ring-1 ring-gold/45">
                <img src="/images/logo.jpg" alt="" width={32} height={32} className="h-full w-full object-cover" />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold leading-none text-cream">Restaurant Niketa</span>
                <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-[0.24em] text-gold">
                  Since 2013
                </span>
              </span>
            </motion.div>

            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.95, delay: 1.22, ease: easeLux }}
              className="glass-deep pointer-events-none absolute bottom-[13%] left-[8%] z-20 rounded-2xl border border-gold/25 px-2.5 py-2 shadow-[0_18px_44px_-26px_rgba(0,0,0,0.78)]"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/14 text-gold">
                  <Star size={13} className="fill-gold text-gold" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold leading-none text-cream">
                    3.8 <span className="text-xs text-gold/80">/ 5</span>
                  </span>
                  <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-[0.18em] text-smoke">
                    1.2k+ Guests
                  </span>
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default memo(Hero);
