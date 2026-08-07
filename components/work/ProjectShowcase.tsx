import Image from "next/image";
import { Reveal } from "@/components/primitives/Reveal";
import { FeaturePills } from "@/components/work/FeaturePills";
import { LogoCloud } from "@/components/work/LogoCloud";
import { Plate } from "@/components/work/Plate";
import { PhonePair } from "@/components/work/PhonePair";
import { ProjectMetrics } from "@/components/work/ProjectMetrics";
import type { Project } from "@/lib/content";

/**
 * One product, as a spread.
 *
 * The layout is a 12-column spread with a full empty column between the two
 * halves — copy in four, nothing in one, media in seven — and it alternates
 * side every block. The alternation is the rhythm of the act: without it, four
 * products in a row read as one long list, and the reader stops arriving at
 * each new one.
 *
 * Two decisions carry most of the feel:
 *
 *  1. THE COPY IS STICKY, THE MEDIA IS NOT. The text column pins just under the
 *     nav while the plate or the devices travel past it. That is what produces
 *     the "cinematic" progression — the reader is held on one message while the
 *     evidence for it moves — and it costs one `position: sticky`, no scroll
 *     listener and no pinned-section library.
 *  2. DOM ORDER NEVER CHANGES. Copy always comes first in the markup, so the
 *     reading and tab order stay identical on every block and on every screen.
 *     The visual side is set with `col-start`, which reorders nothing.
 *
 * Below `lg` the spread collapses to a single column in that same order and the
 * sticky is dropped. Copy stays first there on purpose: a plate arriving before
 * its name is a picture of nothing, and every one of these captures is dense
 * enough to need the sentence above it.
 */
export function ProjectShowcase({
  project,
  /** Even blocks put the media on the right; odd blocks flip it. */
  flipped = false,
  /** Only the first block is above the fold. Everything else defers. */
  priority = false,
}: {
  project: Project;
  flipped?: boolean;
  priority?: boolean;
}) {
  // The plate leans away from the page edge it sits nearest, so both sides of
  // the spread appear to open towards the reader rather than in one direction.
  const tilt = flipped ? 2 : -2;

  const media =
    project.media.kind === "phones" ? (
      <PhonePair screens={project.media.screens} tilt={tilt} priority={priority} />
    ) : (
      <Plate
        src={project.media.src}
        alt={project.media.alt}
        tilt={tilt}
        priority={priority}
      />
    );

  return (
    <article className="group relative">
      <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        {/* ---------------------------------------------------------- copy */}
        <div
          className={`lg:col-span-4 lg:row-start-1 lg:self-start lg:sticky lg:top-[7.5rem] ${
            flipped ? "lg:col-start-9" : "lg:col-start-1"
          }`}
        >
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="type-label tnum text-ink-25">{project.index}</span>
              <span aria-hidden className="h-px w-7 bg-rule-strong" />
              <span className="type-label text-accent">{project.kind}</span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-7 flex items-center gap-3.5">
              <Mark logo={project.logo} />
              <h3 className="type-h3">
                {project.href ? (
                  // A real link rather than a pseudo-element stretched over the
                  // block. The sticky column is a positioned ancestor, so a
                  // stretched link would cover the copy anyway — and covering
                  // your own paragraph to make a card clickable costs the reader
                  // the ability to select the text on it.
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${project.name} — open the live product in a new tab`}
                    className="link-rule"
                  >
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
              </h3>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="type-serif mt-8 max-w-[19ch] text-[clamp(1.55rem,2.5vw,2.35rem)] leading-[1.14] tracking-[-0.02em] text-ink">
              {project.pitch}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="type-body mt-7 max-w-[46ch] text-ink-70">{project.summary}</p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9">
              <FeaturePills items={project.tags} />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10">
              <ProjectMetrics project={project} />
            </div>
          </Reveal>
        </div>

        {/* --------------------------------------------------------- media */}
        <div
          className={`lg:col-span-7 lg:row-start-1 ${
            flipped ? "lg:col-start-1" : "lg:col-start-6"
          }`}
        >
          <Reveal y={30} duration={1}>
            {media}
          </Reveal>

          {project.partners ? (
            <Reveal delay={0.16}>
              <div className="mt-12 border-t border-rule pt-8 md:mt-14">
                <LogoCloud
                  label={project.partners.label}
                  items={project.partners.items}
                  named={project.partners.items.length > 4}
                />
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/**
 * The product's own mark, set to one optical height across every block.
 *
 * Width comes from the artwork's aspect ratio rather than a shared box — these
 * range from a square app icon to a signal waveform four times wider than it is
 * tall, and one box either squashes the wide ones to invisibility or floats the
 * square ones in dead space.
 */
const MARK_HEIGHT_REM = 1.6;

const isVector = (src: string) => src.endsWith(".svg");

function Mark({ logo }: { logo: Project["logo"] }) {
  if (logo.square) {
    return (
      <span className="relative block size-8 shrink-0 overflow-hidden rounded-[7px]">
        <Image src={logo.src} alt="" fill sizes="32px" className="object-cover" />
      </span>
    );
  }

  return (
    <span
      className="relative block shrink-0"
      style={{
        height: `${MARK_HEIGHT_REM}rem`,
        width: `${MARK_HEIGHT_REM * (logo.aspect ?? 1.5)}rem`,
      }}
    >
      <Image
        src={logo.src}
        alt=""
        fill
        sizes="140px"
        unoptimized={isVector(logo.src)}
        className="object-contain object-left"
      />
    </span>
  );
}
