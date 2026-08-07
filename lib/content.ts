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
  lead: "Quadrum is a founder-led product studio designing and building high-quality digital products — from initial strategy and product definition through design, engineering, launch and continued development.",
  standfirst: [
    "Founder-led delivery",
    "Direct collaboration",
    "Working products, not presentations",
  ],
} as const;

/* ========================================================== ACT II — proof */

export type Partner = {
  name: string;
  src: string;
  /**
   * Width ÷ height of the artwork. Logo walls fail when every mark is forced
   * through one box, because a horizontal wordmark and a square badge do not
   * read at the same height. Each mark is set to one shared optical height and
   * takes its width from this, so the row shares a baseline instead of a box.
   */
  aspect: number;
  /**
   * Optical correction, applied to the shared height. A stacked lockup (mark
   * above wordmark) needs more height than a single-line wordmark before its
   * type is legible; a mark that fills its artboard edge to edge needs less.
   */
  scale?: number;
};

/**
 * How a product is shown.
 *
 * `plate` is the default: one wide capture, framed. `phones` is reserved for
 * products whose real surface is a phone — showing those as a desktop rectangle
 * misrepresents them, and a floating pair of devices is both more honest and the
 * strongest image in the act.
 */
export type Media =
  | { kind: "plate"; src: string; alt: string }
  | {
      kind: "phones";
      screens: readonly { src: string; alt: string }[];
    };

export type Project = {
  index: string;
  /** The industry the product operates in. Sits in the accent label. */
  kind: string;
  name: string;
  /**
   * The pitch. One or two short sentences, set large in the serif — this is
   * the line a visitor actually reads, so it has to sell the product on its
   * own and stop before it becomes a paragraph. Keep it under ~110 characters.
   */
  pitch: string;
  /** The detail, for the reader the pitch already caught. One sentence. */
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
  /**
   * What the product does, in the product's own vocabulary. Six at most — a
   * seventh pill turns a capability list into a tag cloud, and the reader stops
   * reading any of them.
   */
  tags: readonly string[];
  /** What it is built on. One quiet line; never a second row of pills. */
  stack: readonly string[];
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
  media: Media;
  partners?: { label: string; items: readonly Partner[] };
};

/**
 * Order is an argument, not a catalogue.
 *
 * BNBPay leads because it is the only product here we can show as the thing it
 * actually is — a phone in someone's hand — and because it is the densest piece
 * of engineering in the set. Noise closes because it is the one still in private
 * beta, and an act should not end on a claim the reader cannot check.
 */
export const projects: readonly Project[] = [
  {
    index: "01",
    kind: "Payments infrastructure",
    name: "BNBPay",
    pitch: "Programmable payment rails for businesses that live on the internet.",
    summary:
      "Merchants and AI applications accept any supported token and settle in the one they asked for — invoicing, subscriptions, gift cards, programmable payouts and the x402 Flex rails behind a single set of APIs.",
    href: "https://bnbpayvercel1.vercel.app",
    status: "Live",
    metric: "Six accepted tokens, settled gaslessly on BNB Chain",
    tags: [
      "Multi-token",
      "x402 Flex",
      "Gasless",
      "Gift cards",
      "Subscriptions",
      "Merchant APIs",
    ],
    stack: ["Solidity", "TypeScript", "Next.js", "BNB Chain"],
    logo: { src: "/work/logos/bnbpay-mark.png", alt: "BNBPay", aspect: 854 / 488 },
    media: {
      kind: "phones",
      screens: [
        {
          src: "/work/bnbpay-invoice.png",
          alt: "The BNBPay app on a phone, showing invoice generation, subscription creation and the x402 Flex multi-token acceptance form.",
        },
        {
          src: "/work/bnbpay-cards.png",
          alt: "The BNBPay gift card screen on a phone, showing a USDC card preview and the four steps of sending a card by shareable link.",
        },
      ],
    },
    partners: {
      label: "Accelerated by",
      items: [
        { name: "Binance Chain", src: "/work/partners/binance-chain.png", aspect: 1200 / 504 },
        { name: "YZi Labs", src: "/work/partners/yzi-labs.webp", aspect: 1600 / 533 },
      ],
    },
  },
  {
    index: "02",
    kind: "Merchant infrastructure",
    name: "Pepay",
    pitch: "Multi-chain payment infrastructure built for modern commerce.",
    summary:
      "Accept digital assets, manage payments and settle across supported networks from one unified system — with invoicing, payment links, QR checkout, subscriptions and financial reconciliation built into the same payment layer.",
    href: "https://pepay-merchant-dashboard.vercel.app/home",
    status: "Live",
    metric: "$19.9M settled · 75.9K transactions · 26.7K paying wallets",
    tags: [
      "Cross-chain",
      "Settlement",
      "Treasury",
      "Payment links",
      "Subscriptions",
      "AI payments",
    ],
    stack: ["React", "TypeScript", "Solana", "BNB Chain"],
    logo: { src: "/work/logos/pepay.png", alt: "Pepay", square: true },
    media: {
      kind: "plate",
      src: "/work/pepay.jpg",
      alt: "The Pepay merchant dashboard showing settled payment volume, transaction counts, success rate, auto-settlement and the supported asset and network lists.",
    },
    partners: {
      label: "Accelerated by",
      items: [
        { name: "Binance Chain", src: "/work/partners/binance-chain.png", aspect: 1200 / 504 },
        { name: "YZi Labs", src: "/work/partners/yzi-labs.webp", aspect: 1600 / 533 },
        { name: "CoinMarketCap", src: "/work/partners/coinmarketcap.png", aspect: 1, scale: 1.5 },
      ],
    },
  },
  {
    index: "03",
    kind: "Sports media platform",
    name: "Combat Reviews",
    pitch: "Every fight that matters, in one place.",
    summary:
      "A unified combat-sports platform bringing events, fight cards, rankings, athlete profiles, predictions and community discussion together across major promotions and disciplines — from announcement through to result.",
    href: "https://globalfight-p69k.onrender.com/events",
    status: "Live",
    metric: "Nine disciplines · Full cards, venues and live countdowns",
    tags: [
      "Events",
      "Fight cards",
      "Rankings",
      "Predictions",
      "Athlete profiles",
      "Community",
    ],
    stack: ["Next.js", "TypeScript", "Postgres", "Prisma"],
    logo: { src: "/work/logos/combat-reviews.png", alt: "Combat Reviews", aspect: 507 / 350 },
    media: {
      kind: "plate",
      src: "/work/combat-reviews-showcase-v2.png",
      alt: "Combat Reviews platform showing combat-sports event discovery on tablet and event schedule and predictions on mobile.",
    },
    partners: {
      label: "Official partners",
      items: [
        { name: "BATL Promotions", src: "/work/partners/batl-promotions.png", aspect: 1, scale: 1.5 },
        { name: "Box IQ", src: "/work/partners/box-iq.png", aspect: 1, scale: 1.2 },
        { name: "Kong Fight Tape", src: "/work/partners/kong-fight-tape.png", aspect: 1, scale: 1.2 },
      ],
    },
  },
  {
    index: "04",
    kind: "Enterprise AI",
    name: "Noise",
    pitch: "An AI-powered communication and knowledge system for organisations.",
    summary:
      "Noise connects information from email, messaging, meetings and internal documents into one intelligent workspace. It helps teams recover context, surface important updates and understand what requires attention without manually searching across disconnected systems.",
    // No public URL yet — access is gated behind a request form, so there is
    // nothing honest to link to. Deliberately left unlinked.
    status: "Private beta",
    metric: "Email, chat, calls, documents and calendars in one index",
    tags: [
      "Email",
      "Chat",
      "Meetings",
      "Documents",
      "Knowledge graph",
      "Context engine",
    ],
    stack: ["React", "Fastify", "Postgres", "Vector search"],
    logo: { src: "/work/logos/noise.svg", alt: "Noise", aspect: 280 / 64 },
    media: {
      kind: "plate",
      src: "/work/noise.jpg",
      alt: "The Noise workspace showing the focus brief, flagged concentration and account risks, conversation and calendar items, and the Noise Brain panel listing connected sources.",
    },
    partners: {
      label: "Connected platforms",
      items: [
        { name: "Gmail", src: "/work/partners/noise-gmail.webp", aspect: 4 / 3 },
        { name: "Outlook", src: "/work/partners/noise-outlook.png", aspect: 960 / 909 },
        { name: "Slack", src: "/work/partners/noise-slack.png", aspect: 840 / 859 },
        { name: "Teams", src: "/work/partners/noise-teams.svg", aspect: 1 },
        { name: "Drive", src: "/work/partners/noise-google-drive.png", aspect: 1 },
        { name: "Dropbox", src: "/work/partners/noise-dropbox.png", aspect: 2400 / 2232 },
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
  Work: projects.map((project) => ({ label: project.name, href: "#work" })),
} as const;
