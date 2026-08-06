import type { ReactNode } from "react";
import type { PlacementName } from "@/lib/lattice";

/**
 * Every section on the page goes through here, because the lattice canvas has
 * to float *between* a section's surface and its content.
 *
 * The section itself never creates a stacking context (no z-index, no
 * transform), so:
 *
 *   -z-10  surface   painted below the canvas
 *    z-0   canvas    fixed, in the root stacking context
 *    z-10  content   painted above the canvas
 *
 * `data-tone` is read by the lattice to cross-fade its stroke colour from ink
 * to bone as the object passes over a dark surface.
 *
 * `data-lattice` is how each act tells the object where to sit while that act
 * is on screen — always on the side the text is not. Sections own this because
 * only the section knows which side its content is weighted to. See PLACEMENTS
 * in lib/lattice.ts.
 */

type Surface = "paper" | "sunk" | "void";

const surfaces: Record<Surface, string> = {
  // Paper is the body background — nothing to paint.
  paper: "",
  sunk: "bg-paper-sunk/70",
  void: "bg-void",
};

export function Section({
  id,
  surface = "paper",
  lattice = "quietRight",
  fadeOut = false,
  orderAnchor = false,
  className = "",
  contentClassName = "",
  children,
}: {
  id?: string;
  surface?: Surface;
  lattice?: PlacementName;
  /**
   * Dissolve the surface into paper across the section's bottom padding,
   * instead of ending on a hard edge. Used once, at the turn.
   *
   * This has to be rendered by `Section` rather than passed in as a child:
   * children live inside the `z-10` content wrapper, which both creates a
   * stacking context (so `-z-10` no longer means "under the canvas") and is
   * inset by the section's padding (so `bottom-0` lands under the last
   * paragraph rather than under the whitespace below it).
   */
  fadeOut?: boolean;
  /**
   * Marks this act as the one the lattice measures its ordering against. Exactly
   * one section on the page sets it — the turn. See `orderAtAnchor`.
   */
  orderAnchor?: boolean;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  const dark = surface === "void";

  return (
    <section
      id={id}
      data-tone={dark ? "dark" : "light"}
      data-lattice={lattice}
      data-order-anchor={orderAnchor ? "" : undefined}
      className={`relative ${dark ? "text-bone" : ""} ${className}`}
    >
      <div aria-hidden className={`absolute inset-0 -z-10 ${surfaces[surface]}`} />
      {fadeOut ? (
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-b from-transparent to-paper md:h-64"
        />
      ) : null}
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </section>
  );
}
