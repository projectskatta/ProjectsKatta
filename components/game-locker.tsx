"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Code2, Copy, Download, Lock, Play } from "lucide-react";
import type { GameScript } from "@/types/platform";

const tokenKey = "pk_token_expiry";

// Minimal shape of the bits of the YouTube IFrame API we actually use.
type YouTubePlayer = { destroy: () => void };
type YouTubeStateChangeEvent = { data: number };

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: { events: { onStateChange: (event: YouTubeStateChangeEvent) => void } }
      ) => YouTubePlayer;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type GameLockerProps = {
  game: GameScript;
};

export function GameLocker({ game }: GameLockerProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [watching, setWatching] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerElementId = `pk-yt-player-${game.id}`;

  // The countdown only ticks once the video has actually started playing —
  // not the moment the "watch to unlock" panel opens.
  useEffect(() => {
    if (!videoStarted || countdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, videoStarted]);

  // Load the YouTube IFrame API (once per page) and attach a real player so
  // we can detect the actual "playing" event, instead of trusting a timer
  // that used to start the moment this panel opened.
  useEffect(() => {
    if (!watching || unlocked) {
      return;
    }

    let cancelled = false;

    function attachPlayer() {
      if (cancelled || playerRef.current || !window.YT) {
        return;
      }

      playerRef.current = new window.YT.Player(playerElementId, {
        events: {
          onStateChange: (event) => {
            if (window.YT && event.data === window.YT.PlayerState.PLAYING) {
              setVideoStarted(true);
            }
          }
        }
      });
    }

    if (window.YT?.Player) {
      attachPlayer();
    } else {
      if (!document.getElementById("youtube-iframe-api")) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }

      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        attachPlayer();
      };
    }

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [watching, unlocked, playerElementId]);

  function startUnlockFlow() {
    const expiry = Number(window.localStorage.getItem(tokenKey) ?? 0);

    if (unlocked || expiry > Date.now()) {
      setUnlocked(true);
      return;
    }

    setVideoStarted(false);
    setCountdown(10);
    setWatching(true);
  }

  function unlockCode() {
    window.localStorage.setItem(tokenKey, String(Date.now() + 24 * 60 * 60 * 1000));
    setUnlocked(true);
    setWatching(false);
  }

  async function copyCode() {
    await navigator.clipboard.writeText(game.sourceCode);
  }

  const rawPromoSrc = game.youtubeUrl || `https://www.youtube.com/embed/${game.promoVideoId}`;
  const promoSeparator = rawPromoSrc.includes("?") ? "&" : "?";
  const promoOrigin = typeof window !== "undefined" ? window.location.origin : "";
  // enablejsapi=1 is required for the IFrame API to control this exact embed.
  const promoVideoSrc = `${rawPromoSrc}${promoSeparator}enablejsapi=1&origin=${promoOrigin}`;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="aspect-video rounded-lg border border-zinc-200 bg-zinc-950 p-4">
        {game.gameFileUrl ? (
          <iframe
            title={game.title}
            src={game.gameFileUrl}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
            className="h-full w-full rounded-md border border-zinc-700 bg-white"
          />
        ) : (
          <div className="grid h-full place-items-center rounded-md border border-zinc-700">
            <div className="text-center text-white">
              <Play className="mx-auto h-10 w-10" aria-hidden="true" />
              <p className="mt-3 text-lg font-black">{game.title}</p>
            </div>
          </div>
        )}
      </div>

      {game.youtubeUrl && (
        <iframe
          title={`${game.title} tutorial`}
          src={game.youtubeUrl}
          className="mt-4 aspect-video w-full rounded-md border border-zinc-200"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}

      <p className="mt-4 text-sm leading-6 text-zinc-600">{game.description}</p>

      <button
        type="button"
        onClick={startUnlockFlow}
        className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-zinc-700"
      >
        {unlocked ? <Code2 className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
        {unlocked ? "Code Unlocked" : "View Source Code"}
      </button>

      {watching && !unlocked && (
        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <iframe
            id={playerElementId}
            title="ProjectsKatta promo video"
            src={promoVideoSrc}
            className="aspect-video w-full rounded-md border border-zinc-200"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-sm font-black text-zinc-700">
              {!videoStarted
                ? "Play the video above to start the timer"
                : countdown > 0
                  ? `${countdown}s remaining`
                  : "Ready"}
            </p>
            <button
              type="button"
              disabled={!videoStarted || countdown > 0}
              onClick={unlockCode}
              className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              Skip & Get Code
            </button>
          </div>
        </div>
      )}

      {unlocked && (
        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-black text-white"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy Code
            </button>
            {game.sourceCodeFileUrl && (
              <Link
                href={game.sourceCodeFileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-black text-zinc-950"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Source
              </Link>
            )}
          </div>
          <pre className="mt-4 max-h-80 overflow-auto rounded-lg bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
            <code>{game.sourceCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
