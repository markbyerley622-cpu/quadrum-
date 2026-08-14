import Image from "next/image";
import { Reveal } from "@/components/primitives/Reveal";
import { ScrollStage } from "@/components/primitives/ScrollStage";
import { AppGrid } from "@/components/work/AppGrid";
import { FeaturePills } from "@/components/work/FeaturePills";
import { LogoCloud } from "@/components/work/LogoCloud";
import { ProductWell, STAGING } from "@/components/work/ProductWell";
import { ProjectMetrics } from "@/components/work/ProjectMetrics";
import type { Project } from "@/lib/content";

/**
 * One product, as a shot.
 *
 * The spread used to be a twelve-column grid — copy in four, media in eight,
 * sticky text beside a travelling plate — and it was the right structure for an
 * act that was arguing in words. It is the wrong structure for an act whose
 * entire argument is that these things exist and run, because it made the film
 * a column-width illustration ALONGSIDE the paragraph about it. A reader looked
 * at the words first every time.
 *
 * So the spread is now three bands, in this order and never another:
 *
 *     PITCH        one sentence, set over the footage where the recording is
 *                  quiet enough to carry it and on paper above where it is not
 *     THE SHOT     the product running, at 80–100% of the window
 *     THE PROOF    summary, capabilities, the number, the link, the marks —
 *                  everything a sceptic needs and nobody else reads first
 *
 * That ordering is the whole change. The film is no longer competing with the
 * copy for the same horizontal space; it has the page to itself for a screen,
 * and the copy is what you find on either side of it. The hierarchy the act
 * already had — PITCH → DESCRIPTION → PROOF — is unchanged. It is now expressed
 * in scale and sequence instead of in three sizes of type inside one column.
 *
 * DOM ORDER NEVER CHANGES, on any product or any screen. Name, pitch, film,
 * detail. Where a pitch is rendered over its footage it is still the same
 * element in the same place in the document, absolutely positioned at `lg` and
 * nowhere else — so reading order, tab order and the phone layout are identical
 * across all six.
 *
 * ON A PHONE none of the compositions are attempted. See the stylesheet: every
 * shot resolves to the film full bleed at its own aspect on a dark band, which
 * is the only art direction a 393px screen has room for. The desktop
 * compositions are all built out of overflowing the window, and a window that
 * narrow has nothing to overflow.
 */
export function ProjectShowcase({
  project,
  /** Only the first shot is anywhere near the fold. Everything else defers. */
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const { shot, frame } = STAGING[project.index] ?? {
    shot: "float" as const,
    frame: "editorial" as const,
  };

  const overlaid = frame !== "editorial";

  /* The name and pitch. One element, three homes: on paper above the well, at
     the foot of the shot, or in the dark column beside it. Rendered once and
     positioned by the frame, so there is never a second copy of the pitch in
     the document for a screen reader to read twice. */
  const header = (
    <ProductHeader
      project={project}
      tone={overlaid ? "void" : "paper"}
      className={
        frame === "overlay"
          ? // Inside the well: stacked at the top of the dark band on a phone,
            // lifted onto the footage itself above `lg`.
            "container-page relative z-[2] pt-11 pb-9 lg:absolute lg:inset-x-0 lg:bottom-0 lg:pt-0 lg:pb-[clamp(2.5rem,5vh,4.5rem)]"
          : frame === "sidebar"
            ? "container-page relative z-[2] pt-11 pb-9 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:max-w-[min(32vw,26rem)] lg:flex-col lg:justify-center lg:pt-0 lg:pb-0"
            : ""
      }
    />
  );

  return (
    <ScrollStage className="relative">
      <article>
        {frame === "editorial" ? (
          <div className="container-page pb-11 md:pb-14">{header}</div>
        ) : null}

        <ProductWell
          project={project}
          shot={shot}
          header={overlaid ? header : undefined}
          priority={priority}
        />

        {/* ------------------------------------------------------- the proof
            Everything that makes the shot above checkable, set deliberately
            quieter than it used to be. It is not less important — the link is
            still the single most valuable control in the act — it is that a
            reader who has just watched the product run does not need to be
            sold, they need to be able to verify. */}
        <div className="container-page pt-12 md:pt-16">
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="type-body max-w-[52ch] text-ink-70">
                  {project.summary}
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="mt-8">
                  <FeaturePills items={project.tags} />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.12}>
                <ProjectMetrics project={project} />
              </Reveal>
            </div>
          </div>

          {project.apps ? (
            <Reveal delay={0.06}>
              <div className="mt-12 border-t border-rule pt-8 md:mt-14">
                <AppGrid label={project.apps.label} items={project.apps.items} />
              </div>
            </Reveal>
          ) : null}

          {project.partners ? (
            <Reveal delay={0.06}>
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
      </article>
    </ScrollStage>
  );
}

/**
 * Index, sector, name, pitch. In that order, at every size, on both grounds.
 *
 * The mark is dropped on the dark grounds and that is deliberate rather than a
 * fallback: two of the four products shot that way have wordmarks drawn for
 * paper, and more to the point, a logo laid over a running product is the first
 * thing this act said it would not do. The name in type is enough — it is what
 * the product does on its own site.
 */
function ProductHeader({
  project,
  tone,
  className = "",
}: {
  project: Project;
  tone: "paper" | "void";
  className?: string;
}) {
  const dark = tone === "void";

  return (
    <div className={className}>
      <Reveal>
        <div className="flex items-center gap-4">
          <span
            className={`type-label tnum ${dark ? "text-bone-60" : "text-ink-25"}`}
          >
            {project.index}
          </span>
          <span
            aria-hidden
            className={`h-px w-7 ${dark ? "bg-rule-invert-strong" : "bg-rule-strong"}`}
          />
          {/* Burnt sienna sits at the edge of legibility on near-black, so the
              dark ground takes the softened tint. Same accent, one step up. */}
          <span
            className={`type-label ${dark ? "text-accent-soft" : "text-accent"}`}
          >
            {project.kind}
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-6 flex items-center gap-3.5">
          {project.logo && !dark ? <Mark logo={project.logo} /> : null}
          <h3 className={`type-h3 ${dark ? "text-bone" : ""}`}>
            {project.href ? (
              // A real link rather than a pseudo-element stretched over the
              // block. Covering your own pitch to make a section clickable costs
              // the reader the ability to select the text on it, and on the
              // overlaid frames it would also cover the film.
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
        {/* The one line a visitor is meant to be able to repeat after five
            seconds. Wider measure than it had in the old four-column layout,
            because it is no longer a column of copy — it is a caption on a
            screen-sized picture, and it should read in one pass. */}
        <p
          className={`type-pitch mt-7 max-w-[24ch] ${dark ? "text-bone" : "text-ink"}`}
        >
          {project.pitch}
        </p>
      </Reveal>
    </div>
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
