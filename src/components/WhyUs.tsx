import { memo } from "react";
import { Leaf, Flame, Users, UtensilsCrossed, Timer, Crown } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";

const features = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    text: "Vegetables at dawn, meats marinated overnight — nothing pre-cooked, ever.",
    span: "sm:col-span-2",
  },
  {
    icon: Flame,
    title: "Authentic Taste",
    text: "Recipes guarded since 2013, ground on stone and finished over live fire.",
    span: "",
  },
  {
    icon: Users,
    title: "Family Friendly",
    text: "Spacious family seating, patient service and plates for every generation.",
    span: "",
  },
  {
    icon: UtensilsCrossed,
    title: "Indian & Chinese",
    text: "Two masterful kitchens under one roof — dum biryani to dragon chicken.",
    span: "",
  },
  {
    icon: Timer,
    title: "Fast Service",
    text: "Hot at your table in minutes, even when the dining room is full.",
    span: "",
  },
  {
    icon: Crown,
    title: "Premium Dining",
    text: "An experience dressed in brass, warm light and quiet attention to detail.",
    span: "sm:col-span-2",
  },
];

function WhyUs() {
  return (
    <section
      id="why-us"
      aria-labelledby="why-title"
      className="relative overflow-hidden bg-onyx py-24 transition-colors duration-500 lg:py-32"
    >
      <div className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-wine/[0.07] blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-gold/[0.05] blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          id="why-title"
          eyebrow="Why Choose Niketa"
          title={
            <>
              The Niketa <span className="italic text-gold-grad">Difference</span>
            </>
          }
          sub="Thirteen years of quiet obsession — with the rice, the fire, and the way a family should be fed."
        />

        {/* bento grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 [grid-auto-flow:dense] sm:grid-cols-2 sm:gap-6 lg:grid-cols-4" role="list">
          {features.slice(0, 3).map((f, i) => (
            <BentoCard key={f.title} f={f} i={i} />
          ))}

          {/* image cell */}
          <Reveal delay={0.22} className="sm:row-span-2">
            <figure className="group relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-cream/[0.06]">
              <img
                src="REAL_SPICES_BG"
                alt="The spice library of the Niketa kitchen"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gold">Our Craft</span>
                <h3 className="mt-1 font-display text-2xl font-semibold text-cream">The Spice Library</h3>
              </figcaption>
            </figure>
          </Reveal>

          {features.slice(3).map((f, i) => (
            <BentoCard key={f.title} f={f} i={i + 3} />
          ))}

          {/* stat cell */}
          <Reveal delay={0.3}>
            <div className="glass relative flex h-full min-h-[180px] flex-col items-start justify-end overflow-hidden rounded-2xl p-6 sm:p-8">
              <span className="text-outline pointer-events-none absolute -right-4 -top-6 select-none font-display text-[7rem] font-semibold leading-none" aria-hidden="true">
                13
              </span>
              <span className="font-display text-4xl font-semibold text-gold-soft">Years</span>
              <span className="mt-2 max-w-[14rem] text-[12px] leading-relaxed text-smoke">
                of feeding Contai like family — and counting.
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BentoCard({ f, i }: { f: (typeof features)[number]; i: number }) {
  return (
    <Reveal delay={i * 0.06} className={f.span}>
      <div
        role="listitem"
        className="card-lift group glass relative h-full rounded-2xl p-6 hover:border-gold/30 sm:p-8"
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.06] text-gold transition-all duration-500 group-hover:border-gold/50 group-hover:bg-gold/10 group-hover:shadow-[0_0_30px_-6px_rgba(201,163,92,0.5)]">
          <f.icon size={20} strokeWidth={1.6} aria-hidden="true" />
        </div>
        <h3 className="mt-6 font-display text-2xl font-semibold text-cream">{f.title}</h3>
        <p className="mt-3 max-w-md text-[13px] leading-relaxed text-smoke">{f.text}</p>
        <span
          className="mt-6 block h-px w-10 bg-gold/30 transition-all duration-500 group-hover:w-full group-hover:bg-gold/40"
          aria-hidden="true"
        />
      </div>
    </Reveal>
  );
}

export default memo(WhyUs);
