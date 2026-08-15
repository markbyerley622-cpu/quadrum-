"use client";

import { useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef } from "react";
import {
  blendPlacement,
  buildLattice,
  clamp01,
  lerp,
  orderAt,
  orderAtAnchor,
  PLACEMENTS,
  smoothstep,
  type Placement,
  type PlacementName,
} from "@/lib/lattice";

/**
 * The system lattice.
 *
 * One object, one canvas, the whole page. It begins as a drifting cloud of
 * unconnected points tangled by arbitrary dependencies, and resolves — driven
 * entirely by scroll position — into an ordered architectural lattice.
 *
 * Why a fixed 2D canvas rather than WebGL:
 *  - 60 points and ~175 hairlines is nothing; this runs at frame rate on a
 *    phone and costs no dependency.
 *  - Hairline strokes in ink are the page's existing visual language. A
 *    refractive glass sphere would belong to a different site.
 *
 * Layering: this sits at z-0. Section surfaces are painted by `-z-10` children
 * so the object floats above the surface but below all content, which sits at
 * `z-10`. See components/primitives/Section.tsx.
 */

const INK = [20, 19, 15] as const;
const BONE = [237, 234, 226] as const;
const ACCENT = [176, 73, 42] as const;
const ACCENT_SOFT = [201, 113, 79] as const;

/** Perspective distance. Larger = flatter. */
const FOV = 3.4;

/** Softness of the ink→bone transition at a surface boundary, in px. */
const FEATHER = 30;

export function Lattice() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const { nodes, ordered, chaotic } = buildLattice();
    const count = nodes.length;

    // Projected positions, reused every frame — no per-frame allocation.
    const px = new Float32Array(count);
    const py = new Float32Array(count);
    const pd = new Float32Array(count);

    let width = 0;
    let height = 0;

    /** Document-space ranges of the dark surfaces. */
    let darkRanges: Array<[number, number]> = [];

    /** Document-space ranges of the acts, with the placement each one asks for. */
    let zones: Array<{ top: number; bottom: number; placement: Placement }> = [];

    /**
     * Document-space range of the act the ordering curve is measured against —
     * the turn. See `orderAtAnchor`.
     */
    let orderRange: [number, number] | null = null;

    function measure() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const scrollTop = window.scrollY;

      darkRanges = Array.from(
        document.querySelectorAll<HTMLElement>('[data-tone="dark"]'),
      ).map((el) => {
        const r = el.getBoundingClientRect();
        return [r.top + scrollTop, r.bottom + scrollTop] as [number, number];
      });

      zones = Array.from(
        document.querySelectorAll<HTMLElement>("[data-lattice]"),
      )
        .map((el) => {
          const r = el.getBoundingClientRect();
          const name = el.dataset.lattice as PlacementName;
          return {
            top: r.top + scrollTop,
            bottom: r.bottom + scrollTop,
            placement: PLACEMENTS[name] ?? PLACEMENTS.quietRight,
          };
        })
        .sort((a, b) => a.top - b.top);

      const anchor = document.querySelector<HTMLElement>("[data-order-anchor]");
      if (anchor) {
        const r = anchor.getBoundingClientRect();
        orderRange = [r.top + scrollTop, r.bottom + scrollTop];
      } else {
        orderRange = null;
      }
    }

    /**
     * Resolve the placement for the current scroll position.
     *
     * Inside a zone the object sits exactly where that act asked for it. Within
     * a feather band at each edge it blends halfway to the neighbouring zone,
     * so it is exactly between the two placements at the boundary itself and
     * the motion is continuous in both directions.
     */
    function resolvePlacement(): Placement {
      if (zones.length === 0) return PLACEMENTS.quietRight;

      const y = window.scrollY + height / 2;

      let i = zones.findIndex((z) => y >= z.top && y <= z.bottom);
      if (i === -1) i = y < zones[0].top ? 0 : zones.length - 1;

      const zone = zones[i];
      const feather = Math.min(height * 0.6, (zone.bottom - zone.top) * 0.4);
      if (feather <= 0) return zone.placement;

      if (y < zone.top + feather && i > 0) {
        const t = 0.5 + 0.5 * clamp01((y - zone.top) / feather);
        return blendPlacement(zones[i - 1].placement, zone.placement, t);
      }
      if (y > zone.bottom - feather && i < zones.length - 1) {
        const t = 0.5 + 0.5 * clamp01((zone.bottom - y) / feather);
        return blendPlacement(zones[i + 1].placement, zone.placement, t);
      }
      return zone.placement;
    }

    /**
     * Tone is resolved per drawn primitive, not once per frame.
     *
     * The object regularly straddles a surface boundary — a single global tone
     * would leave half of it invisible, drawn in ink on the dark side. Each
     * line and point instead asks what surface *it* is over, and the answer is
     * feathered across the edge so nothing pops.
     */
    let screenRanges: Array<[number, number]> = [];

    /**
     * True while the whole page is dark. Read once per frame from the root
     * element, which is where the theme lives.
     *
     * Under the dark theme the surface question this function exists to answer
     * has one answer everywhere: the page is dark, the inverted sections are
     * darker, and ink hairlines would be invisible on both. So the object draws
     * in bone throughout, and the accent takes its softened tint — the same
     * decision the dark sections have always made, applied to the page.
     */
    let inverted = false;

    function toneAtY(y: number) {
      if (inverted) return 1;
      let t = 0;
      for (let i = 0; i < screenRanges.length; i++) {
        const [top, bottom] = screenRanges[i];
        if (y < top - FEATHER || y > bottom + FEATHER) continue;
        const enter = smoothstep(top - FEATHER, top + FEATHER, y);
        const exit = 1 - smoothstep(bottom - FEATHER, bottom + FEATHER, y);
        const v = Math.min(enter, exit);
        if (v > t) t = v;
      }
      return t;
    }

    const shade = (y: number, a: number) => {
      const t = toneAtY(y);
      return `rgba(${Math.round(lerp(INK[0], BONE[0], t))},${Math.round(
        lerp(INK[1], BONE[1], t),
      )},${Math.round(lerp(INK[2], BONE[2], t))},${a})`;
    };

    const accentShade = (y: number, a: number) => {
      const t = toneAtY(y);
      return `rgba(${Math.round(lerp(ACCENT[0], ACCENT_SOFT[0], t))},${Math.round(
        lerp(ACCENT[1], ACCENT_SOFT[1], t),
      )},${Math.round(lerp(ACCENT[2], ACCENT_SOFT[2], t))},${a})`;
    };

    function render(time: number, forcedProgress?: number) {
      inverted = document.documentElement.dataset.theme === "dark";
      const p = forcedProgress ?? clamp01(scrollYProgress.get());
      // The camera and the rotation ride the whole document; how *ordered* the
      // object is rides the turn specifically, so that acts can be added
      // anywhere without dragging the resolution out from under it.
      const order =
        forcedProgress !== undefined || !orderRange
          ? orderAt(p)
          : orderAtAnchor(window.scrollY + height / 2, orderRange[0], orderRange[1]);
      const cam = resolvePlacement();

      const scrollTop = window.scrollY;
      screenRanges = darkRanges.map(
        ([top, bottom]) => [top - scrollTop, bottom - scrollTop] as [number, number],
      );

      // Narrow viewports have no side margin to put the object in — the text
      // spans the full width — so it sits centred, smaller, and much fainter.
      // At that opacity it is a texture behind the page rather than an object
      // beside it, which is the correct trade at that size.
      const narrow = width < 768;
      const centreX = narrow ? width * 0.5 : width * cam.cx;
      const centreY = height * (narrow ? 0.46 : cam.cy);
      const scale = Math.min(width, height) * cam.s * (narrow ? 0.85 : 1);
      // The points. 0.26 rather than the 0.22 this ran at, so a node is never
      // fainter than the lines arriving at it — a dot dimmer than its own
      // connections reads as a smudge on the paper rather than as a joint.
      const alpha = cam.a * (narrow ? 0.26 : 1);

      /**
       * Lines are faded LESS than points on a phone, and that asymmetry is the
       * fix for the one thing this object did wrong at that size.
       *
       * Everything used to be scaled by a single narrow factor. But a point is
       * drawn at up to 65% alpha and a connection at 30% of it, so knocking
       * both down by the same 0.22 took the points to something still visible
       * and the lines to roughly 0.06 — under the cutoff for anything at depth.
       * The object arrived on a phone as a field of loose dots: the structure
       * was being drawn and could not be seen, which is precisely the opposite
       * of what the thing is about. Holding the lines much higher costs no
       * legibility — a hairline at 6% ink over paper is a texture either way —
       * and the points read as connected because they are.
       *
       * The ratio is what matters here, not the absolute number: roughly twice
       * the points. Both were dialled back a step after the first pass, because
       * a phone has no side margin to put this object in — it sits over the
       * copy, and at full strength it was arguing with it.
       */
      const lineAlpha = cam.a * (narrow ? 0.5 : 1);

      // Rotation: a slow constant turn plus a scroll-driven sweep, so the
      // object is never static but never spins for the sake of it.
      const t = time * 0.001;
      const rotY = t * 0.06 + p * Math.PI * 1.15;
      const rotX = -0.3 + Math.sin(t * 0.11) * 0.05 + p * 0.22;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Drift dies away as the object orders itself.
      const drift = 1 - order;

      for (let i = 0; i < count; i++) {
        const n = nodes[i];
        const wobble = drift * n.amp;
        const x0 =
          lerp(n.cx, n.ox, order) + Math.sin(t * n.speed + n.phase) * wobble;
        const y0 =
          lerp(n.cy, n.oy, order) +
          Math.cos(t * n.speed * 0.9 + n.phase) * wobble;
        const z0 =
          lerp(n.cz, n.oz, order) +
          Math.sin(t * n.speed * 0.7 + n.phase * 1.7) * wobble;

        const x1 = x0 * cosY - z0 * sinY;
        const z1 = x0 * sinY + z0 * cosY;
        const y1 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        const persp = FOV / (FOV + z2);
        px[i] = centreX + x1 * persp * scale;
        py[i] = centreY + y1 * persp * scale;
        pd[i] = persp;
      }

      ctx!.clearRect(0, 0, width, height);
      ctx!.lineCap = "round";
      ctx!.lineWidth = 1;

      // --- Tangled dependencies. Present at the start, gone by the end. ----
      const chaosAlpha = Math.pow(1 - order, 1.5);
      if (chaosAlpha > 0.004) {
        for (const e of chaotic) {
          const depth = (pd[e.a] + pd[e.b]) * 0.5;
          const a = chaosAlpha * lineAlpha * 0.13 * depth;
          if (a < 0.004) continue;
          const my = (py[e.a] + py[e.b]) * 0.5;
          ctx!.strokeStyle = e.accent ? accentShade(my, a * 1.8) : shade(my, a);
          ctx!.beginPath();
          ctx!.moveTo(px[e.a], py[e.a]);
          ctx!.lineTo(px[e.b], py[e.b]);
          ctx!.stroke();
        }
      }

      // --- Structure. Absent at the start, the whole object by the end. ----
      const orderAlpha = Math.pow(order, 1.35);
      if (orderAlpha > 0.004) {
        for (const e of ordered) {
          const depth = (pd[e.a] + pd[e.b]) * 0.5;
          const a = orderAlpha * lineAlpha * 0.3 * depth * depth;
          if (a < 0.004) continue;
          const my = (py[e.a] + py[e.b]) * 0.5;
          ctx!.strokeStyle = shade(my, a);
          ctx!.beginPath();
          ctx!.moveTo(px[e.a], py[e.a]);
          ctx!.lineTo(px[e.b], py[e.b]);
          ctx!.stroke();
        }
      }

      // --- The points themselves -------------------------------------------
      for (let i = 0; i < count; i++) {
        const depth = pd[i];
        const n = nodes[i];
        const r = (0.8 + depth * 1.25) * (1 + order * 0.25);
        // Accent resolves late — the decisions only read as decisive once the
        // structure around them exists.
        const isAccent = n.accent && order > 0.3;
        const a = alpha * (0.2 + depth * 0.45) * (isAccent ? 1 : 0.85);

        ctx!.fillStyle = isAccent
          ? accentShade(
              py[i],
              Math.min(1, a * smoothstep(0.3, 0.75, order) * 1.6),
            )
          : shade(py[i], a);
        ctx!.beginPath();
        ctx!.arc(px[i], py[i], r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    // ---- Reduced motion: draw the finished structure once, and stop. ------
    if (reduced) {
      const draw = () => {
        measure();
        render(0, 1);
      };
      draw();
      window.addEventListener("resize", draw);
      // Nothing else redraws this canvas for a reader who has asked for no
      // motion, so a theme flip would leave the object in the previous theme's
      // ink until the next resize. One observer, one redraw.
      const themed = new MutationObserver(draw);
      themed.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      return () => {
        window.removeEventListener("resize", draw);
        themed.disconnect();
      };
    }

    let frame = 0;
    let running = true;

    function loop(time: number) {
      if (!running) return;
      render(time);
      frame = requestAnimationFrame(loop);
    }

    measure();
    frame = requestAnimationFrame(loop);

    // Re-measure once fonts and layout settle, so the dark-surface ranges come
    // from the final layout rather than the first paint.
    const settle = window.setTimeout(measure, 700);

    const onResize = () => measure();
    const onVisibility = () => {
      if (document.hidden && running) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!document.hidden && !running) {
        running = true;
        frame = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, scrollYProgress]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
