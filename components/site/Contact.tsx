"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { TextReveal } from "@/components/primitives/TextReveal";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { contact } from "@/lib/content";
import { EASE } from "@/lib/motion";

/**
 * Act V — the invitation.
 *
 * Contact and footer share one continuous dark surface, so the page resolves
 * into a single block rather than stacking two more sections. The surface
 * returns to dark here deliberately: the lattice is fully ordered by now, so
 * the closing image is a built structure on the same surface the chaos
 * happened on.
 *
 * The section asks for one thing. At rest it is a question, a sentence and a
 * single action — no address, no telephone, no office grid, because none of
 * those are the thing we want a reader to do. The form is real but it is behind
 * the click, so the resting composition stays as quiet as the acts above it.
 *
 * Activating the CTA swaps it for the form in place. The swap uses the same
 * fade-and-rise as every other arrival on the page rather than a height
 * animation or a modal — the section grows, which is what an inline expansion
 * should look like in a document that is already a single scroll.
 */
export function Contact() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  // Focus moves to the first field as it mounts, so activating the CTA puts the
  // keyboard where it is needed. `preventScroll` stops the browser jumping the
  // section before the reveal has settled.
  const focusFirstField = useCallback((el: HTMLInputElement | null) => {
    el?.focus({ preventScroll: true });
  }, []);

  return (
    <Section
      id="contact"
      surface="void"
      lattice="close"
      className="scroll-mt-24 pt-32 pb-24 md:pt-52 md:pb-36"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow invert>{contact.eyebrow}</Eyebrow>
            </Reveal>
            <TextReveal
              as="h2"
              className="type-h2 mt-8 -ml-[0.04em] max-w-[16ch]"
              lines={[...contact.headline]}
            />
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <Reveal delay={0.15}>
              <p className="type-body measure text-bone-60">{contact.body}</p>
            </Reveal>
          </div>
        </div>

        {/* One hairline sits above whichever state is showing — the CTA block
            and the form each carry it, so the rule never doubles or moves. */}
        <div className="mt-20 md:mt-28">
          {open ? (
            /* The form mounts on the click itself and only its arrival is
               animated. Gating the mount on an exit animation finishing would
               make the section's most important element depend on a clock that
               browsers freeze in a background tab. */
            <motion.div
              id="enquiry"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <EnquiryForm onFirstFieldRef={focusFirstField} />
            </motion.div>
          ) : (
            <div className="border-t border-rule-invert pt-12 md:pt-16">
                <Reveal>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-expanded={open}
                    aria-controls="enquiry"
                    className="group relative inline-flex items-center gap-6 overflow-hidden border border-rule-invert-strong px-9 py-6 md:px-12 md:py-7"
                  >
                    {/* Fills from the left, the same gesture the section rules
                        use when they draw themselves in. */}
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-left scale-x-0 bg-bone transition-transform duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    />
                    <span className="type-label relative text-bone transition-colors duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-void">
                      {contact.cta}
                    </span>
                    <span
                      aria-hidden
                      className="relative block text-bone transition-[transform,color] duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:text-void"
                    >
                      <svg viewBox="0 0 24 24" className="size-5" fill="none">
                        <path
                          d="M4 12 h15 M13 6 l6 6 -6 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </span>
                  </button>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
