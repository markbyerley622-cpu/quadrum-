/**
 * Faint vertical column rules. Not decoration — they expose the grid the page
 * is actually set on, which is what gives the layout its architectural read.
 *
 * Kept at ~5% opacity: felt rather than seen.
 */
export function GridLines({
  columns = 6,
  invert = false,
  className = "",
}: {
  columns?: number;
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 select-none ${className}`}
    >
      <div className="container-page h-full">
        <div
          className="grid h-full"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className={`h-full border-l ${
                invert ? "border-bone/[0.07]" : "border-ink/[0.055]"
              } ${i === 0 ? "" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
