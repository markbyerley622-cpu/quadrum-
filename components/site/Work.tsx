import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { Rule } from "@/components/primitives/Rule";
import { Section } from "@/components/primitives/Section";
import { TextReveal } from "@/components/primitives/TextReveal";
import { ProjectShowcase } from "@/components/work/ProjectShowcase";
import { projects } from "@/lib/content";

/**
 * Act II — the proof. Six products, five of them shown as film.
 *
 * This act sits second on the page, immediately after the claim, because it is
 * the only thing on the site that cannot be written by anyone. Everything after
 * it — the thesis, the method, the studio — is argued to a reader who has
 * already seen the receipts.
 *
 * Three rules hold it together:
 *
 *  1. ONE MESSAGE PER SPREAD. Each product gets a full spread with exactly one
 *     sentence set large enough to be the only thing you read. An earlier
 *     version stacked a pitch, a summary, a metric row, a tag row, a status and
 *     a partner strip at the same visual weight under a full-bleed plate — six
 *     things competing, so a reader took none of them. The hierarchy now falls
 *     away sharply: pitch, then paragraph, then hairline facts.
 *  2. THE COPY HOLDS, THE EVIDENCE MOVES. The text column is sticky and the
 *     media scrolls past it, so each product introduces itself once and then
 *     shows its work. Five of the six show it as film, already playing by the
 *     time the reader arrives — no control bar, nothing to press. This is also
 *     what hands the reader forward: a spread releases only when the next one
 *     has already begun.
 *  3. NOTHING IS DECORATIVE. Every number, capability and partner mark is taken
 *     from the running product, and every film is an unedited capture of it. The
 *     accent is spent on the index rule, the metric marker and the link, and
 *     nowhere else in the act.
 *
 * Blocks alternate side — copy left, then copy right — because five spreads in
 * one direction read as a list rather than as five separate arrivals.
 *
 * ON A PHONE the spread reorders itself so there is exactly one focal point: the
 * name and the pitch, then the film full bleed edge to edge, and only then the
 * detail that supports it. See `ProjectShowcase` for how, and why the two
 * columns dissolve rather than reflow.
 */
export function Work() {
  return (
    <Section id="work" lattice="farRight" className="scroll-mt-24 pt-10 pb-24 md:pb-32">
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
              {/* Names the range, then says what actually connects it. Listing
                  the sectors alone invites the wrong conclusion — three of the
                  six are financial, and a reader who stops at the list files
                  this studio under crypto. The common factor is not an industry
                  and it is worth saying out loud. */}
              <p className="type-body max-w-[42ch] text-ink-70">
                Payments, institutional liquidity, combat sports, property
                investment and enterprise AI. What these share is not a sector —
                it is that each was a complicated business that had to become a
                product someone could actually use. Five of the six are shown
                running, not described.
              </p>
            </Reveal>
          </div>
        </div>

        <Rule className="mt-16 md:mt-24" />

        {/* The gap is the act's most important number. Each spread has to clear
            the viewport before the next begins, or the sticky copy of one
            product ends up on screen beside the plate of the next. */}
        <div className="mt-20 flex flex-col gap-32 md:mt-28 md:gap-48 lg:gap-56">
          {projects.map((project, i) => (
            <ProjectShowcase
              key={project.index}
              project={project}
              flipped={i % 2 === 1}
              priority={i === 0}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
