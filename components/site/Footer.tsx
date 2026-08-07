import { Logomark } from "@/components/site/Logo";
import { Reveal } from "@/components/primitives/Reveal";
import { footerLinks, site } from "@/lib/content";

/**
 * Footer. Continues the dark surface from the contact section, and closes on
 * an oversized wordmark clipped by the viewport edge — the page ends on the
 * studio's name at the largest type on the site, at the lowest contrast.
 */
export function Footer() {
  return (
    // Same layering contract as `Section`: surface below the lattice canvas,
    // content above it. See components/primitives/Section.tsx.
    <footer data-tone="dark" data-lattice="close" className="relative overflow-hidden pb-8 text-bone">
      <div aria-hidden className="absolute inset-0 -z-10 bg-void" />
      <div className="container-page relative z-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 border-t border-rule-invert pt-14 md:grid-cols-12 md:pt-16">
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-2.5">
              <Logomark className="size-[18px]" />
              <span className="text-[0.95rem] font-medium tracking-[-0.03em]">
                {site.name}
              </span>
            </div>
            <p className="type-small measure mt-6 max-w-[42ch] text-bone-60">
              {site.description}
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <nav key={heading} aria-label={heading} className="md:col-span-2">
              <h2 className="type-label text-bone-60">{heading}</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="link-rule type-small text-bone transition-colors duration-300 hover:text-bone-60"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 md:col-span-3">
            <h2 className="type-label text-bone-60">Contact</h2>
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="link-rule type-small break-all text-bone"
                >
                  {site.email}
                </a>
              </li>
              <li className="type-small text-bone-60">{site.location}</li>
            </ul>
          </div>
        </div>

        {/* --- Oversized wordmark ---------------------------------------- */}
        <Reveal y={30} duration={1.1}>
          <div
            aria-hidden
            className="mt-20 select-none text-[19vw] leading-[0.78] font-normal tracking-[-0.055em] text-bone/[0.07] md:mt-24"
          >
            Quadrum
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-rule-invert pt-7">
          <p className="type-label text-bone-60">
            © {site.founded} {site.name}. All rights reserved.
          </p>
          <a href="#top" className="type-label group flex items-center gap-2.5 text-bone-60 transition-colors hover:text-bone">
            Back to top
            <span
              aria-hidden
              className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1"
            >
              <svg viewBox="0 0 12 12" className="size-3" fill="none">
                <path d="M6 11 V1 M1.5 5.5 L6 1 L10.5 5.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
