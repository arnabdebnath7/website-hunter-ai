import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export const easeLux: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "article" | "span";
}

export function Reveal({ children, delay = 0, y = 40, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: reduce ? 0.4 : 0.95, delay, ease: easeLux }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, center = true }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-center gap-4 ${center ? "justify-center" : "justify-start"}`} aria-hidden="true">
      <span className="hairline w-10 sm:w-14" />
      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.42em] text-gold">
        {children}
      </span>
      <span className={`hairline w-10 sm:w-14 ${center ? "" : "opacity-0"}`} />
    </div>
  );
}

interface SectionHeadProps {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  center?: boolean;
  id?: string;
}

export function SectionHead({ eyebrow, title, sub, center = true, id }: SectionHeadProps) {
  return (
    <div className={`${center ? "text-center" : "text-left"}`}>
      <Reveal>
        <Eyebrow center={center}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          id={id}
          className="mt-6 font-display text-4xl leading-[1.06] tracking-tight text-cream sm:text-5xl lg:text-6xl text-balance"
        >
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p
            className={`mt-6 max-w-xl text-sm leading-relaxed text-smoke sm:text-base text-pretty ${
              center ? "mx-auto" : ""
            }`}
          >
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  );
}
