"use client";

import { t } from "@/data/program-content";
import type { Locale, ProgramContent } from "@/types/program";
import { Icon, type IconName } from "@/components/brand/icons";
import { Pita } from "@/components/brand/mark";
import { FadeInUp, StaggerGroup, StaggerItem } from "@/components/landing/motion";
import { SectionShell } from "@/components/landing/section-shell";
import { VideoFrame } from "@/components/landing/video-frame";

const aboutIcons: IconName[] = ["video", "jadwal", "sertifikat"];

interface AboutSectionProps {
  locale: Locale;
  content: ProgramContent["about"];
}

export function AboutSection({ locale, content }: AboutSectionProps) {
  return (
    <SectionShell
      id="tentang"
      soft
      eyebrow={t(content.eyebrow, locale)}
      title={t(content.title, locale)}
      description={t(content.description, locale)}
    >
      <StaggerGroup className="grid gap-6 md:grid-cols-3">
        {content.highlights.map((item, index) => (
          <StaggerItem key={item.id}>
            <article className="lp-feature">
              <span className="lp-feature__icon">
                <Icon name={aboutIcons[index % aboutIcons.length]} size="lg" />
              </span>
              <h3 className="ts-h3">{t(item.title, locale)}</h3>
              <p className="ts-small">{t(item.description, locale)}</p>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <FadeInUp className="lp-video">
        <div className="lp-video__copy">
          <p className="ts-overline">
            <Pita />
            {locale === "id" ? "Video profil" : "Profile video"}
          </p>
          <h3 className="ts-h2">
            {locale === "id"
              ? "Kenalan dulu dengan Duta Teladan Universitas STEKOM."
              : "Meet Duta Teladan Universitas STEKOM."}
          </h3>
          <p className="ts-small">
            {locale === "id"
              ? "Program ini gratis untuk peserta. Kamu dapat pelatihan intensif, lalu berpeluang mendapat uang saku dan bonus performa dari evaluasi berkala."
              : "The program is free for participants. You get intensive training and the chance to earn a stipend and performance bonuses from regular evaluations."}
          </p>
        </div>

        <VideoFrame
          envUrl={process.env.NEXT_PUBLIC_TRAINING_VIDEO_URL}
          configKey="trainingVideoUrl"
          provider="drive"
          title="Video profil Duta Teladan Universitas STEKOM"
          caption="Workshop content creator"
          subcaption="Universitas STEKOM × Duta Teladan"
          posterSrc="/images/gallery/kampus.jpeg"
          playLabel={locale === "id" ? "Putar video" : "Play video"}
          emptyText={
            locale === "id"
              ? "Link video belum diatur. Tambahkan NEXT_PUBLIC_TRAINING_VIDEO_URL."
              : "Video link not set. Add NEXT_PUBLIC_TRAINING_VIDEO_URL."
          }
        />
      </FadeInUp>
    </SectionShell>
  );
}
