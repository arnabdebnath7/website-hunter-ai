import { memo } from "react";
import { MapPin, Phone, Clock, MessageCircle, Navigation } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";
import { ADDRESS, HOURS, MAP_EMBED, MAP_LINK, PHONE_DISPLAY, PHONE_TEL, WA_LINK } from "../lib/data";
import { useOpenNow } from "../lib/hooks";

function Contact() {
  const open = useOpenNow();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-onyx py-24 transition-colors duration-500 lg:py-32"
    >
      <div
        className="pointer-events-none absolute right-0 top-0 h-[420px] w-[520px] rounded-full bg-gold/[0.05] blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          id="contact-title"
          eyebrow="Find Us"
          title={
            <>
              Your Table is <span className="italic text-gold-grad">Waiting</span>
            </>
          }
          sub="On Contai Bypass Road, beside the Central Bus Stand — easy to reach, hard to leave."
        />

        {/* map canvas with floating info card */}
        <Reveal delay={0.1}>
          <div className="mt-14">
            <div className="glass relative overflow-hidden rounded-3xl p-2">
              <div className="relative min-h-[560px] lg:min-h-[600px]">
                <iframe
                  title="Map — Restaurant Niketa, Contai Bypass Road"
                  src={MAP_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="map-dark absolute inset-0 h-full w-full rounded-2xl"
                  allowFullScreen
                />

                {/* floating info card */}
                <div className="glass-deep no-scrollbar absolute inset-x-3 bottom-3 max-h-[70%] overflow-y-auto rounded-2xl p-7 sm:p-8 lg:inset-x-auto lg:bottom-6 lg:left-6 lg:top-6 lg:w-[400px] lg:max-h-none">
                  <h3 className="font-display text-3xl font-semibold text-cream">Visit Restaurant Niketa</h3>

                  <ul className="mt-8 space-y-6">
                    <li className="flex gap-4">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.07] text-gold">
                        <MapPin size={16} aria-hidden="true" />
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">
                          Address
                        </span>
                        <address className="mt-1.5 text-[13px] not-italic leading-relaxed text-cream/75">
                          {ADDRESS}
                        </address>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.07] text-gold">
                        <Phone size={16} aria-hidden="true" />
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">
                          Phone
                        </span>
                        <a
                          href={`tel:${PHONE_TEL}`}
                          className="mt-1.5 block font-display text-xl font-semibold text-cream transition-colors hover:text-gold"
                        >
                          {PHONE_DISPLAY}
                        </a>
                        <span className="text-[11px] text-smoke">Tap to call directly</span>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.07] text-gold">
                        <Clock size={16} aria-hidden="true" />
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">
                          Opening Hours
                        </span>
                        <p className="mt-1.5 text-[13px] text-cream/75">
                          Open Daily · <time>{HOURS}</time>
                        </p>
                        <span
                          className={`mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                            open ? "text-leaf" : "text-wine"
                          }`}
                          role="status"
                        >
                          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                            <span
                              className={`absolute h-full w-full animate-ping rounded-full ${
                                open ? "bg-leaf/60" : "bg-wine/60"
                              }`}
                            />
                            <span className={`h-full w-full rounded-full ${open ? "bg-leaf" : "bg-wine"}`} />
                          </span>
                          {open ? "Serving now" : "Closed · opens 11:30 AM"}
                        </span>
                      </div>
                    </li>
                  </ul>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                    <a
                      href={`tel:${PHONE_TEL}`}
                      aria-label={`Call Restaurant Niketa at ${PHONE_DISPLAY}`}
                      className="btn-gold inline-flex flex-1 items-center justify-center gap-2.5 rounded-full px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em]"
                    >
                      <Phone size={14} aria-hidden="true" />
                      Call Now
                    </a>
                    <a
                      href={WA_LINK}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Chat with Restaurant Niketa on WhatsApp"
                      className="btn-ghost inline-flex flex-1 items-center justify-center gap-2.5 rounded-full border-leaf/30 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-leaf"
                    >
                      <MessageCircle size={14} aria-hidden="true" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* directions chip */}
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Get directions to Restaurant Niketa on Google Maps"
                  className="glass-deep absolute bottom-5 right-5 hidden items-center gap-3 rounded-full px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cream transition-colors hover:text-gold lg:inline-flex"
                >
                  <Navigation size={13} className="text-gold" aria-hidden="true" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default memo(Contact);
