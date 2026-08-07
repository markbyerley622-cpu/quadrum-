import type { Project } from "@/lib/content";

/**
 * The hard facts, as a hairline band: one number from the running product, the
 * stack it is built on, and either a link to the live thing or an honest reason
 * there isn't one.
 *
 * The link is the point of the whole act. Everything above it is a claim; this
 * is the line that makes the claim checkable in one click, which is why it is
 * the last thing in the block and the only place the accent is spent.
 */
export function ProjectMetrics({ project }: { project: Project }) {
  return (
    <div className="border-t border-rule pt-6">
      <p className="type-label tnum flex items-start gap-3 text-ink-45">
        <span aria-hidden className="mt-[0.3em] size-[5px] shrink-0 bg-accent" />
        <span className="leading-[1.7]">{project.metric}</span>
      </p>

      <p className="type-label mt-4 flex items-start gap-3 text-ink-25">
        <span aria-hidden className="mt-[0.3em] size-[5px] shrink-0 border border-rule-strong" />
        <span className="leading-[1.7]">{project.stack.join("  ·  ")}</span>
      </p>

      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer noopener"
          className="type-label mt-7 inline-flex items-center gap-2.5 text-ink-45 transition-colors duration-500 ease-quad hover:text-ink group-hover:text-ink"
        >
          Visit the live product
          <span
            aria-hidden
            className="block text-accent transition-transform duration-[0.7s] ease-quad motion-safe:group-hover:translate-x-1.5"
          >
            <svg viewBox="0 0 12 12" className="size-3" fill="none">
              <path d="M2.5 9.5 L9.5 2.5 M4 2.5 h5.5 v5.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </a>
      ) : (
        <p className="type-label mt-7 flex items-center gap-2.5 text-ink-45">
          <span aria-hidden className="size-[5px] shrink-0 rounded-full bg-accent animate-blink" />
          {project.status}
        </p>
      )}
    </div>
  );
}
