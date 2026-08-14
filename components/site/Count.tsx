import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { Rule } from "@/components/primitives/Rule";
import { Section } from "@/components/primitives/Section";
import { TextReveal } from "@/components/primitives/TextReveal";
import { Tally } from "@/components/site/Tally";
import { figures, site } from "@/lib/content";

/**
 * Act II½ — the count.
 *
 * The proof act carries these same numbers as hairline captions under each
 * product. That is the right weight while you are looking at the product they
 * belong to, and the wrong weight for the page as a whole: a reader who skims
 * the work never registers that one of these things has settled nineteen million
 * dollars. Pulled together and set at display size, the figures stop being
 * footnotes and become the most convincing screen on the site — because unlike
 * every other claim here, they cannot be written. Somebody either settled that
 * money or they did not.
 *
 * It sits immediately after the work and before the turn, so the argument runs:
 * here is what we built, here is what it did, here is why it holds up.
 *
 * The screen is deliberately almost empty. Eight numbers, eight labels, a rule
 * between each — no illustration, no card, no accent except the attribution.
 * A number set this large does not need help, and anything else on the screen is
 * competing with the only thing on the page that is verifiable.
 */
export function Count() {
  return (
    <Section id="numbers" lattice="quietLeft" className="scroll-mt-24 pt-8 pb-24 md:pb-36">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow>{figures.act}</Eyebrow>
            </Reveal>
            <TextReveal
              as="h2"
              className="type-h2 mt-7 -ml-[0.04em]"
              lines={[...figures.headline]}
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <Reveal delay={0.15}>
              <p className="type-body max-w-[42ch] text-ink-70">{figures.body}</p>
            </Reveal>
          </div>
        </div>

        <Rule className="mt-14 md:mt-20" />

        {/* Two up on a phone rather than one: a single column of eight figures
            is a scroll, and these want to be read as a set. */}
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {figures.items.map((figure, i) => (
            <Reveal
              key={`${figure.label}-${figure.from ?? ""}`}
              delay={(i % 4) * 0.06}
              y={18}
              className="border-b border-rule"
            >
              <li className="flex h-full flex-col py-8 pr-5 md:py-11">
                <Tally figure={figure} />

                <span className="type-body mt-3 block leading-[1.3] text-ink">
                  {figure.label}
                </span>

                {figure.from ? (
                  <span className="type-label mt-3 flex items-center gap-2 text-ink-25">
                    <span aria-hidden className="size-[4px] shrink-0 bg-accent" />
                    {figure.from}
                  </span>
                ) : (
                  <span className="type-label mt-3 flex items-center gap-2 text-ink-25">
                    <span aria-hidden className="size-[4px] shrink-0 border border-rule-strong" />
                    {site.name}
                  </span>
                )}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
