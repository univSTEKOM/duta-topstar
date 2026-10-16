"use client";

import Image from "next/image";

import { t } from "@/data/program-content";
import type { GalleryItem, Locale, ProgramContent } from "@/types/program";
import { Pita } from "@/components/brand/mark";
import { MarkPlayer } from "@/components/brand/mark-player";
import { ArrowIcon, PlayTriangle } from "@/components/brand/icons";
import { openRegistration } from "@/lib/registration";
import { FadeInUp } from "@/components/landing/motion";

interface HeroSectionProps {
  locale: Locale;
  content: ProgramContent["hero"];
  galleryItems: GalleryItem[];
}

export function HeroSection({ locale, content, galleryItems }: HeroSectionProps) {
  const heroPhoto = galleryItems[0];

  return (
    <section id="hero" className="ts-section lp-hero">
      <div className="ts-container">
        <div className="ts-hero">
          <FadeInUp className="ts-hero__copy">
            <p className="ts-overline">
              <Pita />
              {t(content.badge, locale)}
            </p>
            <h1 className="ts-display">{t(content.title, locale)}</h1>
            <p className="ts-lead">{t(content.subtitle, locale)}</p>

            <div className="ts-hero__actions">
              <a className="ts-btn ts-btn--accent ts-btn--lg" href="#daftar" onClick={openRegistration}>
                {t(content.primaryCta, locale)}
                <ArrowIcon />
              </a>
              <a className="ts-btn ts-btn--secondary ts-btn--lg" href="#tentang">
                {t(content.secondaryCta, locale)}
              </a>
            </div>

            <div className="ts-hero__facts lp-hero__facts">
              {content.facts.map((fact) => (
                <div key={fact.id}>
                  <b>{t(fact.value, locale)}</b>
                  <span className="ts-small">{t(fact.label, locale)}</span>
                </div>
              ))}
            </div>
          </FadeInUp>

          {heroPhoto && (
            <FadeInUp className="lp-hero__stage" delay={0.12}>
              <PlayTriangle className="lp-hero__sorotan" colour="biru" />
              <div className="ts-hero__media">
                <Image
                  src={heroPhoto.src}
                  alt={t(heroPhoto.alt, locale)}
                  width={heroPhoto.width}
                  height={heroPhoto.height}
                  sizes="(max-width: 900px) 100vw, 560px"
                  priority
                />
                <span className="lp-viewfinder" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className="ts-hero__badge ts-tag ts-tag--glass">
                  <span className="ts-dot" />
                  {t(heroPhoto.title, locale)}
                </span>
              </div>
              <div className="lp-hero__player">
                <MarkPlayer />
              </div>
            </FadeInUp>
          )}
        </div>
      </div>
    </section>
  );
}
