import Image from "next/image";
import type { Partner } from "@/lib/content";

/**
 * The borrowed-credibility block: an accelerator, a promotion or a platform
 * putting its name next to the product.
 *
 * These used to be held in greyscale at reduced opacity, on the theory that they
 * are supporting evidence and a row of full-colour brand stickers would outshout
 * the product above them. That was the wrong call. Binance Chain, YZi Labs and
 * CoinMarketCap agreeing to appear under a product IS the argument on those
 * spreads, and a wall of small grey ghosts reads as a disclaimer rather than as
 * an endorsement. They are now full colour, roughly twice the size, and each one
 * sits on its own surface.
 *
 * Three things make that work rather than turn the act into a sponsor board:
 *
 *  1. ONE OPTICAL HEIGHT. Every mark is set to the same height and takes its
 *     width from its own aspect ratio, capped at the tile. Forcing a horizontal
 *     wordmark and a square badge through one box either squashes the wide one
 *     to a smear or floats the square one in dead space — which is what makes
 *     most logo walls look like a spreadsheet.
 *  2. THE TILE IS THE RESTRAINT. The marks are loud now, so the container is
 *     not: a hairline, a paper surface half a shade above the page, and no
 *     rounding. The accent appears only on hover, as the same top-edge hairline
 *     the plates use.
 *  3. BIG ON A PHONE, NOT SMALLER. The sizes are fluid but their MINIMUM is the
 *     mobile size, so these grow from an already-large base rather than
 *     collapsing to thumbnails on the screen where most people will see them.
 *
 * Most of these ship on a white plate, which on warm paper would read as a row
 * of stickers. `mix-blend-multiply` drops the white grounds into the tile and
 * leaves the colour; each tile is `isolate` so the blend resolves against its
 * own surface rather than against whatever is behind the section.
 */

/**
 * Shared optical height for every mark in a row.
 *
 * A named row is a row of icons with their own captions, so the mark only has to
 * be recognisable. An unnamed row is a claim — an accelerator's name beside the
 * product — and has to be readable across a room.
 */
const HEIGHT = {
  bare: "clamp(3rem, 8vw, 4.4rem)",
  named: "clamp(2.5rem, 7vw, 3.1rem)",
} as const;

export function LogoCloud({
  label,
  items,
  /** Show each mark's name underneath. Used where the marks are the content. */
  named = false,
}: {
  label: string;
  items: readonly Partner[];
  named?: boolean;
}) {
  return (
    <div>
      <p className="type-label text-ink-45">{label}</p>

      <ul
        className={`mt-6 gap-2.5 sm:gap-3 ${
          // A named row is six small icons and wants a grid, three up on a phone.
          // A bare row is two or three wide wordmarks of wildly different widths
          // and wants to wrap naturally — a grid would box them.
          named ? "grid grid-cols-3 sm:grid-cols-6" : "flex flex-wrap"
        }`}
      >
        {items.map((partner) => {
          const height = `calc(${named ? HEIGHT.named : HEIGHT.bare} * ${partner.scale ?? 1})`;

          // A linked mark is the whole tile, for the same reason as the app row:
          // at this size there is nowhere to put a separate affordance, and a
          // logo that looks clickable and is not is worse than one that plainly
          // is not.
          const Tile = partner.href ? "a" : "div";
          const link = partner.href
            ? {
                href: partner.href,
                target: "_blank" as const,
                rel: "noreferrer noopener",
                "aria-label": `${partner.name} — opens in a new tab`,
              }
            : {};

          return (
            <li key={partner.name} className="contents">
              <Tile
                {...link}
                className="group/mark relative isolate flex flex-col items-center justify-center gap-3
                         border border-rule bg-paper-raised px-5 py-5 sm:px-6
                         shadow-[0_1px_2px_rgb(20_19_15/0.04)]
                         transition-[border-color,box-shadow,transform] duration-[0.6s] ease-quad
                         hover:border-rule-strong
                         hover:shadow-[0_2px_4px_rgb(20_19_15/0.05),0_14px_28px_-16px_rgb(20_19_15/0.28)]
                         motion-safe:hover:-translate-y-0.5"
              >
              {/* The single accent, drawn across the top edge on hover — the same
                  gesture the plates and films use, so a partner tile and a
                  product frame answer to the reader in the same way. */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[0.7s] ease-quad motion-safe:group-hover/mark:scale-x-100"
              />

              <span
                className={`relative block max-w-full ${
                  partner.bleed ? "overflow-hidden rounded-[12px]" : ""
                }`}
                style={{ height, width: `calc(${height} * ${partner.aspect})` }}
              >
                <Image
                  src={partner.src}
                  alt={named ? "" : partner.name}
                  title={partner.name}
                  fill
                  sizes="(min-width: 640px) 240px, 45vw"
                  // EVERY mark here is served exactly as committed. Two reasons,
                  // and the second is the important one:
                  //
                  // `build-work-assets.js` already caps these at 320px and a few
                  // kilobytes, so there is nothing left for the optimizer to
                  // win — and Next will not serve SVG through /_next/image at
                  // all unless `dangerouslyAllowSVG` is on for the whole app,
                  // which would let any future image source ship script into the
                  // page.
                  //
                  // More importantly, every transform between the file and the
                  // screen is somewhere an artifact can appear or a stale
                  // variant can be cached. Google's Drive mark spent an evening
                  // proving it: a chequerboard that had been fixed at source
                  // three times kept rendering, because one cached width of the
                  // optimized encode still held the old one.
                  unoptimized
                  className={`object-center ${
                    // A bleed mark carries its own ground, so it fills its box
                    // and skips the blend — multiplying a solid brand field into
                    // warm paper only makes it muddy.
                    partner.bleed
                      ? "object-cover"
                      : "object-contain mix-blend-multiply"
                  }`}
                />
              </span>

              {named ? (
                // Set in the marks' own casing rather than the eyebrow's caps:
                // these are proper nouns, and uppercasing turns YZi Labs into
                // YZILABS and USDC's siblings into a row that reads as shouting.
                <span className="type-small text-center leading-[1.3] text-ink-45">
                  {partner.name}
                </span>
              ) : null}
              </Tile>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
