"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useWebsiteSettings } from "@/store/SettingsContext";

const ROTATE_MS = 2000;
const BAR_HEIGHT = "2.25rem";

export default function TopAnnouncementBar() {
  const settings = useWebsiteSettings();
  const messages = useMemo(() => {
    const raw = settings?.announcementMessages ?? [];
    return raw.map((item) => String(item).trim()).filter(Boolean);
  }, [settings?.announcementMessages]);

  const enabled = settings?.announcementBarEnabled !== false && messages.length > 0;
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

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--announcement-bar-height",
      enabled ? BAR_HEIGHT : "0px",
    );
    return () => {
      document.documentElement.style.setProperty("--announcement-bar-height", "0px");
    };
  }, [enabled]);

  if (!enabled) return null;

  const currentMessage = messages[index] ?? messages[0];

  return (
    <div className="announcement-bar" role="region" aria-label="Store announcements">
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
