"use client";

import { contact, t } from "@/data/program-content";
import type { Locale, ProgramContent } from "@/types/program";
import { ArrowIcon } from "@/components/brand/icons";
import { FadeInUp } from "@/components/landing/motion";
import { SectionHead, SectionShell } from "@/components/landing/section-shell";

interface FaqSectionProps {
  locale: Locale;
  content: ProgramContent["faq"];
}

export function FaqSection({ locale, content }: FaqSectionProps) {
  return (
    <SectionShell id="faq" soft>
      <div className="lp-faq">
        <div className="lp-faq__aside">
          <SectionHead
            eyebrow={t(content.eyebrow, locale)}
            title={t(content.title, locale)}
            description={t(content.description, locale)}
          />

          <div className="lp-help">
            <h3 className="ts-h3">
              {locale === "id" ? "Masih ada pertanyaan?" : "Still have questions?"}
            </h3>
            <p className="ts-small">
              {locale === "id"
                ? "Tanya langsung ke tim program lewat WhatsApp."
                : "Ask the program team directly on WhatsApp."}
            </p>
            <a className="ts-btn ts-btn--secondary ts-btn--sm" href={contact.whatsappLink} target="_blank" rel="noreferrer">
              {locale === "id" ? "Chat WhatsApp" : "Chat on WhatsApp"}
              <ArrowIcon />
            </a>
          </div>
        </div>

        <FadeInUp>
          {/* Native details/summary: works without JS, the first item starts open. */}
          <div className="ts-accordion">
            {content.items.map((faqItem, index) => (
              <details key={faqItem.id} className="ts-accordion__item" open={index === 0}>
                <summary className="ts-accordion__header">
                  {t(faqItem.question, locale)}
                  <span className="ts-accordion__icon" aria-hidden="true">
                    <svg viewBox="0 0 12 12">
                      <path d="M6 1v10M1 6h10" />
                    </svg>
                  </span>
                </summary>
                <div className="ts-accordion__area">
                  <p>{t(faqItem.answer, locale)}</p>
                </div>
              </details>
            ))}
          </div>
        </FadeInUp>
      </div>
    </SectionShell>
  );
}
