import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { ScrollText } from "@/components/primitives/ScrollText";
import { Section } from "@/components/primitives/Section";
import { turn } from "@/lib/content";

/**
 * Act III — the turn. The pivot of the whole page.
 *
 * Three things resolve at exactly this point, on purpose:
 *  - the argument turns from the problem to the answer;
 *  - the surface returns from dark to paper, dissolved rather than cut;
 *  - the lattice finishes ordering itself.
 *
 * That last one is why this section carries `orderAnchor`: the lattice measures
 * how resolved it should be against *this* act's position, not against a
 * fraction of the document. See `orderAtAnchor` in lib/lattice.ts.
 *
 * The word-by-word illumination is used here and nowhere else. It hands the
 * pace of the sentence to the reader, which is worth spending once.
 */
export function Turn() {
  return (
    // `fadeOut` dissolves the dark surface into paper across the bottom padding,
    // so the act change is felt before it is seen.
    <Section
      surface="void"
      lattice="quietRight"
      fadeOut
      orderAnchor
      className="pt-24 pb-48 md:pt-36 md:pb-64"
    >
      <div className="container-page">
        <Reveal>
          <Eyebrow invert>{turn.act}</Eyebrow>
        </Reveal>

        <div className="mt-10 md:mt-16">
          <ScrollText
            as="h2"
            text={turn.headline}
            className="type-h2 -ml-[0.04em] max-w-[18ch]"
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-y-8 md:mt-24 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-4">
            <Reveal>
              <div aria-hidden className="h-px w-full bg-rule-invert-strong md:w-20" />
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.12}>
              <p className="type-lead measure text-bone-60">{turn.body}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
