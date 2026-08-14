import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { Rule } from "@/components/primitives/Rule";
import { Section } from "@/components/primitives/Section";
import { TextReveal } from "@/components/primitives/TextReveal";
import { ProjectShowcase } from "@/components/work/ProjectShowcase";
import { projects } from "@/lib/content";

/**
 * Act II — the proof. Six products, every one of them shown as film, each shot
 * at roughly the size of the window.
 *
 * This act sits second on the page, immediately after the claim, because it is
 * the only thing on the site that cannot be written by anyone. Everything after
 * it — the thesis, the method, the studio — is argued to a reader who has
 * already seen the receipts.
 *
 * Four rules hold it together:
 *
 *  1. THE FILM IS THE PAGE. Each product gets a full-bleed aperture cut through
 *     the paper, 84–100% of the viewport tall, with the product running inside
 *     it. The previous layout gave the film eight of twelve columns beside a
 *     sticky paragraph, and the paragraph won every time — a reader looks at
 *     words before pictures when the two are the same size, and in an act whose
 *     only job is proof that is exactly backwards.
 *  2. ONE MESSAGE PER SHOT. Exactly one sentence is set large enough to be the
 *     only thing you read. For two of the six it is set over the footage and
 *     for one beside it in the dark; the other three carry it on paper above,
 *     because their recordings are too dense to read type across. Everything
 *     else — summary, capabilities, the
 *     number, the link, the marks — waits on paper underneath, where a reader
 *     who wants to verify will find it and nobody else has to step over it.
 *  3. NO TWO PRODUCTS ARE SHOT THE SAME WAY. A console that runs wider than the
 *     window, a broadcast strip panning edge to edge, an aerial that takes the
 *     whole screen, a desktop surface running off it. Six identical rounded
 *     rectangles is what this act exists instead of; see `ProductWell` for
 *     which composition each product gets and why its own footage chose it.
 *  4. NOTHING IS DECORATIVE. Every number, capability and partner mark is taken
 *     from the running product, and every film is an unedited capture of it.
 *     Nothing here is a mockup, a render or a device that does not exist.
 *
 * THE CAMERA IS WHAT JOINS THEM. Every shot is still moving as the next one
 * cuts in, and the gestures hand off down the act — dolly, push in, open out,
 * pan, reset, rest. That is one CSS custom property per product and no
 * animation architecture at all; the stylesheet's "THE PROOF ACT'S CAMERA"
 * block is the whole implementation.
 *
 * ON A PHONE none of the compositions are attempted, because all six are built
 * out of overflowing the window. The reader gets the name, the pitch, and then
 * the film full bleed at its own aspect on a dark band — one focal point, no
 * overlapping type, and no desktop composition squeezed into 393px.
 */
export function Work() {
  return (
    <Section id="work" lattice="farRight" className="scroll-mt-24 pt-10 pb-24 md:pb-32">
      {/* The header is the last thing in this act that sits inside the page
          container. Everything below the rule is full bleed, because a shot
          that stops at the gutter is a card. */}
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
              {/* Names the range and then stops. The old version explained what
                  connects six projects across four industries; the constellation
                  at the end of the act now shows it, and a sentence that
                  pre-empts a thing the page is about to demonstrate is a
                  sentence doing the demonstration's job badly. */}
              <p className="type-body max-w-[40ch] text-ink-70">
                Payments, institutional liquidity, combat sports, property
                investment and enterprise AI. All six are shown running.
              </p>
            </Reveal>
          </div>
        </div>

        <Rule className="mt-16 md:mt-24" />
      </div>

      {/* The gap between products, and it is the act's most important number in
          both directions. Too small and the proof of one product runs into the
          pitch of the next; too large and the paper between the shots becomes
          the page, which puts the reader back in a list. It is deliberately
          tighter than it was — the shots are now near a screen tall each, so
          the paper is a caption between them rather than a section break. */}
      <div className="mt-16 flex flex-col gap-16 md:mt-20 md:gap-24">
        {projects.map((project, i) => (
          <ProjectShowcase
            key={project.index}
            project={project}
            priority={i === 0}
          />
        ))}
      </div>
    </Section>
  );
}
