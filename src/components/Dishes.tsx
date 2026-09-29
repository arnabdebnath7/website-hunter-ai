import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { Reveal, easeLux } from "./Reveal";
import { REAL_SPICES_BG } from "../lib/brand-images";
import { favourites, menuCategories, type MenuItem } from "../lib/data";

type MenuTab = "favourites" | string;

type DisplayItem = MenuItem & {
  tagLabel: string;
};

const tabs: Array<{ id: MenuTab; label: string }> = [
  { id: "favourites", label: "Everyone's Favourite" },
  ...menuCategories.map((category) => ({ id: category.id, label: category.label })),
];

const PAGE_SIZE = 6;

function priceText(item: MenuItem) {
  return item.price2 ? `₹${item.price}/₹${item.price2}` : `₹${item.price}`;
}

function dishImg(item: DisplayItem) {
  return item.img ?? "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=82";
}

function LeafLine({ flip = false }: { flip?: boolean }) {
  return (
    <span
      className="flex h-12 w-16 items-center justify-center text-gold/70 sm:h-14 sm:w-20"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 76 64" fill="none" className="h-full w-full overflow-visible">
        <path
          d="M67 57C48 51 33 39 24 24C20 17 18 10 18 5"
          stroke="currentColor"
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        <path d="M20 13C14 11 11 7 10 2C15 3 19 6 20 13Z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 24C17 22 13 17 12 11C18 12 23 17 25 24Z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M33 35C25 34 20 29 18 23C25 24 31 28 33 35Z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M44 45C36 46 30 42 26 36C34 35 41 38 44 45Z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M56 53C49 56 42 53 37 48C45 46 52 48 56 53Z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 16C27 12 29 7 28 2C24 5 21 9 22 16Z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <path d="M28 28C35 25 38 20 38 14C32 16 28 21 28 28Z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <path d="M38 39C45 37 50 33 51 27C44 28 39 33 38 39Z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <path d="M51 49C58 48 64 45 66 39C59 39 53 43 51 49Z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      </svg>
    </span>
  );
}

function AddButton({ added, name, onAdd }: { added: boolean; name: string; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      aria-label={added ? `${name} added to order` : `Add ${name} to order`}
      className={`inline-flex h-9 min-w-[66px] shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-[8px] font-extrabold uppercase tracking-[0.12em] transition-all duration-300 focus-visible:outline-gold sm:min-w-[78px] sm:px-3 sm:text-[8.5px] ${
        added
          ? "border border-leaf/40 bg-leaf/15 text-leaf shadow-[0_8px_22px_-18px_rgba(31,191,98,0.65)]"
          : "bg-cream text-ink shadow-[0_10px_22px_-16px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 hover:bg-gold hover:text-ongold"
      }`}
    >
      {added ? (
        <>
          <Check size={11} strokeWidth={2.6} aria-hidden="true" />
          Added
        </>
      ) : (
        <>
          <Plus size={11} strokeWidth={2.6} aria-hidden="true" />
          Add
        </>
      )}
    </button>
  );
}

function MenuCard({
  item,
  index,
  added,
  onAdd,
}: {
  item: DisplayItem;
  index: number;
  added: boolean;
  onAdd: (item: MenuItem) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.22 } }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 0.62, delay: (index % 4) * 0.04, ease: easeLux }}
      className="group h-full"
    >
      <div className="relative h-full overflow-hidden rounded-[20px] border border-cream/[0.08] bg-coal shadow-[0_18px_46px_-32px_rgba(0,0,0,0.82)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_28px_70px_-38px_rgba(0,0,0,0.95)]">
        {/* clean image zone */}
        <div className="shine relative aspect-square overflow-hidden bg-ink">
          <img
            src={dishImg(item)}
            alt={`${item.name} at Restaurant Niketa`}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.15s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.055]"
          />

          {/* subtle readability gradient only */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/14 via-transparent to-ink/78" />

          {/* liquid-glass tag line: top of image, aligned, non-overlapping */}
          <div className="absolute left-2 top-2 z-10 flex w-[calc(100%-1rem)] items-center gap-1 overflow-hidden sm:left-3 sm:top-3 sm:w-[calc(100%-1.5rem)] sm:gap-1.5">
            <span className="shrink-0 whitespace-nowrap rounded-full border border-gold/30 bg-ink/65 px-1.5 py-0.5 text-[5.8px] font-extrabold uppercase tracking-[0.045em] text-gold-soft shadow-[0_10px_24px_-18px_rgba(0,0,0,0.85)] backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[7.5px] sm:tracking-[0.1em]">
              {item.tagLabel}
            </span>
            {item.badge && (
              <span className="shrink-0 whitespace-nowrap rounded-full border border-cream/18 bg-cream/65 px-1.5 py-0.5 text-[5.8px] font-extrabold uppercase tracking-[0.035em] text-ink shadow-[0_10px_24px_-18px_rgba(0,0,0,0.85)] backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[7.5px] sm:tracking-[0.08em]">
                {item.badge}
              </span>
            )}
          </div>

          {/* dish name: bottom blank image space, transparent background */}
          <div className="absolute inset-x-3 bottom-3 z-10">
            <h3 className="truncate font-display text-[0.98rem] font-bold leading-none tracking-[-0.01em] text-cream drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] sm:text-[1.12rem]">
              {item.name}
            </h3>
          </div>
        </div>

        {/* reserved footer: price + add with clean space */}
        <div className="flex min-h-[60px] items-center justify-between gap-3 border-t border-cream/[0.08] bg-coal px-3 py-2.5 sm:min-h-[66px] sm:gap-4 sm:px-4">
          <span className="shrink-0 whitespace-nowrap font-display text-[1.02rem] font-semibold leading-none text-gold-soft sm:text-[1.24rem]">
            {priceText(item)}
            <span className="sr-only">rupees</span>
          </span>
          <AddButton added={added} name={item.name} onAdd={() => onAdd(item)} />
        </div>
      </div>
    </motion.article>
  );
}

function Dishes({ onAdd }: { onAdd: (d: MenuItem) => void }) {
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MenuTab>("favourites");
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const flashTimer = useRef<number | undefined>(undefined);
  const categoryScroller = useRef<HTMLDivElement>(null);

  const handleAdd = (item: MenuItem) => {
    onAdd(item);
    setJustAdded(item.id);
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setJustAdded(null), 1200);
  };

  const activeCategory = menuCategories.find((category) => category.id === activeTab);
  const normalizedQuery = query.trim().toLowerCase();

  const allSearchItems: DisplayItem[] = [
    ...favourites.map((item) => ({ ...item, tagLabel: "Favourite" })),
    ...menuCategories.flatMap((category) =>
      category.items.map((item) => ({ ...item, tagLabel: category.label }))
    ),
  ].filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index);

  const tabItems: DisplayItem[] =
    activeTab === "favourites"
      ? favourites.map((item) => ({ ...item, tagLabel: "Favourite" }))
      : (activeCategory?.items ?? []).map((item) => ({
          ...item,
          tagLabel: activeCategory?.label ?? "Menu",
        }));

  const filteredItems: DisplayItem[] = normalizedQuery
    ? allSearchItems.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
    : tabItems;

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const visibleItems = filteredItems.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    setPage(0);
  }, [activeTab, normalizedQuery]);

  useEffect(() => {
    if (page > totalPages - 1) setPage(Math.max(0, totalPages - 1));
  }, [page, totalPages]);

  const go = (dir: 1 | -1) => {
    setPage((p) => (p + dir + totalPages) % totalPages);
  };

  const moveCategories = (dir: 1 | -1) => {
    categoryScroller.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative overflow-hidden pt-14 pb-24 lg:pt-16 lg:pb-32">
      <div
        className="pointer-events-none absolute -top-52 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gold/[0.04] blur-[130px]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <LeafLine />
              <span className="text-[10px] font-bold uppercase tracking-[0.42em] text-gold">Our Menu</span>
              <LeafLine flip />
            </div>
            <h2
              id="menu-title"
              className="mt-4 font-display text-[2.45rem] font-semibold leading-[1.04] tracking-[-0.02em] text-cream sm:text-5xl"
            >
              <span className="italic text-gold-grad">Restaurant Niketa</span>
              <br />
              Menu Card
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <label className="relative w-full max-w-xl" htmlFor="menu-search">
              <span className="sr-only">Search food</span>
              <Search
                size={15}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold/70"
                aria-hidden="true"
              />
              <input
                id="menu-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search biryani, chicken, paneer..."
                className="field-input h-12 w-full rounded-full border border-cream/[0.1] pl-11 pr-12 text-sm text-cream placeholder:text-smoke/60 outline-none transition-colors duration-300 focus:border-gold/45"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear menu search"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-smoke transition-colors hover:text-gold"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="flex w-full max-w-7xl items-center gap-2">
              <button
                type="button"
                onClick={() => moveCategories(-1)}
                aria-label="Previous menu categories"
                className="btn-ghost flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cream"
              >
                <ChevronLeft size={15} aria-hidden="true" />
              </button>
              <div
                ref={categoryScroller}
                className="no-scrollbar flex-1 overflow-x-auto rounded-full border border-cream/[0.08] bg-ink/30 p-1.5"
                role="tablist"
                aria-label="Menu categories"
              >
                <div className="flex w-max min-w-full items-center gap-1.5">
                {tabs.map((tab) => {
                  const active = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative shrink-0 rounded-full px-4 py-3 text-[10px] font-bold uppercase tracking-[0.24em] transition-all duration-300 sm:px-5 sm:text-[11px] ${
                        active
                          ? "bg-gold text-ongold shadow-[0_10px_24px_-18px_rgba(201,163,92,0.7)]"
                          : "text-cream/60 hover:text-cream"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => moveCategories(1)}
                aria-label="Next menu categories"
                className="btn-ghost flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cream"
              >
                <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${page}`}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.5, ease: easeLux }}
            className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6"
          >
            {visibleItems.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                index={index}
                added={justAdded === item.id}
                onAdd={handleAdd}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3" aria-label="Menu slider controls">
            <button
              onClick={() => go(-1)}
              aria-label="Previous menu slide"
              className="btn-ghost flex h-11 w-11 items-center justify-center rounded-full text-cream"
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Menu slides">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  role="tab"
                  aria-selected={page === i}
                  aria-label={`Show menu slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    page === i ? "w-8 bg-gold" : "w-2.5 bg-cream/20 hover:bg-cream/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next menu slide"
              className="btn-ghost flex h-11 w-11 items-center justify-center rounded-full text-cream"
            >
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(Dishes);
