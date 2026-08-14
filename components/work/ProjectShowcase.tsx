import Image from "next/image";
import { Reveal } from "@/components/primitives/Reveal";
import { AppGrid } from "@/components/work/AppGrid";
import { FeaturePills } from "@/components/work/FeaturePills";
import { FilmPlate } from "@/components/work/FilmPlate";
import { LogoCloud } from "@/components/work/LogoCloud";
import { Plate } from "@/components/work/Plate";
import { PhonePair } from "@/components/work/PhonePair";
import { ProjectMetrics } from "@/components/work/ProjectMetrics";
import type { Project } from "@/lib/content";

/**
 * One product, as a spread.
 *
 * The layout is a 12-column spread — copy in four, media in eight, running off
 * the outer edge of the page — and it alternates side every block. The
 * alternation is the rhythm of the act: without it, six products in a row read
 * as one long list and the reader stops arriving at each new one.
 *
 * The media takes eight columns and bleeds past the gutter because it has to be
 * bigger than the words about it. An earlier version gave it seven and kept a
 * full empty column between the halves; it was better typography and worse
 * argument — a 16:9 film came out SHORTER than its own copy block, so the
 * description of the evidence was the larger object on screen. In an act whose
 * only job is proof, the proof wins the space.
 *
 * Two decisions carry most of the feel:
 *
 *  1. THE COPY IS STICKY, THE MEDIA IS NOT. The text column pins just under the
 *     nav while the plate or the devices travel past it. That is what produces
 *     the "cinematic" progression — the reader is held on one message while the
 *     evidence for it moves — and it costs one `position: sticky`, no scroll
 *     listener and no pinned-section library.
 *
 *     Which of the two columns is taller varies by product, and that is why the
 *     media is centred rather than top-aligned. A spread carrying devices, an
 *     app row and a partner strip runs far past its copy and the copy sticks
 *     through it; a spread that is one 16:9 film is SHORTER than its own copy,
 *     and top-aligning that leaves a third of the spread as dead paper under the
 *     film. Centred, the same difference reads as margin.
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
    project.media.kind === "film" ? (
      <FilmPlate
        src={project.media.src}
        poster={project.media.poster}
        still={project.media.still}
        alt={project.media.alt}
        aspect={project.media.aspect}
        tilt={tilt}
        priority={priority}
      />
    ) : project.media.kind === "phones" ? (
      <PhonePair screens={project.media.screens} tilt={tilt} priority={priority} />
    ) : (
      <Plate
        src={project.media.src}
        alt={project.media.alt}
        tilt={tilt}
        priority={priority}
      />
    );

  /* Devices under a film, for a product whose recording is of the desktop app
     but whose real surface is a phone. Never shown beside a `phones` block —
     that would be the same evidence twice. */
  const devices = project.media.kind === "film" ? project.media.screens : undefined;

  return (
    <article className="group relative">
      <div className="flex flex-col gap-y-11 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
        {/* ---------------------------------------------------------- copy
            `contents` on small screens dissolves this wrapper so that its two
            halves become siblings of the media and can be ordered around it —
            name and pitch, then the film, then everything else. On a phone that
            is the whole point: the reader gets ONE thing to look at, and the
            supporting detail waits until after they have looked at it.

            Above `lg` the wrapper reassembles into the sticky column it has
            always been, holding both halves together while the media travels. */}
        <div
          className={`contents lg:block lg:col-span-4 lg:row-start-1 lg:self-start lg:sticky lg:top-[7.5rem] ${
            flipped ? "lg:col-start-9" : "lg:col-start-1"
          }`}
        >
          <div className="order-1">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="type-label tnum text-ink-25">{project.index}</span>
                <span aria-hidden className="h-px w-7 bg-rule-strong" />
                <span className="type-label text-accent">{project.kind}</span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="mt-7 flex items-center gap-3.5">
                {project.logo ? <Mark logo={project.logo} /> : null}
                <h3 className="type-h3">
                  {project.href ? (
                    // A real link rather than a pseudo-element stretched over
                    // the block. The sticky column is a positioned ancestor, so
                    // a stretched link would cover the copy anyway — and
                    // covering your own paragraph to make a card clickable costs
                    // the reader the ability to select the text on it.
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${project.name} — ${
                        project.linkLabel ?? "visit the live product"
                      }, opens in a new tab`}
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
          </div>

          <div className="order-3 lg:mt-7">
            <Reveal delay={0.18}>
              <p className="type-body max-w-[46ch] text-ink-70">{project.summary}</p>
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
        </div>

        {/* --------------------------------------------------------- media
            Dissolved on small screens for the same reason as the copy column:
            the film has to land directly under the pitch, while the evidence
            that supports it — devices, sibling apps, partner marks — waits until
            after the reader has been told what they are looking at. Above `lg`
            the four stack in one column beside the sticky copy, as before. */}
        <div
          className={`contents lg:block lg:col-span-8 lg:row-start-1 lg:self-center ${
            flipped ? "lg:col-start-1 lg:-ml-gutter" : "lg:col-start-5 lg:-mr-gutter"
          }`}
        >
          <Reveal className="order-2" y={30} duration={1}>
            {media}
          </Reveal>

          {devices ? (
            <Reveal className="order-4 lg:mt-16" delay={0.1} y={30} duration={1}>
              <PhonePair screens={devices} tilt={-tilt} />
            </Reveal>
          ) : null}

          {project.apps ? (
            <Reveal className="order-5 lg:mt-14" delay={0.16}>
              <div className="border-t border-rule pt-8">
                <AppGrid label={project.apps.label} items={project.apps.items} />
              </div>
            </Reveal>
          ) : null}

          {project.partners ? (
            <Reveal className="order-6 lg:mt-14" delay={0.16}>
              <div className="border-t border-rule pt-8">
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

function Mark({ logo }: { logo: NonNullable<Project["logo"]> }) {
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
