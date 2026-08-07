import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { Rule } from "@/components/primitives/Rule";
import { Section } from "@/components/primitives/Section";
import { TextReveal } from "@/components/primitives/TextReveal";
import { engagement, people } from "@/lib/content";

/**
 * Act IV — who does the work, and how it starts. Two beats, one act.
 *
 * Beat one is what the studio refuses to do. A list of negations needs a
 * different visual grammar to a list of features, so it drops the numerals used
 * elsewhere and sets "No" in the accent with a rule extending into each line.
 *
 * Beat two is the fortnight that opens every engagement — the only thing on the
 * page a reader can actually say yes to. It lives here rather than in its own
 * act because it is the answer to "who are you and how do we start", which is
 * one question, not two.
 *
 * The fortnight was previously a scroll-pinned timeline running over 280vh of
 * document. It was the single most expensive thing on the page and it said what
 * four dated columns say in one screen. The dates are what carry the promise —
 * a phase can slip indefinitely, a day cannot — so the dates are what survived.
 */
export function People() {
  return (
    <Section
      id="studio"
      surface="sunk"
      lattice="lowLeft"
      className="scroll-mt-24 py-24 md:py-36"
    >
      <div className="container-page">
        {/* --- Beat one: the people, and what they refuse ---------------- */}
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>{people.act}</Eyebrow>
            </Reveal>
            <TextReveal
              as="h2"
              className="type-h2 mt-7 -ml-[0.04em] max-w-[20ch]"
              lines={["The people you meet", "are the people", "who build"]}
            />
            <Reveal delay={0.2}>
              <p className="type-body measure mt-8 text-ink-70">{people.body}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-3">
            <Rule />
            <ul>
              {people.refusals.map((refusal, i) => {
                const [first, ...rest] = refusal.split(" ");
                return (
                  <li key={refusal} className="border-b border-rule">
                    <Reveal delay={i * 0.07} y={14}>
                      <div className="group flex items-baseline gap-4 py-5 md:gap-6 md:py-6">
                        <span
                          aria-hidden
                          className="mt-[-0.3em] h-px w-6 shrink-0 origin-left bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-[1.6] md:w-9"
                        />
                        <p className="type-h4">
                          <span className="text-accent">{first}</span>{" "}
                          <span className="text-ink">{rest.join(" ")}</span>
                        </p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* --- Beat two: the fortnight ----------------------------------- */}
        <div className="mt-24 md:mt-36">
          <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-3">
              <Reveal>
                <Eyebrow marker={false}>{engagement.label}</Eyebrow>
              </Reveal>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <Reveal delay={0.1}>
                <p className="type-h3 measure-wide max-w-[26ch]">
                  {engagement.headline}
                </p>
              </Reveal>
            </div>
          </div>

          <Rule className="mt-12 md:mt-16" />

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {engagement.moments.map((moment, i) => (
              <Reveal
                key={moment.index}
                delay={i * 0.07}
                y={16}
                className={`border-b border-rule py-8 md:py-10 ${
                  i > 0 ? "lg:border-l lg:border-rule lg:pl-8" : "lg:pr-8"
                } ${i % 2 === 1 ? "sm:border-l sm:border-rule sm:pl-8 lg:pl-8" : ""}`}
              >
                <li className="list-none">
                  <p className="type-label tnum text-accent">{moment.days}</p>
                  <h3 className="type-h4 mt-5 max-w-[18ch]">{moment.title}</h3>
                  <p className="type-small measure mt-3 max-w-[32ch] text-ink-45">
                    {moment.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal y={14}>
            <div className="mt-8 flex flex-col gap-x-12 gap-y-3 md:flex-row md:items-baseline md:justify-between">
              <p className="type-label shrink-0 text-ink-45">
                {engagement.ledger.label}
              </p>
              <p className="type-small measure text-ink-70 md:text-right">
                {engagement.ledger.body}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
