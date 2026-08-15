"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Logomark, Wordmark } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { nav, site } from "@/lib/content";
import { EASE, transition } from "@/lib/motion";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  const close = useCallback(() => setOpen(false), []);

  // Escape closes the menu, and the page underneath must not scroll while it
  // is open — otherwise the overlay feels detached from the document.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`relative transition-[background-color,backdrop-filter,border-color] duration-500 ${
            scrolled
              ? "border-b border-rule bg-paper/92 backdrop-blur-xl backdrop-saturate-150"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <div className="container-page">
            <div
              className={`flex items-center justify-between transition-[height] duration-500 ${
                scrolled ? "h-[62px]" : "h-[84px]"
              }`}
            >
              <a
                href="#top"
                className="group flex items-center gap-2.5 text-ink"
                aria-label={`${site.name} — home`}
              >
                <Logomark className="size-[18px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-90" />
                <Wordmark />
              </a>

              <nav aria-label="Primary" className="hidden md:block">
                <ul className="flex items-center gap-9">
                  {nav.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="link-rule type-small text-ink-70 transition-colors duration-300 hover:text-ink"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* The right-hand group. The lamp sits with the actions rather
                  than in the link list: it changes the page, it does not
                  navigate it. It is outside the `md:` wrapper deliberately —
                  the phone is where most people meet a dark page, so the
                  control has to be reachable without opening the menu. */}
              <div className="flex items-center gap-1 md:gap-4">
                <ThemeToggle className="-mr-1 md:mr-0" />

                <div className="hidden md:block">
                <a
                  href="#contact"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden border border-rule-strong px-5 py-2.5 text-ink transition-colors duration-500 hover:border-ink"
                >
                  {/* Wipe fill — reads as one considered gesture, not a colour swap. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
                  />
                  <span className="type-label relative transition-colors duration-500 group-hover:text-paper">
                    Start a conversation
                  </span>
                </a>
                </div>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="-mr-2 flex size-11 items-center justify-center md:hidden"
              >
                <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
                <span aria-hidden className="relative block h-3 w-6">
                  <span
                    className={`absolute left-0 block h-px w-full bg-ink transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      open ? "top-1.5 rotate-45" : "top-0"
                    }`}
                  />
                  <span
                    className={`absolute left-0 block h-px w-full bg-ink transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      open ? "top-1.5 -rotate-45" : "top-3"
                    }`}
                  />
                </span>
              </button>
              </div>
            </div>
          </div>

          {/* Reading progress. One hairline of accent, only once you're moving. */}
          <motion.div
            aria-hidden
            style={{ scaleX: scrollYProgress }}
            className={`absolute inset-x-0 bottom-[-1px] h-px origin-left bg-accent transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.overlay}
            className="fixed inset-0 z-40 bg-paper md:hidden"
          >
            <div className="container-page flex h-full flex-col pt-[84px]">
              <nav aria-label="Mobile" className="flex-1 pt-10">
                <ul>
                  {nav.map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.06 }}
                      className="border-b border-rule"
                    >
                      <a
                        href={item.href}
                        onClick={close}
                        className="flex items-baseline justify-between py-5"
                      >
                        <span className="type-h3">{item.label}</span>
                        <span className="type-label text-ink-25 tnum">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.34 }}
                className="border-t border-rule py-8"
              >
                <a
                  href={`mailto:${site.email}`}
                  className="type-h4 link-rule link-rule-out"
                >
                  {site.email}
                </a>
                <p className="type-small mt-3 text-ink-45">{site.location}</p>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
