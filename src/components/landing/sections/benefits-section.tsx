"use client";

import { t } from "@/data/program-content";
import type { Locale, ProgramContent } from "@/types/program";
import { Icon, type IconName } from "@/components/brand/icons";
import { Pita } from "@/components/brand/mark";
import { FadeInUp, StaggerGroup, StaggerItem } from "@/components/landing/motion";
import { SectionShell } from "@/components/landing/section-shell";
import { VideoFrame } from "@/components/landing/video-frame";

// One icon per benefit, in content order: mentor, sertifikat, organisasi, branding,
// networking, portofolio, percaya diri, liburan.
const benefitIcons: IconName[] = [
  "pesan",
  "sertifikat",
  "jadwal",
  "kamera",
  "komunitas",
  "sunting",
  "mikrofon",
  "lokasi",
];

interface BenefitsSectionProps {
  locale: Locale;
  content: ProgramContent["benefits"];
}

export function BenefitsSection({ locale, content }: BenefitsSectionProps) {
  return (
    <SectionShell
      id="benefit"
      soft
      eyebrow={t(content.eyebrow, locale)}
      title={t(content.title, locale)}
      description={t(content.description, locale)}
    >
      <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.items.map((item, index) => (
          <StaggerItem key={item.id} className="h-full">
            <article className="lp-feature">
              <span className="lp-feature__icon">
                <Icon name={benefitIcons[index % benefitIcons.length]} size="lg" />
              </span>
              <h3 className="ts-h3">{t(item.title, locale)}</h3>
              <p className="ts-small">{t(item.description, locale)}</p>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <FadeInUp className="lp-video lp-video--full">
        <p className="ts-overline">
          <Pita />
          {locale === "id" ? "Video kegiatan" : "Activity video"}
        </p>
        <VideoFrame
          envUrl={process.env.NEXT_PUBLIC_BENEFITS_VIDEO_URL}
          configKey="benefitsVideoUrl"
          provider="youtube"
          title="Benefit program Duta Teladan Universitas STEKOM"
          caption={locale === "id" ? "Wisata edukasi 11 hari di Bali" : "11-day education trip to Bali"}
          subcaption="Universitas STEKOM"
          posterSrc="/images/gallery/Behind%20the%20Scene.jpeg"
          playLabel={locale === "id" ? "Putar video" : "Play video"}
          emptyText={
            locale === "id"
              ? "Link video belum diatur. Tambahkan NEXT_PUBLIC_BENEFITS_VIDEO_URL."
              : "Video link not set. Add NEXT_PUBLIC_BENEFITS_VIDEO_URL."
          }
        />
      </FadeInUp>
    </SectionShell>
  );
}
