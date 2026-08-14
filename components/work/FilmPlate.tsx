"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Parallax } from "@/components/primitives/Parallax";

/**
 * A product recording, framed and already running by the time you reach it.
 *
 * A screenshot proves a product exists. A recording proves it works — you watch
 * a gift card get created, a market state update, a fight card fill in, a drone
 * cross a development. That is worth a great deal more in an act whose entire
 * job is proof, which is why five of these six spreads are film.
 *
 * THE FILM PLAYS. It is not a player and it is not scroll-driven: there is no
 * control bar to find, nothing to press, and nothing for the reader to operate.
 * A spread arrives already in motion and keeps looping while it is on screen,
 * which is the behaviour that reads as a product running rather than as a video
 * embedded in a page. An earlier version drove these off the scroll position;
 * it was a nice trick and it made the reader responsible for the evidence, which
 * is exactly backwards for an act that is trying to show them something.
 *
 * Two rules keep that from costing anything:
 *
 *  1. NOTHING LOADS EARLY. A film fetches only once it is within a screen of the
 *     viewport. Six spreads' worth of video requested on first paint would be
 *     most of a phone's data budget spent on things the reader may never reach.
 *  2. NOTHING PLAYS OFF SCREEN. Decoding is paused the moment a film leaves the
 *     viewport and resumed when it returns. Five simultaneously decoding videos
 *     is how a scroll page ends up dropping frames on a laptop.
 *
 * Under `prefers-reduced-motion` the film is not loaded at all: a still of the
 * product running is rendered in its place, and the reader pays for one image
 * instead of a video they were never going to be shown. That still is a
 * different frame from the poster on purpose — see `still` below.
 */
export function FilmPlate({
  src,
  poster,
  still,
  alt,
  /** Width ÷ height of the recording. The frame takes its shape from this. */
  aspect,
  tilt = 0,
  priority = false,
}: {
  src: string;
  /**
   * The film's own first frame. Held while the file downloads — over a second
   * of it on a slow connection — so it has to be the frame playback will
   * actually begin on, or the picture jumps the moment it starts. DRK opens on
   * two seconds of brand animation, and a poster of its console would show the
   * console, cut to black and arrive back at the console: a title read as a
   * glitch.
   */
  poster: string;
  /**
   * A populated frame from the middle, shown INSTEAD of the film under reduced
   * motion. That reader gets exactly one image out of this spread and it has to
   * be the product running — a title card would leave the act's lead product
   * showing nothing at all.
   */
  still: string;
  alt: string;
  aspect: number;
  tilt?: number;
  priority?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  /** Set once the frame comes within a screen of the viewport. Gates the fetch. */
  const [near, setNear] = useState(priority);

  useEffect(() => {
    if (near) return;
    const el = frameRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      // One full screen of warning, so the first frames are buffered before the
      // reader arrives and the film is already running when they get there
      // rather than starting once they are looking at it.
      { rootMargin: "100% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [near]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // `play()` rejects when the tab is backgrounded or the browser declines
        // autoplay. Both are fine and both leave the poster up, so the rejection
        // is swallowed rather than logged on every scroll.
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      // A tenth of the frame is enough to commit. Waiting for a quarter means a
      // tall film on a short screen starts noticeably late.
      { threshold: 0.1 },
    );

    observer.observe(video);
    return () => observer.disconnect();
    // `near` is a dependency because the source is attached only once it flips.
    // An observer created before that is watching an element with no `src`, and
    // if it fires then, the `play()` is wasted — intersection has to CHANGE for
    // the callback to run again, and for a film the reader scrolled straight to
    // it may not. Re-running when the source lands gives a fresh observer, which
    // reports the current intersection immediately.
  }, [reduced, near]);

  return (
    <div ref={frameRef}>
      <Parallax distance={26} tilt={tilt}>
        <figure
          // Full bleed below `lg`: the gutter is cancelled, the side border with
          // it, and the film becomes the only thing on the screen. Above `lg` it
          // is a framed object sitting in a column beside its copy.
          className="group/plate relative -mx-gutter overflow-hidden border-y border-rule bg-void
                     lg:mx-0 lg:border
                     lg:shadow-[0_1px_2px_rgb(20_19_15/0.05),0_30px_60px_-30px_rgb(20_19_15/0.30),0_70px_120px_-60px_rgb(20_19_15/0.30)]
                     lg:transition-[border-color,box-shadow] lg:duration-[0.9s] lg:ease-quad
                     lg:group-hover:border-rule-strong
                     lg:group-hover:shadow-[0_1px_2px_rgb(20_19_15/0.06),0_40px_80px_-30px_rgb(20_19_15/0.38),0_90px_150px_-60px_rgb(20_19_15/0.34)]"
          style={{ aspectRatio: aspect }}
        >
          {reduced ? (
            <Image
              src={still}
              alt={alt}
              fill
              // The media column is eight of twelve inside a 1560px container.
              sizes="(min-width: 1024px) 66vw, 100vw"
              priority={priority}
              quality={88}
              className="object-cover object-center"
            />
          ) : (
            <video
              ref={videoRef}
              // The recording is the evidence, so it is described rather than
              // hidden. A video element takes no alt attribute; `aria-label` is
              // what a screen reader announces in its place.
              aria-label={alt}
              poster={poster}
              // `muted` and `playsInline` together are what buy autoplay on iOS
              // — muted alone still opens the fullscreen player, which would
              // hijack the page the moment the reader scrolled past.
              muted
              playsInline
              loop
              preload={near ? "auto" : "none"}
              src={near ? src : undefined}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          )}

          {/* Lighting, matched to the still plate so that a film and a
              screenshot read as the same object in the same act. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgb(255_255_255/0.07)_0%,transparent_38%)]"
          />

          {/* The act's single accent inside a frame: a hairline drawn across the
              top edge on hover, the same one the still plate uses. */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[0.9s] ease-quad motion-safe:group-hover:scale-x-100"
          />
        </figure>
      </Parallax>
    </div>
  );
}
