"use client";

import { useEffect, useState } from "react";

import { t } from "@/data/program-content";
import { cn } from "@/lib/utils";
import { openRegistration } from "@/lib/registration";
import type { Locale, LocalizedText, NavItem } from "@/types/program";
import { Mark } from "@/components/brand/mark";
import { ThemeToggle } from "@/components/landing/theme-toggle";

interface SiteHeaderProps {
  locale: Locale;
  brand: LocalizedText;
  navItems: NavItem[];
}

export function SiteHeader({ locale, brand, navItems }: SiteHeaderProps) {
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll-spy: the link of the section in view gets aria-current.
  useEffect(() => {
    const updateActive = () => {
      const offset = 160;
      let currentHref: string | null = null;

      for (const item of navItems) {
        if (!item.href.startsWith("#")) continue;

        const section = document.getElementById(item.href.slice(1));
        if (!section) continue;

        if (section.offsetTop - offset <= window.scrollY) {
          currentHref = item.href;
        }
      }

      setActiveHref(currentHref);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [navItems]);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth > 1120) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  const handleNavClick = (href: string) => {
    setActiveHref(href);
    setIsMenuOpen(false);
  };

  const registerLabel = locale === "id" ? "Daftar" : "Register";

  return (
    <>
      <header className="ts-nav">
        <div className="ts-nav__inner">
          <a className="ts-nav__brand" href="#hero" onClick={() => handleNavClick("#hero")}>
            <Mark />
            <span>topstar</span>
            <span className="sr-only">— {t(brand, locale)}</span>
          </a>

          <ul className="ts-nav__links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  className="ts-nav__link"
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  aria-current={activeHref === item.href ? "true" : undefined}
                >
                  {t(item.label, locale)}
                </a>
              </li>
            ))}
          </ul>

          <div className="lp-nav__actions">
            <ThemeToggle />
            <a className="ts-btn ts-btn--primary ts-btn--sm" href="#daftar" onClick={openRegistration}>
              {registerLabel}
            </a>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="lp-icon-btn lp-menu-btn"
              aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              {isMenuOpen ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <nav
        id="mobile-nav"
        className={cn("lp-sheet", isMenuOpen && "is-open")}
        aria-label="Menu"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                aria-current={activeHref === item.href ? "true" : undefined}
              >
                {t(item.label, locale)}
              </a>
            </li>
          ))}
        </ul>
        <a
          className="ts-btn ts-btn--accent ts-btn--lg"
          href="#daftar"
          onClick={(event) => {
            setIsMenuOpen(false);
            openRegistration(event);
          }}
        >
          {locale === "id" ? "Daftar sekarang" : "Register now"}
        </a>
      </nav>
    </>
  );
}
