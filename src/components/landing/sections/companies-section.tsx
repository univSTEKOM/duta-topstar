"use client";

import Image from "next/image";

import type { Locale } from "@/types/program";
import { SectionShell } from "@/components/landing/section-shell";

const companyLogos = [
  {
    src: "/images/companies/1639532557_0d92b4396a2f2c1df96e (3).png",
    name: "Partner 1",
  },
  {
    src: "/images/companies/5N71zUDViF8gjbezG9NayWuiLyIeKWlpaJTOzOsU.png",
    name: "Partner 2",
  },
  {
    src: "/images/companies/Logo Toploker Verifikasi 2 (1).png",
    name: "TopLoker.com",
  },
];

interface CompaniesSectionProps {
  locale: Locale;
}

export function CompaniesSection({ locale }: CompaniesSectionProps) {
  return (
    <SectionShell
      id="didukung"
      eyebrow={locale === "id" ? "Mitra program" : "Program partners"}
      title={locale === "id" ? "Didukung oleh." : "Supported by."}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {companyLogos.map((logo) => (
          <div key={logo.src} className="lp-logo-tile">
            <Image
              src={logo.src}
              alt={`Logo ${logo.name}`}
              width={320}
              height={140}
              unoptimized
            />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
