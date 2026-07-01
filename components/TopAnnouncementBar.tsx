"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fetchPublicSettingsFresh } from "@/lib/api";
import { DEFAULT_ANNOUNCEMENT_MESSAGES } from "@/lib/default-announcements";
import { useWebsiteSettings } from "@/store/SettingsContext";

const ROTATE_MS = 2000;
const MIN_BAR_HEIGHT = 36;

function normalizeMessages(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => String(item).trim()).filter(Boolean);
}

export default function TopAnnouncementBar() {
  const contextSettings = useWebsiteSettings();
  const [fetchedMessages, setFetchedMessages] = useState<string[] | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const contextMessages = useMemo(
    () => normalizeMessages(contextSettings?.announcementMessages),
    [contextSettings?.announcementMessages],
  );

  useEffect(() => {
    if (contextMessages.length > 0) return;

    let cancelled = false;

    fetchPublicSettingsFresh()
      .then((settings) => {
        if (cancelled) return;
        const messages = normalizeMessages(settings?.website?.announcementMessages);
        if (messages.length > 0) {
          setFetchedMessages(messages);
        }
      })
      .catch(() => {
        /* keep fallback defaults below */
      });

    return () => {
      cancelled = true;
    };
  }, [contextMessages.length]);

  const messages = useMemo(() => {
    if (contextMessages.length > 0) return contextMessages;
    if (fetchedMessages && fetchedMessages.length > 0) return fetchedMessages;
    return [...DEFAULT_ANNOUNCEMENT_MESSAGES];
  }, [contextMessages, fetchedMessages]);

  const enabled =
    (contextSettings?.announcementBarEnabled !== false || contextSettings == null) &&
    messages.length > 0;

  const [index, setIndex] = useState(0);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % messages.length);
  }, [messages.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + messages.length) % messages.length);
  }, [messages.length]);

  useEffect(() => {
    if (!enabled || messages.length <= 1) return;
    const timer = window.setInterval(goNext, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [enabled, messages.length, goNext]);

  useEffect(() => {
    if (index >= messages.length) setIndex(0);
  }, [index, messages.length]);

  const updateBarHeight = useCallback(() => {
    const node = barRef.current;
    if (!node || !enabled) {
      document.documentElement.style.setProperty("--announcement-bar-height", "0px");
      return;
    }

    const measured = Math.max(node.offsetHeight, MIN_BAR_HEIGHT);
    document.documentElement.style.setProperty(
      "--announcement-bar-height",
      `${measured}px`,
    );
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.style.setProperty("--announcement-bar-height", "0px");
      return;
    }

    updateBarHeight();

    const node = barRef.current;
    if (!node) return;

    const observer = new ResizeObserver(() => updateBarHeight());
    observer.observe(node);
    window.addEventListener("resize", updateBarHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateBarHeight);
      document.documentElement.style.setProperty("--announcement-bar-height", "0px");
    };
  }, [enabled, messages, updateBarHeight]);

  if (!enabled) return null;

  const currentMessage = messages[index] ?? messages[0];

  return (
    <div
      ref={barRef}
      className="announcement-bar"
      role="region"
      aria-label="Store announcements"
      aria-live="polite"
    >
      <div className="announcement-bar-inner">
        <p key={currentMessage} className="announcement-bar-message">
          {currentMessage}
        </p>

        {messages.length > 1 ? (
          <div className="announcement-bar-controls">
            <button
              type="button"
              className="announcement-bar-nav"
              onClick={goPrev}
              aria-label="Previous announcement"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="announcement-bar-nav"
              onClick={goNext}
              aria-label="Next announcement"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
