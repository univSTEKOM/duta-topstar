"use client";

import { t } from "@/data/program-content";
import type { Locale, ProgramContent } from "@/types/program";
import { Pita } from "@/components/brand/mark";
import { SectionShell } from "@/components/landing/section-shell";
import { VideoFrame } from "@/components/landing/video-frame";

interface TrainingSectionProps {
  locale: Locale;
  content: ProgramContent["training"];
}

export function TrainingSection({ locale, content }: TrainingSectionProps) {
  return (
    <SectionShell
      id="pelajari"
      eyebrow={t(content.eyebrow, locale)}
      title={t(content.title, locale)}
      description={t(content.description, locale)}
    >
      <div className="lp-video mt-0">
        <div className="lp-video__copy">
          <p className="ts-overline">
            <Pita />
            {locale === "id" ? "Video materi" : "Training video"}
          </p>
          <h3 className="ts-h2">
            {locale === "id"
              ? "Tonton materi inti langsung dari Universitas STEKOM."
              : "Watch the core training directly from Universitas STEKOM."}
          </h3>
          <p className="ts-small">
            {locale === "id"
              ? "Video ini merangkum kurikulum utama yang akan kamu pelajari selama program berlangsung."
              : "This video summarizes the main curriculum you will learn throughout the program."}
          </p>
        </div>

        <VideoFrame
          envUrl={process.env.NEXT_PUBLIC_TRAINING_VIDEO_URL}
          configKey="trainingVideoUrl"
          provider="drive"
          title="Materi Duta Teladan Universitas STEKOM"
          caption={locale === "id" ? "Materi inti program" : "Core training"}
          subcaption="Universitas STEKOM"
          posterSrc="/images/gallery/kampus.jpeg"
          playLabel={locale === "id" ? "Putar video" : "Play video"}
          emptyText={
            locale === "id"
              ? "Link video belum diatur. Tambahkan NEXT_PUBLIC_TRAINING_VIDEO_URL."
              : "Video link not set. Add NEXT_PUBLIC_TRAINING_VIDEO_URL."
          }
        />
      </div>
    </SectionShell>
  );
}
