import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

function apiImagePattern(): { protocol: "http" | "https"; hostname: string; port?: string } | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    const origin = apiUrl.replace(/\/api\/?$/, "");
    const { protocol, hostname, port } = new URL(origin);
    return {
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
      ...(port ? { port } : {}),
    };
  } catch {
    return null;
  }
}

const apiPattern = apiImagePattern();

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: configDir,
  images: {
    qualities: [75, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      ...(apiPattern ? [apiPattern] : []),
    ],
  },
};

export default nextConfig;