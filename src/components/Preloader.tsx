import { motion, AnimatePresence } from "framer-motion";
import { easeLux } from "./Reveal";

const letters = "RESTAURANT NIKETA".split("");

export default function Preloader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeInOut", delay: 0.05 } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink"
          role="status"
          aria-label="Restaurant Niketa is loading"
        >
          <motion.div
            exit={{ y: -50, opacity: 0, transition: { duration: 0.6, ease: easeLux } }}
            className="flex flex-col items-center px-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: easeLux }}
              className="relative"
            >
              <span className="block h-24 w-24 overflow-hidden rounded-full ring-1 ring-gold/50 sm:h-28 sm:w-28">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7b7a9b4c1a?auto=format&fit=crop&w=160&q=80" alt="Restaurant Niketa" className="h-full w-full object-cover" />
              </span>
              <motion.span
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1.35, opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.3, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-gold"
                aria-hidden="true"
              />
            </motion.div>

            <div className="mt-7 flex overflow-hidden" aria-hidden="true">
              {letters.map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.035, ease: easeLux }}
                  className={`font-display font-semibold text-cream ${
                    l === " "
                      ? "w-2.5 sm:w-4"
                      : "text-lg tracking-[0.22em] sm:text-2xl sm:tracking-[0.3em]"
                  }`}
                >
                  {l === " " ? "" : l}
                </motion.span>
              ))}
            </div>
            <span className="sr-only">Restaurant Niketa</span>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-2.5 text-[9px] font-bold uppercase tracking-[0.44em] text-gold"
            >
              Estd 2013 · Contai
            </motion.span>

            <div className="mt-8 h-px w-44 overflow-hidden bg-cream/10">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.05, delay: 0.15, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-transparent via-gold to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
