"use client";

import { t } from "@/data/program-content";
import type { Locale, ProgramContent } from "@/types/program";
import { cn } from "@/lib/utils";
import { FadeInUp, StaggerGroup, StaggerItem } from "@/components/landing/motion";
import { SectionShell } from "@/components/landing/section-shell";

interface IncomeSectionProps {
  locale: Locale;
  content: ProgramContent["income"];
}

export function IncomeSection({ locale, content }: IncomeSectionProps) {
  return (
    <SectionShell
      id="penghasilan"
      eyebrow={t(content.eyebrow, locale)}
      title={t(content.title, locale)}
      description={t(content.description, locale)}
    >
      <FadeInUp>
        <p className="lp-statement">{t(content.statement, locale)}</p>
      </FadeInUp>

      {/* Figures are words, not amounts: the stipend depends on each period's evaluation. */}
      <StaggerGroup className="lp-stat-grid grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {content.metrics.map((metric, index) => (
          <StaggerItem key={metric.id} className="h-full">
            <div className={cn("ts-stat h-full", index === 0 && "ts-stat--highlight")}>
              <span className="ts-stat__value">{t(metric.stat, locale)}</span>
              <h3 className="ts-h3">{t(metric.label, locale)}</h3>
              <p className="ts-small">{t(metric.helper, locale)}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </SectionShell>
  );
}
