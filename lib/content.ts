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
  name: "Quantar",
  domain: "www.quantar.space",
  /**
   * WITH the `www`, because that is the canonical host. The apex 308-redirects
   * to it, so the shorter form — which this was — pointed every canonical tag,
   * OG url, sitemap entry and JSON-LD @id at a permanent redirect rather than
   * at the page. If the redirect is ever reversed at the DNS or project level,
   * this is the line that has to follow it.
   */
  url: "https://www.quantar.space",
  tagline: "Complex digital products. Built to last.",
  description:
    "Quantar is a founder-led product strategy, design and engineering studio focused on turning complex ideas into refined digital products.",
  email: "hello@quantar.space",
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

/**
 * The opening slide.
 *
 * It is a slide, deliberately — one claim, five words of range, and nothing
 * else. The first version ran a headline, a lead paragraph, a three-item
 * promise strip and six product screenshots floating at depth behind all of it.
 * Every part was defensible on its own and together they were a collage: six
 * things moving while the reader tried to read a seventh. A visitor could not
 * have told you what the single most important thing on that screen was,
 * because there wasn't one.
 *
 * The fix went one step too far before it landed. The collage was replaced with
 * a single dimensional object holding the six products, which was the right
 * principle and the wrong object — the most elaborate thing on the site,
 * standing next to the sentence that actually makes the argument. The sentence
 * is the screen now. See `components/site/Hero.tsx` for what must not be added
 * back to it.
 */
export const hero = {
  eyebrow: "Product strategy, design and engineering",
  /**
   * THE CLAIM. Authored as three lines because `TextReveal` masks and raises
   * one at a time, so the break is typesetting rather than wrapping.
   *
   * "Complex digital products. Built to last." described the output. This
   * describes the job, which is the thing a prospective client is actually
   * trying to work out on the first screen: not what we make, but whether we
   * make the kind of thing they need.
   *
   * The middle line was "complicated businesses", which put the reader's own
   * company in the difficult chair on the first sentence they read. It then
   * spent a pass as "ambitious businesses", which was flattery, and flattery
   * is a thing a reader has to discount before they can believe the next
   * sentence. The adjective is gone: no qualifier, no filtering of who this is
   * addressed to, and the claim is shorter and harder without it.
   */
  headline: ["We build the products", "businesses need next."],
  /**
   * The two words the whole sentence turns on, set in the accent.
   *
   * Anyone can say they build products. The claim here is about WHEN — not the
   * thing you needed last year, the thing you need next — and that is the half
   * of the sentence a reader skims straight past. It is the only coloured type
   * on the page above the fold, which is the entire reason it works; the moment
   * a second phrase is highlighted, neither is.
   *
   * Must appear verbatim at the END of one of the lines above. `Hero` splits on
   * it rather than the copy carrying markup, so this file stays plain text.
   */
  emphasis: "need next.",
  /**
   * The range, as six words, in place of the paragraph that used to sit here.
   * Every one of these is a sector with a shipped product behind it lower down
   * the page — nothing here is aspirational, and nothing is a service list.
   * Crypto and Web3 earn their place on Pepay and BNBPay, which are the two
   * products carrying the hardest numbers on the page.
   */
  sectors: ["Payments", "Crypto & Web3", "Markets", "Sport", "Property", "AI"],
} as const;

/* ========================================================== ACT II — proof */

export type Partner = {
  name: string;
  src: string;
  /**
   * Where the mark goes when clicked. Point it at the thing that makes the
   * association checkable — the accelerator's own programme page, not the
   * accelerator's homepage — since the whole value of a borrowed mark is that
   * a sceptical reader can go and confirm it.
   */
  href?: string;
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
  /**
   * The artwork is a full-bleed disc or tile carrying its own coloured ground,
   * rather than a mark floating on white. Those two want opposite handling:
   * `mix-blend-multiply` exists to drop a white ground into the paper, and
   * applied to a solid brand field it just muddies it. A bleed mark is shown
   * unblended in a rounded box, which is the shape the artwork was drawn for.
   */
  bleed?: boolean;
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
      /**
       * A SECOND film, shown in its own device beside the first.
       *
       * Only used where the two recordings are genuinely different kinds of
       * evidence rather than two angles on one. Combat has both: a cut reel of
       * the product presented, and the raw unedited capture of the product
       * running. The reel is the better picture and the capture is the better
       * proof, and the pair says something neither says alone — which is the
       * only reason to spend a second device on it.
       */
      also?: {
        src: string;
        poster: string;
        still: string;
        alt: string;
        aspect: number;
      };
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
   * The pitch, and the top of the hierarchy every product follows here:
   * PITCH → DESCRIPTION → PROOF.
   *
   * One sentence, set at `type-pitch`, and the test it has to pass is that
   * somebody could repeat it after five seconds on the page. It is the only
   * line in the block most visitors will read, so it says what the thing IS
   * rather than what it does. Under ~95 characters.
   */
  pitch: string;
  /**
   * Why it matters, for the reader the pitch already caught. ONE short
   * sentence, and never a sentence the film below it already proves — the
   * paragraph is the voiceover, the recording is the evidence. These were two
   * to three times this length and were explaining what the reader was about to
   * watch.
   */
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
 * phone in someone's hand. Noise closes because it is the one product a reader
 * still cannot use: the product page is public, the product is not.
 */
export const projects: readonly Project[] = [
  {
    index: "01",
    kind: "Multi-chain payments",
    name: "Pepay",
    pitch: "The payment infrastructure turning crypto into something people can actually use.",
    summary:
      "Accept any supported asset and settle from one system — invoicing, payment links, QR checkout, subscriptions and reconciliation on the same ledger.",
    href: "https://pepay-merchant-dashboard.vercel.app/home",
    secondary: { label: "@pepaylabs", href: "https://x.com/pepaylabs" },
    status: "Live",
    // "Paying wallets" is the metric the system actually counts, and it is also
    // a phrase that means nothing outside crypto. Saying what it counts —
    // wallets that have paid — keeps the figure exact and drops the jargon.
    metric: "$19.9M settled · 75.9K transactions · 26.7K wallets that have paid",
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
        { name: "Binance Chain", src: "/work/partners/binance-chain.png", aspect: 1200 / 504, href: "https://www.bnbchain.org/en/programs/mvb" },
        { name: "YZi Labs", src: "/work/partners/yzi-labs.webp", aspect: 1600 / 533, href: "https://www.bnbchain.org/en/programs/mvb" },
        { name: "CoinMarketCap", src: "/work/partners/coinmarketcap.png", aspect: 1, scale: 1.5 },
      ],
    },
  },
  {
    index: "02",
    // "Institutional liquidity" is the sector as the sector calls itself, and
    // it is two words a reader outside it has to translate before they can read
    // the pitch underneath. The label says what the thing is instead.
    kind: "Trading infrastructure",
    name: "DRK",
    pitch: "The infrastructure that makes real-world assets easier to buy, sell and trade.",
    // "Tokenisation solved issuance. It did not solve liquidity." is the best
    // line this product has and it stays — but it only lands for a reader who
    // already knows what issuance and liquidity mean in the same sentence, so
    // the next clause says the same thing in words that need nothing.
    summary:
      "Tokenisation solved issuance. It did not solve liquidity: it makes an asset digital without making it easy to trade. DRK is the layer between tokenised assets and the institutions that trade them.",
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
    /**
     * The networks and assets the product runs against, using the marks DRK's
     * own repository vendors.
     *
     * The label says "integrated" and not "partners" deliberately, and the two
     * are not interchangeable here: DRK's asset manifest is explicit that these
     * marks are the chains and assets its work names, and are NOT presented as
     * partnerships, clients or endorsements. Putting them under an "Accelerated
     * by" or "Partners" heading would make a claim its own documentation
     * refuses to make. Every mark is the official artwork, vendored unaltered —
     * except Aptos, which publishes black-on-transparent and was inverted to
     * white for DRK's dark deck, and is inverted back here for paper.
     */
    partners: {
      label: "Networks and assets integrated",
      items: [
        { name: "Ethereum", src: "/work/chains/ethereum.png", aspect: 1, bleed: true },
        { name: "Solana", src: "/work/chains/solana.png", aspect: 1, bleed: true },
        { name: "Aptos", src: "/work/chains/aptos.png", aspect: 1, bleed: true },
        { name: "Sui", src: "/work/chains/sui.png", aspect: 1, bleed: true },
        { name: "USDC", src: "/work/chains/usdc.png", aspect: 1, bleed: true },
        { name: "Robinhood", src: "/work/chains/robinhood.png", aspect: 1, bleed: true },
        { name: "Cantor", src: "/work/chains/cantor.png", aspect: 1, bleed: true },
      ],
    },
  },
  {
    index: "03",
    kind: "Programmable payments",
    name: "BNBPay",
    pitch: "The payment network built for a world where money moves on-chain.",
    // "Gasless, programmable rails" was two pieces of jargon in three words:
    // "rails" is industry, "gasless" is crypto, and a merchant reading this has
    // to decode both before reaching the list of things the product does.
    summary:
      "Payments that move on-chain without the payer covering blockchain fees — invoices, subscriptions, gift cards and API payments for merchants, platforms and AI agents across BNB Chain and opBNB.",
    href: "https://bnbpayvercel1.vercel.app",
    status: "Live",
    metric: "Six tokens accepted, with no blockchain fee for the payer",
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
        { name: "Binance Chain", src: "/work/partners/binance-chain.png", aspect: 1200 / 504, href: "https://www.bnbchain.org/en/programs/mvb" },
        { name: "YZi Labs", src: "/work/partners/yzi-labs.webp", aspect: 1600 / 533, href: "https://www.bnbchain.org/en/programs/mvb" },
      ],
    },
  },
  {
    index: "04",
    kind: "Sports media platform",
    name: "Combat Reviews",
    // "The intelligence layer for the world's combat sports" told a reader what
    // kind of company wrote it rather than what the thing is. A fan, a promoter
    // and an investor all understand the line below on the first read.
    pitch: "A platform for following combat sports, the fighters and the events.",
    summary:
      "Events, fight cards, rankings, athlete profiles and predictions across every major promotion, from announcement through to result.",
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
    /**
     * The only portrait film in the act, and the only product shown inside a
     * device. It replaced a landscape recording of the desktop site — which was
     * a good-looking shot of the wrong surface. This product is used on a phone.
     *
     * The footage is now the product's own reel rather than a 258px screen
     * capture, so it is 9:16 and the device it renders in takes that shape. It
     * is also the one film here that is a composed piece rather than a raw
     * capture, and the alt text says what is actually in it.
     */
    media: {
      kind: "film",
      src: "/work/video/combat-demo.mp4",
      poster: "/work/video/combat-demo-open.jpg",
      still: "/work/video/combat-demo.jpg",
      alt: "The Combat Reviews reel: the app in the hand, moving through the events feed, a fight card with its prediction challenge, and the rankings leaderboard.",
      aspect: 9 / 16,
      /**
       * The raw capture, and the one that goes in the device.
       *
       * The reel above is a cut piece with a scene and a grade — the best
       * picture in the act and, unavoidably, marketing. This is the app itself,
       * recorded off a phone with nothing done to it. Side by side they make
       * the argument this act is actually making: here is how it is sold, and
       * here is the thing behind it, running. Neither would say that alone.
       */
      also: {
        src: "/work/video/combat-app.mp4",
        poster: "/work/video/combat-app-open.jpg",
        still: "/work/video/combat-app.jpg",
        alt: "An unedited capture of the Combat Reviews app: the breaking bar, the upcoming events feed and the UFC 330 main event with its odds, broadcast details and quick pick.",
        aspect: 252 / 548,
      },
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
    /**
     * WE BUILT THE SITE, NOT THE RESORT, and every line in this block has to
     * say so.
     *
     * It used to be filed under "Property development" and pitched as "Thirty-
     * eight villas on the South Lombok coast", with tags reading "38-villa
     * development" and "Masterplan & villa types" — which is a description of
     * the client's development rather than of the thing this studio made. A
     * reader skimming the act came away thinking Quantar builds resorts. The
     * work is the digital sales experience the developer sells through, and it
     * is a better credential stated accurately: the villas are somebody else's,
     * the product that presents them is ours.
     */
    kind: "Property marketing",
    name: "Linton Villas",
    pitch: "A thirty-eight villa resort in South Lombok, presented online for overseas buyers.",
    summary:
      "We built the experience the developer sells through: masterplan, villa types, floor plans, financial projections, an eight-minute film and the full prospectus, as one guided journey.",
    href: "https://lintonvillas.vercel.app",
    status: "Live",
    metric: "38 villas, four types and the full prospectus in one site",
    tags: [
      "Investor website",
      "Guided sales journey",
      "Masterplan & villa types",
      "Financial projections",
      "Interactive property tour",
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
    // "An operating system for turning fragmented work into decisions" asked
    // the reader to decode three ideas before the sentence resolved. This one
    // resolves on the first read, and the paragraph under it says why it
    // matters — which is the order every pitch on this page follows.
    pitch: "One place for your team's email, chats, meetings and documents.",
    summary:
      "Everything the team works in is brought together and indexed, so context is found in seconds instead of hunted across a dozen disconnected systems.",
    href: "https://noiselanding.vercel.app/",
    // The product itself is still gated — access goes through a request form —
    // so this points at what IS public, and the label says exactly that. A
    // reader who clicks "visit the live product" and lands on a marketing page
    // has been misled, and this act cannot afford that on any of the six.
    linkLabel: "View the Noise product page",
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
    /**
     * The one film in the act that is NOT a capture of the running product.
     *
     * Noise is in private beta and its workspace is gated; what is public is
     * the product page, which is the thing linked above and the thing recorded
     * here. That is a real artefact the studio built and it is shown as one —
     * but the alt text says "product page" and not "workspace", because the
     * whole premise of this act is that a sceptical reader can check what they
     * are being shown, and a marketing surface described as an application is
     * exactly the claim that would cost the other five their credibility.
     *
     * The workspace still exists as `/work/noise.jpg` if this block ever wants
     * to show the application itself instead.
     */
    media: {
      kind: "film",
      src: "/work/video/noise-demo.mp4",
      poster: "/work/video/noise-demo-open.jpg",
      still: "/work/video/noise-demo.jpg",
      alt: "The Noise product page: the connected sources — Gmail, Slack, Drive, Notion and the rest — orbiting the memory layer, beside the line 'Your company should know everything.'",
      aspect: 1280 / 612,
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

/* ========================================================== ACT II — the count

   THE NUMBERS COME FIRST, and that ordering is deliberate.

   This screen used to sit after all six product spreads, roughly fifteen
   thousand pixels down, on the reasoning that figures mean more once you have
   seen the things that produced them. In practice it meant the single most
   convincing screen on the site was the one fewest people reached — and it is
   the most convincing precisely because, unlike every other claim here, it
   cannot be written. Somebody either settled nineteen million dollars or they
   did not.

   So it now opens the proof: the numbers, then the products that produced them.
   The hinge above it asks what we have actually built, and this answers it in
   eight figures before the reader has scrolled a single film.

   That reordering makes the body copy load-bearing. Every figure is repeated
   verbatim in its own product's block BELOW — which is what the reader has to
   be told, because a number presented before its evidence is an assertion until
   they know where to go and check it. Nothing here is rounded up, aggregated
   across products to look larger, or projected. */

export type Figure = {
  /** The number itself, so it can be counted up rather than faded in. */
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** What it counts. Kept to a few words — the number is the message. */
  label: string;
  /** Which product it came from. Absent where it describes the studio. */
  from?: string;
};

export const figures: {
  act: string;
  headline: readonly string[];
  body: string;
  items: readonly Figure[];
} = {
  act: "II · The count",
  headline: ["Numbers we", "can be held to"],
  // Was: "Every figure here is taken from a running product, and every one of
  // them appears again in that product's own block below. Nothing is aggregated
  // across products, projected, or rounded up to look larger." True, and
  // written like a disclaimer. Same three promises, said plainly.
  body: "These figures come straight from the products themselves, and every one of them appears again in that product's own block below. Nothing is projected, combined across products or rounded up.",
  items: [
    { value: 19.9, decimals: 1, prefix: "$", suffix: "M", label: "settled", from: "Pepay" },
    { value: 75.9, decimals: 1, suffix: "K", label: "transactions", from: "Pepay" },
    { value: 26.7, decimals: 1, suffix: "K", label: "wallets that have paid", from: "Pepay" },
    // "Sold" is the word this must never say. The development is being taken to
    // market, not cleared — the site presents thirty-eight villas, it has not
    // shifted them, and a count of sales is a claim nobody has made. Nor is it
    // "villas built": the villas are the client's, the site is ours. What is
    // true is the size of the thing the product had to carry.
    { value: 38, label: "villas presented in one site", from: "Linton Villas" },
    { value: 6, label: "tokens accepted, no payer fees", from: "BNBPay" },
    { value: 6, label: "products built" },
    // Live means a public URL a reader can open right now. DRK is pre-release
    // and Noise is in private beta, and neither is counted here.
    { value: 4, label: "in production today" },
    { value: 6, label: "platforms indexed", from: "Noise" },
  ],
};

/* ============================================================ ACT III — turn */

export const turn = {
  // "III · The turn" was a name for what the section does to the page, which is
  // information the reader has no use for. The acts now say what they contain:
  // the proof is what we have built, the approach is how we build, the studio
  // is who builds it. Change this and change `hinges.toTurn` with it.
  act: "III · The approach",
  headline: "We build digital products for lasting performance — not just launch day.",
  // Trimmed. The second half used to explain what product judgment, design
  // discipline and engineering depth get you — to a reader who has just
  // scrolled six products and eight figures proving it. The evidence had
  // already made the argument; the paragraph was repeating it back.
  body: "Products don't stay still. Customers change, requirements change and new problems appear. We build for the version that exists in three years, not the one that launches.",
} as const;

/**
 * The four stages, one line of method each, plus the studio principle that
 * belongs to it.
 *
 * NOTE: these are Quantar's own positions, not client testimonials. If real,
 * permissioned client quotes ever exist, add them as their own act rather than
 * dressing these up.
 */
export const process = [
  {
    index: "01",
    title: "Define",
    summary:
      "Work out what the business is trying to achieve, who it is for, what limits it and how success gets measured.",
    principle:
      "The most expensive product decisions are often made before anyone realises they are making them.",
  },
  {
    index: "02",
    title: "Design",
    summary:
      "Shape the interface, the way information is organised and the system underneath it together — not as separate jobs passed between teams.",
    principle:
      "A design is not finished when it looks right. It is finished when it still works when the data is messy, the edge cases arrive and the network does not.",
  },
  {
    index: "03",
    title: "Build",
    summary:
      "Ship in working pieces, each one tested and monitored from the day it goes live.",
    principle:
      "Build the codebase for the engineer who inherits it eighteen months from now. Often, that engineer is you.",
  },
  {
    index: "04",
    title: "Evolve",
    summary:
      "Keep improving the product against what real use shows and what the business needs next.",
    principle:
      "Production teaches you things the original specification never could. The advantage belongs to teams that keep listening.",
  },
] as const;

/* ========================================================== ACT IV — studio */

export const people = {
  act: "IV · The studio",
  headline: ["The people you meet", "are the people", "who build"],
  body: "The same team stays with the work from the first idea through to the finished product, so you are always talking to the people making the decisions.",
  /**
   * Each of these has to open with "No" — `People.tsx` sets the first word in
   * the accent and the rest in ink, and the negation is the whole grammar of
   * the list.
   *
   * They used to be stated as industry terms: pyramid staffing, an
   * account-management layer, a sales-to-delivery handoff. Every one of those
   * names a practice the reader has probably suffered without knowing what it
   * is called, so each now describes what they would EXPERIENCE instead.
   */
  refusals: [
    "No junior team replacing the people you met",
    "No account managers sitting in between",
    "No handoff from sales to a different team",
    "No technology chosen because it is fashionable",
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
  headline: "Fourteen days. Four fixed outputs. Enough clarity to decide what happens next — and nothing you cannot walk away from.",
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
      body: "We map what we know, what we are assuming and what still needs an answer — with every assumption written down.",
    },
    {
      index: "03",
      days: "Day 06 — 09",
      // "The thin slice" is what this is called by the people who build
      // software and nothing at all to anybody else, which is the wrong way
      // round for the one output on this page a non-technical founder is being
      // asked to picture.
      title: "A working first version",
      body: "One important part of the product, built end to end and deployed. Real enough to expose the technical, product and operational problems before you commit to building everything.",
    },
    {
      index: "04",
      days: "Day 10 — 14",
      title: "The decision",
      body: "A written recommendation showing the trade-offs, risks and next steps — with a plan another capable team could execute without us.",
    },
  ],
  /**
   * The line the whole fortnight exists to earn, set large under the timeline.
   * It is the difference between this and every discovery workshop the reader
   * has already been sold, and it belongs at the end of the sequence rather
   * than in the header, where it would be a promise instead of a conclusion.
   */
  close: "You leave with a decision. Not another deck.",
  ledger: {
    label: "What you leave with",
    body: "Every output is yours, whether we continue together or not. No lock-in. No dependency. No obligation.",
  },
} as const;

/* ================================================== ACT IV½ — the constellation

   Six products as one constellation, collapsing into the studio.

   This is the only screen on the site that argues by picture alone. The act
   above it has just spent six spreads proving each product individually; what it
   cannot show, product by product, is the thing a client is actually buying —
   that payments, institutional liquidity, combat sports, property and enterprise
   AI came out of the same room. A paragraph claiming that is an assertion. Six
   names drawing lines to one name is a demonstration.

   So the copy here is almost nothing: six names, six facts already stated
   elsewhere, and one line at the end. Every fact repeats a claim from that
   product's own block — nothing is introduced this late in the page. */

export const constellation = {
  act: "IV · The breadth",
  /** Landed only once the collapse completes. The picture makes the argument. */
  statement: ["Different sectors.", "One way of working."],
  /**
   * Position on a square field, in percent. Arranged as a ring rather than a
   * grid: a grid of six would read as a card layout, which is exactly what this
   * section exists instead of.
   */
  nodes: [
    { name: "Noise", fact: "Private beta", x: 50, y: 7 },
    { name: "DRK", fact: "In development", x: 85, y: 29 },
    { name: "Pepay", fact: "$19.9M settled", x: 81, y: 73 },
    { name: "Linton Villas", fact: "38 villas presented", x: 50, y: 94 },
    // "Every major promotion" and not "Nine disciplines": the discipline count
    // was dropped from this product's copy in an earlier pass, and reviving a
    // retired figure in a section whose whole premise is that it introduces
    // nothing would be exactly the wrong place to do it.
    { name: "Combat Reviews", fact: "Every major promotion", x: 18, y: 73 },
    { name: "BNBPay", fact: "Six tokens, no payer fees", x: 14, y: 29 },
  ],
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
  // "Have something worth building?" asked the reader to rate their own idea,
  // which is a strange thing to make someone do at the point of contact. This
  // asks about the work instead, and answers the question the whole page has
  // been arguing: complicated is the qualification, not a disqualification.
  // An array because `TextReveal` masks and raises one line at a time, and the
  // break has to be authored rather than left to wrapping. Kept here rather than
  // in the component: this file claims to be the single source of site copy, and
  // a headline that lives in the markup is a headline nobody finds when they
  // come here to change it. That is not hypothetical — the previous wording sat
  // in `Contact.tsx` while a different, unused string sat in this file.
  headline: ["Something", "complicated?"],
  body: "Tell us what you're building, where it stands and what you need next. We read every enquiry ourselves and respond within two working days.",
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
    act: "III · The approach",
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
