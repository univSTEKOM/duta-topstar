"use client";

import Image from "next/image";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { t } from "@/data/program-content";
import { cn } from "@/lib/utils";
import type { AmbassadorItem, Locale, ProgramContent } from "@/types/program";
import { StaggerGroup, StaggerItem } from "@/components/landing/motion";
import { SectionShell } from "@/components/landing/section-shell";

const followersFormatter = new Intl.NumberFormat("id-ID");
const SLOW_TAIL_DIGITS = 200;

interface TailSchedule {
  stepMs: number;
  startDelayMs: number;
}

interface RankedAmbassador extends AmbassadorItem {
  topPlatform: "TikTok" | "Instagram";
  topFollowers: number;
}

const TAIL_SCHEDULE_BY_RANK: Record<number, TailSchedule> = {
  1: { stepMs: 4000, startDelayMs: 320 },
  2: { stepMs: 2000, startDelayMs: 780 },
  3: { stepMs: 1000, startDelayMs: 160 },
  4: { stepMs: 500, startDelayMs: 640 },
  5: { stepMs: 1500, startDelayMs: 1080 },
};

function formatFollowers(value: number) {
  return followersFormatter.format(value);
}

function getTopPlatform(item: AmbassadorItem): Pick<RankedAmbassador, "topPlatform" | "topFollowers"> {
  if (item.tiktokFollowers >= item.instagramFollowers) {
    return {
      topPlatform: "TikTok",
      topFollowers: item.tiktokFollowers,
    };
  }

  return {
    topPlatform: "Instagram",
    topFollowers: item.instagramFollowers,
  };
}

function sortAmbassadors(items: AmbassadorItem[]): RankedAmbassador[] {
  return items
    .map((item) => ({ ...item, ...getTopPlatform(item) }))
    .sort((a, b) => b.topFollowers - a.topFollowers);
}

function useCountUp(
  target: number,
  isActive: boolean,
  fastDuration: number,
  finalDigits: number,
  tailStepMs: number,
  tailStartDelayMs: number,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    let rafId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const normalizedTarget = Math.max(Math.round(target), 0);
    const normalizedFinalDigits = Math.max(Math.round(finalDigits), 0);
    const normalizedTailStepMs = Math.max(Math.round(tailStepMs), 16);
    const normalizedTailStartDelayMs = Math.max(Math.round(tailStartDelayMs), 0);
    const slowStart = Math.max(normalizedTarget - normalizedFinalDigits, 0);
    const startedAt = performance.now();

    const runSlowTail = (from: number) => {
      let current = from;

      const step = () => {
        if (current >= normalizedTarget) return;

        current = Math.min(current + 1, normalizedTarget);
        setValue(current);

        if (current < normalizedTarget) {
          timeoutId = setTimeout(step, normalizedTailStepMs);
        }
      };

      timeoutId = setTimeout(step, normalizedTailStepMs + normalizedTailStartDelayMs);
    };

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / fastDuration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const nextValue = Math.round(slowStart * easedProgress);

      setValue((previous) => (nextValue > previous ? nextValue : previous));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setValue(slowStart);
        if (slowStart < normalizedTarget) {
          runSlowTail(slowStart);
        }
      }
    };

    setValue(0);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [target, isActive, fastDuration, finalDigits, tailStepMs, tailStartDelayMs]);

  return isActive ? value : 0;
}

function AnimatedFollowers({
  target,
  fastDuration = 900,
  finalDigits = 2,
  tailStepMs = 1000,
  tailStartDelayMs = 0,
  className,
}: {
  target: number;
  fastDuration?: number;
  finalDigits?: number;
  tailStepMs?: number;
  tailStartDelayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.55 });
  const value = useCountUp(
    target,
    isInView,
    fastDuration,
    finalDigits,
    tailStepMs,
    tailStartDelayMs,
  );

  return (
    <span ref={ref} className={className}>
      {formatFollowers(value)}
    </span>
  );
}

function ProfileCard({
  item,
  locale,
  rank,
  tailSchedule,
}: {
  item: RankedAmbassador;
  locale: Locale;
  rank: number;
  tailSchedule: TailSchedule;
}) {
  return (
    <article className={cn("ts-profile h-full", rank === 1 && "ts-profile--first")}>
      <div className="ts-profile__photo">
        <Image
          src={item.photo}
          alt={`Foto ${item.name}`}
          width={480}
          height={600}
          sizes="(max-width: 767px) 50vw, 240px"
          unoptimized
        />
        <span className="ts-profile__rank" aria-label={`Peringkat ${rank}`}>
          {rank}
        </span>
      </div>
      <div className="ts-profile__body">
        <h3 className="ts-profile__name">{item.name}</h3>
        <p className="ts-profile__meta">{item.school}</p>
        {/* Live follower counts; a card hides the figure rather than showing 0. */}
        {item.topFollowers > 0 && (
          <>
            <AnimatedFollowers
              target={item.topFollowers}
              fastDuration={rank === 1 ? 1050 : 900}
              finalDigits={SLOW_TAIL_DIGITS}
              tailStepMs={tailSchedule.stepMs}
              tailStartDelayMs={tailSchedule.startDelayMs}
              className="lp-profile__count"
            />
            <span className="lp-profile__platform">
              {locale === "id" ? `followers ${item.topPlatform}` : `${item.topPlatform} followers`}
            </span>
          </>
        )}
      </div>
    </article>
  );
}

interface AmbassadorsSectionProps {
  locale: Locale;
  content: ProgramContent["ambassadors"];
}

export function AmbassadorsSection({ locale, content }: AmbassadorsSectionProps) {
  const rankedAmbassadors = sortAmbassadors(content.items);

  if (rankedAmbassadors.length === 0) {
    return null;
  }

  return (
    <SectionShell
      id="duta"
      eyebrow={t(content.eyebrow, locale)}
      title={t(content.title, locale)}
      description={t(content.description, locale)}
    >
      <StaggerGroup className="lp-profile-grid grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {rankedAmbassadors.map((item, index) => {
          const rank = index + 1;

          return (
            <StaggerItem key={item.id} className="h-full">
              <ProfileCard
                item={item}
                locale={locale}
                rank={rank}
                tailSchedule={TAIL_SCHEDULE_BY_RANK[rank] ?? TAIL_SCHEDULE_BY_RANK[5]}
              />
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </SectionShell>
  );
}
