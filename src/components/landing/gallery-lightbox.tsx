"use client";

import Image from "next/image";

import { t } from "@/data/program-content";
import type { GalleryItem, Locale } from "@/types/program";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface GalleryLightboxProps {
  locale: Locale;
  items: GalleryItem[];
  openIndex: number | null;
  onOpenChange: (nextIndex: number | null) => void;
}

export function GalleryLightbox({
  locale,
  items,
  openIndex,
  onOpenChange,
}: GalleryLightboxProps) {
  const activeItem = openIndex !== null ? items[openIndex] : null;

  const move = (direction: "prev" | "next") => {
    if (openIndex === null) return;

    const offset = direction === "next" ? 1 : -1;
    const nextIndex = (openIndex + offset + items.length) % items.length;
    onOpenChange(nextIndex);
  };

  return (
    <Dialog
      open={openIndex !== null}
      onOpenChange={(open) => {
        if (!open) onOpenChange(null);
      }}
    >
      {activeItem && (
        <DialogContent className="max-w-4xl gap-4 rounded-[var(--radius-xl)] border-[var(--line)] bg-[var(--surface-raised)] p-4 sm:max-w-4xl sm:p-6">
          <DialogTitle className="sr-only">{t(activeItem.title, locale)}</DialogTitle>
          <DialogDescription className="sr-only">
            {t(activeItem.alt, locale)}
          </DialogDescription>

          <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-soft)]">
            <Image
              src={activeItem.src}
              alt={t(activeItem.alt, locale)}
              width={activeItem.width}
              height={activeItem.height}
              className="h-auto w-full object-cover"
              priority={false}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="ts-small">
              {t(activeItem.title, locale)}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="lp-icon-btn"
                onClick={() => move("prev")}
                aria-label={locale === "id" ? "Foto sebelumnya" : "Previous photo"}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                className="lp-icon-btn"
                onClick={() => move("next")}
                aria-label={locale === "id" ? "Foto berikutnya" : "Next photo"}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
