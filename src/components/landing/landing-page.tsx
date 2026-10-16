"use client";

import { contact, programContent } from "@/data/program-content";
import type { Locale } from "@/types/program";
import { MotionProvider } from "@/components/landing/motion";
import { SiteHeader } from "@/components/landing/site-header";
import { HeroSection } from "@/components/landing/sections/hero-section";
import { AboutSection } from "@/components/landing/sections/about-section";
import { IncomeSection } from "@/components/landing/sections/income-section";
import { BenefitsSection } from "@/components/landing/sections/benefits-section";
import { TimelineSection } from "@/components/landing/sections/timeline-section";
import { OutcomesSection } from "@/components/landing/sections/outcomes-section";
import { AmbassadorsSection } from "@/components/landing/sections/ambassadors-section";
import { GallerySection } from "@/components/landing/sections/gallery-section";
import { CompaniesSection } from "@/components/landing/sections/companies-section";
import { FaqSection } from "@/components/landing/sections/faq-section";
import { FinalCtaSection } from "@/components/landing/sections/final-cta-section";
import { FloatingActions } from "@/components/landing/floating-actions";
import { Mark } from "@/components/brand/mark";

export function LandingPage() {
  const locale: Locale = "id";

  return (
    <MotionProvider>
      <div className="ts-root relative overflow-x-clip">
        <SiteHeader
          locale={locale}
          brand={programContent.brand}
          navItems={programContent.nav}
        />

        <main>
          <HeroSection
            locale={locale}
            content={programContent.hero}
            galleryItems={programContent.gallery.items}
          />
          <AboutSection locale={locale} content={programContent.about} />
          <IncomeSection locale={locale} content={programContent.income} />
          <BenefitsSection locale={locale} content={programContent.benefits} />
          <TimelineSection locale={locale} content={programContent.timeline} />
          <OutcomesSection
            locale={locale}
            content={programContent.outcomes}
            ambassadors={programContent.ambassadors.items}
          />
          <AmbassadorsSection locale={locale} content={programContent.ambassadors} />
          <GallerySection locale={locale} content={programContent.gallery} />
          <CompaniesSection locale={locale} />
          <FaqSection locale={locale} content={programContent.faq} />
          <FinalCtaSection
            locale={locale}
            ctaContent={programContent.finalCta}
            formContent={programContent.form}
            facts={programContent.hero.facts}
          />
        </main>

        <FloatingActions
          registerTitle={programContent.form.title[locale]}
          registerHint="Gratis · tanpa biaya daftar"
          registerLabel="Daftar"
        />

        <footer className="ts-footer">
          <div className="ts-footer__inner">
            <div className="ts-footer__about">
              <p className="ts-footer__brand">
                <Mark />
                topstar
              </p>
              <p>
                Duta Teladan Universitas STEKOM — program resmi pengembangan content creator untuk
                personal branding dan pertumbuhan akun.
              </p>
            </div>

            <div>
              <h4>Jelajahi</h4>
              <ul className="lp-footer-links">
                {programContent.nav.map((item) => (
                  <li key={item.id}>
                    <a href={item.href}>{item.label[locale]}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Kontak</h4>
              <ul>
                <li>
                  Universitas STEKOM
                  <br />
                  Jl. Majapahit 605, Pedurungan, Kota Semarang, Jawa Tengah 50192
                </li>
                <li>
                  <a href={contact.whatsappLink} target="_blank" rel="noreferrer">
                    WhatsApp {contact.whatsappDisplay}
                  </a>
                </li>
                <li>
                  <a href={contact.instagramLink} target="_blank" rel="noreferrer">
                    Instagram {contact.instagramHandle}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="ts-footer__bottom">© 2026 Duta Teladan Universitas STEKOM.</div>
        </footer>
      </div>
    </MotionProvider>
  );
}
