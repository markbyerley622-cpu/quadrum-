"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The recording itself, and nothing else.
 *
 * This deliberately renders no frame, no border, no shadow and no aspect box —
 * it fills whatever the composition around it has decided the shot should be.
 * That is the whole difference between this and the media block it replaced:
 * the film used to arrive already dressed as a card, which meant every product
 * got the same card. Now the shot is composed per product and the film is the
 * thing poured into it.
 *
 * What it still owns is the behaviour, because that part must not vary:
 *
 *  1. THE FILM PLAYS. No control bar, nothing to press, nothing for the reader
 *     to operate. A shot arrives already in motion and loops while it is on
 *     screen, which is what reads as a product running rather than as a video
 *     embedded in a page.
 *  2. NOTHING LOADS EARLY. A film fetches only once it is within a screen of
 *     the viewport. Six films requested on first paint is most of a phone's
 *     data budget spent on things the reader may never reach.
 *  3. NOTHING PLAYS OFF SCREEN. Decoding pauses the moment a film leaves the
 *     viewport. The shots are near a viewport tall each, so at most two are
 *     ever decoding — which is the point of making them that big.
 *  4. NOTHING MAKES A SOUND. `muted` is not negotiable here; it is also what
 *     buys autoplay at all, and `playsInline` is what stops iOS hijacking the
 *     page into its fullscreen player the moment the reader scrolls past.
 *
 * Under `prefers-reduced-motion` the film is never fetched: a still of the
 * product running is rendered in its place, and the reader pays for one image
 * instead of a video they were never going to be shown.
 */
export function ProductFilm({
  src,
  /**
   * The film's OWN first frame, held while the file downloads. It has to be the
   * frame playback will actually begin on or the picture jumps the moment it
   * starts — DRK opens on two seconds of brand animation, and a poster of its
   * console would show the console, cut to black, and arrive back at the
   * console: a title card read as a glitch.
   */
  poster,
  /**
   * A populated frame from the middle, shown INSTEAD of the film under reduced
   * motion. That reader gets exactly one image out of this shot and it has to
   * be the product running, not whatever the recording happened to open on.
   */
  still,
  alt,
  /** Only the first film in the act is anywhere near the fold. */
  priority = false,
  /** How the frame is cropped. Set where a shot deliberately favours one edge. */
  position = "center",
  sizes = "(min-width: 1024px) 100vw, 100vw",
}: {
  src: string;
  poster: string;
  still: string;
  alt: string;
  priority?: boolean;
  position?: string;
  sizes?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  /** Set once the film comes within a screen of the viewport. Gates the fetch. */
  const [near, setNear] = useState(priority);

  useEffect(() => {
    if (near || reduced) return;
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      // One full screen of warning, so the first frames are buffered before the
      // reader arrives and the film is already running when they get there.
      { rootMargin: "100% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [near, reduced]);

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
      { threshold: 0.05 },
    );

    observer.observe(video);
    return () => observer.disconnect();
    // `near` is a dependency because the source is attached only once it flips.
    // An observer created before that is watching an element with no `src`, and
    // intersection has to CHANGE for the callback to run again — for a film the
    // reader scrolled straight to, it may never. A fresh observer reports the
    // current intersection immediately.
  }, [reduced, near]);

  if (reduced) {
    return (
      <Image
        src={still}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={88}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      // The recording is the evidence, so it is described rather than hidden. A
      // video element takes no alt attribute; `aria-label` is what a screen
      // reader announces in its place.
      aria-label={alt}
      poster={poster}
      muted
      playsInline
      loop
      preload={near ? "auto" : "none"}
      src={near ? src : undefined}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: position }}
    />
  );
}
