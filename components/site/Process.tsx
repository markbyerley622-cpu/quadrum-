import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { TextReveal } from "@/components/primitives/TextReveal";
import { process } from "@/lib/content";

/**
 * Act III, second beat — Define → Design → Build → Evolve.
 *
 * This used to be four full-height panels tracked by a sticky index. It read
 * well and cost four screens of scroll to say something the reader had already
 * accepted by this point in the page — so it is now a single quadrant, one
 * screen, four cells.
 *
 * The name is the point of the studio, so the four cells are laid out as an
 * actual quadrant rather than a list: hairlines between them, nothing around
 * them, closed off at the bottom so the block reads as a table rather than a
 * run of items that happened to stop.
 *
 * Each stage carries the studio principle that belongs to it, set in the serif
 * so it reads as an aside in a different voice to the surrounding copy.
 */
export function Process() {
  return (
    <Section id="approach" lattice="quietLeft" className="scroll-mt-24 py-24 md:py-36">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow>How we work</Eyebrow>
            </Reveal>
            <TextReveal
              as="h2"
              className="type-h2 mt-7 -ml-[0.04em]"
              lines={["From uncertainty to", "dependable software"]}
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <Reveal delay={0.15}>
              <p className="type-body measure text-ink-70">
                Four capabilities, applied end to end by one accountable team.
                Strategy, design and engineering stay connected from the first
                decision through production — no handoffs, no loss of context.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:mt-24 md:grid-cols-2">
          {process.map((step, i) => (
            <Reveal
              key={step.index}
              delay={(i % 2) * 0.08}
              y={18}
              className={`border-t border-rule ${
                i % 2 === 1
                  ? "md:border-l md:border-rule md:pl-10 lg:pl-16"
                  : "md:pr-10 lg:pr-16"
              }`}
            >
              <div className="group flex h-full items-start gap-5 py-9 md:gap-8 md:py-12">
                <span className="type-label tnum mt-[0.45rem] shrink-0 text-ink-25 transition-colors duration-500 group-hover:text-accent">
                  {step.index}
                </span>
                <div className="min-w-0">
                  <h3 className="type-h3">{step.title}</h3>
                  <p className="type-body measure mt-4 text-ink-70">
                    {step.summary}
                  </p>
                  <figure className="mt-6 border-l border-accent/40 pl-5">
                    <blockquote className="type-serif measure text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.45] text-ink-45">
                      {step.principle}
                    </blockquote>
                  </figure>
                </div>
              </div>
            </Reveal>
          ))}
          {/* Close the quadrant so the last row reads as a table, not a cut-off. */}
          <div className="border-t border-rule md:col-span-2" />
        </div>
      </div>
    </Section>
  );
}
