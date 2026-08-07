import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { TextReveal } from "@/components/primitives/TextReveal";
import { contact, site } from "@/lib/content";

/**
 * Act V — the invitation.
 *
 * Contact and footer share one continuous dark surface, so the page resolves
 * into a single block rather than stacking two more sections. The email address
 * is set at heading scale because it is the only action being asked for.
 *
 * The surface returns to dark here deliberately: the lattice is fully ordered
 * by now, so the closing image is a built structure on the same surface the
 * chaos happened on.
 */
export function Contact() {
  return (
    <Section
      id="contact"
      surface="void"
      lattice="close"
      className="scroll-mt-24 pt-24 pb-20 md:pt-36 md:pb-28"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow invert>{contact.act}</Eyebrow>
            </Reveal>
            <TextReveal
              as="h2"
              className="type-h2 mt-8 -ml-[0.04em] max-w-[16ch]"
              lines={["Send us the problem,", "not the specification."]}
            />
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <Reveal delay={0.15}>
              <p className="type-body measure text-bone-60">{contact.body}</p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 border-t border-rule-invert pt-12 md:mt-24 md:pt-16">
          <Reveal>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex max-w-full items-baseline gap-4 md:gap-6"
            >
              <span className="type-h2 relative inline-block break-all">
                {site.email}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-1 h-px origin-right scale-x-0 bg-accent transition-transform duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100"
                />
              </span>
              <span
                aria-hidden
                className="hidden shrink-0 transition-transform duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 md:block"
              >
                <svg viewBox="0 0 24 24" className="size-8 text-accent" fill="none">
                  <path d="M5 19 L19 5 M9 5 h10 v10" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            </a>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-y-8 sm:grid-cols-2">
            {[
              { label: "Studio", value: site.location, href: null },
              { label: "Response", value: "Within two working days", href: null },
            ].map((row, i) => (
              <Reveal key={row.label} delay={i * 0.08} y={14}>
                <div className="border-t border-rule-invert pt-5">
                  <p className="type-label text-bone-60">{row.label}</p>
                  {row.href ? (
                    <a href={row.href} className="link-rule type-body mt-3 inline-block text-bone">
                      {row.value}
                    </a>
                  ) : (
                    <p className="type-body mt-3 text-bone">{row.value}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
