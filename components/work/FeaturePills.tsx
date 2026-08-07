/**
 * What the product does, in its own vocabulary.
 *
 * These are hairline outlines rather than filled chips on purpose. A filled
 * chip is a button, and a row of six things that look like buttons but are not
 * clickable is the single most common way a portfolio page teaches its reader
 * to stop trusting it.
 */
export function FeaturePills({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-2 gap-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="type-label border border-rule px-2.5 py-2 text-ink-45 transition-colors duration-500 ease-quad group-hover:border-rule-strong"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
