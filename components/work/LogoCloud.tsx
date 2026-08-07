import Image from "next/image";
import type { Partner } from "@/lib/content";

/**
 * The borrowed-credibility block: an accelerator, a promotion or a platform
 * putting its name next to the product.
 *
 * Two rules do all the work here, and both are about restraint:
 *
 *  1. ONE OPTICAL HEIGHT. Every mark is set to the same height and takes its
 *     width from its own aspect ratio. Forcing a horizontal wordmark and a
 *     square badge through one box either squashes the wide one to a smear or
 *     floats the square one in dead space — which is what makes most logo walls
 *     look like a spreadsheet.
 *  2. QUIET UNTIL ASKED. The marks are held in greyscale at reduced opacity and
 *     only resolve on hover. They are supporting evidence, not the argument, and
 *     a row of full-colour brand stickers would outshout the product above them.
 *
 * Every one of these ships on a white plate, which on warm paper would read as
 * a row of labels. `mix-blend-multiply` drops the white grounds into the paper;
 * the list is `isolate` so the blend resolves against its own paper background
 * rather than against the lattice canvas behind the section.
 */

/**
 * Shared optical height for every mark in a row.
 *
 * A named row is a row of icons with their own captions, so the mark only has
 * to be recognisable. An unnamed row is a claim — an accelerator's name beside
 * the product — and has to be readable at a glance or it is doing nothing.
 */
const HEIGHT_REM = { named: 1.9, bare: 2.9 } as const;

const isVector = (src: string) => src.endsWith(".svg");

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
      <p className="type-label text-ink-25">{label}</p>
      <ul
        className={`isolate mt-6 flex flex-wrap items-end bg-paper ${
          named ? "gap-x-7 gap-y-6" : "gap-x-9 gap-y-7"
        }`}
      >
        {items.map((partner) => {
          const height = (named ? HEIGHT_REM.named : HEIGHT_REM.bare) * (partner.scale ?? 1);

          return (
            <li key={partner.name} className="flex flex-col items-start gap-2.5">
              <span
                className="relative block"
                style={{
                  height: `${height}rem`,
                  width: `${height * partner.aspect}rem`,
                }}
              >
                <Image
                  src={partner.src}
                  alt={named ? "" : partner.name}
                  title={partner.name}
                  fill
                  sizes="120px"
                  // Next refuses to serve SVG through /_next/image unless
                  // `dangerouslyAllowSVG` is on for the whole app, which would
                  // let any future image source ship script into the page. A
                  // vector has nothing to gain from the raster pipeline anyway.
                  //
                  // This fails silently when missed: a broken mark occupies its
                  // box and paints nothing, so the row looks right and the logo
                  // is simply absent.
                  unoptimized={isVector(partner.src)}
                  className="object-contain object-bottom opacity-80 mix-blend-multiply grayscale transition-[opacity,filter] duration-[0.7s] ease-quad hover:opacity-100 hover:grayscale-0"
                />
              </span>

              {named ? (
                <span className="type-label text-ink-25">{partner.name}</span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
