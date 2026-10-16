"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getPublicConfig, type PublicConfig } from "@/lib/public-config";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/mark";
import { PlayTriangle } from "@/components/brand/icons";

type Provider = "drive" | "youtube";

interface VideoFrameProps {
  /** build-time NEXT_PUBLIC_* value; when empty the URL is fetched from /api/public-config */
  envUrl?: string;
  configKey: keyof PublicConfig;
  provider: Provider;
  title: string;
  /** lower-third text on the poster */
  caption: string;
  subcaption?: string;
  /** local programme photo; YouTube videos use their own thumbnail and fall back to this */
  posterSrc: string;
  playLabel: string;
  emptyText: string;
}

function youtubeId(url: string) {
  return (
    url.match(/youtube\.com\/embed\/([^?&/]+)/)?.[1] ??
    url.match(/[?&]v=([^?&]+)/)?.[1] ??
    url.match(/youtu\.be\/([^?&/]+)/)?.[1] ??
    null
  );
}

function driveId(url: string) {
  return url.match(/\/file\/d\/([^/?]+)/)?.[1] ?? null;
}

// Google Drive picks its mobile player (a toolbar stacked above the video) from the user agent,
// so detect the same way rather than by screen size.
function isMobileUserAgent() {
  const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData;
  if (typeof uaData?.mobile === "boolean") return uaData.mobile;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function embedUrl(provider: Provider, url: string) {
  if (provider === "youtube") {
    const id = youtubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1&playsinline=1` : url;
  }
  const id = driveId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
}

/**
 * 16:9 video behind a brand poster: photo, play button, navy lower third with the white mark,
 * white mark watermark top-right. The player iframe only loads after a tap, so phones don't get
 * an unlabeled dark box and the page doesn't pay for two video players up front.
 */
export function VideoFrame({
  envUrl = "",
  configKey,
  provider,
  title,
  caption,
  subcaption,
  posterSrc,
  playLabel,
  emptyText,
}: VideoFrameProps) {
  const [runtimeUrl, setRuntimeUrl] = useState("");
  const [playback, setPlayback] = useState<{ cropDriveToolbar: boolean } | null>(null);
  const [remotePosterFailed, setRemotePosterFailed] = useState(false);

  useEffect(() => {
    if (envUrl) return;
    let isActive = true;

    getPublicConfig().then((config) => {
      if (!isActive) return;
      setRuntimeUrl(config[configKey] ?? "");
    });

    return () => {
      isActive = false;
    };
  }, [envUrl, configKey]);

  const resolvedUrl = (envUrl || runtimeUrl).trim();

  if (!resolvedUrl) {
    return (
      <div className="lp-video__frame">
        <div className="lp-video__empty">
          <PlayTriangle className="lp-play" colour="biru" />
          <p className="m-0">{emptyText}</p>
        </div>
      </div>
    );
  }

  const ytId = provider === "youtube" ? youtubeId(resolvedUrl) : null;
  const remotePoster = ytId && !remotePosterFailed ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : null;

  return (
    <div className={cn("lp-video__frame", playback?.cropDriveToolbar && "lp-video__frame--drive-mobile")}>
      {playback ? (
        <iframe
          title={title}
          src={embedUrl(provider, resolvedUrl)}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="lp-video__poster" onClick={() => setPlayback({ cropDriveToolbar: provider === "drive" && isMobileUserAgent() })} aria-label={`${playLabel}: ${caption}`}>
          <Image
            src={remotePoster ?? posterSrc}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 640px"
            unoptimized={Boolean(remotePoster)}
            onError={() => setRemotePosterFailed(true)}
          />
          <span className="lp-video__shade" aria-hidden="true" />
          <Mark tone="white" className="lp-video__watermark" />
          <span className="lp-video__play" aria-hidden="true">
            <PlayTriangle colour="biru" />
          </span>
          <span className="lp-video__lower" aria-hidden="true">
            <Mark tone="white" />
            <span>
              <b>{caption}</b>
              {subcaption && <small>{subcaption}</small>}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
