"use client";

import { t } from "@/data/program-content";
import type { Locale, ProgramContent } from "@/types/program";
import { openRegistration } from "@/lib/registration";
import { ArrowIcon } from "@/components/brand/icons";
import { FadeInUp } from "@/components/landing/motion";
import { SectionShell } from "@/components/landing/section-shell";

interface TimelineSectionProps {
  locale: Locale;
  content: ProgramContent["timeline"];
}

export function TimelineSection({ locale, content }: TimelineSectionProps) {
  return (
    <SectionShell
      id="alur"
      eyebrow={t(content.eyebrow, locale)}
      title={t(content.title, locale)}
      description={t(content.description, locale)}
    >
      <FadeInUp>
        {/* Numbers come from the CSS counter in .ts-steps */}
        <ol className="ts-steps lp-steps">
          {content.steps.map((step) => (
            <li key={step.id} className="ts-step">
              <h3 className="ts-h3">{t(step.title, locale)}</h3>
              <p className="ts-small">{t(step.description, locale)}</p>
            </li>
          ))}
        </ol>
      </FadeInUp>

      <FadeInUp className="lp-next" delay={0.1}>
        <div>
          <h3 className="ts-h3">
            {locale === "id" ? "Tahap 1 cuma isi formulir." : "Step 1 is just a form."}
          </h3>
          <p className="ts-small">
            {locale === "id"
              ? "Gratis dan bisa dari HP. Pendaftar terpilih dihubungi tim lewat WhatsApp untuk tahap seleksi."
              : "Free and works on your phone. Selected applicants are contacted on WhatsApp for selection."}
          </p>
        </div>
        <a className="ts-btn ts-btn--primary" href="#daftar" onClick={openRegistration}>
          {locale === "id" ? "Mulai tahap 1" : "Start step 1"}
          <ArrowIcon />
        </a>
      </FadeInUp>
    </SectionShell>
  );
}
