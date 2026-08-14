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

const fs = require("fs");
const path = require("path");
const sharp = require(path.join(process.cwd(), "node_modules", "sharp"));

const SRC = path.join(process.cwd(), "assets", "source");
const OUT = path.join(process.cwd(), "public", "work");
const src = (...parts) => path.join(SRC, ...parts);
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

/**
 * The marketing plates: one delivery width, one encoder.
 *
 * Combat Reviews is not derived here. Its plate is an approved showcase render
 * shipped as a fixed asset (`public/work/combat-reviews-showcase-v2.png`), so
 * re-encoding it from a raw capture would replace the approved composition.
 */
async function plates() {
  const jobs = [
    ["pepay.jpeg", "pepay.jpg"],
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

/**
 * Remove an editor's transparency checkerboard that has been exported INTO the
 * artwork.
 *
 * Google's Drive mark arrived with the grey-and-white chequer baked in as a
 * semi-transparent layer — 95,000 pixels of it, all at about 63% alpha and all
 * completely desaturated. It went unnoticed for as long as the partner marks
 * were rendered in greyscale at reduced opacity; the moment they were shown at
 * full colour and twice the size, the mark had a visible chessboard behind it.
 *
 * The test is saturation, not alpha. The chequer is grey by definition and the
 * logo is not, so any partially-transparent pixel with almost no colour in it is
 * chequer and is cleared. In this file that is 95,050 pixels against 71 genuinely
 * low-saturation edge pixels, which is about as clean a separation as an image
 * ever offers.
 *
 * CLEARING ALPHA IS NOT ENOUGH, and this is the part that costs an hour if you
 * do not know it. A pixel at alpha 0 still carries RGB, and this file's were the
 * chequer's own 238/255 greys alternating in a seven-pixel grid. Every measure
 * of the file then says it is clean — the alpha is zero, the histogram is clean
 * — and the chequer still appears in the browser at about 4% contrast, because
 * the RGB under transparent pixels survives resizing and re-encoding and gets
 * averaged back in. Measured against its neighbours: Drive's rendered background
 * varied by 10 levels of luminance where Slack, Teams and Dropbox varied by 0.
 *
 * So the alpha goes entirely. The mark is composited onto white and written with
 * no alpha channel at all, which makes the whole class of bug impossible — there
 * is no longer anything hidden to leak. Nothing is lost: every mark in this row
 * renders under `mix-blend-multiply`, which is precisely the operation that
 * drops a white ground into the surface beneath it.
 */
async function dechequer(name, { alpha = 250, saturation = 12 } = {}) {
  const { data, info } = await sharp(src("partners", name))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let cleared = 0;
  let flattened = 0;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0 && data[i + 3] < alpha) {
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      const min = Math.min(data[i], data[i + 1], data[i + 2]);
      if (max - min < saturation) {
        data[i + 3] = 0;
        cleared++;
      }
    }

    if (data[i + 3] === 0) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      flattened++;
    }
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .flatten({ background: "#ffffff" })
    .png({ compressionLevel: 9 })
    .toFile(out("partners", name));

  console.log(
    "partner",
    name,
    `cleared ${cleared} chequer px, flattened ${flattened} transparent px, alpha dropped`,
  );
}

/**
 * Right-size every partner mark, so none of them needs the image optimizer.
 *
 * They are shown at about 50–90px and two of them arrived as 300KB PNGs, which
 * is most of a megabyte of logo on a page whose entire film budget is seven. At
 * 320px they cover the largest display size at 3x and cost a few kilobytes each,
 * and at that point running them through `/_next/image` at request time buys
 * nothing — so the components render them `unoptimized` and what is committed is
 * exactly what the browser receives.
 *
 * That last part is the real reason for this step. Every transform between the
 * file and the screen is somewhere an artifact can be introduced or a stale
 * variant cached, and `noise-google-drive.png` proved it: the chequer survived
 * three correct fixes to the source because the optimizer kept serving a cached
 * encode of the old one. Removing the transform removes the question.
 *
 * SVG is passed through untouched — a vector has no size to reduce.
 */
async function partnerMarks({ edge = 320 } = {}) {
  const dir = path.join(SRC, "partners");
  if (!fs.existsSync(dir)) return;

  for (const name of fs.readdirSync(dir)) {
    if (name.endsWith(".svg")) continue;

    const image = sharp(src("partners", name));
    const meta = await image.metadata();

    // Flatten onto white for the same reason as `dechequer`: these render under
    // `mix-blend-multiply`, so a white ground is invisible, and an alpha channel
    // is a place for invisible colour to hide.
    let pipeline = image
      .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" });

    pipeline = name.endsWith(".webp")
      ? pipeline.webp({ quality: 90 })
      : pipeline.png({ compressionLevel: 9 });

    const buffer = await pipeline.toBuffer();
    fs.writeFileSync(out("partners", name), buffer);

    const after = await sharp(buffer).metadata();
    console.log(
      "partner",
      name.padEnd(24),
      `${meta.width}x${meta.height} -> ${after.width}x${after.height}`,
      `${(buffer.length / 1024).toFixed(0)}KB`,
    );
  }
}

(async () => {
  await plates();
  await invoicePhone();
  await giftCardPhone();
  await inkify("bnbpay-mark.png", "bnbpay-mark.png");
  // Runs before the resize: it works on the full-resolution mark, where the
  // chequer is unambiguous, and writes back into the source pipeline.
  await dechequer("noise-google-drive.png");
  fs.copyFileSync(out("partners", "noise-google-drive.png"), src("partners", "noise-google-drive.png"));
  await partnerMarks();
})();
