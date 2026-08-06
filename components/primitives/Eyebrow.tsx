import type { ReactNode } from "react";

/**
 * The mono section label. Appears above nearly every section and is the main
 * thing tying the page together as one system — so it never varies.
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
      className={`type-label inline-flex items-center gap-2.5 ${
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
