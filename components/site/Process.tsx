import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { TextReveal } from "@/components/primitives/TextReveal";
import { MethodList } from "@/components/site/MethodList";

/**
 * Act III, second beat — Define → Design → Build → Evolve.
 *
 * It has been three things. Four full-height panels tracked by a sticky index,
 * which cost four screens of scroll to say something the reader had already
 * accepted. Then a quadrant of four cells, which fixed the length and lost the
 * point: everything legible, nothing emphasised, four equal blocks of body copy
 * in a section whose whole subject is sequence.
 *
 * Now it is four numerals you open, one at a time. See `MethodList` for why the
 * accordion is the argument rather than a space-saving device.
 *
 * The header stays deliberately plain. This section is the one place on the page
 * making a claim about how the studio works rather than what it has built, and
 * the reader arriving here has just come through six products and eight figures —
 * they do not need persuading again, they need it stated.
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

        <Reveal delay={0.1} y={18}>
          <MethodList />
        </Reveal>
      </div>
    </Section>
  );
}
