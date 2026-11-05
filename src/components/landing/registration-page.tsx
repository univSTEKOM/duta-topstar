"use client";

import Link from "next/link";

import { contact } from "@/data/program-content";
import type { Locale } from "@/types/program";
import { Mark } from "@/components/brand/mark";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { ClientOnly } from "@/components/ui/client-only";
import { RegistrationForm } from "@/components/landing/registration-form";

export function RegistrationPage() {
  const locale: Locale = "id";

  return (
    <div className="ts-root relative overflow-x-clip">
      <header className="ts-nav">
        <div className="ts-nav__inner lp-regnav">
          <Link className="ts-nav__brand" href="/">
            <Mark />
            <span>topstar</span>
          </Link>

          <div className="lp-nav__actions">
            <ThemeToggle />
            <Link className="ts-btn ts-btn--secondary ts-btn--sm" href="/">
              {locale === "id" ? "Kembali" : "Back"}
            </Link>
          </div>
        </div>
      </header>

      <main className="ts-section lp-regmain">
        <div className="ts-container">
          <ClientOnly
            fallback={
              <div className="lp-regpage">
                <p className="ts-small lp-regpage__loading">Memuat formulir pendaftaran…</p>
              </div>
            }
          >
            <RegistrationForm locale={locale} />
          </ClientOnly>
        </div>
      </main>

      <footer className="ts-footer">
        <div className="ts-footer__bottom">
          © 2026 Duta Teladan Universitas STEKOM ·{" "}
          <a href={contact.whatsappLink} target="_blank" rel="noreferrer">
            WhatsApp {contact.whatsappDisplay}
          </a>
        </div>
      </footer>
    </div>
  );
}
