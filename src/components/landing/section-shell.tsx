import { cn } from "@/lib/utils";
import { Pita } from "@/components/brand/mark";

interface SectionShellProps {
  id: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** surface-soft band; sections alternate */
  soft?: boolean;
  centered?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface SectionHeadProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  centered?: boolean;
}

export function SectionHead({ eyebrow, title, description, centered = false }: SectionHeadProps) {
  return (
    <header className={cn("ts-section-head", centered && "ts-section-head--center")}>
      {eyebrow && (
        <p className="ts-overline">
          <Pita />
          {eyebrow}
        </p>
      )}
      {title && <h2 className="ts-h1">{title}</h2>}
      {description && <p className="ts-lead">{description}</p>}
    </header>
  );
}

/** Topstar section: overline with the pita, h1, optional lead, then content space-8 below. */
export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  soft = false,
  centered = false,
  className,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className={cn("ts-section", soft && "ts-section--soft", className)}>
      <div className="ts-container">
        {(eyebrow || title || description) && (
          <SectionHead eyebrow={eyebrow} title={title} description={description} centered={centered} />
        )}

        {children}
      </div>
    </section>
  );
}
