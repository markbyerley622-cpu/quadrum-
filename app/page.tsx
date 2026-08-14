import { Hinge } from "@/components/primitives/Hinge";
import { Lattice } from "@/components/lattice/Lattice";
import { Constellation } from "@/components/site/Constellation";
import { Contact } from "@/components/site/Contact";
import { Count } from "@/components/site/Count";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";
import { People } from "@/components/site/People";
import { Process } from "@/components/site/Process";
import { Turn } from "@/components/site/Turn";
import { Work } from "@/components/site/Work";
import { hinges, projects, site } from "@/lib/content";

/**
 * The page is a five-act narrative, not a stack of sections.
 *
 *   I    Opening      the claim
 *   II   The proof    six products, five of them shown running
 *   II½  The count    what those products have actually done, set large
 *   III  The turn     the thesis, and how the work is done
 *   IV   The studio   who does it, what we refuse, and how an engagement starts
 *   V    The invitation
 *
 * The count is a half-act rather than an act of its own because it introduces
 * nothing: every figure on it is repeated verbatim from a product block above.
 * It exists because a reader who skims the work never registers that one of
 * these things has settled nineteen million dollars, and because it is the only
 * screen on the site whose claims cannot be written.
 *
 * THE PROOF COMES SECOND, and that ordering is the most important decision on
 * the page. An earlier version ran eight acts and put three invented concept
 * studies in the fifth — a visitor scrolled through four screens of argument
 * before seeing anything shipped, and what they eventually saw was hypothetical.
 * Real work now lands inside the first two screens, and every act after it is
 * argued to a reader who has already been given a reason to keep reading.
 *
 * Every act is joined by a `Hinge` carrying the question the next act answers,
 * so the reader is handed forward rather than dropped into a new topic.
 *
 * Two things resolve together across the page, both driven by scroll:
 *   - the surface runs paper (I–II) → dark (III) → paper (III–IV) → dark (V);
 *   - the lattice orders itself from a chaotic cloud into a built structure,
 *     anchored to the turn itself (`orderAtAnchor` in lib/lattice.ts) so acts
 *     can be added or resized without dragging the resolution out from under
 *     the act that earns it.
 */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.description,
  slogan: site.tagline,
  // No telephone and no postal address: the studio publishes neither, and
  // asserting either in structured data would be a claim we cannot stand behind.
  areaServed: "Worldwide",
  knowsAbout: projects.flatMap((p) => [p.kind, ...p.tags]),
  serviceType: [
    "Product strategy",
    "Product design",
    "Software engineering",
    "Platform architecture",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Selected work",
    itemListElement: projects.map((project) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "SoftwareApplication",
        name: project.name,
        applicationCategory: project.kind,
        description: project.summary,
        ...(project.href ? { url: project.href } : {}),
      },
    })),
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, author-controlled object — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* First in the DOM so every section's content paints above it. */}
      <Lattice />

      <Nav />

      <main id="main">
        {/* I */}
        <Hero />
        <Hinge {...hinges.toProof} />

        {/* II */}
        <Work />
        <Count />
        <Hinge {...hinges.toTurn} />

        {/* III */}
        <Turn />
        <Process />
        <Hinge {...hinges.toStudio} />

        {/* IV */}
        <People />
        <Constellation />

        {/* V */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
