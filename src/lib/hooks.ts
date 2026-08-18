import { useEffect, useState } from "react";

export const SECTION_IDS = [
  "home",
  "menu",
  "why-us",
  "reviews",
  "about",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Tracks which section is currently in the viewport for nav highlighting. */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        });
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: 0 }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return active;
}

/** Live open/closed status for 11:00 AM – 10:30 PM IST. */
export function useOpenNow(): boolean {
  const compute = () => {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      const h = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
      const m = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
      const mins = (h % 24) * 60 + m;
      return mins >= 11 * 60 + 30 && mins < 22 * 60 + 45;
    } catch {
      return true;
    }
  };

  const [open, setOpen] = useState<boolean>(compute);

  useEffect(() => {
    const t = window.setInterval(() => setOpen(compute()), 60_000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return open;
}
