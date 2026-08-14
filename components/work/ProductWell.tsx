import Image from "next/image";
import { PhonePair } from "@/components/work/PhonePair";
import { ProductFilm } from "@/components/work/ProductFilm";
import type { Project } from "@/lib/content";
import type { ReactNode } from "react";

/**
 * The well: one product, composed around its own footage.
 *
 * A "well" is an aperture cut clean through the paper — full bleed, no border,
 * no radius, no shadow, no gutter — with the product running inside it at
 * something close to the size of the window. Six identical rounded rectangles
 * beside six identical copy columns is precisely what this act exists instead
 * of, so the only thing the six wells have in common is that they are all holes
 * in the same page. What happens inside each one is decided by what the footage
 * actually is.
 *
 * The geometry lives in CSS (`app/globals.css`, "THE PROOF ACT'S CAMERA")
 * because all six compositions are built out of overflowing the window, and a
 * viewport-relative width does not belong in a React prop. This file decides
 * WHAT is in each shot; the stylesheet decides how big it is and where the
 * camera is standing.
 *
 * THE CAMERA IS THE CONNECTING DEVICE. Every shot is a `calc()` off `--c`, the
 * centred scroll progress of its own spread, and every shot is mid-move at the
 * moment the next one cuts in. Read down the act, the gestures hand off:
 *
 *     Pepay      the camera dollies past a floating interface
 *     DRK        and pushes into a console wider than the window
 *     BNBPay     which opens out — desktop and devices separating across frame
 *     Combat     panning hard along a broadcast wall
 *     Linton     until the aerial takes the whole window and absorbs the motion
 *     Noise      and everything comes to rest on one quiet surface
 *
 * That is the difference between animating cards and animating a camera, and it
 * is why the shots must not be interchangeable: a gesture that hands off has to
 * be a different gesture from the one it hands off to.
 */

export type ShotName =
  | "float"
  | "console"
  | "travel"
  | "wall"
  | "aerial"
  | "surface";

/** Where the product's name and pitch sit relative to its shot. */
export type FrameName =
  /** On paper above the well. The film is the answer to a question already asked. */
  | "editorial"
  /** In bone at the foot of the shot itself, over the footage. */
  | "overlay"
  /** In a column of dark beside the shot, which runs off the far edge. */
  | "sidebar";

/**
 * The direction, per product. Keyed by index so it sits beside the copy it
 * stages without being mixed into it — `lib/content.ts` is what the studio has
 * built, this is how it is shot, and the two change for completely different
 * reasons.
 */
export const STAGING: Record<string, { shot: ShotName; frame: FrameName }> = {
  // Pepay — a consumer product. The interface floats in dark space with room on
  // every side and the camera passes it, which is what gives the act its
  // opening sense of depth before anything has been said.
  "01": { shot: "float", frame: "editorial" },
  // DRK — institutional. The console runs wider than the window and the camera
  // only ever pushes further in. Nothing about this shot pulls back.
  //
  // The copy is NOT overlaid, and this is the one place in the act where that
  // was tried and reversed. DRK's recording is the densest frame here — a
  // monitoring pipeline, a rolling market state, a participants table and a
  // managed-trade chart, all lit — and a pitch set over it was legible only
  // because the scrim was heavy enough to bury the console underneath. Two
  // things fighting, both losing. On paper above, the sentence reads in one
  // pass and the console is unobstructed.
  "02": { shot: "console", frame: "editorial" },
  // BNBPay — money moving. Two objects cross the frame in opposite directions.
  "03": { shot: "travel", frame: "editorial" },
  // Combat Reviews — the most aggressive treatment in the act. A broadcast
  // strip, edge to edge, panning faster than anything around it.
  "04": { shot: "wall", frame: "overlay" },
  // Linton — the cinematic reset. The camera is already inside this footage, so
  // the page does almost nothing and lets the drone do the travelling.
  "05": { shot: "aerial", frame: "overlay" },
  // Noise — an operating environment. A desktop surface running off the edge of
  // the window, and the one shot in the act that comes to rest.
  "06": { shot: "surface", frame: "sidebar" },
};

export function ProductWell({
  project,
  shot,
  /** Rendered inside the well for `overlay` and `sidebar` frames; null otherwise. */
  header,
  priority = false,
}: {
  project: Project;
  shot: ShotName;
  header?: ReactNode;
  priority?: boolean;
}) {
  const media = project.media;

  const film =
    media.kind === "film" ? (
      <ProductFilm
        src={media.src}
        poster={media.poster}
        still={media.still}
        alt={media.alt}
        priority={priority}
        sizes="100vw"
      />
    ) : media.kind === "plate" ? (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes="(min-width: 1024px) 70vw, 100vw"
        quality={90}
        priority={priority}
        className="object-cover object-center"
      />
    ) : null;

  switch (shot) {
    /* ------------------------------------------------------------ 01 · float
       The interface held clear of every edge, lit from one side, with the dark
       running past it in all directions. The margin is the composition: an
       object with space around it reads as an object, and an object bled to the
       window edges reads as a background. Pepay is the only product in the act
       shot this way, because it is the only one that opens it. */
    case "float":
      return (
        <div className="well well--float">
          <div className="shot shot--float">
            {film}
            {/* One soft fall of light, so the plane has a surface. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgb(255_255_255/0.08)_0%,transparent_40%)]"
            />
          </div>
        </div>
      );

    /* ---------------------------------------------------------- 02 · console
       Wider than the window on both sides and clipped top and bottom, so the
       reader is inside the interface rather than looking at a picture of it.
       The scale only ever increases across the pass — this is the shot that
       pushes in, and it hands the act over to the next product mid-push. */
    case "console":
      return (
        // Header first in the markup on every overlaid shot. Above `lg` it is
        // absolutely positioned so the order is invisible; below it, this is
        // what puts the name and the pitch ABOVE the film instead of under it,
        // which is the difference between a caption and a label.
        // No scrim. A scrim exists to make overlaid type legible, and there is
        // no type over this shot — darkening the bottom third of a console
        // nobody is reading across is just losing a third of the console.
        <div className="well well--console">
          <div className="shot shot--console">{film}</div>
        </div>
      );

    /* ----------------------------------------------------------- 03 · travel
       The desktop recording and the devices cross the frame in opposite
       directions, so the shot is doing the thing the product does: value
       leaving one place and arriving in another. The overlap is what makes them
       one scene rather than two exhibits — the phones are in front of the
       console, not next to it. */
    case "travel":
      return (
        <div className="well well--travel">
          <div className="shot shot--travel">{film}</div>
          {media.kind === "film" && media.screens ? (
            <div className="drift drift--travel">
              <PhonePair screens={media.screens} float={false} />
            </div>
          ) : null}
        </div>
      );

    /* ------------------------------------------------------------- 04 · wall
       A broadcast strip. No frame, no inset, no softening and no margin: the
       edges of the window are the edges of the film. It pans harder and faster
       than anything else in the act, which is the correct register for a
       product about fights. */
    case "wall":
      return (
        <div className="well well--wall">
          {header}
          <div className="shot shot--wall">{film}</div>
          {/* The heaviest scrim in the act, and the footage is why: this
              recording ends on a fight card, a rankings table and a partner
              marquee all at once, which is the densest, brightest frame any of
              these six products produces. The standard scrim left the pitch
              sitting in the middle of a results table. */}
          <Scrim weight="heavy" />
        </div>
      );

    /* ----------------------------------------------------------- 05 · aerial
       The whole window, and almost nothing done to it. This footage is a drone
       crossing a development — it already contains more camera movement than
       anything the page could add, so the page adds one slow settle and gets
       out of the way. It is also the act's visual reset: after four interfaces,
       a landscape. */
    case "aerial":
      return (
        <div className="well well--aerial">
          {header}
          <div className="shot shot--aerial">{film}</div>
          <Scrim weight="soft" />
        </div>
      );

    /* ---------------------------------------------------------- 06 · surface
       A desktop that runs off the right edge of the window and keeps going,
       with the copy held in the dark it leaves behind. The only still in the
       act and the only shot that comes to rest — the act ends by stopping
       moving, which is what makes the six before it read as travel. */
    case "surface":
      return (
        <div className="well well--surface">
          {header}
          <div className="shot shot--surface">
            {film}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgb(255_255_255/0.06)_0%,transparent_42%)]"
            />
          </div>
        </div>
      );
  }
}

/**
 * The ground the overlaid copy stands on.
 *
 * Only above `lg`, and only where the copy is actually over the footage. Below
 * that the name and pitch sit above the film in the dark band rather than on
 * top of it — a scrim exists to make type legible over a picture, and darkening
 * a 393px-wide film to make room for type that is not there any more is just
 * losing the picture.
 *
 * Three weights, because a scrim is sized to the frame it has to survive, not
 * to a house style. Linton's aerial is a dark canopy and needs almost nothing;
 * Combat's recording ends on a lit results table and needs almost everything.
 * A single weight tuned for the average would be too heavy for one and too
 * light for the other — and too light is not a stylistic miss, it is a pitch
 * the reader cannot read.
 */
function Scrim({ weight = "base" }: { weight?: "soft" | "base" | "heavy" }) {
  const grounds = {
    soft: "bg-[linear-gradient(to_top,rgb(16_15_13/0.78)_0%,rgb(16_15_13/0.34)_20%,transparent_50%)]",
    base: "bg-[linear-gradient(to_top,rgb(16_15_13/0.92)_0%,rgb(16_15_13/0.55)_22%,rgb(16_15_13/0.12)_44%,transparent_64%)]",
    heavy:
      "bg-[linear-gradient(to_top,rgb(16_15_13/0.98)_0%,rgb(16_15_13/0.95)_24%,rgb(16_15_13/0.78)_38%,rgb(16_15_13/0.3)_54%,transparent_74%)]",
  } as const;

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-[1] hidden lg:block ${grounds[weight]}`}
    />
  );
}
