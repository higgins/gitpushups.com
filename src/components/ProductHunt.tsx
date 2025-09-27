'use client'

import React from "react";

/**
 * FloatingProductHuntBadge
 * - Fixed bottom-right on desktop; stretches nicely on mobile
 * - Live countdown to Sun Sep 28, 2025 12:01 AM America/Los_Angeles (PDT)
 * - After expiry, shows a thank-you message
 */
export function ProductHunt() {
  // Target instant: 2025-09-28 00:01:00 in America/Los_Angeles.
  // PDT is UTC-7 on this date, so UTC = 07:01.
  const TARGET_UTC_MS = Date.UTC(2025, 8, 28, 7, 1, 0); // months are 0-based

  const [remainingMs, setRemainingMs] = React.useState<number>(() => {
    return TARGET_UTC_MS - Date.now();
  });

  // Update once per second without setTimeout (uses rAF; coalesces to 1Hz updates)
  React.useEffect(() => {
    let rafId = 0;
    let lastShownSecond = Math.floor(remainingMs / 1000);

    const tick = () => {
      const now = Date.now();
      const nextRemaining = TARGET_UTC_MS - now;
      const nextSecond = Math.floor(nextRemaining / 1000);
      if (nextSecond !== lastShownSecond) {
        lastShownSecond = nextSecond;
        setRemainingMs(nextRemaining);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // We intentionally don't include remainingMs in deps to avoid resetting lastShownSecond each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOver = remainingMs <= 0;

  const formatRemaining = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const two = (n: number) => n.toString().padStart(2, "0");
    // Show D:HH:MM:SS (omit days label if zero)
    return days > 0
      ? `${days}d ${two(hours)}:${two(minutes)}:${two(seconds)}`
      : `${two(hours)}:${two(minutes)}:${two(seconds)}`;
  };

  return (
    <div className="ph-floating">
      <a
        href="https://www.producthunt.com/products/git-pushups?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-git&#0045;pushups"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Git Pushups on Product Hunt (opens in new tab)"
        className="ph-link"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1020519&theme=dark&t=1758945493590"
          alt="Git&#0032;Pushups - Do&#0032;pushups&#0032;or&#0032;we&#0032;block&#0032;your&#0032;code | Product Hunt"
          width={250}
          height={54}
          className="ph-img"
        />
      </a>

      <div className="ph-timer" role="status" aria-live="polite">
        {isOver ? (
          <span className="ph-thanks">thanks for voting for us on product hunt</span>
        ) : (
          <>
            <span className="ph-live-dot" aria-hidden />
            <span className="ph-count-label">
              we’re live — time left to vote:
            </span>
            <span className="ph-count">{formatRemaining(remainingMs)}</span>
          </>
        )}
      </div>

      {/* Styles (scoped) */}
      <style jsx>{`
        .ph-floating {
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 92vw;
          align-items: flex-end;
        }

        .ph-link {
          display: inline-block;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24),
            0 2px 8px rgba(0, 0, 0, 0.18);
          transition: transform 0.12s ease, filter 0.12s ease;
          backdrop-filter: saturate(120%);
        }
        .ph-link:hover {
          transform: translateY(-1px);
          filter: brightness(1.02);
        }
        .ph-link:active {
          transform: translateY(0);
        }

        .ph-img {
          display: block;
          width: 250px;
          height: 54px;
        }

        .ph-timer {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          line-height: 1;
          color: #111;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 999px;
          padding: 8px 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
          backdrop-filter: blur(4px);
        }

        .ph-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff3b3f; /* bright coral from your palette */
          box-shadow: 0 0 0 6px rgba(255, 59, 63, 0.15);
        }

        .ph-count-label {
          opacity: 0.75;
        }
        .ph-count {
          font-variant-numeric: tabular-nums;
          font-weight: 600;
        }
        .ph-thanks {
          font-weight: 600;
        }

        /* Mobile friendliness */
        @media (max-width: 480px) {
          .ph-floating {
            left: 16px;
            right: 16px;
            align-items: stretch;
          }
          .ph-link,
          .ph-img {
            width: 100%;
            height: auto;
          }
          .ph-timer {
            justify-content: center;
          }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .ph-link {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
