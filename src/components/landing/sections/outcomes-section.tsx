"use client";

import Image from "next/image";

import { t } from "@/data/program-content";
import type { Locale, ProgramContent } from "@/types/program";
import { StaggerGroup, StaggerItem } from "@/components/landing/motion";
import { SectionShell } from "@/components/landing/section-shell";

interface OutcomesSectionProps {
  locale: Locale;
  content: ProgramContent["outcomes"];
  ambassadors: ProgramContent["ambassadors"]["items"];
}

// Placeholder quotes, flagged as such in the section description. The brand book asks for
// real quotes from Duta, with consent: replace these before presenting them as genuine.
const placeholderQuotes = [
  "Program ini bikin aku lebih percaya diri tampil di depan kamera. Mentornya jelas, tugasnya terarah, dan hasilnya terasa di engagement.",
  "Aku ngerasa lebih siap masuk dunia digital. Konsisten bikin konten jadi kebiasaan, dan networking-nya juga luas.",
  "Dapet insight konten yang praktis, bukan cuma teori. Aku jadi paham cara bikin konten yang relevan buat audiens.",
  "Kegiatannya rapi, terstruktur, dan bikin portofolio aku makin kuat. Banyak exposure dan peluang kolaborasi.",
];

export function OutcomesSection({ locale, content, ambassadors }: OutcomesSectionProps) {
  const testimonials = ambassadors.slice(0, 4).map((ambassador, index) => ({
    ...ambassador,
    quote: placeholderQuotes[index % placeholderQuotes.length],
  }));

  return (
    <SectionShell
      id="testimoni"
      soft
      eyebrow={t(content.eyebrow, locale)}
      title={t(content.title, locale)}
      description={t(content.description, locale)}
    >
      <StaggerGroup className="grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <StaggerItem key={testimonial.id} className="h-full">
            <figure className="ts-quote h-full justify-between">
              <blockquote className="ts-quote__text">{testimonial.quote}</blockquote>
              <figcaption className="ts-quote__who">
                <span className="ts-quote__avatar">
                  <Image
                    src={testimonial.photo}
                    alt=""
                    width={88}
                    height={88}
                    className="size-full object-cover object-top"
                    unoptimized
                  />
                </span>
                <span>
                  <p className="ts-quote__name">{testimonial.name}</p>
                  <p className="ts-caption">Duta Teladan · {testimonial.school}</p>
                </span>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </SectionShell>
  );
}
