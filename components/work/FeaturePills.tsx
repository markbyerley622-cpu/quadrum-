/**
 * What the product does, in its own vocabulary.
 *
 * These are hairline outlines rather than filled chips on purpose. A filled chip
 * is a button, and a row of six things that look like buttons but are not
 * clickable is the single most common way a portfolio page teaches its reader to
 * stop trusting it.
 *
 * They are NOT set in the mono label any more, and that is the important change.
 * `type-label` is 11px, uppercase, and tracked out to 0.16em — which is a
 * specification for an eyebrow appearing once, not for six capability names a
 * reader is expected to actually take in. At that size and tracking the words
 * stop being read and start being pattern: "MERCHANT APIS" set in 11px caps
 * across three wrapped lines on a phone is decoration with a meaning attached.
 *
 * So: sentence case, the body face, near-full ink contrast, and enough padding
 * that each one is a distinct object. They are the same size as the summary
 * above them, because they carry the same weight of information.
 */
export function FeaturePills({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="type-small border border-rule bg-paper-raised px-4 py-2.5 leading-none text-ink
                     transition-[border-color,background-color] duration-500 ease-quad
                     group-hover:border-rule-strong"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
