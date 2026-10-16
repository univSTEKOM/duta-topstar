"use client";

import { t } from "@/data/program-content";
import type { Locale, ProgramContent } from "@/types/program";
import { PlayTriangle } from "@/components/brand/icons";
import { FadeInUp } from "@/components/landing/motion";
import { ClientOnly } from "@/components/ui/client-only";
import { RegistrationForm } from "@/components/landing/registration-form";

interface FinalCtaSectionProps {
  locale: Locale;
  ctaContent: ProgramContent["finalCta"];
  formContent: ProgramContent["form"];
  facts: ProgramContent["hero"]["facts"];
}

export function FinalCtaSection({
  locale,
  ctaContent,
  formContent,
  facts,
}: FinalCtaSectionProps) {
  return (
    <section id="daftar" className="ts-section">
      <div className="ts-container">
        <FadeInUp>
          {/* One navy stage: the closing call and the registration panel together. */}
          <div className="ts-cta lp-cta">
            <div className="ts-cta__art" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="ts-cta__copy">
              <h2 className="ts-h1">{t(ctaContent.title, locale)}</h2>
              <p className="ts-lead">{t(ctaContent.subtitle, locale)}</p>
              <ul className="lp-cta__points">
                {facts.map((fact) => (
                  <li key={fact.id}>
                    <PlayTriangle colour="kuning" />
                    {t(fact.value, locale)} · {t(fact.label, locale).toLowerCase()}
                  </li>
                ))}
              </ul>
            </div>

            <div id="registration-form" className="relative z-1 scroll-mt-(--nav-height)">
              <ClientOnly
                fallback={
                  <div className="lp-register">
                    <p className="ts-small">Memuat formulir pendaftaran…</p>
                  </div>
                }
              >
                <RegistrationForm locale={locale} formContent={formContent} />
              </ClientOnly>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
