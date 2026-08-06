import Image from "next/image";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { Rule } from "@/components/primitives/Rule";
import { Section } from "@/components/primitives/Section";
import { TextReveal } from "@/components/primitives/TextReveal";
import { projects, type Project } from "@/lib/content";

/**
 * Act II — the proof. Three products that are actually in production.
 *
 * This act sits second on the page, immediately after the claim, because it is
 * the only thing on the site that cannot be written by anyone. Everything after
 * it — the thesis, the method, the studio — is argued to a reader who has
 * already seen the receipts.
 *
 * Three rules hold the design together:
 *
 *  1. THE SCREENSHOT IS THE ARGUMENT, so it gets the entire width. An earlier
 *     version set the plate beside the copy in seven of twelve columns and the
 *     products simply did not read — a dense dashboard at 740px is a texture,
 *     not an interface. Full bleed doubles the pixels and the products become
 *     legible, which is the only reason they are on the page.
 *  2. THE PITCH IS A LINE, NOT A PARAGRAPH. Each product leads with one serif
 *     sentence at heading scale that sells it on its own. The descriptive copy
 *     sits underneath at body size for the reader the pitch already caught.
 *  3. NOTHING IS DECORATIVE. Every number, tag and partner mark is taken from
 *     the running product. The one accent hairline is spent on hover, on the
 *     top edge of the frame, and nowhere else in the act.
 *
 * The layout no longer alternates left/right. With the plate full width there
 * are no sides to alternate, and the rhythm now comes from the band beneath it:
 * pitch left, detail right, then a hairline row of facts.
 */

/**
 * Next refuses to serve SVG through `/_next/image` — it returns 400 unless
 * `dangerouslyAllowSVG` is switched on for the entire app, which would let any
 * future image source ship script into the page. A vector has nothing to gain
 * from the raster pipeline anyway, so these are served straight from /public.
 *
 * This failed silently the first time: a broken mark simply occupies its box
 * and paints nothing, so the layout looks correct and the logo is just absent.
 */
const isVector = (src: string) => src.endsWith(".svg");

export function Work() {
  return (
    <Section id="work" lattice="farRight" className="scroll-mt-24 pt-8 pb-24 md:pb-36">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>II · The proof</Eyebrow>
            </Reveal>
            <TextReveal
              as="h2"
              className="type-h2 mt-7 -ml-[0.04em]"
              lines={["Products we've", "put into production"]}
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <Reveal delay={0.15}>
              <p className="type-body measure text-ink-70">
                Payment infrastructure, a sports platform and an enterprise AI
                workspace. Different industries, same standard — all three run
                against real users and real data.
              </p>
            </Reveal>
          </div>
        </div>

        <Rule className="mt-14 md:mt-20" />

        <div className="mt-14 flex flex-col gap-24 md:mt-20 md:gap-32 lg:gap-40">
          {projects.map((project) => (
            <ProjectBlock key={project.index} project={project} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function ProjectBlock({ project }: { project: Project }) {
  return (
    <article className="group relative">
      {/* --- Masthead: index, industry, mark, name --------------------- */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 pb-7">
          <div className="flex items-center gap-3.5">
            <Mark logo={project.logo} />
            <h3 className="type-h3">
              {project.href ? (
                // Stretched link: one anchor with a clear accessible name, and
                // a pseudo-element that makes the whole block clickable. The
                // article is `relative`, so this resolves against it.
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${project.name} — open the live product in a new tab`}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <span className="type-label tnum text-ink-25">{project.index}</span>
            <span aria-hidden className="h-px w-8 bg-rule-strong" />
            <span className="type-label text-accent">{project.kind}</span>
          </div>
        </div>
      </Reveal>

      {/* --- The plate. Full width, because that is the whole point. --- */}
      <Reveal y={28}>
        <Shot project={project} />
      </Reveal>

      {/* --- The pitch, and the detail behind it ----------------------- */}
      <div className="mt-10 grid grid-cols-1 gap-y-6 md:mt-12 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-7">
          <Reveal delay={0.08}>
            <p className="type-serif max-w-[20ch] text-[clamp(1.6rem,3.3vw,2.9rem)] leading-[1.12] tracking-[-0.02em] text-ink">
              {project.pitch}
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:self-end">
          <Reveal delay={0.14}>
            <p className="type-body measure text-ink-70">{project.summary}</p>
          </Reveal>
        </div>
      </div>

      {/* --- The facts, as a hairline band ---------------------------- */}
      <div className="mt-10 border-t border-rule pt-7 md:mt-12">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <Reveal delay={0.06}>
              <p className="type-label tnum flex items-start gap-3 text-ink-45">
                <span aria-hidden className="mt-[0.3em] size-[5px] shrink-0 bg-accent" />
                <span className="leading-[1.7]">{project.metric}</span>
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="type-label border border-rule px-3 py-2 text-ink-45 transition-colors duration-500 group-hover:border-rule-strong"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="type-label mt-7 flex items-center gap-2.5 text-ink-45">
                {project.href ? (
                  <>
                    <span className="transition-colors duration-500 group-hover:text-ink">
                      Visit the live product
                    </span>
                    <span
                      aria-hidden
                      className="block text-accent transition-transform duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-1.5"
                    >
                      <svg viewBox="0 0 12 12" className="size-3" fill="none">
                        <path
                          d="M2.5 9.5 L9.5 2.5 M4 2.5 h5.5 v5.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      aria-hidden
                      className="size-[5px] shrink-0 rounded-full bg-accent animate-blink"
                    />
                    {project.status}
                  </>
                )}
              </p>
            </Reveal>
          </div>

          {project.partners ? (
            <div className="lg:col-span-5">
              <Reveal delay={0.2}>
                <Partners partners={project.partners} />
              </Reveal>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/**
 * The product screenshot, at full container width.
 *
 * The frame is a fixed-aspect box with the image absolutely filling it, so the
 * space is reserved before a single byte of image has arrived — this act would
 * otherwise be the only source of layout shift on the page.
 *
 * The surface underneath is `void` rather than paper: all three products are
 * dark interfaces, so the plate reads as one solid object while it loads
 * instead of flashing a light rectangle and then going dark.
 */
function Shot({ project }: { project: Project }) {
  return (
    <figure
      // Squarer on a phone. A 16:10 desktop capture at 350px wide is a 220px
      // sliver; cropping ~25% off the right buys a third more height and the
      // interface actually reads. The crop is from the right because all three
      // products carry their primary column on the left.
      className="relative aspect-[4/3] overflow-hidden border border-rule bg-void
                 shadow-[0_1px_2px_rgb(20_19_15/0.05),0_24px_50px_-24px_rgb(20_19_15/0.26)]
                 transition-[border-color,box-shadow] duration-[0.9s] ease-[cubic-bezier(0.22,1,0.36,1)]
                 group-hover:border-rule-strong
                 group-hover:shadow-[0_1px_2px_rgb(20_19_15/0.06),0_36px_80px_-26px_rgb(20_19_15/0.34)]
                 sm:aspect-[3/2] lg:aspect-[16/10]"
    >
      <Image
        src={project.shot.src}
        alt={project.shot.alt}
        fill
        // Full-bleed inside the page container, which is capped at 1560px.
        sizes="(min-width: 1680px) 1560px, 100vw"
        // Only the first plate is above the fold on a tall desktop viewport;
        // the rest are worth deferring.
        priority={project.index === "01"}
        quality={88}
        className="object-cover object-top transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.02]"
      />

      {/* The single accent in the act: a hairline drawn across the top edge on
          hover. Inside the frame so it lands on the image, not the paper. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[0.9s] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-x-100"
      />
    </figure>
  );
}

/**
 * The product's own mark, set to one optical height across all three blocks.
 *
 * Width comes from the artwork's own aspect ratio rather than a shared box —
 * these marks range from a square app icon to a signal waveform four times
 * wider than it is tall, and forcing them through one box either squashes the
 * wide ones to invisibility or floats the square ones in dead space.
 */
const MARK_HEIGHT_REM = 1.75;

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

/**
 * The trusted-by / official-partner strip.
 *
 * These marks are the borrowed credibility on the page — an accelerator or a
 * promotion putting its name next to the product — so they are set large
 * enough to actually be recognised rather than filed away as footnote icons.
 *
 * Every one ships on a white plate and most are brand-coloured, which on warm
 * paper would read as a row of stickers. Two things fix that:
 * `mix-blend-multiply` drops the white grounds into the paper, and the strip
 * is held in greyscale until the block is hovered. The container is `isolate`
 * so the blend resolves against its own paper background rather than against
 * the lattice canvas behind the section.
 */
function Partners({ partners }: { partners: NonNullable<Project["partners"]> }) {
  return (
    <div className="border-t border-rule pt-7 lg:border-t-0 lg:pt-0">
      <p className="type-label text-ink-25">{partners.label}</p>
      <ul className="isolate mt-6 flex flex-wrap items-center gap-x-8 gap-y-6 bg-paper">
        {partners.items.map((partner) => (
          <li
            key={partner.name}
            className={`relative ${
              partner.wide
                ? "h-14 w-[8.5rem]"
                : partner.stacked
                  ? "h-20 w-20"
                  : "h-14 w-14"
            }`}
          >
            <Image
              src={partner.src}
              alt={partner.name}
              title={partner.name}
              fill
              sizes="136px"
              unoptimized={isVector(partner.src)}
              className="object-contain object-left opacity-85 mix-blend-multiply grayscale transition-[opacity,filter] duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:grayscale-0"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
