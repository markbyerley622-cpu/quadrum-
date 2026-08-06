/**
 * Single source of truth for all site copy.
 *
 * The page is structured as five acts rather than a list of sections. Each act
 * ends with a hinge — the question the next act answers — so the reader is
 * handed forward instead of being dropped into a new topic. Keep that chain
 * intact when editing: if you change an act, check the hinge that leads into it
 * still asks the right question.
 *
 * The ordering rule that matters most: THE PROOF COMES SECOND. A visitor should
 * know what this studio does, and see that it has actually shipped, inside the
 * first two screens. Everything else — the thesis, the method, the people — is
 * argued afterwards, to a reader who has already been given a reason to care.
 * Resist adding an act before the work.
 */

export const site = {
  name: "Quadrum",
  domain: "quadrumstudio.com",
  url: "https://quadrumstudio.com",
  tagline: "Complex digital products. Built to last.",
  description:
    "Quadrum is a senior product strategy, design and engineering studio for complex digital products. We partner with ambitious founders and established organisations to define, design, build and evolve business-critical software.",
  email: "hello@quadrumstudio.com",
  phone: "+44 20 7946 0102",
  phoneHref: "+442079460102",
  location: "London, United Kingdom",
  founded: 2026,
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
] as const;

/* =========================================================== ACT I — open */

export const hero = {
  eyebrow: "Senior product strategy, design and engineering",
  headline: ["Complex", "digital products.", "Built to last."],
  lead: "Quadrum designs and builds business-critical software — from the first product decision through production, scale and long-term operation.",
  standfirst: [
    "Senior practitioners",
    "Direct collaboration",
    "Shipped, not slideware",
  ],
} as const;

/* ========================================================== ACT II — proof */

export type Partner = {
  name: string;
  src: string;
  /** Optical sizing. Some marks are wordmarks, some are square badges. */
  wide?: boolean;
};

export type Project = {
  index: string;
  /** The industry the product operates in. Sits in the accent label. */
  kind: string;
  name: string;
  summary: string;
  /**
   * The live product. Present means the claim on this card is checkable in one
   * click, which is the entire point of the act — so only omit it when there is
   * genuinely no public URL. Never point this at something unverified.
   */
  href?: string;
  /** Shown where the link would be. Says why, when there is no link. */
  status: string;
  /** One hard number or fact taken from the running product. */
  metric: string;
  tags: readonly string[];
  logo: {
    src: string;
    alt: string;
    /** App-icon marks get a rounded square box rather than a free-standing one. */
    square?: boolean;
    /**
     * Width ÷ height of the artwork. The mark is set to a fixed optical height
     * and takes its width from this, so a wide signal mark and a compact
     * monogram both sit on the same baseline instead of one being squashed into
     * a box shaped for the other.
     */
    aspect?: number;
  };
  shot: { src: string; alt: string };
  partners?: { label: string; items: readonly Partner[] };
};

export const projects: readonly Project[] = [
  {
    index: "01",
    kind: "Payments infrastructure",
    name: "Pepay",
    summary:
      "Crypto payment infrastructure for merchants, AI agents and programmable finance. Payers send whatever token they hold; merchants receive the stablecoin they asked for, reconciled in a single ledger a finance team can read.",
    href: "https://pepay-merchant-dashboard.vercel.app/home",
    status: "Live",
    metric: "$19.9M settled · 75.9K transactions · 26.7K paying wallets",
    tags: ["Web3", "BNB Chain", "Solana", "React", "TypeScript"],
    logo: { src: "/work/logos/pepay.png", alt: "Pepay", square: true },
    shot: {
      src: "/work/pepay.jpg",
      alt: "The Pepay dashboard showing settled payment volume, transaction counts, protocol revenue and weekly settlement charts.",
    },
    partners: {
      label: "Accelerated by",
      items: [
        { name: "Binance Chain", src: "/work/partners/binance-chain.png", wide: true },
        { name: "YZi Labs", src: "/work/partners/yzi-labs.webp", wide: true },
        { name: "CoinMarketCap", src: "/work/partners/coinmarketcap.png" },
      ],
    },
  },
  {
    index: "02",
    kind: "Sports media platform",
    name: "Combat Reviews",
    summary:
      "A production platform for discovering combat sports events, rankings, athlete profiles and community predictions — every card that matters, across nine disciplines and every major promotion.",
    href: "https://globalfight-p69k.onrender.com/events",
    status: "Live",
    metric: "Nine disciplines · Full cards, venues and live countdowns",
    tags: ["Next.js", "TypeScript", "Postgres", "Prisma", "Search"],
    logo: { src: "/work/logos/combat-reviews.png", alt: "Combat Reviews", aspect: 507 / 350 },
    shot: {
      src: "/work/combat-reviews.jpg",
      alt: "The Combat Reviews events page showing sport filters, recent event result cards and the official partner strip.",
    },
    partners: {
      label: "Official partners",
      items: [
        { name: "BATL Promotions", src: "/work/partners/batl-promotions.png" },
        { name: "Box IQ", src: "/work/partners/box-iq.png" },
        { name: "Kong Fight Tape", src: "/work/partners/kong-fight-tape.png" },
      ],
    },
  },
  {
    index: "03",
    kind: "Enterprise AI",
    name: "Noise",
    summary:
      "An AI-native enterprise communication platform that unifies email, chat and collaboration into one intelligent workspace — every conversation the company has ever had, as a single searchable memory.",
    // No public URL yet — access is gated behind a request form, so there is
    // nothing honest to link to. Deliberately left unlinked.
    status: "Private beta",
    metric: "One workspace across seven connected surfaces",
    tags: ["AI", "Enterprise", "React", "Fastify", "Postgres"],
    logo: { src: "/work/logos/noise.svg", alt: "Noise", aspect: 280 / 64 },
    shot: {
      src: "/work/noise.jpg",
      alt: "The Noise Executive Cockpit showing company health metrics, revenue at risk, declining accounts and the Noise Brain assistant panel.",
    },
    partners: {
      label: "Connected surfaces",
      items: [
        { name: "Gmail", src: "/work/partners/noise-gmail.webp" },
        { name: "Outlook", src: "/work/partners/noise-outlook.png" },
        { name: "Slack", src: "/work/partners/noise-slack.png" },
        { name: "Microsoft Teams", src: "/work/partners/noise-teams.svg" },
        { name: "Google Drive", src: "/work/partners/noise-google-drive.png" },
        { name: "Dropbox", src: "/work/partners/noise-dropbox.png" },
      ],
    },
  },
] as const;

/* ============================================================ ACT III — turn */

export const turn = {
  act: "III · The turn",
  headline: "Most software is built for launch. We build for what follows.",
  body: "Launch is the beginning. Products have to survive real users, changing requirements, operational pressure, new team members and years of iteration. We combine product judgment, design discipline and engineering depth so the software stays valuable after the first release.",
} as const;

/**
 * The four stages, one line of method each, plus the studio principle that
 * belongs to it.
 *
 * NOTE: these are Quadrum's own positions, not client testimonials. If real,
 * permissioned client quotes ever exist, add them as their own act rather than
 * dressing these up.
 */
export const process = [
  {
    index: "01",
    title: "Define",
    summary:
      "Clarify the commercial problem, the users, the constraints and what success is measured by.",
    principle:
      "The most expensive decisions on a product are made in the first three weeks, by people who do not yet know they are making them.",
  },
  {
    index: "02",
    title: "Design",
    summary:
      "Interface, information architecture and system model designed together, not in sequence.",
    principle:
      "A design is not finished when it looks right. It is finished when it still works on the day the data is messy and the network is gone.",
  },
  {
    index: "03",
    title: "Build",
    summary:
      "Shipped in working increments, under test, observable from the first deploy.",
    principle:
      "Write the codebase for the engineer who joins in eighteen months. Often that engineer is you.",
  },
  {
    index: "04",
    title: "Evolve",
    summary:
      "Improved against evidence from production and the business needs that changed since.",
    principle:
      "The product you operate will teach you things the product you designed never could. Most teams are not listening by then.",
  },
] as const;

/* ========================================================== ACT IV — studio */

export const people = {
  act: "IV · The studio",
  headline: "The people in the first meeting stay on the work",
  body: "Strategy, design and engineering decisions are made by experienced practitioners with direct responsibility for the result.",
  refusals: [
    "No pyramid staffing",
    "No translation through account managers",
    "No silent handoff between sales and delivery",
    "No technology selected for fashion",
  ],
} as const;

/**
 * The fortnight that opens every engagement.
 *
 * This is the only thing a reader can actually say yes to: a bounded, cheap,
 * walk-away-able start. The four moments are dated rather than phased — a phase
 * can slip indefinitely, a day cannot — so the numbers have to be specific
 * enough to be held to.
 */
export const engagement = {
  label: "How an engagement starts",
  headline: "Fourteen days, four fixed outputs, and a decision either side can walk away from.",
  moments: [
    {
      index: "01",
      days: "Day 01 — 02",
      title: "The problem, restated",
      body: "What the business is actually trying to achieve, in language the whole room agrees with.",
    },
    {
      index: "02",
      days: "Day 03 — 05",
      title: "The constraint map",
      body: "What is fixed, what is assumed, what is negotiable — with assumptions labelled as assumptions.",
    },
    {
      index: "03",
      days: "Day 06 — 09",
      title: "The thin slice",
      body: "One real path through the product, built end to end. Deployed, observable, honest about its gaps.",
    },
    {
      index: "04",
      days: "Day 10 — 14",
      title: "The decision",
      body: "A written recommendation with the trade-offs visible, and a plan you could hand to another studio.",
    },
  ],
  ledger: {
    label: "What you keep",
    body: "All four outputs are yours either way. No lock-in, and no obligation to continue.",
  },
} as const;

/* ====================================================== ACT V — invitation */

export const contact = {
  act: "V · The invitation",
  headline: "Send us the problem, not the specification.",
  body: "Tell us what the business is trying to achieve, what is currently getting in the way and why the problem matters now.",
} as const;

/* ========================================================= connective tissue */

/** The hinges between acts. Each is the question its act answers. */
export const hinges = {
  toProof: {
    act: "II · The proof",
    question: "So what have you actually built?",
  },
  toTurn: {
    act: "III · The turn",
    question: "And what makes those hold up once they are live?",
  },
  toStudio: {
    act: "IV · The studio",
    question: "So who is actually doing the work?",
  },
} as const;

export const footerLinks = {
  Studio: [
    { label: "Work", href: "#work" },
    { label: "Approach", href: "#approach" },
    { label: "Studio", href: "#studio" },
  ],
  Work: [
    { label: "Pepay", href: "#work" },
    { label: "Combat Reviews", href: "#work" },
    { label: "Noise", href: "#work" },
  ],
} as const;
