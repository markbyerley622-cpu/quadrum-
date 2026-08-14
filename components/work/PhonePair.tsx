import { Parallax } from "@/components/primitives/Parallax";
import { PhoneMockup } from "@/components/work/PhoneMockup";

/**
 * Two devices, overlapping.
 *
 * Every dimension is derived from one custom property, so the overlap holds at
 * every breakpoint and the pair scales as a single object. Hardcoded widths are
 * why most device mockups crop or collide on a phone; here the whole group is
 * `1.68 × --phone` wide and simply gets smaller.
 *
 * The front phone is the primary surface and sits lower and larger. The one
 * behind is smaller and raised, which is enough to establish depth without any
 * blur or opacity trickery.
 */
export function PhonePair({
  screens,
  tilt = 0,
  priority = false,
  /**
   * The idle bob. On by default, and turned OFF wherever the pair is already
   * being moved by something else — inside a scroll-driven shot the two motions
   * fight each other, and a device that floats on its own while the camera is
   * travelling past it reads as a widget rather than as a thing in the scene.
   */
  float = true,
}: {
  screens: readonly { src: string; alt: string }[];
  tilt?: number;
  priority?: boolean;
  float?: boolean;
}) {
  const [front, back] = screens;

  return (
    <Parallax distance={float ? 30 : 0} tilt={tilt}>
      <div
        className="relative mx-auto flex w-fit items-start justify-center"
        style={{ ["--phone" as string]: "min(17.5rem, 41vw)" }}
      >
        {/* Ambient light behind the pair — the only place on the page that
            hints at the product's own colour, and the reason the devices read
            as sitting in space rather than pasted onto paper. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[130%] -translate-x-1/2 -translate-y-1/2
                     rounded-[50%] bg-[radial-gradient(closest-side,rgb(176_73_42/0.09),transparent_72%)] blur-2xl"
        />

        <div className="relative z-20 w-[var(--phone)] translate-y-[3%]">
          <PhoneMockup
            src={front.src}
            alt={front.alt}
            drift={float ? 9 : 0}
            priority={priority}
          />
        </div>

        {back ? (
          <div className="relative z-10 -ml-[calc(var(--phone)*0.2)] w-[calc(var(--phone)*0.88)] -translate-y-[5%]">
            <PhoneMockup
              src={back.src}
              alt={back.alt}
              drift={float ? 6 : 0}
              delay={1.4}
            />
          </div>
        ) : null}
      </div>
    </Parallax>
  );
}
