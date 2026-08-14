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
    "Quadrum is a founder-led product strategy, design and engineering studio focused on turning complex ideas into refined digital products.",
  email: "hello@quadrumstudio.com",
  location: "Operating globally",
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
  eyebrow: "Product strategy, design and engineering",
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
 * `film` is the strongest of the three and the default wherever a recording
 * exists: a screenshot proves a product exists, a recording proves it works.
 * `plate` is the fallback for a product with no capture. `phones` is reserved
 * for products whose real surface is a phone — showing those as a desktop
 * rectangle misrepresents them, and a floating pair of devices is both more
 * honest and the strongest still image in the act.
 */
export type Media =
  | { kind: "plate"; src: string; alt: string }
  | {
      kind: "phones";
      screens: readonly { src: string; alt: string }[];
    }
  | {
      kind: "film";
      src: string;
      /**
       * The film's OWN first frame, shown while the file downloads. It has to be
       * the first frame and not a nicer one: on a slow connection the poster is
       * up for over a second, so anything else visibly jumps the moment playback
       * starts. Generated as `<name>-open.jpg`.
       */
      poster: string;
      /**
       * A populated frame from the middle, which replaces the film entirely
       * under `prefers-reduced-motion`. That reader gets one image and it has to
       * be the product running, not whatever the recording happened to open on.
       * Generated as `<name>.jpg`.
       */
      still: string;
      alt: string;
      /** Width ÷ height of the encode, so the frame reserves its exact space. */
      aspect: number;
      /**
       * Device shots shown under the film. For a product whose real surface is
       * a phone but whose recording is of the desktop app — the film carries the
       * flow, the devices carry the form factor.
       */
      screens?: readonly { src: string; alt: string }[];
    };

/**
 * A sibling product in the same family, shown as a small marked row under the
 * spread. Only used where a product is genuinely one app of several — inventing
 * a family out of features would be the worst kind of padding.
 */
export type App = {
  name: string;
  /** What it is, in four or five words. Longer and the row stops scanning. */
  summary: string;
  src: string;
  /**
   * Where the app lives, if it is out. Makes the whole tile a link, which is
   * the only way this row is worth more than a picture of five icons.
   */
  href?: string;
  /**
   * Unreleased. Renders the mark quieter and adds the marker. Never set this
   * alongside an `href` that works — a "Soon" badge on something the reader can
   * open and use is a claim contradicted by one click.
   */
  soon?: boolean;
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
  /**
   * Overrides the link's wording. Set it wherever `href` does not point at the
   * running product itself — a reader who clicks "visit the live product" and
   * lands on something else has been misled, and this act cannot afford that.
   */
  linkLabel?: string;
  /**
   * A second link, for a product with somewhere else public worth going — its
   * own account, usually. It renders as an outline beside the filled primary,
   * never instead of it: the live product is the claim this act is making, and
   * a social account is a place to go once you already believe it.
   */
  secondary?: { label: string; href: string };
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
  /**
   * The product's own mark. Optional, and omitted rather than approximated:
   * some of these products set their name in type and have no mark to vendor,
   * and drawing one for them would be inventing a logo. Where it is absent the
   * name simply carries itself, which is what the product does too.
   */
  logo?: {
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
  apps?: { label: string; items: readonly App[] };
  partners?: { label: string; items: readonly Partner[] };
};

/**
 * Order is an argument, not a catalogue.
 *
 * Pepay leads because it is the most checkable thing here. It is the only
 * product carrying settled volume, transaction counts and paying wallets — real
 * numbers from a running system — and it arrives with three accelerator marks
 * and five sibling apps on the same infrastructure. A reader who believes one
 * spread in this act will believe that one, and everything after it is argued
 * to someone who already has.
 *
 * DRK follows as the hardest problem in the set and the only one that is a
 * category rather than a product. BNBPay is the densest piece of engineering
 * here and the only product shown as both film and the thing it actually is, a
 * phone in someone's hand. Noise closes because it is the one product with
 * nothing public to open.
 */
export const projects: readonly Project[] = [
  {
    index: "01",
    kind: "Merchant infrastructure",
    name: "Pepay",
    pitch: "Multi-chain payment infrastructure built for modern commerce.",
    summary:
      "Accept digital assets, manage payments and settle across supported networks from one unified system — with invoicing, payment links, QR checkout, subscriptions and financial reconciliation built into the same payment layer.",
    href: "https://pepay-merchant-dashboard.vercel.app/home",
    secondary: { label: "@pepaylabs", href: "https://x.com/pepaylabs" },
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
      kind: "film",
      src: "/work/video/pepay-reel.mp4",
      poster: "/work/video/pepay-reel-open.jpg",
      still: "/work/video/pepay-reel.jpg",
      alt: "The Pepay product reel: the mark resolves out of light, the supported networks assemble around it and the line 'USD1 lives on-chain' lands.",
      aspect: 16 / 9,
    },
    apps: {
      label: "The Pepay ecosystem",
      items: [
        {
          name: "Pepay Merchants",
          summary: "Business dashboard",
          src: "/work/apps/app-logo-pepay-merchants.png",
        },
        {
          name: "Pepay API",
          summary: "Developer tools",
          src: "/work/apps/app-logo-pepay-api.png",
        },
        {
          name: "Pepay Commerce",
          summary: "Buy Amazon products with crypto",
          src: "/work/apps/app-logo-pepay-commerce1.png",
          soon: true,
        },
        {
          name: "Pepay Commerce 5",
          summary: "Shop with AI, pay with crypto",
          src: "/work/apps/app-logo-pepay-commerce-5.png",
          soon: true,
        },
        {
          name: "Grab Me a Slice",
          // The product's own line. Pepay's app list says "support creators",
          // which undersells it — this one takes AI agent payments too.
          summary: "Payment links for creators",
          src: "/work/apps/app-logo-pepay-grab.png",
          href: "https://gmasvirtual.vercel.app",
          // Deliberately not `soon`, unlike the two Commerce apps: this one is
          // live and complete at the link above, so the marker would be wrong.
        },
      ],
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
    index: "02",
    kind: "Institutional liquidity infrastructure",
    name: "DRK",
    pitch: "Market infrastructure for making real-world assets liquid.",
    summary:
      "Tokenisation solved issuance. It did not solve liquidity. DRK is building the operating layer between tokenised assets and institutional markets — bringing fair value, liquidity, risk, execution and settlement into one system designed to determine how an asset should be priced, traded and made liquid.",
    href: "https://drk-deck.vercel.app/",
    // The product itself is pre-release. What is public is the investor
    // experience we built for it, so the link says so rather than implying the
    // reader is about to open a trading console.
    linkLabel: "View the DRK product story",
    status: "In development",
    metric: "Wallets · Pools · Execution · Reconciliation · Reporting",
    tags: [
      "Fair value",
      "Liquidity",
      "Risk",
      "Execution",
      "Settlement",
      "Reporting",
    ],
    stack: ["TypeScript", "React", "EVM", "Trading infrastructure"],
    logo: { src: "/work/logos/drk.svg", alt: "DRK", square: true },
    media: {
      kind: "film",
      src: "/work/video/drk-demo.mp4",
      poster: "/work/video/drk-demo-open.jpg",
      still: "/work/video/drk-demo.jpg",
      alt: "A recording of the DRK console: the monitoring pipeline, rolling market state, participants and concentration, cross-pool comparison and the managed trade chart.",
      aspect: 16 / 9,
    },
    // No partner strip. The one organisation the work names is a mapped
    // deployment target with no mandate or agreement in place, and a logo under
    // a product reads as an endorsement whatever the caption says.
  },
  {
    index: "03",
    kind: "Payments infrastructure",
    name: "BNBPay",
    pitch: "Programmable payment infrastructure for merchants, platforms and AI agents.",
    summary:
      "BNBPay provides gasless, programmable payment infrastructure for merchants, digital platforms and AI agents. Its unified integration supports invoices, subscriptions, gift cards and x402-powered API payments across BNB Chain and opBNB — making on-chain commerce simpler to deploy, operate and scale.",
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
      kind: "film",
      src: "/work/video/bnbpay-demo.mp4",
      poster: "/work/video/bnbpay-demo-open.jpg",
      still: "/work/video/bnbpay-demo.jpg",
      alt: "A recording of BNBPay: a gift card is configured, funded and issued, ending on a created card with its QR code and shareable claim link.",
      aspect: 1280 / 958,
      // The recording is of the desktop app; the product's real surface is a
      // phone. The film carries the flow, the devices carry the form factor.
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
    index: "04",
    kind: "Sports media platform",
    name: "Combat Reviews",
    pitch: "Every fight that matters, in one place.",
    summary:
      "A unified combat-sports platform bringing events, fight cards, rankings, athlete profiles, predictions and community discussion together across major promotions and disciplines — from announcement through to result.",
    href: "https://globalfight-p69k.onrender.com/events",
    status: "Live",
    metric: "Events · Full cards · Rankings · Predictions · Community",
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
      kind: "film",
      src: "/work/video/combat-demo.mp4",
      poster: "/work/video/combat-demo-open.jpg",
      still: "/work/video/combat-demo.jpg",
      alt: "A recording of Combat Reviews: the event feed, a full fight card and the rankings moving past under the main event.",
      aspect: 1280 / 592,
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
    index: "05",
    kind: "Property development",
    name: "Linton Villas",
    pitch: "An investment platform for 38 private villas in South Lombok.",
    summary:
      "A digital sales experience built to turn a property development into an investable proposition for overseas buyers — combining the masterplan, four villa types, floor plans, financial projections, facilities, an eight-minute film and the full prospectus into one guided narrative designed to build conviction before an investor ever visits the site.",
    href: "https://lintonvillas.vercel.app",
    status: "Live",
    metric: "38 villas · four types · delivery scheduled for early 2028",
    tags: [
      "38-villa development",
      "Investment presentation",
      "Masterplan & villa types",
      "Financial projections",
      "Interactive property experience",
      "Investor prospectus",
    ],
    stack: ["Strategy", "UX/UI", "Next.js", "Interactive media"],
    // Linton sets its name in type and has no mark. See the `logo` field.
    media: {
      kind: "film",
      src: "/work/video/linton-hero.mp4",
      poster: "/work/video/linton-hero-open.jpg",
      still: "/work/video/linton-hero.jpg",
      alt: "An aerial pass over Linton Villas: the villa rows, the communal pool and the gardens, with the South Lombok coast beyond the development.",
      aspect: 16 / 9,
    },
  },
  {
    index: "06",
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
  headline: "We build digital products for lasting performance — not just launch day.",
  body: "Real products evolve. Users change, requirements shift and complexity compounds. We combine product judgment, design discipline and engineering depth to build software that performs under pressure and improves with time.",
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
      "Clarify the commercial problem, the users, the constraints and how success will be measured.",
    principle:
      "The most expensive product decisions are often made before anyone realises they are making them.",
  },
  {
    index: "02",
    title: "Design",
    summary:
      "Shape the interface, information architecture and system model together — not as separate disciplines handed from one team to another.",
    principle:
      "A design is not finished when it looks right. It is finished when it still works when the data is messy, the edge cases arrive and the network does not.",
  },
  {
    index: "03",
    title: "Build",
    summary:
      "Ship in working increments, under test and observable from the first deployment.",
    principle:
      "Build the codebase for the engineer who inherits it eighteen months from now. Often, that engineer is you.",
  },
  {
    index: "04",
    title: "Evolve",
    summary:
      "Improve the product against evidence from production, user behaviour and the needs of the business as they change.",
    principle:
      "Production teaches you things the original specification never could. The advantage belongs to teams that keep listening.",
  },
] as const;

/* ========================================================== ACT IV — studio */

export const people = {
  act: "IV · The studio",
  headline: "The people you meet are the people who build",
  body: "Strategy, design and engineering decisions stay close to the people building the product, keeping communication direct and execution accountable.",
  refusals: [
    "No pyramid staffing",
    "No account-management layer",
    "No sales-to-delivery handoff",
    "No technology chosen for fashion",
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
  headline: "Fourteen days. Four fixed outputs. Enough clarity to decide what should happen next — without creating dependency.",
  moments: [
    {
      index: "01",
      days: "Day 01 — 02",
      title: "The problem, restated",
      body: "A precise definition of what the business is trying to achieve, written in language everyone involved can agree on.",
    },
    {
      index: "02",
      days: "Day 03 — 05",
      title: "The constraint map",
      body: "A clear view of what is fixed, what is assumed and what remains open — with every assumption made explicit.",
    },
    {
      index: "03",
      days: "Day 06 — 09",
      title: "The thin slice",
      body: "One meaningful path through the product, built end to end and deployed. Real enough to expose technical, product and operational risk before larger commitments are made.",
    },
    {
      index: "04",
      days: "Day 10 — 14",
      title: "The decision",
      body: "A written recommendation showing the trade-offs, risks and next steps — with a plan another capable team could execute without us.",
    },
  ],
  ledger: {
    label: "What you leave with",
    body: "Every output is yours, whether we continue together or not. No lock-in. No dependency. No obligation.",
  },
} as const;

/* ====================================================== ACT V — invitation */

/**
 * Act V — the invitation.
 *
 * The section asks for exactly one thing, and the form stays behind a click so
 * the resting state is a question and an action rather than an input grid. Copy
 * for both states lives here together, because the promise made above the CTA
 * ("two working days") is the same promise repeated under the send button and
 * the two must never drift apart.
 */
export const contact = {
  eyebrow: "Contact",
  headline: "Have something worth building?",
  body: "Tell us what you're working on, where things stand and what you need next. We'll review it and respond within two working days.",
  cta: "Discuss a project",
  form: {
    /** Names the revealed region for screen readers. */
    label: "Project enquiry",
    name: { label: "Name", placeholder: "Your name" },
    email: { label: "Work email", placeholder: "you@company.com" },
    company: { label: "Company", placeholder: "Company or organisation" },
    brief: {
      label: "What are you working on?",
      placeholder: "A short description of the product, problem or opportunity.",
    },
    stage: {
      label: "Where are you currently?",
      optional: "Optional",
      placeholder: "Select if useful",
      options: [
        "Exploring an idea",
        "Existing product",
        "Redesign / rebuild",
        "Scaling an existing system",
        "Not sure yet",
      ],
    },
    submit: "Send enquiry",
    sending: "Sending",
    assurance: "We review every enquiry directly. Expect a response within two working days.",
    success: {
      title: "Enquiry received.",
      body: "It comes straight to us, unfiltered. Expect a reply within two working days.",
    },
    /** Shown when the enquiry could not be delivered. Never swallow a send. */
    failure: "That did not send. Please email us directly and we will pick it up:",
  },
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

/**
 * The footer navigation is the same four anchors as the top nav, rendered once
 * on the closing legal line. It is deliberately not a sitemap: contact details
 * are not repeated here, because the enquiry section directly above is the only
 * place the page asks for anything.
 */
export const footerLinks = nav;
