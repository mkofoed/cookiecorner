"use client";

import { useRef, useState } from "react";
import styles from "./cookie-consent-banner.module.css";

export function CookieConsentBanner() {
  const bannerRef = useRef<HTMLElement | null>(null);
  const [bannerOffset, setBannerOffset] = useState({ x: 0, y: 0 });
  const [isDismissed, setIsDismissed] = useState(false);

  function acceptCookies() {
    setIsDismissed(true);
  }

  function dodgeDecline() {
    const banner = bannerRef.current;
    if (!banner) {
      return;
    }

    setBannerOffset((currentOffset) => {
      const bannerBounds = banner.getBoundingClientRect();
      const minDeltaX = 16 - bannerBounds.left;
      const maxDeltaX = window.innerWidth - bannerBounds.right - 16;
      const minDeltaY = 16 - bannerBounds.top;
      const maxDeltaY = window.innerHeight - bannerBounds.bottom - 16;

      return {
        x: currentOffset.x + getRandomOffset(minDeltaX, maxDeltaX),
        y: currentOffset.y + getRandomOffset(minDeltaY, maxDeltaY),
      };
    });
  }

  if (isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Cookie consent"
      className={styles.banner}
      ref={bannerRef}
      role="dialog"
      aria-live="polite"
      style={{
        transform: `translate(${bannerOffset.x}px, ${bannerOffset.y}px)`,
      }}
    >
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Cookie notice</p>
        <h2>We love cookies, don&apos;t you?</h2>
        <p>
          Declining is not really an option, but we admire the persistence.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.secondaryButton}
          onClick={dodgeDecline}
          onFocus={dodgeDecline}
          onMouseEnter={dodgeDecline}
          type="button"
        >
          Decline
        </button>
        <button
          className={styles.primaryButton}
          onClick={acceptCookies}
          type="button"
        >
          Accept cookies
        </button>
      </div>
    </aside>
  );
}

function getRandomOffset(min: number, max: number) {
  if (max <= min) {
    return min;
  }

  return Math.round(Math.random() * (max - min) + min);
}
