import Image from "next/image";
import { Parallax } from "@/components/primitives/Parallax";

/**
 * A product capture, framed.
 *
 * The frame is a fixed-aspect box with the image absolutely filling it, so the
 * space is reserved before a single byte has arrived — the plates are otherwise
 * the only source of layout shift on the page.
 *
 * The surface underneath is `void` rather than paper: every product here is a
 * dark interface, so the plate reads as one solid object while it loads instead
 * of flashing a light rectangle and then going dark.
 *
 * `tilt` comes from which side of the spread the plate sits on. A plate on the
 * right tilts its right edge away from the reader and settles flat as it
 * reaches the middle of the viewport, which is what gives the act its sense of
 * depth without moving anything anyone is trying to read.
 */
export function Plate({
  src,
  alt,
  tilt = 0,
  priority = false,
}: {
  src: string;
  alt: string;
  tilt?: number;
  priority?: boolean;
}) {
  return (
    <Parallax distance={26} tilt={tilt}>
      <figure
        className="group/plate relative aspect-[4/3] overflow-hidden border border-rule bg-void
                   shadow-[0_1px_2px_rgb(20_19_15/0.05),0_30px_60px_-30px_rgb(20_19_15/0.30),0_70px_120px_-60px_rgb(20_19_15/0.30)]
                   transition-[border-color,box-shadow] duration-[0.9s] ease-quad
                   group-hover:border-rule-strong
                   group-hover:shadow-[0_1px_2px_rgb(20_19_15/0.06),0_40px_80px_-30px_rgb(20_19_15/0.38),0_90px_150px_-60px_rgb(20_19_15/0.34)]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          // The media column is at most 7 of 12 inside a 1560px container.
          sizes="(min-width: 1024px) 58vw, 100vw"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          quality={88}
          className="object-cover object-center transition-transform duration-[1.4s] ease-quad motion-safe:group-hover:scale-[1.015]"
        />

        {/* Lighting. A single soft fall of light from the top-left, at an
            opacity that survives on an OLED and disappears on a bad panel —
            which is the correct failure mode for something decorative. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgb(255_255_255/0.07)_0%,transparent_38%)]"
        />

        {/* The single accent in the act: a hairline drawn across the top edge
            on hover. Inside the frame, so it lands on the image. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[0.9s] ease-quad motion-safe:group-hover:scale-x-100"
        />
      </figure>
    </Parallax>
  );
}
