/**
 * Builds every image the work section serves, from the raw captures in
 * `assets/source`. Run from the project root:
 *
 *   node scripts/build-work-assets.js
 *
 * Nothing here is a one-off. The captures get replaced every time a product
 * ships something worth showing, and re-deriving the phone screens by hand in
 * an image editor is how a set of assets drifts out of sync with each other —
 * different backgrounds, different padding, different corner radii. Keeping the
 * derivation in code means the next capture goes through the same crops.
 *
 * Requires `sharp`, which Next already installs.
 */

const path = require("path");
const sharp = require(path.join(process.cwd(), "node_modules", "sharp"));

const SRC = path.join(process.cwd(), "assets", "source");
const OUT = path.join(process.cwd(), "public", "work");
const src = (name) => path.join(SRC, name);
const out = (...parts) => path.join(OUT, ...parts);

/**
 * The BNBPay app's own background, sampled from the captures. Re-stacked cards
 * have to sit on this exact value or the composite shows its seams.
 */
const APP_BG = "#0b0e11";

/** Phone screen canvas: 9:19.5, near enough to a current iPhone. */
const PHONE = { W: 440, H: 953, PAD: 20 };
const INNER = PHONE.W - PHONE.PAD * 2;

/** Extract a region and scale it to a target width. */
const cut = (file, left, top, width, height, target) =>
  sharp(file)
    .extract({ left, top, width, height })
    .resize({ width: target, kernel: "lanczos3" })
    .png()
    .toBuffer({ resolveWithObject: true });

const compose = (layers, file) =>
  sharp({
    create: { width: PHONE.W, height: PHONE.H, channels: 4, background: APP_BG },
  })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(file);

/** The three marketing plates: one delivery width, one encoder. */
async function plates() {
  const jobs = [
    ["pepay.jpeg", "pepay.jpg"],
    ["combat-reviews.jpeg", "combat-reviews.jpg"],
    ["noise.jpeg", "noise.jpg"],
  ];

  for (const [from, to] of jobs) {
    await sharp(src(from))
      .resize({ width: 2000, withoutEnlargement: true })
      // 4:4:4 because every one of these carries small light-on-dark type, and
      // chroma subsampling turns coloured text into a smear.
      .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(out(to));
    const m = await sharp(out(to)).metadata();
    console.log("plate  ", to, `${m.width}x${m.height}`);
  }
}

/**
 * BNBPay ships one responsive app, and the captures we have are of its desktop
 * layout. Rather than squeeze a 992px-wide screenshot into a phone — which
 * would be both illegible and a misrepresentation — the real cards are cut out
 * and re-stacked at phone width, which is what the app itself does at that
 * breakpoint.
 */
async function invoicePhone() {
  const f = src("bnbpay-invoice.png");

  const logo = await cut(f, 68, 6, 190, 30, 190);
  const testnet = await cut(f, 816, 7, 66, 28, 74);
  const title = await cut(f, 268, 70, 424, 88, INNER);
  const invoice = await cut(f, 133, 183, 336, 164, INNER);
  const subscription = await cut(f, 487, 183, 336, 164, INNER);
  const details = await cut(f, 133, 424, 336, 478, INNER);

  let y = 26;
  const layers = [
    { input: logo.data, left: PHONE.PAD, top: y + 1 },
    { input: testnet.data, left: PHONE.W - PHONE.PAD - testnet.info.width, top: y },
  ];
  y += 30 + 26;

  for (const [el, gap] of [[title, 22], [invoice, 14], [subscription, 18], [details, 0]]) {
    layers.push({ input: el.data, left: PHONE.PAD, top: y });
    y += el.info.height + gap;
  }

  await compose(layers, out("bnbpay-invoice.png"));
  console.log("phone  ", "bnbpay-invoice.png", `content ${y}px`);
}

/**
 * The gift-card capture has the same problem plus one of its own: the preview
 * panel is as tall as the form beside it, so two thirds of it is empty. Its top
 * and its closing edge are taken and the dead middle dropped, which rebuilds
 * the panel at the height its own content actually needs.
 */
async function giftCardPhone() {
  const f = src("bnbpay-gift-cards.png");

  const logo = await cut(f, 48, 15, 90, 26, 116);
  const tab = await cut(f, 308, 14, 72, 29, 93);
  const testnet = await cut(f, 792, 16, 64, 25, 74);
  const panelTop = await cut(f, 461, 88, 338, 412, INNER);
  const panelCap = await cut(f, 461, 768, 338, 22, INNER);
  const form = await cut(f, 108, 88, 335, 300, INNER);

  let y = 26;
  const layers = [
    { input: logo.data, left: PHONE.PAD, top: y + 2 },
    { input: tab.data, left: PHONE.PAD + logo.info.width + 14, top: y },
    { input: testnet.data, left: PHONE.W - PHONE.PAD - testnet.info.width, top: y + 1 },
  ];
  y += 34 + 28;

  for (const [el, gap] of [[panelTop, 0], [panelCap, 18], [form, 0]]) {
    layers.push({ input: el.data, left: PHONE.PAD, top: y });
    y += el.info.height + gap;
  }

  await compose(layers, out("bnbpay-cards.png"));
  console.log("phone  ", "bnbpay-cards.png", `content ${y}px`);
}

/**
 * Key a white-ground logo to transparency and flatten it to a single ink
 * colour, so a brand-yellow lockup can sit in a masthead built entirely of ink
 * on paper.
 *
 * Coverage comes from `255 - min(r,g,b)` rather than from luminance. Luminance
 * is the obvious choice and it is wrong: brand yellow is nearly as bright as
 * white, so a luminance key renders the mark at about a fifth of its opacity
 * and it arrives on the page as a grey ghost. The minimum channel is high only
 * where the pixel is genuinely close to white, which is the actual question.
 */
async function inkify(from, to, rgb = [20, 19, 15]) {
  const { data, info } = await sharp(src(from))
    .flatten({ background: "#ffffff" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const keyed = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    keyed[i] = rgb[0];
    keyed[i + 1] = rgb[1];
    keyed[i + 2] = rgb[2];
    keyed[i + 3] = 255 - Math.min(data[i], data[i + 1], data[i + 2]);
  }

  await sharp(keyed, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    // Trim the artboard so the mark can be sized by its own aspect ratio.
    .trim({ threshold: 1 })
    .toFile(out("logos", to));

  const m = await sharp(out("logos", to)).metadata();
  console.log("logo   ", to, `${m.width}x${m.height}`, `aspect ${(m.width / m.height).toFixed(3)}`);
}

(async () => {
  await plates();
  await invoicePhone();
  await giftCardPhone();
  await inkify("bnbpay-mark.png", "bnbpay-mark.png");
})();
