"use client";

import { useEffect, useState } from "react";

/**
 * The lamp.
 *
 * One control, two states, no menu. A three-way switch (light / dark / system)
 * is the more complete answer and the wrong one here: it turns a single gesture
 * into a decision with three outcomes, two of which look identical to the
 * person making it. The page opens in the theme it was designed in and the
 * visitor can turn it over; that choice is then remembered for good.
 *
 * WHY IT IS NOT A SUN AND A MOON. Every glyph on this site is geometric — the
 * mark, the eyebrow squares, the blinking dot. A pictogram of a celestial body
 * would be the only illustration on the page. This is a disc that is half lit,
 * and it turns 180° when pressed, so the gesture and the meaning are the same
 * movement: the light moves round to the other side.
 *
 * The theme itself is applied by the inline script in `app/layout.tsx`, which
 * runs before first paint. This component only writes to it — it never decides
 * the initial value, because by the time React runs, the decision has already
 * been made and painting a second one would be a flash.
 */

export const THEME_KEY = "quantar-theme";

/** Kept in step with `--color-paper` in both themes. Drives the browser chrome. */
const CHROME = { light: "#f4f2ed", dark: "#14120f" } as const;

export function ThemeToggle({ className = "" }: { className?: string }) {
  /**
   * Starts light on the server and on first render, and is corrected from the
   * DOM after mount. It has to be this way round: the markup React renders on
   * the server cannot know what is in this visitor's localStorage, so it renders
   * the default and adopts the truth a tick later. The only thing that depends
   * on it is the disc's rotation, which nobody sees resolve.
   */
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.dataset.theme === "dark";
    setDark(isDark);

    // The browser chrome, on a load that came back dark. The inline script in
    // the layout cannot do this — it runs before Next has emitted the meta tag
    // it would be writing to — so the tag ships with the light value and is
    // corrected here. Without it, a returning visitor gets a dark page in a
    // bone-coloured browser bar, which is more obvious on a phone than it
    // sounds.
    if (isDark) {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", CHROME.dark);
    }
  }, []);

  const flip = () => {
    const next = dark ? "light" : "dark";
    const root = document.documentElement;

    // Colour transitions exist only for the length of the flip. See
    // `.theme-flip` in globals.css.
    root.classList.add("theme-flip");
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove("theme-flip"), 550);

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", CHROME[next]);

    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private browsing, or storage disabled. The theme still flips; it just
      // will not be remembered, which is a better outcome than not flipping.
    }

    setDark(!dark);
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-pressed={dark}
      aria-label={dark ? "Switch to the light theme" : "Switch to the dark theme"}
      title={dark ? "Light" : "Dark"}
      className={`group flex size-11 items-center justify-center text-ink ${className}`}
    >
      <span
        aria-hidden
        className="relative block size-[18px] overflow-hidden rounded-full border border-ink-45
                   transition-[transform,border-color] duration-[0.75s] ease-quad
                   group-hover:border-ink motion-safe:group-active:scale-90"
        style={{ transform: `rotate(${dark ? 180 : 0}deg)` }}
      >
        {/* The lit half. A filled semicircle rather than a crescent, so the
            control reads at 18px — a crescent at this size is a smudge. */}
        <span className="absolute inset-y-0 left-0 w-1/2 bg-ink transition-colors duration-500" />
      </span>
    </button>
  );
}
