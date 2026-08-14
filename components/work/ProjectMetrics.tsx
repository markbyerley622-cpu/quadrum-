import type { Project } from "@/lib/content";

/**
 * The hard facts, as a hairline band: one number from the running product, the
 * stack it is built on, and either a link to the live thing or an honest reason
 * there isn't one.
 *
 * The link is the point of the whole act. Everything above it is a claim; this
 * is the line that makes the claim checkable in one click — so it is a button
 * rather than a caption. It spent a long time set as a quiet mono label at the
 * same size and weight as the stack line above it, which is a strange way to
 * treat the single most important control on the page: the one thing the reader
 * is meant to DO looked exactly like the things they were meant to read.
 *
 * Filled ink going accent on hover, matching the enquiry form's submit — the
 * site now has one idea of what a button is. Full width on a phone, where a
 * thumb needs a target rather than a phrase.
 */
export function ProjectMetrics({ project }: { project: Project }) {
  return (
    <div className="border-t border-rule pt-7">
      {/* The metric is a fact from the running product and the loudest line in
          this band. It used to be set in the same 11px tracked mono as the stack
          below it, which made "$19.9M settled · 75.9K transactions" — the best
          sentence on the page — the same weight as a list of frameworks. It is
          now body size with the figures in tabular numerals. */}
      <p className="type-body tnum flex items-start gap-3.5 text-ink">
        <span aria-hidden className="mt-[0.55em] size-[6px] shrink-0 bg-accent" />
        <span className="leading-[1.5]">{project.metric}</span>
      </p>

      {/* The stack stays quiet and stays mono — it is the one place where the
          typewriter voice is doing real work, because these are literally the
          names of tools. But it loses the uppercasing, which was turning
          "Next.js" into "NEXT.JS" and "UX/UI" into a shout. */}
      <p className="type-small mt-4 flex items-start gap-3.5 font-mono text-ink-45">
        <span aria-hidden className="mt-[0.5em] size-[6px] shrink-0 border border-rule-strong" />
        <span className="leading-[1.6] tracking-[0.01em]">{project.stack.join("  ·  ")}</span>
      </p>

      {/* The button band wraps rather than squeezing: the copy column is four of
          twelve, and two buttons side by side in it will compress the primary
          until its label breaks over two lines. Better the second drops to its
          own row. */}
      {project.href ? (
        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-stretch">
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer noopener"
            // Sentence case at body-small rather than 11px tracked caps. A
            // button is the one piece of type on a page that has to be read
            // instantly and correctly, and "VIEW THE DRK PRODUCT STORY" spaced
            // out to 0.16em is read as a texture before it is read as an
            // instruction.
            className="type-small group/cta inline-flex w-full items-center justify-between gap-6
                       whitespace-nowrap border border-ink bg-ink px-7 py-5 font-medium text-paper
                       transition-[background-color,border-color] duration-[0.42s] ease-quad
                       hover:border-accent hover:bg-accent
                       sm:w-auto sm:justify-start"
          >
            {project.linkLabel ?? "Visit the live product"}
            <span
              aria-hidden
              className="block transition-transform duration-[0.7s] ease-quad motion-safe:group-hover/cta:translate-x-1.5"
            >
              <svg viewBox="0 0 12 12" className="size-3.5" fill="none">
                <path d="M2.5 9.5 L9.5 2.5 M4 2.5 h5.5 v5.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </span>
          </a>

          {project.secondary ? (
            <a
              href={project.secondary.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${project.name} on X — ${project.secondary.label}, opens in a new tab`}
              className="type-small inline-flex w-full items-center justify-center gap-2.5
                         whitespace-nowrap border border-rule-strong px-7 py-5 text-ink-45
                         transition-colors duration-[0.42s] ease-quad
                         hover:border-ink hover:text-ink
                         sm:w-auto"
            >
              {/* X's mark, drawn rather than fetched — it is one path, and a
                  remote asset for one glyph is a request nobody should pay. */}
              <svg viewBox="0 0 24 24" aria-hidden className="size-3.5" fill="currentColor">
                <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.11l11.97 15.64Z" />
              </svg>
              {project.secondary.label}
            </a>
          ) : null}
        </div>
      ) : (
        /* No link to give, so the status takes the button's place and its weight
           but not its fill. An outline says "there is nothing to press here"
           without leaving the state looking like an afterthought beneath the
           products that do have one. */
        <p
          className="type-small mt-8 inline-flex w-full items-center gap-3 border border-rule-strong
                     px-7 py-5 text-ink-45 sm:w-auto"
        >
          <span aria-hidden className="size-[5px] shrink-0 rounded-full bg-accent animate-blink" />
          {project.status}
        </p>
      )}
    </div>
  );
}
