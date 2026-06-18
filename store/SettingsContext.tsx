"use client";

import { createContext, useContext } from "react";
import type { WebsiteSettings } from "@/lib/api";

const SettingsContext = createContext<WebsiteSettings | null>(null);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: WebsiteSettings | null;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
  );
}

export function useWebsiteSettings() {
  return useContext(SettingsContext);
}
