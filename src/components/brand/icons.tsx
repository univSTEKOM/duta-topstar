import { cn } from "@/lib/utils";

/* Topstar icon set: 2px line on a 24px grid in currentColor, round caps and joins,
   exactly one filled accent in a role colour (a play triangle where possible).
   Paths copied from topstar-design-system/components/Icon; "lokasi" is new and
   drawn to the same rules. */

export type IconName =
  | "video"
  | "kamera"
  | "mikrofon"
  | "sunting"
  | "jadwal"
  | "sertifikat"
  | "komunitas"
  | "pesan"
  | "lokasi";

const accent = (colour: string) => ({ fill: `var(--${colour})`, stroke: `var(--${colour})` });

const ICONS: Record<IconName, React.ReactNode> = {
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="3" />
      <path d="M16 10.5 21 7.5v9l-5-3" style={accent("biru")} />
    </>
  ),
  kamera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="3" />
      <path d="M8.5 7 10 4h4l1.5 3" />
      <circle cx="12" cy="13.5" r="3.5" style={accent("pink")} />
    </>
  ),
  mikrofon: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" style={accent("ungu")} />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </>
  ),
  sunting: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="m13 7 4 4" style={{ stroke: "var(--kuning)" }} />
      <path d="M4 20h4l-4-4z" style={accent("kuning")} />
    </>
  ),
  jadwal: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="m10 13 4 2.5-4 2.5z" style={accent("hijau")} />
    </>
  ),
  sertifikat: (
    <>
      <circle cx="12" cy="9" r="5" style={accent("kuning")} />
      <path d="M9 13.5 8 21l4-2 4 2-1-7.5" />
    </>
  ),
  komunitas: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" style={accent("biru")} />
      <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15.5 14.5c3 0 5.5 2 5.5 5" />
    </>
  ),
  pesan: (
    <>
      <path d="M4 5h16v11H9l-5 4z" />
      <circle cx="9" cy="10.5" r="1.2" style={accent("pink")} />
      <circle cx="12.5" cy="10.5" r="1.2" style={accent("pink")} />
      <circle cx="16" cy="10.5" r="1.2" style={accent("pink")} />
    </>
  ),
  lokasi: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <path d="m10.5 7.2 4 2.3-4 2.3z" style={accent("hijau")} />
    </>
  ),
};

interface IconProps {
  name: IconName;
  size?: "sm" | "md" | "default" | "lg";
  className?: string;
}

export function Icon({ name, size = "default", className }: IconProps) {
  return (
    <svg
      className={cn("ts-icon", size !== "default" && `ts-icon--${size}`, className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/** Trailing arrow for buttons; nudges right on hover via .ts-btn svg. */
export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** A single rounded play triangle in a flat colour. */
export function PlayTriangle({ className, colour = "on-dark" }: { className?: string; colour?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path
        d="M30 18 L82 50 L30 82 Z"
        style={{ fill: `var(--${colour})`, stroke: `var(--${colour})` }}
        strokeWidth={14}
        strokeLinejoin="round"
      />
    </svg>
  );
}
