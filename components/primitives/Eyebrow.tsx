import type { ReactNode } from "react";

/**
 * The mono section label. Appears above nearly every section and is the main
 * thing tying the page together as one system — so it never varies.
 *
 * This is the one component that still sets caps, and the only one that should.
 * It carries act markers — "II · The proof", "How we work" — where a few
 * characters need to read as a section marker rather than as a sentence, and it
 * appears once per section. Everything else that used to be uppercased through
 * `type-label` (capability names, metrics, categories, button labels) has been
 * returned to its own casing, because tracked caps at 11px stop being read and
 * start being pattern.
 */
export function Eyebrow({
  children,
  invert = false,
  marker = true,
  className = "",
}: {
  children: ReactNode;
  invert?: boolean;
  /** The small accent square. Omit inside dense lists. */
  marker?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`type-label type-label-caps inline-flex items-center gap-2.5 ${
        invert ? "text-bone-60" : "text-ink-45"
      } ${className}`}
    >
      {marker ? (
        <span aria-hidden className="size-[5px] shrink-0 bg-accent" />
      ) : null}
      {children}
    </span>
  );
}
