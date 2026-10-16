"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { MARK_COLOURS, TRIANGLE_PATH, triangleTransform } from "@/components/brand/mark";

/* The logo story from the brand book: play → logo → lensa → bintang → play.
   Same five triangles, moved as a group with 60ms stagger on the Alir curve,
   drifting slowly on the Hanyut curve while each formation holds. */

type Formation = "play" | "logo" | "lens" | "star";
type State = [number, number, number, number, number];

const STATES: Record<Formation, State[]> = {
  play: [
    [52, 52, 0, 1.5, 1.5],
    [52, 52, 0, 1.5, 1.5],
    [52, 52, 0, 1.5, 1.5],
    [52, 52, 0, 1.5, 1.5],
    [52, 52, 0, 1.5, 1.5],
  ],
  logo: [
    [49.333, 22.0, 0, 1, 1],
    [78.326, 42.095, 72, 1, 1],
    [68.173, 75.879, 144, 1, 1],
    [32.906, 76.662, 216, 1, 1],
    [21.262, 43.364, 288, 1, 1],
  ],
  lens: [
    [50.0, 32.0, -51, 1, 1],
    [69.021, 45.82, 21, 1, 1],
    [61.756, 68.18, 93, 1, 1],
    [38.244, 68.18, 165, 1, 1],
    [30.979, 45.82, 237, 1, 1],
  ],
  star: [
    [50.0, 25.484, -90, 1.35, 0.8],
    [75.218, 43.806, -18, 1.35, 0.8],
    [65.586, 73.452, 54, 1.35, 0.8],
    [34.414, 73.452, 126, 1.35, 0.8],
    [24.782, 43.806, 198, 1.35, 0.8],
  ],
};

const HOLD_DRIFT: Record<Formation, number> = { play: 0, logo: 8, lens: 24, star: 8 };
const SEQUENCE: Formation[] = ["play", "logo", "lens", "star"];

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const a = (p1: number, p2: number) => 1 - 3 * p2 + 3 * p1;
  const b = (p1: number, p2: number) => 3 * p2 - 6 * p1;
  const c = (p1: number) => 3 * p1;
  const calc = (t: number, p1: number, p2: number) => ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t;
  const slope = (t: number, p1: number, p2: number) => 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1);

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = slope(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      t -= (calc(t, x1, x2) - x) / s;
    }
    return calc(Math.min(1, Math.max(0, t)), y1, y2);
  };
}

const ALIR = bezier(0.45, 0, 0.2, 1);
const HANYUT = bezier(0.3, 0.1, 0.7, 0.9);

function rotateAroundCentre(x: number, y: number, degrees: number): [number, number] {
  const angle = (degrees * Math.PI) / 180;
  const dx = x - 50;
  const dy = y - 52;
  return [50 + dx * Math.cos(angle) - dy * Math.sin(angle), 52 + dx * Math.sin(angle) + dy * Math.cos(angle)];
}

interface MarkPlayerProps {
  className?: string;
  label?: string;
}

export function MarkPlayer({ className, label = "Animasi logo Topstar berganti formasi" }: MarkPlayerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = pathRefs.current;
    const current: State[] = STATES.play.map((state) => [...state] as State);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tweens: Array<{ i: number; from: State; to: State; start: number; dur: number; ease: (x: number) => number }> = [];
    let raf = 0;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let step = 0;
    let running = false;

    const apply = (i: number, value: State) => {
      current[i] = value;
      paths[i]?.setAttribute("transform", triangleTransform(value));
    };

    const loop = (now: number) => {
      tweens = tweens.filter((tw) => {
        const progress = (now - tw.start) / tw.dur;
        if (progress < 0) return true;
        const e = tw.ease(Math.min(progress, 1));
        apply(tw.i, tw.from.map((v, k) => v + (tw.to[k] - v) * e) as State);
        return progress < 1;
      });
      raf = tweens.length ? requestAnimationFrame(loop) : 0;
    };

    const set = (name: Formation, drift = 0, dur = 0, ease = ALIR, stagger = true) => {
      tweens = [];
      STATES[name].forEach((s, i) => {
        const [x, y] = drift ? rotateAroundCentre(s[0], s[1], drift) : [s[0], s[1]];
        let rotation = s[2] + drift;
        rotation += 360 * Math.round((current[i][2] - rotation) / 360);
        const to: State = [x, y, rotation, s[3], s[4]];

        if (reduce || !dur) {
          apply(i, to);
          return;
        }
        tweens.push({ i, from: [...current[i]] as State, to, start: performance.now() + (stagger ? i * 60 : 0), dur: dur * 1000, ease });
      });
      svg.classList.toggle("is-lens", name === "lens");
      if (tweens.length && !raf) raf = requestAnimationFrame(loop);
    };

    const later = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const next = () => {
      if (!running) return;
      const name = SEQUENCE[step % SEQUENCE.length];
      step += 1;
      set(name, 0, name === "play" ? 1.2 : 1.1);
      later(1350, () => {
        if (HOLD_DRIFT[name]) set(name, HOLD_DRIFT[name], 1.1, HANYUT, false);
      });
      later(name === "play" ? 2600 : 2450, next);
    };

    const start = () => {
      if (running) return;
      running = true;
      next();
    };

    const stop = () => {
      running = false;
      timers.forEach(clearTimeout);
      timers = [];
    };

    if (reduce) {
      set("logo");
      return;
    }

    set("logo");
    step = 1;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    observer.observe(svg);

    return () => {
      observer.disconnect();
      stop();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg ref={svgRef} className={cn("lp-player", className)} viewBox="0 0 100 100" role="img" aria-label={label}>
      <circle className="ring" cx="50" cy="52" r="41" fill="none" strokeWidth="2" />
      {[4, 3, 2, 1, 0].map((i) => (
        <path
          key={i}
          ref={(node) => {
            pathRefs.current[i] = node;
          }}
          d={TRIANGLE_PATH}
          transform={triangleTransform(STATES.logo[i])}
          style={{ fill: MARK_COLOURS[i], stroke: MARK_COLOURS[i] }}
          strokeWidth={7}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
