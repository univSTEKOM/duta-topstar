import { cn } from "@/lib/utils";

/** Five rounded play triangles, rotated 72° apart. Colour order is fixed: biru, kuning, pink, hijau, ungu. */
export const TRIANGLE_PATH = "M42 8 L64 22 L42 36 Z";
export const TRIANGLE_ORIGIN = [49.333, 22] as const;

export const MARK_COLOURS = ["var(--biru)", "var(--kuning)", "var(--pink)", "var(--hijau)", "var(--ungu)"] as const;

/** [x, y, rotation, scaleX, scaleY] per triangle, in mark order. */
export const LOGO_FORMATION: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [49.333, 22.0, 0, 1, 1],
  [78.326, 42.095, 72, 1, 1],
  [68.173, 75.879, 144, 1, 1],
  [32.906, 76.662, 216, 1, 1],
  [21.262, 43.364, 288, 1, 1],
];

export function triangleTransform([x, y, r, sx, sy]: readonly number[]) {
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r.toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(${-TRIANGLE_ORIGIN[0]} ${-TRIANGLE_ORIGIN[1]})`;
}

interface MarkProps {
  className?: string;
  /** colour on surface or navy; white on role colours and photos; navy for one-ink use */
  tone?: "colour" | "white" | "navy";
  title?: string;
}

export function Mark({ className, tone = "colour", title }: MarkProps) {
  const fillFor = (index: number) =>
    tone === "white" ? "#ffffff" : tone === "navy" ? "#0f172a" : MARK_COLOURS[index];

  return (
    <svg
      className={cn("ts-mark", className)}
      viewBox="0 0 100 100"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* drawn last-to-first so biru sits on top, as in the asset files */}
      {LOGO_FORMATION.map((state, index) => (
        <path
          key={index}
          d={TRIANGLE_PATH}
          transform={triangleTransform(state)}
          style={{ fill: fillFor(index), stroke: fillFor(index) }}
          strokeWidth={7}
          strokeLinejoin="round"
        />
      )).reverse()}
    </svg>
  );
}

/** Five small triangles in mark order, beside overlines and in lower thirds. */
export function Pita({ className }: { className?: string }) {
  return (
    <span className={cn("ts-pita", className)} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
