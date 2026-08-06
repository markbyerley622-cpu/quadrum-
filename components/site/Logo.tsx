/**
 * Logomark: a square with the corner cut and re-drawn as a tail — a Q reduced
 * to structure. Drawn with strokes so it stays crisp at every size and
 * inherits `currentColor` on light and dark sections alike.
 */
export function Logomark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      strokeLinecap="square"
    >
      <rect
        x="1.75"
        y="1.75"
        width="20.5"
        height="20.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14.5 14.5 L22.25 22.25" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7.5" y="7.5" width="7" height="7" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-[0.95rem] font-medium tracking-[-0.03em] ${className}`}
    >
      Quadrum
    </span>
  );
}
