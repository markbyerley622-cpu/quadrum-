/**
 * Builds every video the work section serves, from the raw recordings in
 * `assets/source/video`. Run from the project root:
 *
 *   node scripts/build-work-video.js            # everything
 *   node scripts/build-work-video.js linton     # just the jobs whose name matches
 *
 * Requires `ffmpeg` on PATH. The raw recordings are screen captures straight
 * off the products — 40–100MB each, sometimes with an audio track, sometimes at
 * an odd capture resolution — and none of that belongs on a page.
 *
 * ONE PROFILE, because every film on the page plays rather than being seeked.
 * That is worth stating, since an earlier version drove these off the scroll and
 * needed a keyframe every half second to do it: seeking can only land on a
 * keyframe, so a sparse one leaves the picture visibly lagging the wheel. Nothing
 * seeks these now, so the GOP goes back to a normal two seconds and every file
 * comes in roughly a third smaller for the same picture. If a scrub ever returns,
 * that is the setting to change and the reason to change it.
 *
 * Audio is stripped from all of them. Every one of these autoplays, autoplay is
 * only permitted while muted, and an audio track that can never be heard is
 * bytes the reader pays for and never receives.
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SRC = path.join(process.cwd(), "assets", "source", "video");
const OUT = path.join(process.cwd(), "public", "work", "video");

/**
 * Delivery width. The media column is at most 7 of 12 columns inside a 1560px
 * container — about 900px, so 1280 covers it at 1.4x and covers a 2x phone
 * outright. 1920 was tried and is indistinguishable at this size for triple the
 * weight.
 */
const WIDTH = 1280;

/** Frames between keyframes. 60 at 30fps is one every two seconds. */
const GOP = 60;

/**
 * A ceiling worth holding. Past roughly four megabytes a single film stops being
 * an asset on the page and starts being the reason the page is slow, and the
 * reader who pays for it is on the worst connection of anyone visiting.
 */
const BUDGET_MB = 4;

const jobs = [
  {
    from: "drk-demo.mp4",
    to: "drk-demo",
    // Runs from frame one, deliberately. The first two seconds are DRK's own
    // brand animation resolving on black before it cuts to the live console,
    // and that title is the reason to play the film from the top rather than
    // from the first populated frame: the spread opens on the product's own
    // identity and then shows the product. It costs two seconds per loop.
    //
    // The tail is left in with it. The operator navigates between sections
    // through the capture and each one re-initialises, so there are spinners at
    // ~7s, ~35s and ~56s. They read as an application loading, which is what
    // they are — but if they ever want cutting, the longest continuous run of
    // populated console is 37→52 and `start`/`duration` are how to take it.
    poster: 44,
    crf: 30,
  },
  {
    from: "bnbpay-cards-demo.mp4",
    to: "bnbpay-demo",
    // The gift card is created at ~22s. That frame is the whole product in one
    // picture, which is what a poster is for.
    poster: 22,
    crf: 30,
    // Captured in a 1908px window against an app whose own container is about
    // 820px wide, so two fifths of the frame is empty background and the panels
    // arrive on the page too small to read. The crop is set to the app's
    // container plus air: the masthead runs 562→1376 and the widest modal
    // 780→1120, both comfortably inside. Nothing of the product is lost, and the
    // result is a 4:3 that matches the still plate.
    crop: { w: 1250, h: 936, x: 330, y: 0 },
  },
  {
    from: "combat-demo.mp4",
    to: "combat-demo",
    // Nine seconds, so almost any frame is representative. This one has the
    // card list populated rather than mid-transition.
    poster: 5,
    crf: 29,
    // Twenty-two rows off the bottom: the capture caught the browser's link
    // status bar, and a stray localhost-looking URL across the corner of a
    // product shot is the sort of detail that makes the rest look unchecked.
    crop: { w: 1918, h: 888, x: 0, y: 0 },
  },
  {
    from: "linton-hero.mp4",
    to: "linton-hero",
    // The only live-action source in the set, and it costs. Grain, foliage and
    // constant camera movement give an encoder nothing to hold still, so the
    // settings that keep a static console at a megabyte and a half put this at
    // nearly six. It gives up both a little width and a little quality to come
    // in under budget — an aerial is the most forgiving footage there is for
    // both, and it is still the largest file on the page by twice.
    poster: 13,
    crf: 34,
    width: 1152,
  },
  {
    from: "pepay-reel.mp4",
    to: "pepay-reel",
    // A twelve-second cut motion piece rather than a capture, and the shortest
    // loop on the page, so it can afford the best picture of the set.
    poster: 8,
    crf: 28,
  },
];

const ffmpeg = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });

const size = (file) => `${(fs.statSync(file).size / 1e6).toFixed(1)}MB`;

/**
 * A crop, then a scale. Order matters: cropping first means the scale operates
 * on what survives, so the delivery width describes the picture the reader
 * actually sees rather than the empty background around it.
 */
const filter = (crop, width) =>
  [crop && `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`, `scale=${width}:-2:flags=lanczos`]
    .filter(Boolean)
    .join(",");

function encode({ from, to, crf, crop, start, duration, width = WIDTH }) {
  const input = path.join(SRC, from);
  const output = path.join(OUT, `${to}.mp4`);

  ffmpeg([
    // -ss AFTER -i, unlike the poster: seeking on the input side lands on a
    // keyframe, and a trim that starts a few frames early puts the loading
    // screen it was meant to remove back in the file. Output-side seeking is
    // slower and frame-exact, which is the right trade for a one-off build.
    "-i", input,
    ...(start ? ["-ss", String(start)] : []),
    ...(duration ? ["-t", String(duration)] : []),
    "-an",
    // -2 keeps the height even, which H.264's 4:2:0 chroma requires. Capture
    // heights are arbitrary — one of these sources is 936px tall.
    "-vf", filter(crop, width),
    "-c:v", "libx264",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-preset", "slow",
    "-crf", String(crf),
    "-g", String(GOP),
    "-keyint_min", String(GOP),
    // Moves the index to the front of the file so playback can start on the
    // first chunk instead of waiting for the whole download. These autoplay the
    // moment they scroll into view, so that first chunk is the whole experience.
    "-movflags", "+faststart",
    output,
  ]);

  const mb = fs.statSync(output).size / 1e6;
  console.log(
    `video  ${to}.mp4  ${width}w  crf ${crf}  ${size(output)}` +
      (mb > BUDGET_MB ? `  ⚠ over the ${BUDGET_MB}MB budget` : ""),
  );
}

/**
 * TWO STILLS PER FILM, because they answer different questions.
 *
 *  - `<name>-open.jpg` is the film's own first frame, and it is what the video
 *    element carries as its `poster`. The poster is what the reader looks at
 *    while the file downloads — over a second of it on a slow connection — so
 *    any frame OTHER than the first means the picture visibly jumps the moment
 *    playback begins. That matters most where a film opens on a title: DRK's
 *    first two seconds are its brand animation, and a poster of the console
 *    would show the console, cut to black, and then arrive at the console
 *    again, which reads as a glitch rather than as a title.
 *  - `<name>.jpg` is a populated frame from the middle, and it replaces the
 *    film entirely under `prefers-reduced-motion`. That reader gets one image
 *    and it has to be the product, not a title card — the act's whole argument
 *    is what these things look like running.
 *
 * Only one of the two is ever fetched by any given reader.
 */
function stills({ from, to, poster: at, crop }) {
  const input = path.join(SRC, from);

  // -ss before -i seeks on keyframes, which is fast and accurate enough for a
  // still. 1600 wide because a still is the LCP candidate on these spreads, and
  // through the same crop as the film so the two cannot disagree.
  const grab = (seconds, suffix) => {
    const output = path.join(OUT, `${to}${suffix}.jpg`);
    ffmpeg(["-ss", String(seconds), "-i", input, "-frames:v", "1", "-vf", filter(crop, 1600), "-q:v", "4", output]);
    console.log(`still  ${to}${suffix}.jpg  t=${seconds}s  ${size(output)}`);
  };

  grab(at, "");
  // A hair after zero rather than zero: some captures open on a single black
  // frame before the first real one.
  grab(0.1, "-open");
}

fs.mkdirSync(OUT, { recursive: true });

// An optional name filter, so re-tuning one encode does not re-run the other
// four. Every job runs when no argument is given.
const only = process.argv[2];
const selected = only ? jobs.filter((job) => job.to.includes(only)) : jobs;

if (!selected.length) {
  console.error(`no job matches "${only}". Known: ${jobs.map((j) => j.to).join(", ")}`);
  process.exit(1);
}

for (const job of selected) {
  encode(job);
  stills(job);
}
