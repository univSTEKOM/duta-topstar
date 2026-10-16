"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { t } from "@/data/program-content";
import { cn } from "@/lib/utils";
import type { Locale, ProgramContent } from "@/types/program";
import { FadeInUp } from "@/components/landing/motion";
import { SectionShell } from "@/components/landing/section-shell";

const DynamicGalleryLightbox = dynamic(
  () =>
    import("@/components/landing/gallery-lightbox").then(
      (module) => module.GalleryLightbox,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

// Four columns × three rows: one wide+tall lead photo, then tiles that fill the grid exactly.
const tileLayout = [
  "ts-gallery__item--wide ts-gallery__item--tall",
  "",
  "",
  "ts-gallery__item--wide",
  "ts-gallery__item--wide",
  "ts-gallery__item--wide",
];

interface GallerySectionProps {
  locale: Locale;
  content: ProgramContent["gallery"];
}

export function GallerySection({ locale, content }: GallerySectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openLabel = locale === "id" ? "Buka foto" : "Open photo";

  return (
    <SectionShell
      id="galeri"
      soft
      eyebrow={t(content.eyebrow, locale)}
      title={t(content.title, locale)}
      description={t(content.description, locale)}
    >
      <FadeInUp>
        <div className="ts-gallery lp-gallery">
          {content.items.map((item, index) => (
            <figure key={item.id} className={cn("ts-gallery__item", tileLayout[index] ?? "")}>
              <button
                type="button"
                className="lp-gallery__btn"
                onClick={() => setOpenIndex(index)}
                aria-label={`${openLabel}: ${t(item.title, locale)}`}
              >
                <Image
                  src={item.src}
                  alt={t(item.alt, locale)}
                  width={item.width}
                  height={item.height}
                  sizes={index === 0 ? "(max-width: 767px) 100vw, 600px" : "(max-width: 767px) 50vw, 300px"}
                  loading="lazy"
                />
              </button>
              <figcaption>{t(item.title, locale)}</figcaption>
            </figure>
          ))}
        </div>
      </FadeInUp>

      <DynamicGalleryLightbox
        locale={locale}
        items={content.items}
        openIndex={openIndex}
        onOpenChange={setOpenIndex}
      />
    </SectionShell>
  );
}
